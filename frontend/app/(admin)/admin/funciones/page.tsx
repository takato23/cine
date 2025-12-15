'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Showtime } from '@/lib/types/showtime'
import { Plus, Edit, Trash2, Calendar, Clock, Film } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState, EmptyState } from '@/components/ui/states'
import { useToast } from '@/components/ui/Toast'

export default function AdminFuncionesPage() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: showtimes, isLoading, refetch } = useQuery<Showtime[]>({
    queryKey: ['showtimes', 'admin', selectedDate.toISOString().split('T')[0]],
    queryFn: async () => {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const res = await api.get(`/showtimes?date=${dateStr}`)
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/showtimes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showtimes'] })
      addToast({ title: 'Función eliminada', variant: 'success' })
    },
  })

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white tracking-tight mb-1"
          >
            Funciones
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400"
          >
            Gestiona horarios y funciones del cine.
          </motion.p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Nueva Función
        </Button>
      </header>

      {/* Date Selector Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {dates.map((date, idx) => {
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const isToday = date.toDateString() === new Date().toDateString()
          return (
            <motion.button
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap font-semibold text-sm transition-all border ${isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 border-white/10'
                }`}
            >
              {isToday ? 'Hoy' : format(date, 'EEE d', { locale: es })}
            </motion.button>
          )
        })}
      </motion.div>

      {isLoading ? (
        <LoadingState title="Cargando funciones..." subtitle="Obteniendo programación." />
      ) : !showtimes || showtimes.length === 0 ? (
        <EmptyState
          title="Sin funciones"
          subtitle="No hay funciones programadas para esta fecha."
          action={<Button leftIcon={<Plus className="w-4 h-4" />}>Agregar Función</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {showtimes.map((showtime, idx) => (
            <motion.div
              key={showtime.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <Card className="p-5 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Time Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary-400 mb-0.5" />
                      <span className="text-lg font-black text-white">
                        {format(new Date(showtime.startTime), 'HH:mm')}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate mb-1">
                        {showtime.movie?.title || 'Sin película'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-neutral-400">
                          {showtime.room?.name || 'Sin sala'}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-primary-500/15 text-primary-400 border border-primary-500/20">
                          {showtime.format === 'TWO_D' ? '2D' : showtime.format === 'THREE_D' ? '3D' : showtime.format}
                        </span>
                        <span className="text-neutral-500 text-xs">
                          {showtime.language?.toUpperCase()}
                          {showtime.subtitles && ` / Sub ${showtime.subtitles.toUpperCase()}`}
                        </span>
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
                        if (confirm('¿Eliminar esta función?')) {
                          deleteMutation.mutate(showtime.id)
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
