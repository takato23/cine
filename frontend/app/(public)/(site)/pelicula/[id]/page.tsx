'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, Star, Ticket, RefreshCcw, ArrowLeft, Play, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { DateSelector } from '@/components/DateSelector'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

import { useMovie } from '@/lib/queries/movies'
import { useShowtimes } from '@/lib/queries/showtimes'

function formatMoneyARS(amount: number) {
  return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

function formatTime(iso: string) {
  return format(new Date(iso), 'HH:mm')
}

export default function PeliculaPage() {
  const params = useParams<{ id: string }>()
  const movieId = params?.id

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [tab, setTab] = useState<'sinopsis' | 'trailer'>('sinopsis')

  const dateKey = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate])

  const movieQuery = useMovie(movieId)
  const showtimesQuery = useShowtimes({ movieId, date: dateKey })

  const movie = movieQuery.data
  const showtimes = showtimesQuery.data ?? []

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary-500/30">

      {/* LOADING / ERROR STATES (Full Screen for immersion) */}
      {movieQuery.isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingState title="Cargando película..." />
        </div>
      ) : movieQuery.isError ? (
        <div className="h-screen flex items-center justify-center">
          <ErrorState title="Error al cargar" onRetry={() => movieQuery.refetch()} />
        </div>
      ) : !movie ? (
        <div className="h-screen flex items-center justify-center">
          <EmptyState
            title="Película no encontrada"
            action={
              <Link href="/cartelera">
                <Button>Volver a cartelera</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* 1. IMMERSIVE BACKGROUND LAYER */}
          <div className="fixed inset-0 z-0">
            {movie.posterUrl && (
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover opacity-30 blur-2xl scale-110"
                priority
              />
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          {/* 2. NAVIGATION - Now relative, part of main content to avoid overlap with global nav */}
          <div className="relative z-20 pt-4 px-4">
            <div className="container mx-auto">
              <Link href="/cartelera">
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-semibold text-sm">Volver</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* 3. MAIN CONTENT */}
          <main className="relative z-10 container mx-auto px-4 pt-8 pb-20">
            <div className="grid lg:grid-cols-12 gap-12 items-start">

              {/* LEFT: Poster & Key Info */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 relative group">
                <motion.div
                  initial={{ opacity: 0, y: 30, rotateY: 10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
                >
                  {movie.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900" />
                  )}
                  {/* Gloss effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-40 pointer-events-none" />
                </motion.div>

                {/* Stats Tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start"
                >
                  {movie.rating && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm backdrop-blur-md">
                      <Star className="h-4 w-4 fill-current" /> {movie.rating}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 font-medium text-sm backdrop-blur-md">
                    <Clock className="h-4 w-4" /> {movie.duration} min
                  </span>
                </motion.div>
              </div>

              {/* RIGHT: Details & Showtimes */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.genres?.map(g => (
                        <span key={g} className="text-xs font-bold tracking-widest uppercase text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-1 rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl leading-[0.9]">
                      {movie.title}
                    </h1>
                  </div>

                  {/* Tabs Area */}
                  <div className="mb-12 bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
                    <Tabs
                      value={tab}
                      onValueChange={setTab as any}
                      options={[
                        { value: 'sinopsis', label: 'Sinopsis' },
                        { value: 'trailer', label: 'Tráiler' },
                      ]}
                      className="mb-6"
                    />

                    <div className="min-h-[100px]">
                      <AnimatePresence mode='wait'>
                        {tab === 'sinopsis' ? (
                          <motion.div
                            key="synopsis"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
                              {movie.synopsis}
                            </p>
                            <div className="flex gap-8 pt-4 border-t border-white/5">
                              <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Director</p>
                                <p className="text-white font-medium">Denis Villeneuve</p> {/* Hardcoded for demo if not in API */}
                              </div>
                              <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Estreno</p>
                                <p className="text-white font-medium">
                                  {(() => {
                                    if (!movie.releaseDate) return '—';
                                    try {
                                      const date = new Date(movie.releaseDate);
                                      if (isNaN(date.getTime())) return '—';
                                      return format(date, "d MMM yyyy", { locale: es });
                                    } catch {
                                      return '—';
                                    }
                                  })()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="trailer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl"
                          >
                            {movie.trailerUrl ? (
                              <iframe
                                src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                                className="w-full h-full"
                                allowFullScreen
                                title="Trailer"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center flex-col gap-3 text-white/50">
                                <Play className="h-12 w-12 opacity-50" />
                                <p>Trailer no disponible</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Showtimes Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">Funciones Disponibles</h2>
                      <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
                      <DateSelector
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        daysToShow={7}
                      />

                      <div className="mt-8">
                        {showtimesQuery.isLoading ? (
                          <div className="py-12"><LoadingState title="Buscando funciones..." /></div>
                        ) : showtimes.length === 0 ? (
                          <div className="py-12 bg-white/5 rounded-2xl border border-white/5 p-8 text-center">
                            <p className="text-white/50 text-lg">No hay funciones programadas para este día.</p>
                            <Button variant="secondary" className="mt-4" onClick={() => showtimesQuery.refetch()}>
                              Actualizar
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {showtimes.map((s) => {
                              const base = s.pricingRule?.basePrice ?? 5000
                              return (
                                <Link key={s.id} href={`/pelicula/${movie.id}/asientos/${s.id}`} className="group">
                                  <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-300 p-4 text-center group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(238,75,43,0.2)]">
                                    <div className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">
                                      {formatTime(s.startTime)}
                                    </div>
                                    <div className="text-xs font-bold tracking-widest text-white/40 uppercase mt-1 mb-2">
                                      {s.format === 'IMAX' ? 'IMAX' : '2D'} • {s.language}
                                    </div>
                                    <div className="text-sm font-medium text-white/80 bg-black/40 rounded-lg py-1 px-2 inline-block">
                                      {formatMoneyARS(base)}
                                    </div>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}
