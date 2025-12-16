'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Play, ChevronRight, ChevronLeft, Star, Clock } from 'lucide-react';
import { useMovies } from '@/lib/queries/movies';
import type { Movie } from '@/lib/types/movie';

export default function HomePage() {
  const { data: movies, isLoading } = useMovies();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get featured movies (prioritize isFeatured, then ESTRENO status)
  const featuredMovies = movies?.filter(m =>
    m.isFeatured || m.status === 'ESTRENO'
  ).slice(0, 5) || [];

  const currentMovie: Movie | null = featuredMovies[currentIndex] || null;

  // Navigation functions
  const goNext = () => {
    if (featuredMovies.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const goPrev = () => {
    if (featuredMovies.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  // Handle swipe/drag gesture
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // minimum distance to trigger navigation
    if (info.offset.x > threshold) {
      goPrev();
    } else if (info.offset.x < -threshold) {
      goNext();
    }
  };

  // Auto-rotate featured movies every 6 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  return (
    <main
      className="relative w-full min-h-screen bg-black overflow-hidden"
      onTouchStart={(e) => {
        const touch = e.touches[0];
        (e.currentTarget as any)._touchStartX = touch.clientX;
      }}
      onTouchEnd={(e) => {
        const startX = (e.currentTarget as any)._touchStartX;
        if (startX === undefined) return;
        const touch = e.changedTouches[0];
        const diff = touch.clientX - startX;
        const threshold = 50;
        if (diff > threshold) goPrev();
        else if (diff < -threshold) goNext();
      }}
    >

      {/* Background Image with Parallax Effect */}
      <AnimatePresence mode="wait">
        {currentMovie?.posterUrl && (
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={currentMovie.posterUrl}
              alt={currentMovie.title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            {/* Film grain texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-all group"
            aria-label="Película anterior"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:scale-110 transition-all group"
            aria-label="Siguiente película"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6 md:p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 border border-white/10 overflow-hidden backdrop-blur-sm">
              <Image
                src="/images/cinema-logo.png"
                alt="Cinema Pergamino"
                fill
                sizes="48px"
                className="object-contain p-2"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-black tracking-tight text-white">
                Cinema <span className="text-primary">Pergamino</span>
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all"
          >
            Iniciar sesión
          </Link>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-end pb-32 md:pb-40 px-6 md:px-12 lg:px-20">
          <AnimatePresence mode="wait">
            {currentMovie && (
              <motion.div
                key={currentMovie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-4"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-primary font-bold text-xs uppercase tracking-widest">
                    {currentMovie.status === 'ESTRENO' ? 'ESTRENO' : 'EN CARTELERA'}
                  </span>
                </motion.div>

                {/* Movie Title */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-4 drop-shadow-2xl">
                  {currentMovie.title}
                </h1>

                {/* Movie Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/70">
                  {currentMovie.rating && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{currentMovie.rating}</span>
                    </span>
                  )}
                  {currentMovie.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{currentMovie.duration} min</span>
                    </span>
                  )}
                  {currentMovie.genres?.slice(0, 3).map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <p className="text-white/60 text-base md:text-lg leading-relaxed line-clamp-2 mb-8 max-w-xl">
                  {currentMovie.synopsis}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/pelicula/${currentMovie.id}`}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-lg transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-100"
                  >
                    Comprar Entradas
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {currentMovie.trailerUrl && (
                    <button
                      onClick={() => window.open(currentMovie.trailerUrl!, '_blank')}
                      className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Ver Tráiler
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Movie Indicators (if multiple) */}
          {featuredMovies.length > 1 && (
            <div className="flex items-center gap-2 mt-10">
              {featuredMovies.map((movie, idx) => (
                <button
                  key={movie.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-4 bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`Ver ${movie.title}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA - Ver Cartelera */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="hidden md:block">
              <p className="text-white/40 text-sm font-medium">
                {movies?.length || 0} películas en cartelera
              </p>
            </div>
            <Link
              href="/cartelera"
              className="group flex items-center gap-2 text-white font-bold hover:text-primary transition-colors"
            >
              Ver toda la cartelera
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
