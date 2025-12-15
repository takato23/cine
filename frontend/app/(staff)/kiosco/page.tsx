'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - replace with real API call
const peliculasDestacadas = [
    {
        id: '1',
        title: 'Dune: Parte Dos',
        genres: ['Sci-Fi', 'Aventura'],
        duration: 166,
        rating: 'PG-13',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        format: 'IMAX',
    },
    {
        id: '2',
        title: 'Kung Fu Panda 4',
        genres: ['Animación', 'Comedia'],
        duration: 94,
        rating: 'ATP',
        posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        format: '3D',
    },
    {
        id: '3',
        title: 'Godzilla x Kong',
        genres: ['Acción', 'Sci-Fi'],
        duration: 115,
        rating: '+13',
        posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
        format: '3D',
    },
    {
        id: '4',
        title: 'Ghostbusters: Imperio Helado',
        genres: ['Comedia', 'Fantasía'],
        duration: 115,
        rating: 'ATP',
        posterUrl: 'https://image.tmdb.org/t/p/w500/e1J2oNzSBdou01sfc3vxjNLiOGL.jpg',
        format: '2D',
    },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function KioscoPage() {
    return (
        <motion.div
            className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-primary/20 blur-[180px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-[30%] -left-[20%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        x: [0, -30, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <motion.div
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-glow-primary"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <span className="text-white text-4xl font-bold">CP</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-white text-3xl font-bold tracking-tight">Cinema Pergamino</h1>
                        <p className="text-white/50 text-lg">Autoservicio</p>
                    </motion.div>
                </div>

                <motion.div
                    className="text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <CurrentTime />
                </motion.div>
            </header>

            {/* Hero Section */}
            <motion.section
                className="relative z-10 px-12 py-8 flex-shrink-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="text-center max-w-4xl mx-auto">
                    <motion.h2
                        className="text-6xl font-bold text-white mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        ¿Qué querés hacer hoy?
                    </motion.h2>
                    <motion.p
                        className="text-white/60 text-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        Tocá una opción para comenzar
                    </motion.p>
                </div>
            </motion.section>

            {/* Main Actions */}
            <motion.section
                className="relative z-10 px-12 py-8 flex-shrink-0"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
                    <motion.div variants={item}>
                        <Link href="/kiosco/cartelera" className="block group h-full">
                            <div className="glass-card h-full rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 border-2 border-transparent hover:border-primary/30 group-hover:shadow-glow-primary-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center mb-6 shadow-glow-primary group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    <span className="material-symbols-outlined text-white text-5xl">
                                        local_activity
                                    </span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2 relative z-10">Comprar Entradas</h3>
                                <p className="text-white/50 text-base relative z-10">Elegí tu película y tu asiento</p>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={item}>
                        <Link href="/kiosco/snacks" className="block group h-full">
                            <div className="glass-card h-full rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 border-2 border-transparent hover:border-orange-400/30 group-hover:shadow-[0_0_40px_rgba(251,146,60,0.2)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,146,60,0.3)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    <span className="material-symbols-outlined text-white text-5xl">fastfood</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2 relative z-10">Solo Confitería</h3>
                                <p className="text-white/50 text-base relative z-10">Pochoclos, bebidas y más</p>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={item}>
                        <Link href="/kiosco/pickup" className="block group h-full">
                            <div className="glass-card h-full rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 border-2 border-transparent hover:border-purple-400/30 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    <span className="material-symbols-outlined text-white text-5xl">qr_code_scanner</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2 relative z-10">Retirar Entradas</h3>
                                <p className="text-white/50 text-base relative z-10">Escanéa tu código QR</p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Movie Carousel */}
            <motion.section
                className="relative z-10 flex-1 px-12 py-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-3xl font-bold">En Cartelera</h3>
                    <Link
                        href="/kiosco/cartelera"
                        className="text-primary text-xl font-semibold flex items-center gap-2 hover:gap-4 transition-all"
                    >
                        Ver todas
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>

                <motion.div
                    className="grid grid-cols-4 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {peliculasDestacadas.map((pelicula, index) => (
                        <motion.div key={pelicula.id} variants={item}>
                            <Link href={`/kiosco/pelicula/${pelicula.id}`} className="block group">
                                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                    <Image
                                        src={pelicula.posterUrl}
                                        alt={pelicula.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    {/* Format Badge */}
                                    {pelicula.format !== '2D' && (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-bold shadow-glow-primary">
                                            {pelicula.format}
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h4 className="text-white text-xl font-bold mb-2 line-clamp-2">
                                            {pelicula.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-white/60 text-sm">
                                            <span>{pelicula.genres[0]}</span>
                                            <span>•</span>
                                            <span>{Math.floor(pelicula.duration / 60)}h {pelicula.duration % 60}m</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Touch Indicator */}
            <motion.div
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="material-symbols-outlined text-white/40 text-3xl">touch_app</span>
                </motion.div>
                <span className="text-white/40 text-lg">Tocá para interactuar</span>
            </motion.div>

        </motion.div>
    );
}

function CurrentTime() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="text-white/50 text-lg">Hora actual</div>
            <div className="text-white text-4xl font-bold tabular-nums">{time}</div>
        </>
    );
}
