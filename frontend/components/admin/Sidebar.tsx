'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Film, Home, Calendar, DollarSign, Package,
    BarChart3, Settings, ChevronLeft, ChevronRight, Search
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useState, useEffect } from 'react'
import { CommandPalette } from './CommandPalette'

const navItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Film, label: 'Películas', href: '/admin/peliculas' },
    { icon: Calendar, label: 'Funciones', href: '/admin/funciones' },
    { icon: DollarSign, label: 'Precios', href: '/admin/precios' },
    { icon: Package, label: 'Productos', href: '/admin/productos' },
    { icon: BarChart3, label: 'Reportes', href: '/admin/reportes' },
    { icon: Settings, label: 'Salas', href: '/admin/salas' },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [isCommandOpen, setIsCommandOpen] = useState(false)

    // Keyboard shortcut for Command Palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsCommandOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-col h-screen sticky top-0 glass-panel border-r-0 border-r-white/10 z-50 overflow-hidden"
            >
                {/* Brand */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 relative group mb-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <motion.div
                            animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -20 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col overflow-hidden whitespace-nowrap"
                        >
                            <span className="font-black text-lg text-white tracking-tight">CINEMA</span>
                            <span className="text-xs font-medium text-primary-400 tracking-widest uppercase">Admin Pro</span>
                        </motion.div>
                    </div>
                </div>

                {/* Search Trigger */}
                <div className="px-4 mb-4">
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left group",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        <Search className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                        {!collapsed && (
                            <div className="flex-1 flex items-center justify-between overflow-hidden">
                                <span className="text-sm text-white/40 group-hover:text-white/60 truncate">Buscar...</span>
                                <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/30 font-mono">
                                    ⌘K
                                </kbd>
                            </div>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))

                        return (
                            <Link key={item.href} href={item.href} className="block relative group">
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl border-l-2 border-primary-500 pointer-events-none"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <div className={cn(
                                    "relative flex items-center px-3 py-3 rounded-xl transition-all duration-200",
                                    isActive ? "text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}>
                                    <item.icon className={cn("w-5 h-5 transition-colors flex-shrink-0", isActive ? "text-primary-400" : "group-hover:text-white")} />

                                    <motion.span
                                        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                                        className="ml-4 font-medium whitespace-nowrap overflow-hidden text-sm"
                                    >
                                        {item.label}
                                    </motion.span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Collapse Toggle */}
                <div className="p-4 border-t border-white/5 mt-auto">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : (
                            <div className="flex items-center gap-3">
                                <ChevronLeft className="w-5 h-5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Colapsar</span>
                            </div>
                        )}
                    </button>
                </div>
            </motion.aside>

            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </>
    )
}
