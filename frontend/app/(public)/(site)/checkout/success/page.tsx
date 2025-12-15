'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Home, Ticket, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default function CheckoutSuccessPage() {
    const { width, height } = useWindowSize()
    const [showConfetti, setShowConfetti] = useState(true)

    // Stop confetti after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 8000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden relative">
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#ee4b2b', '#ffffff', '#a855f7', '#3b82f6']}
                />
            )}

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-3xl font-black text-white mb-2">¡Pago Exitoso!</h1>
                    <p className="text-white/60 mb-8">
                        Tus entradas han sido reservadas. Te enviamos un correo con la confirmación.
                    </p>

                    {/* Ticket Representation */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x" />
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-16 h-20 rounded-lg bg-neutral-800 animate-pulse" /> {/* Placeholder Poster */}
                            <div>
                                <h3 className="font-bold text-white leading-tight">Duna: Parte Dos</h3>
                                <p className="text-xs text-white/50 mb-2">Cine Central • Sala 4</p>
                                <div className="flex gap-2">
                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">Lun 15, 19:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Cutout circles for ticket effect */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a0a0a]" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0a0a0a]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button variant="secondary" className="w-full text-xs h-10">
                            <Download className="w-4 h-4 mr-2" /> Decargar
                        </Button>
                        <Button variant="secondary" className="w-full text-xs h-10">
                            <Share2 className="w-4 h-4 mr-2" /> Compartir
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <Link href="/entradas">
                            <Button className="w-full h-12 text-base shadow-glow-primary">
                                <Ticket className="w-5 h-5 mr-2" />
                                Ver Mis Entradas
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" className="w-full text-white/40 hover:text-white">
                                <Home className="w-4 h-4 mr-2" />
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
