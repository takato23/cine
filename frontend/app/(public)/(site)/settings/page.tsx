'use client'

import { useMemo, useState, useEffect } from 'react'
import { ShieldCheck, Volume2, Mic, Wrench, ExternalLink, RefreshCcw, User, Bell, Film } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { isMockMode, envString, ff } from '@/lib/flags'
import { useAudioGateStore } from '@/lib/integrations/audio/gate'
import { getSupabasePublicConfig } from '@/lib/integrations/supabase'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { NotificationSettings, PreferenceSettings } from '@/components/settings/GeneralSettings'

function formatBool(v: boolean) {
  return v ? 'ON' : 'OFF'
}

export default function SettingsPage() {
  const { addToast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('profile')
  const [busy, setBusy] = useState<'audio' | 'mic' | null>(null)
  const audio = useAudioGateStore()

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'preferences', label: 'Preferencias', icon: Film },
    { id: 'advanced', label: 'Avanzado', icon: Wrench },
  ]

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    router.push(`/settings?tab=${id}`, { scroll: false })
  }

  const supabaseCfg = useMemo(() => getSupabasePublicConfig(), [])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0a]">
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Configuración</h1>
            <p className="text-white/60">Gestiona tu cuenta y preferencias de la aplicación.</p>
          </div>
          <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>

        <div className="mt-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'preferences' && <PreferenceSettings />}

          {activeTab === 'advanced' && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  UX segura
                </Badge>
                <span className="text-xs text-white/40">Opciones de desarrollador</span>
              </div>

              <Card className="p-6" variant="glow">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Volume2 className="h-6 w-6 text-primary-300" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-extrabold">Audio y micrófono</p>
                    <p className="mt-1 text-sm text-white/60">
                      Para evitar warnings del navegador, el AudioContext y permisos de micrófono solo se activan con un click.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={audio.audioEnabled ? 'primary' : 'secondary'}>{`Audio: ${formatBool(audio.audioEnabled)}`}</Badge>
                    <Badge variant={audio.micEnabled ? 'primary' : 'secondary'}>{`Mic: ${formatBool(audio.micEnabled)}`}</Badge>
                  </div>

                  {audio.lastError ? (
                    <p className="text-xs text-warning/90 border border-warning/25 bg-warning/10 rounded-2xl px-3 py-2">
                      {audio.lastError}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={async () => {
                        setBusy('audio')
                        await audio.enableAudio()
                        setBusy(null)
                        if (useAudioGateStore.getState().audioEnabled) {
                          addToast({ title: 'Audio', message: 'Audio activado.', variant: 'success', duration: 2200 })
                        } else if (useAudioGateStore.getState().lastError) {
                          addToast({ title: 'Audio', message: useAudioGateStore.getState().lastError!, variant: 'warning' })
                        }
                      }}
                      isLoading={busy === 'audio'}
                      leftIcon={<Volume2 className="h-4 w-4" />}
                    >
                      Activar audio
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        setBusy('mic')
                        await audio.enableMicrophone()
                        setBusy(null)
                        if (useAudioGateStore.getState().micEnabled) {
                          addToast({ title: 'Micrófono', message: 'Permiso concedido.', variant: 'success', duration: 2200 })
                        } else if (useAudioGateStore.getState().lastError) {
                          addToast({ title: 'Micrófono', message: useAudioGateStore.getState().lastError!, variant: 'warning' })
                        }
                      }}
                      isLoading={busy === 'mic'}
                      leftIcon={<Mic className="h-4 w-4" />}
                    >
                      Permitir micrófono
                    </Button>
                    <Button variant="outline" onClick={() => audio.reset()}>
                      Reset
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6" variant="default">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Wrench className="h-6 w-6 text-secondary-400" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-extrabold">Integraciones</p>
                    <p className="mt-1 text-sm text-white/60">
                      Flags y env vars que controlan features potencialmente ruidosas.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-extrabold text-white">Modo mock</p>
                    <p className="mt-1 text-sm text-white/70">
                      <span className="font-bold text-primary-200">NEXT_PUBLIC_MOCK_MODE</span>: {formatBool(isMockMode)}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-extrabold text-white">Supabase Realtime</p>
                    <p className="mt-1 text-sm text-white/70">
                      <span className="font-bold text-primary-200">NEXT_PUBLIC_FF_SUPABASE_REALTIME</span>:{' '}
                      {formatBool(ff('SUPABASE_REALTIME', false))}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        leftIcon={<RefreshCcw className="h-4 w-4" />}
                        onClick={() => window.location.reload()}
                      >
                        Recargar para reintentar
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-extrabold text-white">Gemini Live (experimental)</p>
                    <p className="mt-1 text-sm text-white/70">
                      <span className="font-bold text-primary-200">NEXT_PUBLIC_FF_GEMINI_LIVE</span>:{' '}
                      {formatBool(ff('GEMINI_LIVE', false))}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

