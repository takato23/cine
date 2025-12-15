import { backoffMs } from '@/lib/integrations/backoff'
import { devWarnOnce } from '@/lib/integrations/devlog'

export type SafeWebSocketOptions = {
  maxAttempts?: number
  onMessage?: (ev: MessageEvent) => void
  onOpen?: () => void
  onClose?: (ev: CloseEvent) => void
  onError?: (ev: Event) => void
  onStatus?: (status: 'idle' | 'connecting' | 'open' | 'closed' | 'failed') => void
}

export class SafeWebSocket {
  private ws: WebSocket | null = null
  private attempt = 0
  private timer: number | null = null
  private stopped = false
  private maxAttempts: number
  private opts: SafeWebSocketOptions

  constructor(private url: string, opts?: SafeWebSocketOptions) {
    this.opts = opts ?? {}
    this.maxAttempts = opts?.maxAttempts ?? 5
  }

  connect() {
    if (typeof window === 'undefined') return
    if (this.stopped) return

    const existing = this.ws
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) return

    if (!navigator.onLine) {
      this.scheduleRetry()
      return
    }

    this.opts.onStatus?.('connecting')

    try {
      this.ws = new WebSocket(this.url)
    } catch (e) {
      devWarnOnce('ws-ctor-failed', '[WS] no se pudo crear WebSocket', e)
      this.opts.onStatus?.('failed')
      this.scheduleRetry()
      return
    }

    const ws = this.ws
    ws.onopen = () => {
      this.attempt = 0
      this.opts.onStatus?.('open')
      this.opts.onOpen?.()
    }
    ws.onmessage = (ev) => this.opts.onMessage?.(ev)
    ws.onerror = (ev) => {
      this.opts.onError?.(ev)
      // Avoid spamming; close will schedule retry.
    }
    ws.onclose = (ev) => {
      this.opts.onClose?.(ev)
      this.opts.onStatus?.(this.stopped ? 'closed' : 'failed')
      if (!this.stopped) this.scheduleRetry()
    }
  }

  disconnect(code?: number, reason?: string) {
    this.stopped = true
    this.clearTimer()
    const ws = this.ws
    this.ws = null
    if (!ws) return
    try {
      ws.onopen = null
      ws.onmessage = null
      ws.onerror = null
      ws.onclose = null
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(code, reason)
    } catch {
      // noop
    }
    this.opts.onStatus?.('closed')
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    const ws = this.ws
    if (!ws || ws.readyState !== WebSocket.OPEN) return false
    try {
      ws.send(data)
      return true
    } catch {
      return false
    }
  }

  private scheduleRetry() {
    if (typeof window === 'undefined') return
    if (this.stopped) return

    if (this.attempt >= this.maxAttempts) {
      this.opts.onStatus?.('closed')
      return
    }

    const delay = backoffMs(this.attempt, { baseMs: 900, maxMs: 25_000, jitterRatio: 0.3 })
    this.attempt += 1
    this.clearTimer()
    this.timer = window.setTimeout(() => this.connect(), delay)
  }

  private clearTimer() {
    if (!this.timer) return
    window.clearTimeout(this.timer)
    this.timer = null
  }
}

