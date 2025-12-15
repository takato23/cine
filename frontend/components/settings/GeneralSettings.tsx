'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Film, Music, Star, Smartphone, Mail, Volume2 } from 'lucide-react'
import { cn } from '@/lib/cn'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                checked ? "bg-primary" : "bg-white/10"
            )}
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md absolute top-1 left-1"
                animate={{ x: checked ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8 last:mb-0">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 ml-1">{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}

function Item({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-white">{title}</h4>
                    <p className="text-xs text-white/50">{description}</p>
                </div>
            </div>
            <div>{action}</div>
        </div>
    )
}

export function NotificationSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [pushAlerts, setPushAlerts] = useState(true)
    const [marketing, setMarketing] = useState(false)

    return (
        <div className="animate-fade-in max-w-2xl">
            <Section title="Canales de Contacto">
                <Item
                    icon={Mail}
                    title="Alertas por Email"
                    description="Recibir confirmaciones y tickets."
                    action={<Toggle checked={emailAlerts} onChange={setEmailAlerts} />}
                />
                <Item
                    icon={Smartphone}
                    title="Notificaciones Push"
                    description="Avisos sobre tus funciones próximas."
                    action={<Toggle checked={pushAlerts} onChange={setPushAlerts} />}
                />
            </Section>

            <Section title="Tipos de Contenido">
                <Item
                    icon={Star}
                    title="Promociones y Ofertas"
                    description="Descuentos exclusivos en snacks y entradas."
                    action={<Toggle checked={marketing} onChange={setMarketing} />}
                />
            </Section>
        </div>
    )
}

export function PreferenceSettings() {
    return (
        <div className="animate-fade-in max-w-2xl">
            <Section title="Tus gustos">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 text-center">
                    <Film className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Próximamente</h3>
                    <p className="text-white/60 text-sm">Estamos construyendo un sistema de recomendaciones basado en IA para sugerirte las mejores películas.</p>
                </div>
            </Section>
        </div>
    )
}
