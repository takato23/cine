'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Ticket as TicketIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TicketData {
    id: string
    movieTitle: string
    posterUrl: string
    cinema: string
    room: string
    date: string
    time: string
    seats: string[]
    format: string
    qrCode?: string // Mocked for now
}

export function TicketCard({ ticket, index }: { ticket: TicketData; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
                delay: index * 0.1,
                type: 'spring',
                damping: 20,
                stiffness: 100
            }}
            className="group relative w-full aspect-[4/5] max-w-[320px] mx-auto perspective-1000"
        >
            <div className="relative h-full w-full transition-all duration-500 preserve-3d group-hover:rotate-y-12">
                {/* Card Container */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
                    {/* Background Poster Blur */}
                    <div className="absolute inset-0 opacity-40">
                        <Image
                            src={ticket.posterUrl}
                            alt={ticket.movieTitle}
                            fill
                            className="object-cover blur-xl scale-110"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                                <span className="text-xs font-bold text-white tracking-widest">{ticket.format}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5">
                                <TicketIcon className="w-5 h-5 text-white/80" />
                            </div>
                        </div>

                        {/* Movie Info */}
                        <div className="mt-auto mb-6">
                            <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">
                                {ticket.movieTitle}
                            </h3>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{ticket.cinema} • {ticket.room}</span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-black/40 rounded-2xl p-3 border border-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-white/40 mb-1">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Fecha</span>
                                </div>
                                <span className="text-white font-bold">{ticket.date}</span>
                            </div>
                            <div className="bg-black/40 rounded-2xl p-3 border border-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-white/40 mb-1">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Hora</span>
                                </div>
                                <span className="text-white font-bold">{ticket.time}</span>
                            </div>
                        </div>

                        {/* Bottom Section (Cutout styled) */}
                        <div className="relative pt-6 border-t border-dashed border-white/20">
                            {/* Cutout Circles */}
                            <div className="absolute -left-9 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />
                            <div className="absolute -right-9 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0a0a]" />

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="block text-[10px] uppercase text-white/40 font-bold mb-1">Asientos</span>
                                    <div className="text-2xl font-black text-primary tracking-tight">
                                        {ticket.seats.join(', ')}
                                    </div>
                                </div>
                                {/* Fake QR */}
                                <div className="w-12 h-12 bg-white p-1 rounded-lg">
                                    <div className="w-full h-full bg-neutral-900 rounded-sm opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
