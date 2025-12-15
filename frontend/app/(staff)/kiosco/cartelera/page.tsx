'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - replace with API call
const peliculas = [
    {
        id: '1',
        title: 'Dune: Parte Dos',
        genres: ['Sci-Fi', 'Aventura'],
        duration: 166,
        rating: 'PG-13',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        format: 'IMAX',
        status: 'CARTELERA',
        showtimes: ['16:30', '19:00', '21:45'],
    },
    {
        id: '2',
        title: 'Kung Fu Panda 4',
        genres: ['Animación', 'Comedia'],
        duration: 94,
        rating: 'ATP',
        posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        format: '3D',
        status: 'CARTELERA',
        showtimes: ['15:00', '17:30', '20:00'],
    },
    {
        id: '3',
        title: 'Godzilla x Kong: El Nuevo Imperio',
        genres: ['Acción', 'Sci-Fi'],
        duration: 115,
        rating: '+13',
        posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
        format: '3D',
        status: 'CARTELERA',
        showtimes: ['18:15', '21:45'],
    },
    {
        id: '4',
        title: 'Ghostbusters: Imperio Helado',
        genres: ['Comedia', 'Fantasía'],
        duration: 115,
        rating: 'ATP',
        posterUrl: 'https://image.tmdb.org/t/p/w500/e1J2oNzSBdou01sfc3vxjNLiOGL.jpg',
        format: '2D',
        status: 'CARTELERA',
        showtimes: ['14:00', '17:30', '22:00'],
    },
    {
        id: '5',
        title: 'Civil War',
        genres: ['Acción', 'Drama'],
        duration: 109,
        rating: '+16',
        posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
        format: '2D',
        status: 'CARTELERA',
        showtimes: ['19:30', '22:15'],
    },
    {
        id: '6',
        title: 'Abigail',
        genres: ['Terror', 'Thriller'],
        duration: 109,
        rating: '+16',
        posterUrl: 'https://image.tmdb.org/t/p/w500/5gKKSoD3iezjoL7YqZONjmyAiRA.jpg',
        format: '2D',
        status: 'CARTELERA',
        showtimes: ['20:00', '22:30'],
    },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function KioscoCarteleraPage() {
    const [filter, setFilter] = useState<string>('all');

    const filteredPeliculas = peliculas.filter((p) => {
        if (filter === 'all') return true;
        if (filter === '3D') return p.format === '3D';
        if (filter === 'IMAX') return p.format === 'IMAX';
        if (filter === 'ATP') return p.rating === 'ATP';
        return true;
    });

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[150px]"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-8 flex items-center justify-between">
                <Link href="/kiosco" className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-3xl">arrow_back</span>
                    </div>
                    <span className="text-white text-2xl font-semibold">Volver</span>
                </Link>

                <h1 className="text-white text-4xl font-bold">Elegí tu Película</h1>

                <div className="w-14" /> {/* Spacer for centering */}
            </header>

            {/* Filters */}
            <section className="relative z-10 px-12 py-4">
                <div className="flex gap-4 justify-center">
                    {[
                        { key: 'all', label: 'Todas' },
                        { key: '3D', label: '3D' },
                        { key: 'IMAX', label: 'IMAX' },
                        { key: 'ATP', label: 'Para Toda la Familia' },
                    ].map((f) => (
                        <motion.button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 ${filter === f.key
                                ? 'bg-primary text-white shadow-glow-primary'
                                : 'glass-panel text-white/80 hover:bg-white/10'
                                }`}
                        >
                            {f.label}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Movie Grid */}
            <motion.section
                className="relative z-10 px-12 py-8 pb-32"
                variants={container}
                initial="hidden"
                animate="show"
                key={filter} // Re-animate on filter change
            >
                <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredPeliculas.map((pelicula) => (
                        <motion.div key={pelicula.id} variants={item}>
                            <Link href={`/kiosco/pelicula/${pelicula.id}`} className="block group">
                                <div className="glass-card rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all duration-300 group-hover:shadow-2xl">
                                    {/* Poster */}
                                    <div className="relative aspect-[2/3] overflow-hidden">
                                        <Image
                                            src={pelicula.posterUrl}
                                            alt={pelicula.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                                            <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white/90 text-sm font-medium">
                                                {pelicula.rating}
                                            </span>
                                            {pelicula.format !== '2D' && (
                                                <span className="px-3 py-1.5 rounded-xl bg-primary text-white text-sm font-bold shadow-glow-primary">
                                                    {pelicula.format}
                                                </span>
                                            )}
                                        </div>

                                        {/* Showtimes Preview */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex gap-2 flex-wrap justify-center">
                                                {pelicula.showtimes.slice(0, 3).map((time) => (
                                                    <span
                                                        key={time}
                                                        className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-medium"
                                                    >
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="text-white text-2xl font-bold mb-2 line-clamp-2">
                                            {pelicula.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-white/60">
                                            <span>{pelicula.genres[0]}</span>
                                            <span>•</span>
                                            <span>
                                                {Math.floor(pelicula.duration / 60)}h {pelicula.duration % 60}m
                                            </span>
                                        </div>
                                    </div>

                                    {/* Touch CTA */}
                                    <div className="px-6 pb-6">
                                        <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white/60 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                            <span className="text-xl font-semibold">Tocar para ver horarios</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Home Button */}
            <motion.div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Link
                    href="/kiosco"
                    className="glass-panel hover:bg-white/20 transition-all duration-300 px-10 py-5 rounded-full flex items-center gap-4 shadow-2xl"
                >
                    <span className="material-symbols-outlined text-white text-3xl">home</span>
                    <span className="text-white text-xl font-semibold">Volver al Inicio</span>
                </Link>
            </motion.div>

        </div>
    );
}
