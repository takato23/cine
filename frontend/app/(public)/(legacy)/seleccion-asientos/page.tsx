'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Check, X } from 'lucide-react'
import { AmbientBlob, GlowButton, springConfig } from '@/components/ui/motion'

type SeatStatus = 'available' | 'selected' | 'occupied'
type Seat = { id: string; row: string; number: number; status: SeatStatus }

function generateSeats(): Seat[] {
    const rows = ['A', 'B', 'C', 'D', 'E']
    const seatsPerRow = 8
    const seats: Seat[] = []

    // Simulate some occupied seats
    const occupiedSeats = new Set(['A-1', 'A-2', 'B-5', 'B-6'])

    for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            const id = `${row}-${i}`
            seats.push({
                id,
                row,
                number: i,
                status: occupiedSeats.has(id) ? 'occupied' : 'available'
            })
        }
    }

    return seats
}

export default function SeleccionAsientosPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const showtimeId = searchParams.get('showtime')

    const [seats, setSeats] = useState<Seat[]>(() => generateSeats())

    const selectedSeats = useMemo(() => seats.filter(s => s.status === 'selected'), [seats])
    const totalPrice = selectedSeats.length * 6000 // CLP per seat

    const toggleSeat = (seatId: string) => {
        setSeats(prev => prev.map(seat => {
            if (seat.id !== seatId) return seat
            if (seat.status === 'occupied') return seat
            return {
                ...seat,
                status: seat.status === 'selected' ? 'available' : 'selected'
            }
        }))
    }

    const rows = useMemo(() => {
        const grouped: Record<string, Seat[]> = {}
        for (const seat of seats) {
            if (!grouped[seat.row]) grouped[seat.row] = []
            grouped[seat.row].push(seat)
        }
        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
    }, [seats])

    const handleConfirm = () => {
        if (selectedSeats.length === 0) return
        const seatIds = selectedSeats.map(s => s.id).join(',')
        router.push(`/checkout?showtime=${showtimeId}&seats=${seatIds}`)
    }

    return (
        <motion.div
            className="min-h-screen bg-background-dark font-display text-white overflow-hidden flex flex-col selection:bg-primary selection:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Animated Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <AmbientBlob
                    color="rgba(238, 75, 43, 0.15)"
                    size={400}
                    position={{ top: '-15%', left: '50%' }}
                    delay={0}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(238,75,43,0.1),_transparent_60%)]" />
            </div>

            {/* Top App Bar */}
            <motion.header
                className="flex items-center px-4 py-3 justify-between z-20 bg-background-dark/80 backdrop-blur-md sticky top-0 border-b border-white/5 safe-area-top"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...springConfig, delay: 0.1 }}
            >
                <motion.button
                    onClick={() => router.back()}
                    className="text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div className="flex flex-col items-center flex-1 mx-4">
                    <h2 className="text-white text-[15px] font-bold leading-tight tracking-wide text-center truncate w-48">
                        Selecciona tus asientos
                    </h2>
                    <p className="text-primary/80 text-xs font-medium mt-0.5">19:30 · Sala 4</p>
                </div>
                <motion.button
                    className="text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Calendar className="w-5 h-5" />
                </motion.button>
            </motion.header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full pb-40 z-10">
                {/* Screen Visual */}
                <motion.div
                    className="w-full flex flex-col items-center pt-8 pb-12 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Glow under screen with animation */}
                    <motion.div
                        className="absolute top-8 w-3/4 h-20 bg-primary/20 rounded-full"
                        animate={{
                            filter: ['blur(60px)', 'blur(80px)', 'blur(60px)'],
                            opacity: [0.6, 0.8, 0.6]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Curved Screen SVG */}
                    <motion.svg
                        className="w-[90%] z-10"
                        height="48"
                        preserveAspectRatio="none"
                        viewBox="0 0 320 48"
                        width="100%"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        style={{ filter: 'drop-shadow(0 4px 16px rgba(238,75,43,0.3))' }}
                    >
                        <defs>
                            <linearGradient id="screenGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
                                <stop offset="50%" style={{ stopColor: 'rgba(238,75,43,0.9)', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d="M10,48 Q160,0 310,48"
                            fill="none"
                            stroke="url(#screenGradient)"
                            strokeLinecap="round"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </motion.svg>

                    <motion.div
                        className="mt-4 flex flex-col items-center gap-1 opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-xs font-bold tracking-[0.25em] text-white uppercase">Pantalla</span>
                        <motion.svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </motion.div>
                </motion.div>

                {/* Seat Map Container with Stagger */}
                <div className="px-4 w-full overflow-x-auto no-scrollbar">
                    <motion.div
                        className="min-w-[320px] max-w-sm mx-auto grid gap-y-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
                        }}
                    >
                        {rows.map(([rowLabel, rowSeats], rowIdx) => (
                            <motion.div
                                key={rowLabel}
                                className="flex items-center justify-between gap-2"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: springConfig }
                                }}
                            >
                                <span className="text-white/20 text-[10px] font-bold w-4 text-center">{rowLabel}</span>
                                <div className="flex-1 grid grid-cols-8 gap-2 justify-items-center">
                                    {rowSeats.map((seat, seatIdx) => (
                                        <motion.button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat.id)}
                                            disabled={seat.status === 'occupied'}
                                            className={`seat flex items-center justify-center ${seat.status === 'selected'
                                                ? 'seat-selected cursor-pointer'
                                                : seat.status === 'occupied'
                                                    ? 'bg-white/5 border border-white/10 opacity-40 cursor-not-allowed'
                                                    : 'bg-white/5 border border-white/20 cursor-pointer'
                                                }`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 + rowIdx * 0.1 + seatIdx * 0.02 }}
                                            whileHover={seat.status !== 'occupied' ? {
                                                scale: 1.1,
                                                borderColor: 'rgba(238, 75, 43, 0.6)',
                                                boxShadow: '0 0 15px rgba(238, 75, 43, 0.3)'
                                            } : undefined}
                                            whileTap={seat.status !== 'occupied' ? { scale: 0.9 } : undefined}
                                            layout
                                        >
                                            {seat.status === 'occupied' && (
                                                <X className="w-3 h-3 text-white/50" />
                                            )}
                                            {seat.status === 'selected' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute inset-0 rounded-[inherit] bg-primary/20"
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                                <span className="text-white/20 text-[10px] font-bold w-4 text-center">{rowLabel}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Legend */}
                <motion.div
                    className="flex justify-center gap-4 mt-8 mb-4 px-4 flex-wrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-white/20 bg-white/5" />
                        <span className="text-white/60 text-xs font-medium">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center">
                            <X className="w-2 h-2 text-white/30" />
                        </div>
                        <span className="text-white/60 text-xs font-medium">Ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-4 h-4 rounded bg-primary"
                            animate={{ boxShadow: ['0 0 8px rgba(238,75,43,0.4)', '0 0 15px rgba(238,75,43,0.7)', '0 0 8px rgba(238,75,43,0.4)'] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-white text-xs font-bold">Tu Selección</span>
                    </div>
                </motion.div>
            </main>

            {/* Bottom Action Sheet */}
            <motion.footer
                className="fixed bottom-0 left-0 w-full z-30 safe-area-bottom"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.5 }}
            >
                <div className="glass-panel w-full rounded-t-[2rem] p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    {/* Drag Handle */}
                    <div className="w-full flex justify-center mb-4">
                        <div className="w-12 h-1 rounded-full bg-white/20" />
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Selected Seats Preview */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AnimatePresence mode="popLayout">
                                    {selectedSeats.slice(0, 4).map((seat) => (
                                        <motion.div
                                            key={seat.id}
                                            className="size-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-[11px] font-bold text-primary"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                        >
                                            {seat.row}{seat.number}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {selectedSeats.length > 4 && (
                                    <motion.div
                                        className="size-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[11px] font-bold text-white/60"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        +{selectedSeats.length - 4}
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-xs text-white/60">
                                {selectedSeats.length === 0

                                    ? 'Selecciona tus asientos'
                                    : `${selectedSeats.length} ${selectedSeats.length === 1 ? 'asiento' : 'asientos'}`}
                            </p>
                        </div>

                        {/* Split CTA Button - "Buy ticket | $XX" style */}
                        <motion.button
                            onClick={handleConfirm}
                            disabled={selectedSeats.length === 0}
                            className={`
                                w-full h-14 rounded-2xl flex items-center justify-between overflow-hidden
                                transition-all duration-300
                                ${selectedSeats.length > 0
                                    ? 'bg-gradient-to-r from-primary to-primary-600 shadow-glow-primary cursor-pointer'
                                    : 'bg-white/10 cursor-not-allowed opacity-50'
                                }
                            `}
                            whileHover={selectedSeats.length > 0 ? {
                                scale: 1.02,
                                boxShadow: '0 0 30px rgba(238, 75, 43, 0.5)'
                            } : undefined}
                            whileTap={selectedSeats.length > 0 ? { scale: 0.98 } : undefined}
                        >
                            <span className="flex-1 text-center font-bold text-white text-base">
                                Buy ticket
                            </span>
                            <div className="w-px h-8 bg-white/30" />
                            <motion.span
                                className="flex-1 text-center font-bold text-white text-base"
                                key={totalPrice}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                ${selectedSeats.length > 0 ? (totalPrice / 1000).toFixed(0) + 'k' : '0'}
                            </motion.span>
                        </motion.button>
                    </div>
                </div>
            </motion.footer>
        </motion.div>
    )
}
