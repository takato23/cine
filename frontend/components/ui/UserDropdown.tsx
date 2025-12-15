'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, History, ChevronRight, User as UserIcon, Star, CreditCard, Ticket } from 'lucide-react'
import { User } from '@/lib/types' // Ajustar ruta si es necesario

interface UserDropdownProps {
    user: User
    isOpen: boolean
    onClose: () => void
    onLogout: () => void
}

export function UserDropdown({ user, isOpen, onClose, onLogout }: UserDropdownProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop invisible para cerrar al hacer click fuera */}
                    <div className="fixed inset-0 z-40" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="absolute right-0 top-full mt-4 w-80 z-50 origin-top-right"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {/* Header con gradiente */}
                            <div className="relative p-6 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-primary via-purple-500 to-blue-500">
                                        <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.email}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover p-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate text-lg">{user.name || 'Cinéfilo'}</h3>
                                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Miembro Gold</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Mock */}
                                <div className="grid grid-cols-2 gap-2 mt-6">
                                    <div className="bg-black/20 rounded-2xl p-3 border border-white/5 text-center">
                                        <span className="block text-2xl font-black text-white">12</span>
                                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Películas</span>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-3 border border-white/5 text-center">
                                        <span className="block text-2xl font-black text-primary">850</span>
                                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Puntos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 space-y-1">
                                <Link
                                    href="/entradas"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                        <Ticket className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="font-medium flex-1">Mis Entradas</span>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                                </Link>

                                <Link
                                    href="/settings?tab=profile"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <Settings className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="font-medium flex-1">Configuración</span>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                                </Link>
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t border-white/5 mt-1">
                                <button
                                    onClick={() => {
                                        onLogout()
                                        onClose()
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                                        <LogOut className="w-4 h-4 text-red-500" />
                                    </div>
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
