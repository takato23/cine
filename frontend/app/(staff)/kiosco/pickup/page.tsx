'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Mock valid codes for demo
const VALID_CODES = ['123456', '888888', '111222'];

export default function KioscoPickupPage() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');
    const [scannedData, setScannedData] = useState<any>(null);

    // Mock Scanning Effect
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate random scan attempt (visual only)
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleKeyPress = (key: string) => {
        if (status === 'searching' || status === 'found') return;
        if (code.length >= 8) return;
        setCode((prev) => prev + key);
        setStatus('idle');
    };

    const handleDelete = () => {
        if (status === 'searching' || status === 'found') return;
        setCode((prev) => prev.slice(0, -1));
        setStatus('idle');
    };

    const handleClear = () => {
        if (status === 'searching' || status === 'found') return;
        setCode('');
        setStatus('idle');
    };

    const handleSubmit = () => {
        if (code.length < 4) return;
        setStatus('searching');

        // Simulate API call
        setTimeout(() => {
            if (VALID_CODES.includes(code)) {
                setStatus('found');
                setScannedData({
                    id: code,
                    movie: 'Dune: Parte Dos',
                    seats: ['A6', 'A7'],
                    customer: 'Santiago B.',
                });
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/15 blur-[150px]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px]"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
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

                <h1 className="text-white text-4xl font-bold">Retirá tus Entradas</h1>

                <div className="w-14" /> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex gap-8 px-12 py-4 pb-12 overflow-hidden">

                {/* Left: Input Method */}
                <motion.div
                    className="flex-[1.2] flex flex-col"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="glass-card rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl">
                        {/* Display Code */}
                        <div className="mb-8">
                            <label className="text-white/50 text-xl font-medium mb-3 block text-center">
                                Ingresá el código de tu compra
                            </label>
                            <div className={`h-24 rounded-2xl border-2 flex items-center justify-center text-5xl font-bold tracking-[1rem] transition-all duration-300 ${status === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                                    status === 'found' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                                        'bg-black/20 border-white/10 text-white'
                                }`}>
                                {code || <span className="text-white/10 tracking-normal text-4xl">_ _ _ _ _ _</span>}
                            </div>
                            <div className="h-6 mt-2 text-center">
                                {status === 'error' && (
                                    <span className="text-red-400 font-medium animate-pulse">Código no encontrado</span>
                                )}
                                {status === 'searching' && (
                                    <span className="text-primary font-medium animate-pulse">Buscando reserva...</span>
                                )}
                            </div>
                        </div>

                        {/* Keypad */}
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleKeyPress(num.toString())}
                                    className="rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 transition-all duration-100 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={handleClear}
                                className="rounded-2xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 transition-all duration-100 flex items-center justify-center text-xl font-bold text-red-300 shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                            >
                                BORRAR
                            </button>
                            <button
                                onClick={() => handleKeyPress('0')}
                                className="rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 transition-all duration-100 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                            >
                                0
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 transition-all duration-100 flex items-center justify-center shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                            >
                                <span className="material-symbols-outlined text-3xl text-white">backspace</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={code.length < 4 || status === 'searching'}
                            className="mt-6 w-full py-5 rounded-2xl bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary transition-all duration-200 text-white text-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                        >
                            {status === 'searching' ? (
                                <>
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-3xl">search</span>
                                    <span>Buscar Reserva</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Right: Scanner / Success */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnimatePresence mode="wait">
                        {status === 'found' && scannedData ? (
                            <motion.div
                                key="success-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                                <motion.div
                                    className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/40"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                >
                                    <span className="material-symbols-outlined text-white text-6xl">print</span>
                                </motion.div>

                                <h2 className="text-3xl font-bold text-white mb-2">¡Reserva Encontrada!</h2>
                                <p className="text-white/60 text-xl max-w-xs mx-auto mb-8">
                                    Imprimiendo tus entradas para <br />
                                    <strong className="text-white">{scannedData.movie}</strong>
                                </p>

                                <div className="w-full bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                                    <div className="flex justify-between items-center mb-2 text-white/70">
                                        <span>Reserva</span>
                                        <span className="font-mono text-white tracking-widest">{scannedData.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/70">
                                        <span>Asientos</span>
                                        <span className="text-white font-bold">{scannedData.seats.join(', ')}</span>
                                    </div>
                                </div>

                                <Link href="/kiosco" className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                                    Volver al Inicio
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="scanner-card"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <div className="w-[120%] h-[10px] bg-red-500 blur-md absolute top-1/2 -translate-y-1/2 animate-[scan_3s_ease-in-out_infinite]" />
                                </div>
                                <div className="relative z-10 p-8 border-4 border-white/10 rounded-3xl w-64 h-64 flex items-center justify-center mb-8 bg-black/20">
                                    <span className="material-symbols-outlined text-white/20 text-8xl">qr_code_scanner</span>

                                    {/* Corner Markers */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-2">Escaneá tu QR</h2>
                                <p className="text-white/50 text-xl max-w-xs mx-auto">
                                    Acercá el código QR que recibiste por email al lector.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            <style jsx global>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(-150px); opacity: 0; }
                    10% { opacity: 1; }
                    50% { transform: translateY(150px); opacity: 1; }
                    90% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
