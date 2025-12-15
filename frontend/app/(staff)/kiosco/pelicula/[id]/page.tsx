'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data - replace with API call using params.id
const getPelicula = (id: string) => ({
    id,
    title: 'Dune: Parte Dos',
    originalTitle: 'Dune: Part Two',
    synopsis:
        'Paul Atreides se une a Chani y a los Fremen en un viaje espiritual y marcial para vengarse de los conspiradores que destruyeron a su familia. Ante la elección entre el amor de su vida y el destino del universo conocido, se esfuerza por evitar un futuro terrible.',
    genres: ['Sci-Fi', 'Aventura', 'Drama'],
    duration: 166,
    rating: 'PG-13',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    format: 'IMAX',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    showtimes: [
        { id: 's1', time: '16:30', room: 'Sala Roja', format: 'IMAX', seatsAvailable: 45 },
        { id: 's2', time: '19:00', room: 'Sala Roja', format: 'IMAX', seatsAvailable: 23 },
        { id: 's3', time: '21:45', room: 'Sala Amarilla', format: '2D', seatsAvailable: 67 },
        { id: 's4', time: '22:30', room: 'Sala Roja', format: 'IMAX', seatsAvailable: 12 },
    ],
});

// Generate next 5 days
const getDates = () => {
    const dates = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
            day: dayNames[date.getDay()],
            date: date.getDate(),
            full: date.toISOString().split('T')[0],
            isToday: i === 0,
        });
    }
    return dates;
};

export default function KioscoPeliculaPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const pelicula = getPelicula(params.id);
    const dates = getDates();
    const [selectedDate, setSelectedDate] = useState(dates[0].full);
    const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedShowtime) {
            // Store in session/context and navigate
            router.push(`/kiosco/asientos?showtime=${selectedShowtime}`);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden">
            {/* Backdrop Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={pelicula.backdropUrl}
                    alt=""
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-background-dark/40" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-8 flex items-center justify-between">
                <Link href="/kiosco/cartelera" className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-3xl">arrow_back</span>
                    </div>
                    <span className="text-white text-2xl font-semibold">Volver</span>
                </Link>

                <Link href="/kiosco" className="flex items-center gap-4 group">
                    <span className="material-symbols-outlined text-white/60 text-3xl group-hover:text-white transition-colors">
                        home
                    </span>
                </Link>
            </header>

            {/* Content */}
            <div className="relative z-10 px-12 py-4 flex gap-12">
                {/* Left: Poster & Info */}
                <motion.div
                    className="flex-shrink-0 w-[400px]"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl mb-8">
                        <Image
                            src={pelicula.posterUrl}
                            alt={pelicula.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {pelicula.format !== '2D' && (
                            <div className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-primary text-white font-bold shadow-glow-primary">
                                {pelicula.format}
                            </div>
                        )}
                    </div>

                    {/* Movie Info */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white">{pelicula.title}</h1>
                        {pelicula.originalTitle && (
                            <p className="text-white/50 text-lg">{pelicula.originalTitle}</p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {pelicula.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-4 py-2 rounded-xl bg-white/10 text-white/80 text-sm font-medium"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-white/60">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">schedule</span>
                                <span>
                                    {Math.floor(pelicula.duration / 60)}h {pelicula.duration % 60}m
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">verified_user</span>
                                <span>{pelicula.rating}</span>
                            </div>
                        </div>

                        {/* Synopsis */}
                        <p className="text-white/70 text-lg leading-relaxed">{pelicula.synopsis}</p>

                        {/* Director & Cast */}
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-white/50 text-sm mb-2">
                                <strong className="text-white/80">Director:</strong> {pelicula.director}
                            </p>
                            <p className="text-white/50 text-sm">
                                <strong className="text-white/80">Elenco:</strong> {pelicula.cast.join(', ')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Date & Time Selection */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Date Selector */}
                    <div className="mb-10">
                        <h2 className="text-white text-2xl font-bold mb-6">Seleccioná la fecha</h2>
                        <div className="flex gap-4">
                            {dates.map((d) => (
                                <motion.button
                                    key={d.full}
                                    onClick={() => setSelectedDate(d.full)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center justify-center w-24 h-28 rounded-2xl transition-all duration-300 ${selectedDate === d.full
                                            ? 'bg-gradient-to-b from-primary to-primary-600 text-white shadow-glow-primary'
                                            : 'glass-panel text-white/70 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-sm font-medium opacity-80">
                                        {d.isToday ? 'Hoy' : d.day}
                                    </span>
                                    <span className="text-3xl font-bold">{d.date}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Showtime Selector */}
                    <div className="mb-10">
                        <h2 className="text-white text-2xl font-bold mb-6">Seleccioná el horario</h2>
                        <motion.div
                            className="grid grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {pelicula.showtimes.map((show) => (
                                <motion.button
                                    key={show.id}
                                    onClick={() => setSelectedShowtime(show.id)}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-6 rounded-2xl transition-all duration-300 ${selectedShowtime === show.id
                                            ? 'bg-primary/20 border-2 border-primary shadow-glow-primary'
                                            : 'glass-panel border-2 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl font-bold text-white">{show.time}</span>
                                        {show.format !== '2D' && (
                                            <span className="px-3 py-1 rounded-lg bg-primary/30 text-primary text-sm font-bold">
                                                {show.format}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-white/60">
                                        <span>{show.room}</span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">event_seat</span>
                                            {show.seatsAvailable} lugares
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Continue Button */}
                    <AnimatePresence>
                        {selectedShowtime && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <button
                                    onClick={handleContinue}
                                    className="w-full btn-cta-premium py-6 text-2xl flex items-center justify-center gap-4"
                                >
                                    <span>Elegir Asientos</span>
                                    <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

        </div>
    );
}
