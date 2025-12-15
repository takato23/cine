'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock room layout
const roomLayout = {
    name: 'Sala Roja',
    rows: [
        { letter: 'A', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'B', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'C', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'D', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'E', seats: [1, 1, 0, 1, 1, 0, 1, 1] }, // 0 = aisle
        { letter: 'F', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'G', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
        { letter: 'H', seats: [1, 1, 1, 1, 1, 1, 1, 1] },
    ],
    occupiedSeats: ['A1', 'A2', 'B5', 'B6', 'C3', 'C4', 'D7', 'F1', 'F2', 'F3', 'G4', 'G5'],
};

const movieInfo = {
    title: 'Dune: Parte Dos',
    time: '19:00',
    room: 'Sala Roja',
    format: 'IMAX',
};

const TICKET_PRICE = 6000;

export default function KioscoAsientosPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const isSeatOccupied = (seatId: string) => roomLayout.occupiedSeats.includes(seatId);

    const toggleSeat = (seatId: string) => {
        if (isSeatOccupied(seatId)) return;

        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
        );
    };

    const handleContinue = () => {
        if (selectedSeats.length > 0) {
            const seatsParam = encodeURIComponent(selectedSeats.join(','));
            router.push(`/kiosco/snacks?seats=${seatsParam}`);
        }
    };

    const total = selectedSeats.length * TICKET_PRICE;

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/20 blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/kiosco/cartelera" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
                    </div>
                    <span className="text-white text-xl font-semibold">Volver</span>
                </Link>

                <div className="text-center">
                    <h1 className="text-white text-2xl font-bold">{movieInfo.title}</h1>
                    <p className="text-primary text-lg">
                        {movieInfo.time} · {movieInfo.room} · {movieInfo.format}
                    </p>
                </div>

                <Link href="/kiosco" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-white text-2xl">home</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col items-center py-8 px-12 overflow-y-auto">
                {/* Screen Visual */}
                <motion.div
                    className="w-full max-w-3xl mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative">
                        {/* Screen glow */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-primary/30 blur-[40px] rounded-full" />

                        {/* Screen curve */}
                        <svg className="w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="none">
                            <path
                                d="M20,48 Q200,0 380,48"
                                fill="none"
                                stroke="url(#screenGrad)"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                                    <stop offset="50%" stopColor="#ee4b2b" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold">
                                Pantalla
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Seat Map */}
                <motion.div
                    className="glass-card rounded-3xl p-8 max-w-3xl w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-col gap-4">
                        {roomLayout.rows.map((row, rowIndex) => (
                            <motion.div
                                key={row.letter}
                                className="flex items-center justify-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + rowIndex * 0.05 }}
                            >
                                {/* Row label left */}
                                <span className="w-8 text-center text-white/30 text-sm font-bold">
                                    {row.letter}
                                </span>

                                {/* Seats */}
                                <div className="flex gap-3">
                                    {row.seats.map((seat, seatIndex) => {
                                        if (seat === 0) {
                                            return <div key={seatIndex} className="w-12 h-12" />; // Aisle
                                        }

                                        const seatId = `${row.letter}${seatIndex + 1}`;
                                        const isOccupied = isSeatOccupied(seatId);
                                        const isSelected = selectedSeats.includes(seatId);

                                        return (
                                            <motion.button
                                                key={seatIndex}
                                                onClick={() => toggleSeat(seatId)}
                                                disabled={isOccupied}
                                                whileTap={{ scale: isOccupied ? 1 : 0.9 }}
                                                className={`
                          w-12 h-12 rounded-t-xl rounded-b-lg flex items-center justify-center
                          transition-all duration-200 text-xs font-bold
                          ${isOccupied
                                                        ? 'bg-white/5 border border-white/10 cursor-not-allowed opacity-40'
                                                        : isSelected
                                                            ? 'bg-gradient-to-br from-primary to-primary-600 border border-white/30 shadow-glow-primary text-white'
                                                            : 'bg-white/5 border border-white/20 hover:border-primary/50 hover:bg-white/10 text-white/60'
                                                    }
                        `}
                                            >
                                                {isOccupied ? (
                                                    <span className="material-symbols-outlined text-base">close</span>
                                                ) : isSelected ? (
                                                    <span className="material-symbols-outlined text-base">check</span>
                                                ) : (
                                                    seatIndex + 1
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Row label right */}
                                <span className="w-8 text-center text-white/30 text-sm font-bold">
                                    {row.letter}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Legend */}
                <motion.div
                    className="flex gap-8 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/20" />
                        <span className="text-white/60">Disponible</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 opacity-40 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/30 text-sm">close</span>
                        </div>
                        <span className="text-white/60">Ocupado</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-600 shadow-glow-primary" />
                        <span className="text-white font-semibold">Tu selección</span>
                    </div>
                </motion.div>
            </main>

            {/* Bottom Action Bar */}
            <AnimatePresence>
                <motion.footer
                    className="sticky bottom-0 z-50 px-12 pb-8 pt-4"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                >
                    <div className="glass-panel rounded-3xl p-6 flex items-center justify-between shadow-2xl border border-white/10">
                        <div className="flex items-center gap-8">
                            {/* Selected Seats */}
                            <div>
                                <div className="text-white/50 text-sm mb-1">Asientos seleccionados</div>
                                <div className="flex gap-2 flex-wrap max-w-[300px]">
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map((seat) => (
                                            <span
                                                key={seat}
                                                className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-bold text-sm"
                                            >
                                                {seat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-white/40">Ninguno</span>
                                    )}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-l border-white/10 pl-8">
                                <div className="text-white/50 text-sm">Total</div>
                                <div className="text-white text-3xl font-bold">
                                    ${total.toLocaleString('es-AR')}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleContinue}
                            disabled={selectedSeats.length === 0}
                            className="btn-cta-premium px-12 py-5 text-xl disabled:opacity-50 disabled:shadow-none flex items-center gap-3"
                        >
                            <span>{selectedSeats.length === 0 ? 'Seleccioná asientos' : 'Continuar a Snacks'}</span>
                            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                        </button>
                    </div>
                </motion.footer>
            </AnimatePresence>

        </div>
    );
}
