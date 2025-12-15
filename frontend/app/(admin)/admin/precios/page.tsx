'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Plus, Edit, Trash2, DollarSign, Tag, Armchair } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState, EmptyState } from '@/components/ui/states'
import { useToast } from '@/components/ui/Toast'
import { StatsCard } from '@/components/admin/StatsCard'

interface PricingRule {
  id: string
  name: string
  description?: string
  seatType: 'STANDARD' | 'VIP'
  basePrice: number
  roomId?: string
  dayOfWeek?: number
  startTime?: string
  endTime?: string
  isActive: boolean
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function AdminPreciosPage() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const { data: rules, isLoading, refetch } = useQuery<PricingRule[]>({
    queryKey: ['pricing-rules'],
    queryFn: async () => {
      const res = await api.get('/admin/pricing-rules')
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/pricing-rules/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] })
      addToast({ title: 'Regla eliminada', variant: 'success' })
    },
  })

  const totalRules = rules?.length || 0
  const vipRules = rules?.filter(r => r.seatType === 'VIP').length || 0
  const standardRules = rules?.filter(r => r.seatType === 'STANDARD').length || 0

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white tracking-tight mb-1"
          >
            Reglas de Precio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400"
          >
            Administra tarifas y precios de entradas.
          </motion.p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Nueva Regla
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Reglas"
          value={totalRules}
          icon={Tag}
          color="text-blue-400"
          delay={0}
        />
        <StatsCard
          title="Reglas VIP"
          value={vipRules}
          icon={Armchair}
          color="text-purple-400"
          delay={0.1}
        />
        <StatsCard
          title="Reglas Standard"
          value={standardRules}
          icon={Armchair}
          color="text-emerald-400"
          delay={0.2}
        />
      </div>

      {isLoading ? (
        <LoadingState title="Cargando reglas..." subtitle="Obteniendo configuración de precios." />
      ) : !rules || rules.length === 0 ? (
        <EmptyState
          title="Sin reglas de precio"
          subtitle="No hay reglas de precio configuradas."
          action={<Button leftIcon={<Plus className="w-4 h-4" />}>Crear Regla</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <Card className="p-5 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Price Badge */}
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${rule.seatType === 'VIP'
                        ? 'bg-purple-500/10 border border-purple-500/20'
                        : 'bg-emerald-500/10 border border-emerald-500/20'
                      }`}>
                      <DollarSign className={`w-4 h-4 mb-0.5 ${rule.seatType === 'VIP' ? 'text-purple-400' : 'text-emerald-400'
                        }`} />
                      <span className="text-sm font-black text-white">
                        {(rule.basePrice / 1000).toFixed(1)}k
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white truncate">
                          {rule.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${rule.seatType === 'VIP'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          }`}>
                          {rule.seatType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                        <span className="font-semibold text-white">
                          ${rule.basePrice.toLocaleString()}
                        </span>
                        {rule.dayOfWeek !== undefined && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-xs">
                            {DAYS[rule.dayOfWeek]}
                          </span>
                        )}
                        {rule.startTime && rule.endTime && (
                          <span className="text-xs">
                            {rule.startTime} - {rule.endTime}
                          </span>
                        )}
                        {rule.description && (
                          <span className="text-neutral-500 text-xs truncate">
                            • {rule.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="px-3"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-3 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                      onClick={() => {
                        if (confirm('¿Eliminar esta regla?')) {
                          deleteMutation.mutate(rule.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
