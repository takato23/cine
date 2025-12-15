import { ff } from '@/lib/flags'
import { SafeWebSocket } from '@/lib/integrations/ws'

export type GeminiLiveStatus = 'idle' | 'disabled' | 'connecting' | 'connected' | 'closed' | 'failed'

/**
 * Gemini Live está intencionalmente encapsulado detrás de un flag.
 * Motivo: algunos SDKs/wrappers de audio aún usan APIs deprecated (ScriptProcessorNode)
 * o inicializan AudioContext sin gesto del usuario.
 */
export function isGeminiLiveEnabled() {
  return ff('GEMINI_LIVE', false)
}

export class GeminiLiveManager {
  private ws: SafeWebSocket | null = null
  private status: GeminiLiveStatus = 'idle'

  constructor(private url: string) {}

  getStatus() {
    return this.status
  }

  /**
   * Debe llamarse únicamente desde un user gesture (click/tap) si involucra audio/micrófono.
   */
  start() {
    if (!isGeminiLiveEnabled()) {
      this.status = 'disabled'
      return
    }
    if (typeof window === 'undefined') return

    this.ws = new SafeWebSocket(this.url, {
      maxAttempts: 4,
      onStatus: (s) => {
        this.status =
          s === 'open' ? 'connected' : s === 'connecting' ? 'connecting' : s === 'closed' ? 'closed' : 'failed'
      },
    })
    this.ws.connect()
  }

  stop() {
    this.ws?.disconnect(1000, 'client-stop')
    this.ws = null
    this.status = 'closed'
  }

  send(json: unknown) {
    return this.ws?.send(JSON.stringify(json)) ?? false
  }
}

