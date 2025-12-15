'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Bookmark, ChevronLeft } from 'lucide-react'
import type { Movie } from '@/lib/types'

interface MovieCardPremiumProps {
    movie: Pick<Movie, 'id' | 'title' | 'duration' | 'genres' | 'rating' | 'posterUrl' | 'synopsis' | 'director'>
    showHeader?: boolean
    onBack?: () => void
}

export function MovieCardPremium({ movie, showHeader = true, onBack }: MovieCardPremiumProps) {
    return (
        <motion.div
            className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-900"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Poster Background */}
            {movie.posterUrl ? (
                <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Header Navigation */}
            {showHeader && (
                <motion.div
                    className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </motion.button>

                    <motion.button
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Bookmark className="w-5 h-5 text-white" />
                    </motion.button>
                </motion.div>
            )}

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                {/* Title */}
                <motion.h1
                    className="text-3xl font-black text-white leading-tight mb-3 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {movie.title}
                </motion.h1>

                {/* Rating Row */}
                <motion.div
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {movie.rating && (
                        <>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-yellow-400 font-bold text-sm">{movie.rating}</span>
                            </div>
                            <span className="text-[10px] font-bold text-white/90 bg-yellow-400/20 border border-yellow-400/30 px-2 py-0.5 rounded">
                                IMDB {movie.rating}
                            </span>
                        </>
                    )}
                </motion.div>

                {/* Director Info */}
                {movie.director && (
                    <motion.p
                        className="text-white/60 text-sm mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-white/40">Director:</span>{' '}
                        <span className="text-white/80">{movie.director}</span>
                    </motion.p>
                )}

                {/* Synopsis */}
                {movie.synopsis && (
                    <motion.p
                        className="text-white/50 text-sm leading-relaxed line-clamp-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {movie.synopsis}
                    </motion.p>
                )}
            </div>
        </motion.div>
    )
}

// Compact version for lists
interface MovieCardCompactProps {
    movie: Pick<Movie, 'id' | 'title' | 'duration' | 'rating' | 'posterUrl'>
    index?: number
}

export function MovieCardCompact({ movie, index = 0 }: MovieCardCompactProps) {
    return (
        <Link href={`/pelicula/${movie.id}`}>
            <motion.div
                className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Poster */}
                {movie.posterUrl ? (
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                        <span className="text-neutral-600 text-xs">Sin imagen</span>
                    </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/60">{movie.duration} min</span>
                        {movie.rating && (
                            <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{movie.rating}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating badge always visible */}
                {movie.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-xs">{movie.rating}</span>
                    </div>
                )}
            </motion.div>
        </Link>
    )
}
