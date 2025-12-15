'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Home, ShoppingBag, Ticket, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/lib/store'

export function BottomNav() {
    const pathname = usePathname()
    const { user } = useAuthStore()

    const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

    const links = useMemo(
        () => [
            { href: '/', icon: Home, label: 'Inicio' },
            { href: '/cartelera', icon: Film, label: 'Películas' },
            { href: '/confiteria', icon: ShoppingBag, label: 'Snacks' },
            { href: '/entradas', icon: Ticket, label: 'Entradas' },
            { href: user ? '/settings' : '/login', icon: User, label: user ? 'Cuenta' : 'Entrar' },
        ],
        [user]
    )

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 safe-area-bottom">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="grid grid-cols-5 h-16 relative">
                    {links.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center gap-1 group"
                            >
                                {active && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 bg-white/5"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-0.5">
                                    <div className={cn("transition-transform duration-300", active ? "-translate-y-1" : "")}>
                                        <item.icon
                                            className={cn(
                                                "w-6 h-6 transition-all duration-300",
                                                active ? "text-primary drop-shadow-[0_0_8px_rgba(238,75,43,0.5)] scale-110" : "text-white/40 group-active:scale-95"
                                            )}
                                            fill={active ? "currentColor" : "none"}
                                            strokeWidth={active ? 2.5 : 2}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {active && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                                                className="text-[10px] font-bold text-white absolute -bottom-3"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {active && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-full opacity-80"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
