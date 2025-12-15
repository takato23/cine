'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Mock order data - in real app, would come from context/session
const orderData = {
    movie: {
        title: 'Dune: Parte Dos',
        time: '19:00',
        date: 'Hoy, 12 Dic',
        room: 'Sala Roja',
        format: 'IMAX',
        posterUrl: 'https://image.tmdb.org/t/p/w200/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    },
    seats: ['A6', 'A7'],
    ticketPrice: 6000,
    snacks: [
        { name: 'Combo Gigante', quantity: 1, price: 8500 },
        { name: 'Pochoclo Mediano (Dulce)', quantity: 1, price: 3500 },
    ],
};

type PaymentStatus = 'pending' | 'processing' | 'success' | 'error';

export default function KioscoCheckoutPage() {
    const router = useRouter();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    const ticketsTotal = orderData.seats.length * orderData.ticketPrice;
    const snacksTotal = orderData.snacks.reduce((sum, s) => sum + s.price * s.quantity, 0);
    const serviceFee = 500;
    const grandTotal = ticketsTotal + snacksTotal + serviceFee;

    // Countdown timer
    useEffect(() => {
        if (paymentStatus !== 'pending') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setPaymentStatus('error');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentStatus]);

    // Simulate payment polling
    useEffect(() => {
        if (paymentStatus !== 'pending') return;

        // Simulate payment after 8 seconds for demo
        const simulatePayment = setTimeout(() => {
            setPaymentStatus('processing');
            setTimeout(() => {
                setPaymentStatus('success');
            }, 2000);
        }, 8000);

        return () => clearTimeout(simulatePayment);
    }, [paymentStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNewPurchase = () => {
        router.push('/kiosco');
    };

    if (paymentStatus === 'success') {
        return (
            <motion.div
                className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Success Animation */}
                <motion.div
                    className="w-40 h-40 rounded-full bg-green-500/20 flex items-center justify-center mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <span className="material-symbols-outlined text-green-400 text-8xl">check_circle</span>
                    </motion.div>
                </motion.div>

                <motion.h1
                    className="text-5xl font-bold text-white mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    ¡Pago Exitoso!
                </motion.h1>

                <motion.p
                    className="text-white/60 text-2xl mb-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Tu compra se completó correctamente
                </motion.p>

                {/* Ticket QR */}
                <motion.div
                    className="glass-card rounded-3xl p-8 max-w-lg w-full mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="text-center mb-6">
                        <h2 className="text-white text-2xl font-bold mb-2">Tu Ticket Digital</h2>
                        <p className="text-white/50">Mostrá este código en la entrada</p>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-4 mb-6">
                        <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2041%2041%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%200h7v7H0zm8%200h2v1H8zm3%200h3v1h1v1h-1v1h-1V2h-1v2h-1V1h1zm7%200h1v1h1v3h-1V3h-1V1h-1v2h-1V0zm4%200h1v1h-1zm4%200h1v1h1v1h-2V1h-1v2h1v1h-2V2h1V1h-1V0h1zm4%200h2v2h-1V1h-1zm3%200h7v7h-7zM1%201v5h5V1zm33%200v5h5V1zM2%202h3v3H2zm33%200h3v3h-3zM8%203h1v1H8zm4%200h1v4h-2V6h1zm7%200h1v1h-1zm2%200h1v1h-1zm3%200h1v2h-1zm-8%201h1v1h-1zm2%200h2v1h-2zm8%200h1v2h-2V4zm-7%201h1v2h-2v1h-1V7h1V6h1zm4%200h1v1h-1zm-8%201h1v1h2v1h-2v1H9v1H8V8h1V7h1zm3%200h1v1h1v1h-1v1h-1V8h-1V7h1zm6%200h1v1h-1zm8%200h2v1h1v1h-1v2h-1V9h-1v1h-1V9h-1V8h2zm-19%201h1v2H8V8zm4%200h1v1h-1zm18%200h1v1h-1zM0%209h1v1h1v1H0zm3%200h1v1H3zm4%200h2v1H7zm3%200h3v1h-1v1h-1V9zm4%200h1v1h-1zm2%200h1v1h-1zm5%200h1v2h-2V9zm6%200h1v2h-1zm4%200h1v1h1v1h-2zm3%200h2v1h-2zM5%2010h1v1h1v1H6v1H5v1H4v-2h1zm3%200h1v1H8zm13%200h1v2h-2v-1h1zm-7%201h1v1h-1zm3%200h1v1h1v1h-3v-1h1zm6%200h1v2h-1v-1h-1v-1zm3%200h2v1h1v1h1v1h-2v2h-1v1h-1v-1h1v-3h-1zm4%200h1v1h-1zm-21%201h1v1h-1zm13%200h2v3h-1v-2h-1zm4%200h1v1h-1zm4%200h1v2h-1zm3%200h1v2h-1v1h-1v-1h1zM1%2013h1v1h1v1h1v-1h1v2h1v1H4v-1H3v-1H1zm10%200h1v1h-1zm3%200h1v1h-1zm7%200h2v1h-2zm8%200h1v1h-1zm3%200h1v1h-1zM0%2014h1v2H0zm3%200h1v1H3zm11%200h1v1h-1zm5%200h3v2h-1v-1h-1v1h-1zm5%200h2v1h-2zm-14%201h2v1h-1v1h-1zm3%200h1v1h-1zm11%200h1v1h-1zm4%200h1v2h-1zm2%200h1v1h1v-1h1v1h1v3h-1v-2h-1v2h-1v-2h-1zM3%2016h1v1H3zm5%200h4v1h-1v1h-1v1h-1v-1H9v-1H8zm8%200h1v2h-1zm2%200h3v1h-1v1h-1v-1h-1zm9%200h1v1h2v1h-3v-1h-1v-1zm4%200h1v1h2v3h-2v-1h-1v1h1v2h-1v2h-2v-1h1v-1h-1v-1h-1v2h1v1h-1v1h-2v-1h-1v-2h1v-1h2v-1h1v1h1v-2h1v-1h-1v-1h1zM1%2017h1v3h1v1h1v1H2v-1H1v-1h1v-1H1zm6%200h1v1H7zm3%200h1v1h-1zm3%201h1v1h-1zm3%200h2v1h-1v1h-1v1h-1v-2h1zm-8%201h1v1H8zm3%200h1v1h-1zm3%200h1v1h1v-1h1v2h-3zm5%200h2v1h1v4h-1v-1h-1v-2h-1zm-6%201h1v2h-1v1h-1v-2h1zm3%200h1v1h-1zm-6%201h2v1h1v4H9v-2h1v1h1v-1H9v-1h1v-1H9zm6%200h1v1h-1zm-11%201h1v1H4zm8%200h1v2h-1zm2%200h1v1h-1zm3%200h1v1h-1zm3%200h1v1h-1zm-7%201h1v1h-1zm2%200h1v1h1v1h-2zm2%201h1v1h-1zm10%200h1v1h-1zM4%2023h2v1h1v-1h1v1h1v2h-1v1H7v-1H5v-1h1v-1H4zm7%200h2v2h-1v-1h-1zm2%201h1v2h-1zm3%200h1v1h-1zm7%200h1v1h-1zm-4%201h1v1h1v2h-1v1h-1v-1h-1v-2h1zm3%200h3v2h-2v-1h-1zM4%2026h2v1H4zm3%200h1v1H7zm8%200h1v1h-1zm3%200h1v2h-1zm-5%201h2v1h-2zm3%200h1v1h-1zm3%200h3v1h-2v1h1v1h-1v1h-3v-1h1v-2h1zm8%200h1v2h-1zm-19%201h1v1H8zm3%200h1v1h-1zm12%200h1v1h-1zm-11%201h1v1h-1zm2%200h3v3h-1v-1h-1v-1h-1zm4%200h1v1h-1zm2%200h2v1h-2zm14%200h1v4h-1v1h-1v-4h1v-1zm-19%201h1v1h-1zm7%200h1v1h-1zm3%200h1v1h-1zm-8%201h1v3h-1zm2%200h1v2H9v-1h1zm2%200h1v1h-1zm3%200h1v1h-1zm9%200h1v1h1v1h1v1h-3v-1h-1v-1h1zm-12%201h1v2h-3v-1h2zm3%200h1v2h-1zm3%200h1v1h-1zm3%200h1v3h-1zm3%200h1v1h-1zM0%2034h7v7H0zm8%200h4v1h-4zm5%200h1v3h-3v-1h1v-1h1zm5%200h1v2h-2v-1h1zm2%200h3v1h-3zm4%200h2v1h1v1h-1v1h-2zm7%200v5h5v-5zm1%201h3v3h-3zM1%2035v5h5v-5zm17%200h1v3h-1v1h-1v-1h-1v2h-2v-2h1v-1h-1v-1h2v1h1zm5%200h1v2h-1zm2%200h1v1h1v1h-2zM2%2036h3v3H2zm18%200h1v2h-1zm3%200h1v1h-1zm2%200h1v1h-1zm-10%201h1v1h1v1h-1v1h-1v-2h-1v-1zm3%200h1v1h-1zm2%200h1v1h1v2h-1v-1h-1zm-7%201h1v2h-1v1h-2v-2h1v-1zm8%200h2v2h-1v-1h-1zm8%200h1v1h-1zM8%2039h3v1H8zm5%200h2v1h-1v1h-1zm6%200h1v1h-1zm2%200h1v1h-1zm2%200h1v1h1v1h-3v-1h1zm4%200h3v1h-3zm-18%201h1v1h-1zm8%200h1v1h-1zm4%200h1v1h-1z%22%2F%3E%3C%2Fsvg%3E')] bg-contain bg-center bg-no-repeat" />
                    </div>

                    {/* Order Summary */}
                    <div className="text-center">
                        <p className="text-white/70 text-lg">
                            <strong className="text-white">{orderData.movie.title}</strong>
                        </p>
                        <p className="text-white/50">
                            {orderData.movie.date} • {orderData.movie.time} • {orderData.movie.room}
                        </p>
                        <p className="text-primary mt-2 font-semibold">
                            Asientos: {orderData.seats.join(', ')}
                        </p>
                    </div>
                </motion.div>

                {/* New Purchase Button */}
                <motion.button
                    onClick={handleNewPurchase}
                    className="btn-cta-premium px-16 py-6 text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Nueva Compra
                </motion.button>

            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/kiosco/snacks" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
                    </div>
                    <span className="text-white text-xl font-semibold">Volver</span>
                </Link>

                <h1 className="text-white text-3xl font-bold">Completá tu Pago</h1>

                <Link href="/kiosco" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-white text-2xl">home</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex gap-12 px-12 py-8 overflow-hidden">
                {/* Left: Order Summary */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="glass-card rounded-3xl p-8 h-full">
                        <h2 className="text-white text-2xl font-bold mb-8">Resumen de tu Compra</h2>

                        {/* Movie Info */}
                        <div className="flex gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="w-24 h-36 rounded-xl overflow-hidden relative flex-shrink-0">
                                <Image
                                    src={orderData.movie.posterUrl}
                                    alt={orderData.movie.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white text-2xl font-bold mb-2">{orderData.movie.title}</h3>
                                <p className="text-white/60 text-lg mb-1">
                                    {orderData.movie.date} • {orderData.movie.time}
                                </p>
                                <p className="text-white/60 text-lg mb-3">
                                    {orderData.movie.room} • {orderData.movie.format}
                                </p>
                                <div className="flex gap-2">
                                    {orderData.seats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-bold"
                                        >
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 mb-8">
                            {/* Tickets */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">confirmation_number</span>
                                    <span className="text-white text-lg">
                                        Entradas x{orderData.seats.length}
                                    </span>
                                </div>
                                <span className="text-white text-lg font-bold">
                                    ${ticketsTotal.toLocaleString('es-AR')}
                                </span>
                            </div>

                            {/* Snacks */}
                            {orderData.snacks.map((snack, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-orange-400">fastfood</span>
                                        <span className="text-white text-lg">
                                            {snack.name} x{snack.quantity}
                                        </span>
                                    </div>
                                    <span className="text-white text-lg font-bold">
                                        ${(snack.price * snack.quantity).toLocaleString('es-AR')}
                                    </span>
                                </div>
                            ))}

                            {/* Service Fee */}
                            <div className="flex items-center justify-between text-white/50">
                                <span>Cargo por servicio</span>
                                <span>${serviceFee.toLocaleString('es-AR')}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-white text-2xl">Total</span>
                                <span className="text-white text-4xl font-bold">
                                    ${grandTotal.toLocaleString('es-AR')}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Payment QR */}
                <motion.div
                    className="w-[500px] flex-shrink-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="glass-card rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                        {paymentStatus === 'pending' && (
                            <>
                                {/* Timer */}
                                <div className="mb-6">
                                    <div className="text-white/50 text-sm text-center mb-1">Tiempo restante</div>
                                    <div
                                        className={`text-4xl font-bold tabular-nums ${timeLeft <= 60 ? 'text-red-400' : 'text-white'
                                            }`}
                                    >
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="w-72 h-72 bg-white rounded-3xl p-4 mb-8 shadow-2xl">
                                    <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2041%2041%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%200h7v7H0zm8%200h2v1H8zm3%200h3v1h1v1h-1v1h-1V2h-1v2h-1V1h1zm7%200h1v1h1v3h-1V3h-1V1h-1v2h-1V0zm4%200h1v1h-1zm4%200h1v1h1v1h-2V1h-1v2h1v1h-2V2h1V1h-1V0h1zm4%200h2v2h-1V1h-1zm3%200h7v7h-7zM1%201v5h5V1zm33%200v5h5V1zM2%202h3v3H2zm33%200h3v3h-3zM8%203h1v1H8zm4%200h1v4h-2V6h1zm7%200h1v1h-1zm2%200h1v1h-1zm3%200h1v2h-1zm-8%201h1v1h-1zm2%200h2v1h-2zm8%200h1v2h-2V4zm-7%201h1v2h-2v1h-1V7h1V6h1zm4%200h1v1h-1zm-8%201h1v1h2v1h-2v1H9v1H8V8h1V7h1zm3%200h1v1h1v1h-1v1h-1V8h-1V7h1zm6%200h1v1h-1zm8%200h2v1h1v1h-1v2h-1V9h-1v1h-1V9h-1V8h2zm-19%201h1v2H8V8zm4%200h1v1h-1zm18%200h1v1h-1zM0%209h1v1h1v1H0zm3%200h1v1H3zm4%200h2v1H7zm3%200h3v1h-1v1h-1V9zm4%200h1v1h-1zm2%200h1v1h-1zm5%200h1v2h-2V9zm6%200h1v2h-1zm4%200h1v1h1v1h-2zm3%200h2v1h-2zM5%2010h1v1h1v1H6v1H5v1H4v-2h1zm3%200h1v1H8zm13%200h1v2h-2v-1h1zm-7%201h1v1h-1zm3%200h1v1h1v1h-3v-1h1zm6%200h1v2h-1v-1h-1v-1zm3%200h2v1h1v1h1v1h-2v2h-1v1h-1v-1h1v-3h-1zm4%200h1v1h-1zm-21%201h1v1h-1zm13%200h2v3h-1v-2h-1zm4%200h1v1h-1zm4%200h1v2h-1zm3%200h1v2h-1v1h-1v-1h1zM1%2013h1v1h1v1h1v-1h1v2h1v1H4v-1H3v-1H1zm10%200h1v1h-1zm3%200h1v1h-1zm7%200h2v1h-2zm8%200h1v1h-1zm3%200h1v1h-1zM0%2014h1v2H0zm3%200h1v1H3zm11%200h1v1h-1zm5%200h3v2h-1v-1h-1v1h-1zm5%200h2v1h-2zm-14%201h2v1h-1v1h-1zm3%200h1v1h-1zm11%200h1v1h-1zm4%200h1v2h-1zm2%200h1v1h1v-1h1v1h1v3h-1v-2h-1v2h-1v-2h-1zM3%2016h1v1H3zm5%200h4v1h-1v1h-1v1h-1v-1H9v-1H8zm8%200h1v2h-1zm2%200h3v1h-1v1h-1v-1h-1zm9%200h1v1h2v1h-3v-1h-1v-1zm4%200h1v1h2v3h-2v-1h-1v1h1v2h-1v2h-2v-1h1v-1h-1v-1h-1v2h1v1h-1v1h-2v-1h-1v-2h1v-1h2v-1h1v1h1v-2h1v-1h-1v-1h1zM1%2017h1v3h1v1h1v1H2v-1H1v-1h1v-1H1zm6%200h1v1H7zm3%200h1v1h-1zm3%201h1v1h-1zm3%200h2v1h-1v1h-1v1h-1v-2h1zm-8%201h1v1H8zm3%200h1v1h-1zm3%200h1v1h1v-1h1v2h-3zm5%200h2v1h1v4h-1v-1h-1v-2h-1zm-6%201h1v2h-1v1h-1v-2h1zm3%200h1v1h-1zm-6%201h2v1h1v4H9v-2h1v1h1v-1H9v-1h1v-1H9zm6%200h1v1h-1zm-11%201h1v1H4zm8%200h1v2h-1zm2%200h1v1h-1zm3%200h1v1h-1zm3%200h1v1h-1zm-7%201h1v1h-1zm2%200h1v1h1v1h-2zm2%201h1v1h-1zm10%200h1v1h-1zM4%2023h2v1h1v-1h1v1h1v2h-1v1H7v-1H5v-1h1v-1H4zm7%200h2v2h-1v-1h-1zm2%201h1v2h-1zm3%200h1v1h-1zm7%200h1v1h-1zm-4%201h1v1h1v2h-1v1h-1v-1h-1v-2h1zm3%200h3v2h-2v-1h-1zM4%2026h2v1H4zm3%200h1v1H7zm8%200h1v1h-1zm3%200h1v2h-1zm-5%201h2v1h-2zm3%200h1v1h-1zm3%200h3v1h-2v1h1v1h-1v1h-3v-1h1v-2h1zm8%200h1v2h-1zm-19%201h1v1H8zm3%200h1v1h-1zm12%200h1v1h-1zm-11%201h1v1h-1zm2%200h3v3h-1v-1h-1v-1h-1zm4%200h1v1h-1zm2%200h2v1h-2zm14%200h1v4h-1v1h-1v-4h1v-1zm-19%201h1v1h-1zm7%200h1v1h-1zm3%200h1v1h-1zm-8%201h1v3h-1zm2%200h1v2H9v-1h1zm2%200h1v1h-1zm3%200h1v1h-1zm9%200h1v1h1v1h1v1h-3v-1h-1v-1h1zm-12%201h1v2h-3v-1h2zm3%200h1v2h-1zm3%200h1v3h-1zm3%200h1v1h-1zM0%2034h7v7H0zm8%200h4v1h-4zm5%200h1v3h-3v-1h1v-1h1zm5%200h1v2h-2v-1h1zm2%200h3v1h-3zm4%200h2v1h1v1h-1v1h-2zm7%200v5h5v-5zm1%201h3v3h-3zM1%2035v5h5v-5zm17%200h1v3h-1v1h-1v-1h-1v2h-2v-2h1v-1h-1v-1h2v1h1zm5%200h1v2h-1zm2%200h1v1h1v1h-2zM2%2036h3v3H2zm18%200h1v2h-1zm3%200h1v1h-1zm2%200h1v1h-1zm-10%201h1v1h1v1h-1v1h-1v-2h-1v-1zm3%200h1v1h-1zm2%200h1v1h1v2h-1v-1h-1zm-7%201h1v2h-1v1h-2v-2h1v-1zm8%200h2v2h-1v-1h-1zm8%200h1v1h-1zM8%2039h3v1H8zm5%200h2v1h-1v1h-1zm6%200h1v1h-1zm2%200h1v1h-1zm2%200h1v1h1v1h-3v-1h1zm4%200h3v1h-3zm-18%201h1v1h-1zm8%200h1v1h-1zm4%200h1v1h-1z%22%2F%3E%3C%2Fsvg%3E')] bg-contain bg-center bg-no-repeat" />
                                </div>

                                {/* Instructions */}
                                <div className="text-center">
                                    <h3 className="text-white text-2xl font-bold mb-3">Escaneá con Mercado Pago</h3>
                                    <p className="text-white/50 text-lg mb-6">
                                        Abrí la app de Mercado Pago y escaneá el código QR
                                    </p>

                                    {/* MP Logo */}
                                    <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#009EE3]/10 border border-[#009EE3]/30">
                                        <div className="w-10 h-10 rounded-lg bg-[#009EE3] flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">MP</span>
                                        </div>
                                        <span className="text-[#009EE3] font-semibold">Mercado Pago</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {paymentStatus === 'processing' && (
                            <div className="text-center">
                                <motion.div
                                    className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent mx-auto mb-8"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                                <h3 className="text-white text-2xl font-bold mb-3">Procesando Pago...</h3>
                                <p className="text-white/50 text-lg">Por favor esperá un momento</p>
                            </div>
                        )}

                        {paymentStatus === 'error' && (
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
                                    <span className="material-symbols-outlined text-red-400 text-6xl">error</span>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-3">Tiempo Agotado</h3>
                                <p className="text-white/50 text-lg mb-8">
                                    El tiempo para completar el pago ha expirado
                                </p>
                                <button
                                    onClick={() => {
                                        setTimeLeft(300);
                                        setPaymentStatus('pending');
                                    }}
                                    className="btn-cta-premium px-12 py-4 text-lg"
                                >
                                    Intentar de Nuevo
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

        </div>
    );
}
