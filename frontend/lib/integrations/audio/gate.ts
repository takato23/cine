import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeLocalStorage } from '@/lib/integrations/storage'

type AudioGateState = {
  audioEnabled: boolean
  micEnabled: boolean
  lastError: string | null
  enableAudio: () => Promise<void>
  enableMicrophone: () => Promise<void>
  reset: () => void
}

declare global {
  // eslint-disable-next-line no-var
  var __cpAudioCtx: AudioContext | null | undefined
}

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (globalThis.__cpAudioCtx) return globalThis.__cpAudioCtx
  const Ctx = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctx) return null
  globalThis.__cpAudioCtx = new Ctx()
  return globalThis.__cpAudioCtx
}

export const useAudioGateStore = create<AudioGateState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      micEnabled: false,
      lastError: null,

      enableAudio: async () => {
        const ctx = getAudioContext()
        if (!ctx) {
          set({ lastError: 'Este navegador no soporta Web Audio.' })
          return
        }
        try {
          if (ctx.state !== 'running') await ctx.resume()
          set({ audioEnabled: true, lastError: null })
        } catch (e) {
          set({ lastError: e instanceof Error ? e.message : 'No se pudo activar el audio.' })
        }
      },

      enableMicrophone: async () => {
        // Never request permissions automatically.
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          set({ lastError: 'Este navegador no soporta micrófono.' })
          return
        }
        try {
          await get().enableAudio()
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach((t) => t.stop())
          set({ micEnabled: true, lastError: null })
        } catch (e) {
          set({ lastError: e instanceof Error ? e.message : 'No se pudo activar el micrófono.' })
        }
      },

      reset: () => set({ audioEnabled: false, micEnabled: false, lastError: null }),
    }),
    {
      name: 'cp-audio-gate',
      storage: createJSONStorage(() => safeLocalStorage() as any),
      partialize: (s) => ({ audioEnabled: s.audioEnabled, micEnabled: s.micEnabled }),
    }
  )
)
