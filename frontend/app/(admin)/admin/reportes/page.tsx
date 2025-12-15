'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { StatsCard } from '@/components/admin/StatsCard'
import { TrendingUp, Users, Film, DollarSign, Calendar } from 'lucide-react'

// Mock Data
const SALES_DATA = [
    { day: 'Lun', amount: 120000 },
    { day: 'Mar', amount: 95000 },
    { day: 'Mie', amount: 210000 }, // discounted day?
    { day: 'Jue', amount: 150000 },
    { day: 'Vie', amount: 380000 },
    { day: 'Sab', amount: 520000 },
    { day: 'Dom', amount: 480000 },
]

const TOP_MOVIES = [
    { title: 'Duna: Parte Dos', tickets: 1250, revenue: 6250000 },
    { title: 'Kung Fu Panda 4', tickets: 980, revenue: 4900000 },
    { title: 'Godzilla y Kong', tickets: 850, revenue: 4250000 },
    { title: 'Ghostbusters', tickets: 420, revenue: 2100000 },
]

const OCCUPANCY_STATS = [
    { room: 'Sala Roja', capacity: 96, occupied: 78 },
    { room: 'Sala Amarilla', capacity: 72, occupied: 45 },
    { room: 'Lux Hall', capacity: 120, occupied: 110 }, // nearly full
]

export default function AdminReportesPage() {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
    }

    const maxSale = Math.max(...SALES_DATA.map(d => d.amount))

    return (
        <div className="space-y-8 animate-fade-in p-6 pb-20">
            <header>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-white tracking-tight mb-1"
                >
                    Reportes & Métricas
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-400"
                >
                    Resumen de ventas, ocupación y rendimiento de películas.
                </motion.p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Ventas Totales (Semana)"
                    value="$1.955.000"
                    icon={DollarSign}
                    color="text-emerald-400"
                    change="12%"
                    changeType="positive"
                    delay={0}
                />
                <StatsCard
                    title="Tickets Vendidos"
                    value={3500}
                    icon={Film}
                    color="text-blue-400"
                    change="5%"
                    changeType="positive"
                    delay={0.1}
                />
                <StatsCard
                    title="Ocupación Promedio"
                    value="72%"
                    icon={Users}
                    color="text-orange-400"
                    change="2%"
                    changeType="negative"
                    delay={0.2}
                />
                <StatsCard
                    title="Funciones Realizadas"
                    value={42}
                    icon={Calendar}
                    color="text-purple-400"
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-white/5 border-white/5 p-6 h-full">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            Ingresos Semanales
                        </h3>

                        <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                            {SALES_DATA.map((d, i) => (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                                        {formatCurrency(d.amount)}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.amount / maxSale) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                                        className="w-full bg-primary-500/20 hover:bg-primary-500/50 rounded-t-sm relative transition-colors cursor-pointer"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/50" />
                                    </motion.div>
                                    <span className="text-sm font-medium text-white/60">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Top Movies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-white/5 border-white/5 p-6 h-full">
                        <h3 className="text-xl font-bold text-white mb-6">Top Películas</h3>
                        <div className="space-y-6">
                            {TOP_MOVIES.map((m, i) => (
                                <div key={m.title} className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-white font-medium text-base truncate pr-4">{m.title}</span>
                                        <span className="text-primary-400 font-bold text-sm whitespace-nowrap">{m.tickets} tix</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(m.tickets / 1300) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.4 + (i * 0.1) }}
                                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                                        />
                                    </div>
                                    <div className="text-xs text-white/30 mt-1 text-right">
                                        {formatCurrency(m.revenue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Occupancy by Room */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-3"
                >
                    <Card className="bg-white/5 border-white/5 p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Ocupación por Sala (Promedio)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {OCCUPANCY_STATS.map((room, i) => {
                                const percentage = Math.round((room.occupied / room.capacity) * 100)
                                return (
                                    <div key={room.room} className="bg-black/20 rounded-xl p-4 flex items-center justify-between border border-white/5">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{room.room}</h4>
                                            <p className="text-sm text-white/40">{room.capacity} butacas</p>
                                        </div>
                                        <div className="relative w-20 h-20 flex items-center justify-center">
                                            {/* Simple Circular Progress Mock */}
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-white/10"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                                <motion.path
                                                    initial={{ strokeDasharray: "0, 100" }}
                                                    animate={{ strokeDasharray: `${percentage}, 100` }}
                                                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                                    className={`${percentage > 80 ? 'text-emerald-500' : percentage > 50 ? 'text-primary-500' : 'text-rose-500'}`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-sm font-bold text-white">{percentage}%</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </motion.div>
            </div>

        </div>
    )
}
