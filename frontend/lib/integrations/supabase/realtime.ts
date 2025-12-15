import type { RealtimeChannel } from '@supabase/realtime-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { backoffMs } from '@/lib/integrations/backoff'
import { devWarnOnce } from '@/lib/integrations/devlog'
import { getSupabasePublicConfig, isSupabaseRealtimeEnabled } from './config'
import { getSupabaseClient } from './client'

export type SupabaseRealtimeToast = {
  id?: string
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export type SupabaseRealtimeManagerOptions = {
  maxAttempts?: number
  onToast?: (toast: SupabaseRealtimeToast) => void
}

type Status = 'idle' | 'connecting' | 'connected' | 'failed' | 'stopped'

export class SupabaseRealtimeManager {
  private status: Status = 'idle'
  private attempt = 0
  private timer: number | null = null
  private channel: RealtimeChannel | null = null
  private client: SupabaseClient | null = null
  private maxAttempts: number
  private onToast?: (toast: SupabaseRealtimeToast) => void
  private lastToastAt = 0
  private hadFailure = false

  constructor(opts?: SupabaseRealtimeManagerOptions) {
    this.maxAttempts = opts?.maxAttempts ?? 5
    this.onToast = opts?.onToast
  }

  getStatus() {
    return this.status
  }

  start() {
    if (typeof window === 'undefined') return
    if (!isSupabaseRealtimeEnabled()) return

    const cfg = getSupabasePublicConfig()
    if (!cfg) {
      devWarnOnce(
        'supabase-config-missing',
        '[Supabase] Realtime está habilitado por flag pero faltan env vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      )
      return
    }

    if (this.status === 'connecting' || this.status === 'connected') return
    this.status = 'connecting'
    this.client = getSupabaseClient()
    if (!this.client) return

    this.connect()
    window.addEventListener('online', this.onOnline)
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  stop() {
    if (typeof window === 'undefined') return
    this.status = 'stopped'
    this.clearTimer()
    window.removeEventListener('online', this.onOnline)
    document.removeEventListener('visibilitychange', this.onVisibility)
    void this.teardownChannel()
    try {
      this.client?.realtime.disconnect()
    } catch {
      // noop
    }
  }

  private onOnline = () => {
    if (this.status === 'failed' || this.status === 'connecting') this.scheduleRetry(0)
  }

  private onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      // Avoid noisy reconnect loops on background tabs.
      try {
        this.client?.realtime.disconnect()
      } catch {
        // noop
      }
      return
    }
    if (this.status === 'failed') this.scheduleRetry(0)
  }

  private connect() {
    if (!this.client) return
    if (!navigator.onLine) {
      this.status = 'failed'
      this.scheduleRetry(0)
      return
    }

    void this.teardownChannel().finally(() => {
      if (!this.client || this.status === 'stopped') return

      const channel = this.client.channel('cp:realtime-health', {
        config: { broadcast: { ack: false }, presence: { key: 'health' } },
      })

      this.channel = channel
      channel.subscribe((status, err) => {
        if (this.status === 'stopped') return

        if (status === 'SUBSCRIBED') {
          this.status = 'connected'
          this.attempt = 0
          if (this.hadFailure) {
            this.toast({
              id: 'supabase-rt-connected',
              title: 'Conexión en vivo',
              message: 'Realtime reconectado.',
              variant: 'success',
              duration: 1800,
            })
            this.hadFailure = false
          }
          return
        }

        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          this.status = 'failed'
          this.hadFailure = true
          const message =
            err?.message ||
            (status === 'TIMED_OUT'
              ? 'La conexión en vivo tardó demasiado y se reintentará.'
              : 'No se pudo conectar a Realtime y se reintentará.')

          this.toast({
            id: 'supabase-rt-failed',
            title: 'Conexión en vivo',
            message,
            variant: 'warning',
            duration: 3500,
          })
          this.scheduleRetry()
        }
      })
    })
  }

  private scheduleRetry(delayOverrideMs?: number) {
    if (this.status === 'stopped') return
    if (this.attempt >= this.maxAttempts) {
      this.status = 'stopped'
      this.toast({
        id: 'supabase-rt-stopped',
        title: 'Conexión en vivo',
        message: 'Se pausaron los reintentos automáticos. Recargá o reintentá más tarde.',
        variant: 'info',
        duration: 4500,
      })
      return
    }

    const delay = delayOverrideMs ?? backoffMs(this.attempt, { baseMs: 900, maxMs: 25_000, jitterRatio: 0.3 })
    this.attempt += 1
    this.clearTimer()
    this.timer = window.setTimeout(() => this.connect(), delay)
  }

  private clearTimer() {
    if (!this.timer) return
    window.clearTimeout(this.timer)
    this.timer = null
  }

  private async teardownChannel() {
    if (!this.client || !this.channel) return
    const toRemove = this.channel
    this.channel = null
    try {
      await this.client.removeChannel(toRemove)
    } catch {
      // noop
    }
  }

  private toast(payload: SupabaseRealtimeToast) {
    if (!this.onToast) return

    // Avoid toast spam (esp. in flaky networks).
    const now = Date.now()
    if (payload.variant !== 'success' && now - this.lastToastAt < 6000) return
    this.lastToastAt = now
    this.onToast(payload)
  }
}
