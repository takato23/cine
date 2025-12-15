'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface KioskoLayoutProps {
    children: ReactNode;
    showCart?: boolean;
    cartItemCount?: number;
    cartTotal?: number;
    onCartClick?: () => void;
}

export default function KioskoLayout({
    children,
    showCart = true,
    cartItemCount = 0,
    cartTotal = 0,
    onCartClick,
}: KioskoLayoutProps) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background-dark flex flex-col relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[150px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-20 px-8 py-6 flex items-center justify-between">
                <Link href="/kiosco" className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-glow-primary">
                        <span className="text-white text-2xl font-bold">CP</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xl font-bold tracking-tight">Cinema Pergamino</span>
                        <span className="text-white/50 text-sm">Autoservicio</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-white/50 text-sm">Hora actual</div>
                        <div className="text-white text-2xl font-bold tabular-nums">{currentTime}</div>
                    </div>
                    <Link
                        href="/kiosco"
                        className="glass-panel hover:bg-white/10 transition-colors p-4 rounded-2xl"
                    >
                        <span className="material-symbols-outlined text-white text-3xl">home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 px-8 pb-32 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </main>

            {/* Footer Cart Bar */}
            {showCart && (
                <motion.footer
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-8"
                >
                    <div className="glass-panel rounded-3xl p-6 flex items-center justify-between shadow-2xl border border-white/10">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-3xl">shopping_cart</span>
                                </div>
                                {cartItemCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-glow-primary"
                                    >
                                        <span className="text-white text-sm font-bold">{cartItemCount}</span>
                                    </motion.div>
                                )}
                            </div>
                            <div>
                                <div className="text-white/60 text-sm">Tu pedido</div>
                                <div className="text-white text-3xl font-bold">
                                    ${cartTotal.toLocaleString('es-AR')}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onCartClick}
                            disabled={cartItemCount === 0}
                            className="btn-cta-premium px-12 py-5 text-xl disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="flex items-center gap-3">
                                Continuar
                                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                            </span>
                        </button>
                    </div>
                </motion.footer>
            )}

        </div>
    );
}
