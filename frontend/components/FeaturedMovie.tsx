'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Ticket } from 'lucide-react'
import type { Movie } from '@/lib/types'

interface FeaturedMovieProps {
  movie: Pick<Movie, 'id' | 'title' | 'synopsis' | 'duration' | 'genres' | 'rating' | 'posterUrl' | 'status' | 'trailerUrl'>
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  return (
    <section className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
      {/* Background layer */}
      <div className="absolute inset-0">
        {movie.posterUrl ? (
          <>
            <Image
              src={movie.posterUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover opacity-55 scale-[1.03]"
              aria-hidden="true"
            />
            <Image
              src={movie.posterUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover blur-2xl opacity-35"
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-bg-tertiary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-tertiary/40 via-bg-tertiary/70 to-bg-tertiary" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(215,18,58,0.14),transparent_55%)]" />
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-end">
          {/* Left */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {movie.status === 'ESTRENO' && (
                <span className="bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-primary">
                  Estreno
                </span>
              )}
              <span className="bg-bg-secondary/60 border border-neutral-800 text-neutral-200 px-3 py-1 rounded-md text-xs font-semibold">
                {movie.duration} min
              </span>
              {movie.rating && (
                <span className="bg-bg-secondary/60 border border-neutral-800 text-secondary-500 px-3 py-1 rounded-md text-xs font-extrabold">
                  {movie.rating}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
              {movie.title}
            </h1>

            <p className="text-neutral-200 mt-4 max-w-2xl leading-relaxed line-clamp-3">
              {movie.synopsis}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="text-xs font-semibold text-neutral-200 bg-bg-secondary/50 border border-neutral-800 px-3 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href={`/pelicula/${movie.id}`}
                className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-7 py-4 rounded-lg font-bold transition-all duration-fast ease-out hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
              >
                <Ticket className="w-5 h-5" aria-hidden="true" />
                Comprar entradas
              </Link>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-bg-secondary/70 hover:bg-bg-secondary text-neutral-50 px-7 py-4 rounded-lg font-bold transition-all duration-fast ease-out hover:shadow-md active:scale-[0.98] border border-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                >
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Ver tráiler
                </a>
              )}
            </div>
          </div>

          {/* Right: poster card */}
          <div className="md:col-span-2">
            <div className="bg-bg-secondary/70 glass border border-neutral-800 rounded-2xl p-3 shadow-xl">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={`Póster de ${movie.title}`}
                    fill
                    sizes="(max-width: 768px) 60vw, 360px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-tertiary" />
                )}
              </div>
              <div className="mt-3 px-1">
                <p className="text-xs text-neutral-300">Destacada</p>
                <p className="text-sm font-semibold text-neutral-50 line-clamp-1">{movie.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

