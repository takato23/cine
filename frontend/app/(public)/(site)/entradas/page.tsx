'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, History, CreditCard, Tag, HeadphonesIcon, User, ChevronRight, LogOut, Film, ShoppingBag, Home, Ticket } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { AmbientBlob, springConfig, StaggerList, StaggerItem, GlassPanel } from '@/components/ui/motion'
import { TicketCard } from '@/components/ui/TicketCard'
import { cn } from '@/lib/cn'

type TicketData = {
    id: string
    movieTitle: string
    posterUrl: string
    cinema: string
    room: string
    date: string
    time: string
    seats: string[]
    format: string
}

const mockTickets: TicketData[] = [
    {
        id: '1',
        movieTitle: 'Avatar: El Camino del Agua',
        posterUrl: '/avatar.jpg',
        cinema: 'Cine Central',
        room: 'Sala 4',
        date: '14 Oct',
        time: '18:30',
        seats: ['H4', 'H5'],
        format: 'IMAX 3D',
    },
    {
        id: '2',
        movieTitle: 'Super Mario Bros',
        posterUrl: '/mario.jpg',
        cinema: 'Cine Norte',
        room: 'Sala 2',
        date: '15 Oct',
        time: '20:00',
        seats: ['J12'],
        format: '2D',
    },
]

export default function EntradasPage() {
    const router = useRouter()
    const { user, clearAuth } = useAuthStore()

    const quickActions = [
        { icon: History, label: 'Historial', color: 'bg-blue-500' },
        { icon: CreditCard, label: 'Pagos', color: 'bg-purple-500' },
        { icon: Tag, label: 'Cupones', color: 'bg-green-500' },
        { icon: HeadphonesIcon, label: 'Soporte', color: 'bg-orange-500' },
    ]

    const settingsItems = [
        { icon: User, label: 'Editar Perfil', description: 'Cambiar nombre, email, teléfono', href: '/settings?tab=profile' },
        { icon: Bell, label: 'Notificaciones', description: 'Gestionar alertas y promociones', href: '/settings?tab=notifications' },
        { icon: Film, label: 'Preferencias', description: 'Géneros favoritos, cines cercanos', href: '/settings?tab=preferences' },
    ]

    const handleLogout = () => {
        clearAuth()
        router.push('/login')
    }

    return (
        <motion.div
            className="min-h-screen bg-[#0a0a0a] font-display text-white antialiased overflow-x-hidden pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <AmbientBlob color="rgba(238, 75, 43, 0.1)" size={500} position={{ top: '-10%', right: '-20%' }} delay={0} />
                <AmbientBlob color="rgba(168, 85, 247, 0.05)" size={400} position={{ bottom: '20%', left: '-20%' }} delay={2} />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-20 pb-6 px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl md:text-4xl font-black tracking-tight"
                        >
                            Mis Entradas
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/40 font-medium"
                        >
                            Hola, {user?.name || 'Cinéfilo'} 👋
                        </motion.p>
                    </div>
                    <Link href="/settings">
                        <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden relative group">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || user?.email || 'guest'}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                </div>
            </header>

            {/* Tickets Carousel */}
            <section className="relative z-10 mb-10 overflow-hidden">
                <div className="px-6 mb-4 flex justify-between items-end">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Próximas Funciones</span>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto px-6 pb-10 gap-6 snap-x snap-mandatory scrollbar-hide">
                    {mockTickets.length > 0 ? (
                        mockTickets.map((ticket, idx) => (
                            <div key={ticket.id} className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                                <TicketCard ticket={ticket} index={idx} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full p-8 rounded-3xl border border-dashed border-white/10 text-center">
                            <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/60 font-medium mb-4">No tienes entradas próximas</p>
                            <Link href="/cartelera" className="inline-block px-6 py-2 rounded-full bg-primary text-white font-bold text-sm">
                                Ver Cartelera
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="relative z-10 px-6 mb-10">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Accesos Rápidos</span>
                <div className="grid grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                        <motion.button
                            key={action.label}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-1 transition-transform hover:-translate-y-1",
                                "bg-white/5 border border-white/10 group-hover:border-white/20"
                            )}>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center opacity-80", action.color)}>
                                    <action.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <span className="text-[10px] font-medium text-white/60">{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Settings Links */}
            <section className="relative z-10 px-6">
                <StaggerList className="flex flex-col gap-3">
                    {settingsItems.map((item) => (
                        <StaggerItem key={item.label}>
                            <Link href={item.href}>
                                <div className="group bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10 active:scale-[0.98]">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <BaseText className="font-semibold text-white">{item.label}</BaseText>
                                        <BaseText className="text-xs text-white/40">{item.description}</BaseText>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60" />
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}

                    <motion.button
                        onClick={handleLogout}
                        className="w-full mt-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center gap-4 text-red-400 font-medium transition-all hover:bg-red-500/10 active:scale-[0.98]"
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span>Cerrar Sesión</span>
                    </motion.button>
                </StaggerList>
            </section>
        </motion.div>
    )
}

function BaseText({ children, className }: { children: React.ReactNode, className?: string }) {
    return <p className={className}>{children}</p>
}
