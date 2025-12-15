'use client'

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { LucideIcon } from 'lucide-react'
import { useEffect } from 'react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    delay?: number
    color?: string
}

export function StatsCard({ title, value, icon: Icon, change, changeType = 'neutral', delay = 0, color = 'text-primary-400' }: StatsCardProps) {
    // Parsing numeric value for counter animation
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value
    const isCurrency = typeof value === 'string' && value.includes('$')

    const count = useSpring(0, { duration: 2000, bounce: 0 })
    const rounded = useTransform(count, (latest) => {
        if (isCurrency) {
            return `$${Math.round(latest).toLocaleString('es-AR')}`
        }
        return Math.round(latest).toLocaleString('es-AR')
    })

    useEffect(() => {
        if (!isNaN(numericValue)) {
            count.set(numericValue)
        }
    }, [numericValue, count])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        >
            <div className="relative group p-[1px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                <Card className="relative h-full overflow-hidden border-0 bg-black/40 backdrop-blur-xl rounded-[23px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Glow effect behind icon */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color.replace('text-', 'from-')}/20 to-transparent blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-lg`}>
                                <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            {change && (
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    changeType === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-white/5 text-white/60 border-white/10'
                                    }`}>
                                    {changeType === 'positive' && '↑'}
                                    {changeType === 'negative' && '↓'}
                                    {change}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{title}</p>
                            <motion.h3 className="text-3xl font-black text-white tracking-tight">
                                {isNaN(numericValue) ? value : <motion.span>{rounded}</motion.span>}
                            </motion.h3>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
