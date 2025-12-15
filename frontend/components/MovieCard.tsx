'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import type { Movie } from '@/lib/types'

interface MovieCardProps {
  movie: Pick<Movie, 'id' | 'title' | 'duration' | 'genres' | 'rating' | 'posterUrl' | 'status'>
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/pelicula/${movie.id}`}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 rounded-lg"
      aria-label={`Ver detalle de ${movie.title}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-bg-secondary border border-neutral-800 shadow-md transition-all duration-normal ease-out hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]">
        {/* subtle glow */}
        <div className="pointer-events-none absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity duration-slow">
          <div className="absolute inset-0 bg-[radial-gradient(300px_circle_at_30%_20%,rgba(215,18,58,0.18),transparent_60%)]" />
        </div>

        {movie.posterUrl ? (
          <div className="aspect-[2/3] relative">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
              className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-tertiary/95 via-bg-tertiary/10 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[2/3] bg-bg-tertiary flex items-center justify-center border-b border-neutral-800">
            <span className="text-neutral-400 text-sm">Sin imagen</span>
          </div>
        )}
        
        {movie.status === 'ESTRENO' && (
          <div className="absolute top-2 left-2 bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-primary">
            ESTRENO
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-neutral-50 mb-1 line-clamp-2 group-hover:text-primary-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-neutral-300">
            <span className="text-neutral-300">{movie.duration} min</span>
            {movie.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-secondary-500 text-secondary-500" aria-hidden="true" />
                <span className="text-secondary-500 font-semibold">{movie.rating}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs font-semibold text-neutral-200 bg-bg-tertiary/60 border border-neutral-800 px-3 py-1 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
            Ver detalle <ArrowRight className="w-4 h-4 transition-transform duration-fast ease-out group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  )
}

