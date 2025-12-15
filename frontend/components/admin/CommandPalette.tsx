'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Film, Calendar, Package, DollarSign,
    Settings, BarChart3, Plus, X, Command
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface CommandPaletteProps {
    isOpen: boolean
    onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (filteredItems[selectedIndex]) {
                    handleSelect(filteredItems[selectedIndex])
                }
            } else if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, selectedIndex, query]) // added query dependency implicitly via filteredItems calculation in render? No, need to define items outside or memoize.

    const items = [
        // Navigation
        { type: 'nav', icon: BarChart3, label: 'Dashboard', href: '/admin', group: 'Navegación' },
        { type: 'nav', icon: Film, label: 'Películas', href: '/admin/peliculas', group: 'Navegación' },
        { type: 'nav', icon: Calendar, label: 'Funciones', href: '/admin/funciones', group: 'Navegación' },
        { type: 'nav', icon: Package, label: 'Productos', href: '/admin/productos', group: 'Navegación' },
        { type: 'nav', icon: DollarSign, label: 'Precios', href: '/admin/precios', group: 'Navegación' },
        { type: 'nav', icon: Settings, label: 'Salas', href: '/admin/salas', group: 'Navegación' },

        // Actions
        { type: 'action', icon: Plus, label: 'Nueva Película', href: '/admin/peliculas/nueva', group: 'Acciones Rápidas' },
        { type: 'action', icon: Plus, label: 'Nueva Función', href: '/admin/funciones/nueva', group: 'Acciones Rápidas' },
        { type: 'action', icon: Plus, label: 'Nuevo Producto', href: '/admin/productos/nuevo', group: 'Acciones Rápidas' },
    ]

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (item: typeof items[0]) => {
        router.push(item.href)
        onClose()
        setQuery('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[70] px-4"
                    >
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                            {/* Search Header */}
                            <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                                <Search className="w-5 h-5 text-white/40" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar o ejecutar comando..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-lg font-medium"
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-white/40 font-mono">
                                        ESC
                                    </kbd>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="overflow-y-auto p-2 custom-scrollbar">
                                {filteredItems.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-white/30">No se encontraron resultados</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, index) => {
                                            const isSelected = index === selectedIndex

                                            // Render group header if it's the first item or group changes
                                            const showGroup = index === 0 || item.group !== filteredItems[index - 1].group

                                            return (
                                                <div key={item.href + item.label}>
                                                    {showGroup && (
                                                        <div className="px-3 py-2 text-xs font-semibold text-white/30 uppercase tracking-wider">
                                                            {item.group}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left",
                                                            isSelected
                                                                ? "bg-primary/20 text-white shadow-glow-primary-sm border border-primary/20"
                                                                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-2 rounded-lg",
                                                            isSelected ? "bg-primary text-white" : "bg-white/5 text-white/60"
                                                        )}>
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="font-medium block">{item.label}</span>
                                                            {item.type === 'action' && (
                                                                <span className="text-xs opacity-60">Acción rápida</span>
                                                            )}
                                                        </div>
                                                        {isSelected && (
                                                            <motion.div layoutId="enter-icon">
                                                                <Command className="w-4 h-4 opacity-50" />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/5 px-4 py-2 flex justify-between items-center text-[10px] text-white/30">
                                <span>Cinema Pergamino Admin</span>
                                <div className="flex gap-3">
                                    <span className="flex items-center gap-1"><span className="text-white/50">↑↓</span> navegar</span>
                                    <span className="flex items-center gap-1"><span className="text-white/50">↵</span> seleccionar</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
