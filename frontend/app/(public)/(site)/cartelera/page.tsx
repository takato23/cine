'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Ticket, Star, Clock, Info, Play, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { EmptyState, LoadingState } from '@/components/ui/states'
import { useMovies } from '@/lib/queries/movies'
import type { Movie, MovieStatus } from '@/lib/types'

type Filter = MovieStatus | 'ALL'

function formatDuration(minutes: number) {
  return `${minutes} min`
}

export default function CarteleraPage() {
  const { data, isLoading } = useMovies()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('ALL')

  // -- Parallax Hero Refs --
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Parallax effect for the hero background
  const yRange = useTransform(scrollY, [0, 1000], [0, 400])
  const opacityRange = useTransform(scrollY, [0, 500], [1, 0])
  const heroContentY = useTransform(scrollY, [0, 300], [0, 50])
  const heroContentOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // -- Derived State --
  const movies = useMemo(() => {
    const list = data ?? []
    const term = query.trim().toLowerCase()
    return list
      .filter((m) => (filter === 'ALL' ? true : m.status === filter))
      .filter((m) => {
        if (!term) return true
        const haystack = `${m.title} ${(m.genres ?? []).join(' ')}`.toLowerCase()
        return haystack.includes(term)
      })
  }, [data, filter, query])

  const heroMovies = useMemo(() => {
    const list = data ?? []
    return list.filter(m => m.status === 'ESTRENO' || m.status === 'CARTELERA').slice(0, 5) // Top 5 relevant movies
  }, [data])

  // -- Carousel State --
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  // Auto-play
  useEffect(() => {
    if (heroMovies.length <= 1) return
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroMovies.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [heroMovies.length])

  const currentHero = heroMovies[currentHeroIndex]
  const nextSlide = () => setCurrentHeroIndex(prev => (prev + 1) % heroMovies.length)
  const prevSlide = () => setCurrentHeroIndex(prev => (prev - 1 + heroMovies.length) % heroMovies.length)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary-500/30">

      {/* 
          === PARALLAX HERO SECTION === 
          Shows immediately, no scroll required.
      */}
      {!isLoading && currentHero && (
        <div ref={containerRef} className="relative h-[85vh] w-full overflow-hidden group/hero">
          {/* Parallax Background */}
          <motion.div
            style={{ y: yRange, opacity: opacityRange }}
            className="absolute inset-0 z-0"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {currentHero.posterUrl && (
                  <Image
                    src={currentHero.posterUrl}
                    alt={currentHero.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Hero Content */}
          <div className="absolute inset-0 z-10 flex items-end pb-32 md:pb-24 px-4 container mx-auto">
            <motion.div
              style={{ y: heroContentY, opacity: heroContentOpacity }}
              className="max-w-4xl w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(238,75,43,0.4)]">
                      {currentHero.status === 'ESTRENO' ? 'Estreno Exclusivo' : 'En Cartelera'}
                    </span>
                    {currentHero.rating && (
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {currentHero.rating}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
                    {currentHero.title}
                  </h1>

                  {/* Synopsis */}
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8 line-clamp-3 md:line-clamp-none">
                    {currentHero.synopsis}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link href={`/pelicula/${currentHero.id}`}>
                      <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-[0_0_30px_rgba(238,75,43,0.5)] hover:shadow-[0_0_50px_rgba(238,75,43,0.7)] transition-all border border-white/10">
                        <Ticket className="mr-2 h-5 w-5" />
                        Comprar Entradas
                      </Button>
                    </Link>
                    <Link href={`/pelicula/${currentHero.id}`}>
                      <Button variant="secondary" size="lg" className="rounded-full h-14 px-8 text-base bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                        <Info className="mr-2 h-5 w-5" />
                        Más Información
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Carousel Navigation (Right Side) */}
            <div className="absolute bottom-32 right-4 md:right-12 z-20 flex gap-2">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 group"
              >
                <ChevronDown className="w-6 h-6 rotate-90" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>
            </div>

            {/* Carousel Indicators (Bottom Center) */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'w-8 bg-primary-500' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            style={{ opacity: heroContentOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-20 pointer-events-none"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase">Explorar Cartelera</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      )}

      {/* 
          === MAIN CONTENT GRID === 
          Overlaps the hero slightly for depth
      */}
      <div className="relative z-20 bg-neutral-950 -mt-20 pt-12 pb-24 rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
        <div className="container mx-auto px-4">

          {/* Sticky Filters Bar */}
          <div className="sticky top-4 z-40 mb-10">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center">

              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary-400 transition-colors" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar película..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-white/30"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0 mask-linear-fade">
                {(['ALL', 'CARTELERA', 'ESTRENO', 'PROXIMAMENTE'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k as any)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${filter === k
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {k === 'ALL' ? 'Todas' : k === 'CARTELERA' ? 'En Cartelera' : k === 'ESTRENO' ? 'Estrenos' : 'Próximamente'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Movie Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingState title="Cargando películas..." />
              </div>
            ) : movies.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
              >
                {movies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } }
                    }}
                  >
                    <Link href={`/pelicula/${movie.id}`} className="group block h-full">
                      {/* Card Container */}
                      <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5 transition-all duration-500 group-hover:border-primary-500/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:-translate-y-2">

                        {/* Poster */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          {movie.posterUrl ? (
                            <Image
                              src={movie.posterUrl}
                              alt={movie.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 20vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                              <span className="text-white/40 text-xs">Sin imagen</span>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                              <Play className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                            </div>
                          </div>

                          {/* Status Badge */}
                          {movie.status === 'ESTRENO' && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-[10px] font-bold uppercase tracking-wider text-white roundedShadow shadow-lg">
                              Estreno
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="text-white font-bold text-base leading-tight group-hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                            {movie.title}
                          </h3>
                          <div className="flex items-center text-xs text-white/50 gap-2 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(movie.duration)}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[100px]">{movie.director}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {movie.genres.slice(0, 2).map(g => (
                              <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/70 border border-white/5">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState title="No se encontraron películas" subtitle="Prueba con otra búsqueda o filtro." />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
