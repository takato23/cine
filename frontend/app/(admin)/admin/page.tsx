'use client'

import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Film, Calendar, DollarSign, Package, BarChart3,
  Settings, LogOut, TrendingUp, Users, Ticket, MoveRight,
  Search, Bell, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatsCard } from '@/components/admin/StatsCard'
import { motion } from 'framer-motion'
import { SceneContainer } from '@/components/canvas/SceneContainer'
import { FloatingParticles } from '@/components/canvas/FloatingParticles'

export default function AdminPage() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  const kpis = [
    {
      icon: Ticket,
      title: 'Entradas Hoy',
      value: '156',
      change: '12%',
      changeType: 'positive' as const,
      color: 'text-blue-400',
      delay: 0
    },
    {
      icon: TrendingUp,
      title: 'Ingresos Hoy',
      value: '$185.400',
      change: '8%',
      changeType: 'positive' as const,
      color: 'text-emerald-400',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'Ocupación',
      value: '73%',
      change: '2%',
      changeType: 'negative' as const,
      color: 'text-amber-400',
      delay: 0.2
    },
    {
      icon: Film,
      title: 'Funciones Activas',
      value: '8',
      changeType: 'neutral' as const,
      color: 'text-purple-400',
      delay: 0.3
    },
  ]

  const quickActions = [
    {
      icon: Film,
      title: 'Gestionar Películas',
      description: 'Alta, baja y modificación de cartelera.',
      href: '/admin/peliculas',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/20',
      text: 'text-blue-200'
    },
    {
      icon: Calendar,
      title: 'Programar Funciones',
      description: 'Administrar horarios y salas.',
      href: '/admin/funciones',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/20',
      text: 'text-emerald-200'
    },
    {
      icon: Package,
      title: 'Confitería',
      description: 'Control de stock y productos.',
      href: '/admin/productos',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
      text: 'text-purple-200'
    },
    {
      icon: Settings,
      title: 'Configurar Salas',
      description: 'Editar capacidad y modos de asiento.',
      href: '/admin/salas',
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/20',
      text: 'text-orange-200'
    },
  ]

  return (
    <div className="space-y-10 animate-fade-in relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-20">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">Panel de Control</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            Hola, {user?.name?.split(' ')[0] || 'Admin'}
          </motion.h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-white/60">Sistema Operativo</span>
          </div>

          <Button
            variant="ghost"
            className="w-10 h-10 rounded-full p-0 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              clearAuth()
              router.push('/login')
            }}
            className="gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Salir
          </Button>
        </div>
      </header>

      {/* 3D Hero / Stats Area */}
      <section className="relative">
        {/* Decorative Background for Stats */}
        <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {kpis.map((kpi) => (
            <StatsCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions Grid */}
        <section className="xl:col-span-2 space-y-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            Accesos Rápidos
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className={`group h-full p-6 rounded-3xl border ${action.border} bg-white/5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-md`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-white shadow-inner`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <MoveRight className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <h3 className={`text-lg font-bold text-white mb-1`}>{action.title}</h3>
                    <p className={`text-sm text-white/50 group-hover:text-white/80 transition-colors leading-relaxed`}>
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="space-y-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            Actividad Reciente
          </motion.h2>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden h-fit">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Hoy</span>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { action: 'Nueva venta', detail: '2 entradas + Combo', time: '5m', type: 'success' },
                { action: 'Función agregada', detail: 'Gladiador II', time: '15m', type: 'info' },
                { action: 'Stock bajo', detail: 'Bebida 500ml', time: '1h', type: 'warning' },
                { action: 'Nueva venta', detail: '4 entradas', time: '2h', type: 'success' },
                { action: 'Cierre de caja', detail: 'Turno Mañana', time: '4h', type: 'neutral' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                  className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4 cursor-default group"
                >
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                    item.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                      item.type === 'info' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                        'bg-neutral-500'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white truncate">{item.action}</p>
                      <span className="text-[10px] text-white/30 font-mono flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors truncate">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs text-white/40 hover:text-white h-8">Ver historial completo</Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
