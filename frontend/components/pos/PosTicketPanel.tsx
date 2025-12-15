'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Showtime } from '@/lib/types/showtime'
import { usePosStore } from '@/lib/store/pos'
import { Calendar, Clock, Film, Search } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export function PosTicketPanel() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const { setTicketDraft, setMode } = usePosStore()
  const router = useRouter() // Replaces window.location

  const { data: showtimes, isLoading } = useQuery<Showtime[]>({
    queryKey: ['showtimes', 'pos', selectedDate.toISOString().split('T')[0]],
    queryFn: async () => {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const res = await api.get(`/showtimes?date=${dateStr}`)
      return res.data
    },
  })

  const filteredShowtimes = showtimes?.filter((showtime) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (showtime.movie?.title ?? '').toLowerCase().includes(term) ||
      (showtime.room?.name ?? '').toLowerCase().includes(term)
    )
  }) || []

  const handleSelectShowtime = (showtime: Showtime) => {
    setTicketDraft({
      showtimeId: showtime.id,
      showtime,
      seats: [],
    })
    // Use Next.js router for smoother interaction
    router.push(`/pos/asientos/${showtime.id}`)
  }

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] h-full flex flex-col overflow-hidden shadow-2xl">
      {/* Date Selector */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center shadow-lg border border-primary-500/30">
            <Calendar className="w-5 h-5 text-primary-400" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Seleccionar Función</h2>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar items-center">
          {dates.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isToday = date.toDateString() === new Date().toDateString()
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap text-sm font-bold transition-all duration-300 border ${isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25 scale-105'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/10 border-white/5'
                  }`}
              >
                <div className="flex flex-col items-center leading-none gap-1">
                  <span className="uppercase text-[10px] tracking-wider opacity-80">{isToday ? 'HOY' : format(date, 'EEE')}</span>
                  <span className="text-lg">{format(date, 'd')}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 flex-shrink-0 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md" />
        <div className="relative bg-black/50 rounded-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Buscar película o sala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-white/10 text-white placeholder-white/30 pl-12 pr-4 py-4 rounded-2xl text-base font-medium focus:outline-none focus:border-primary-500/50 focus:bg-white/5 transition-all"
          />
        </div>
      </div>

      {/* Showtimes List */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-white/5 mb-4" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
      ) : filteredShowtimes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Film className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No hay funciones</h3>
          <p className="text-white/40 max-w-xs mx-auto">Prueba seleccionando otra fecha o ajusta la búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 pb-4 flex-1 custom-scrollbar content-start">
          {filteredShowtimes.map((showtime) => (
            <button
              key={showtime.id}
              onClick={() => handleSelectShowtime(showtime)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-4 text-left transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl group flex items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Time */}
              <div className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary-500/30 group-hover:bg-primary-500/20 transition-all">
                <span className="text-lg font-black text-white group-hover:text-primary-400">
                  {format(new Date(showtime.startTime), 'HH:mm')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 z-10">
                <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-primary-400 transition-colors">
                  {showtime.movie?.title ?? 'Película'}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/60 flex items-center gap-1.5 border border-white/5">
                    <Film className="w-3 h-3 text-primary-400" />
                    {showtime.room?.name ?? 'Sala'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-white/80 ${showtime.format === 'IMAX' ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' : 'bg-blue-500/20 border-blue-500/30 text-blue-300'}`}>
                    {showtime.format}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right z-10 min-w-[4rem]">
                <p className="text-xl font-black text-white group-hover:text-primary-400 transition-colors tracking-tight">$5.000</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Entrada</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

