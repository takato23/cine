'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Popcorn, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types'; // Assuming Product type exists

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product, quantity: number, customization?: any) => void;
}

export function ProductDetailsModal({
    isOpen,
    onClose,
    product,
    onAddToCart,
}: ProductDetailsModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<'M' | 'L' | 'XL'>('L');

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        onAddToCart(product, quantity, { size });
        // Reset and close
        setQuantity(1);
        setSize('L');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-4 md:p-8">
                        <motion.div
                            initial={{ y: '100%', opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: '100%', opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="pointer-events-auto bg-neutral-900 border border-white/10 w-full max-w-md md:max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* LEFT: Image Section */}
                            <div className="w-full md:w-1/2 bg-gradient-to-br from-white/5 to-transparent relative min-h-[300px] flex items-center justify-center p-8 overflow-hidden">
                                {/* Background Decorative Blobs */}
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative z-10 w-56 h-56 md:w-72 md:h-72"
                                >
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-2 ring-white/10"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                            <Popcorn className="w-24 h-24 text-primary-400 opacity-80" />
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* RIGHT: Details & Controls */}
                            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-neutral-900">
                                <div className="mb-auto">
                                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                                        {product.name}
                                    </h2>
                                    <p className="text-white/60 text-base font-light leading-relaxed mb-6">
                                        {product.description || 'Crujientes, dorados y listos para disfrutar. El compañero perfecto para tu película.'}
                                    </p>

                                    {/* Customization: Size (Example) */}
                                    <div className="mb-8">
                                        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-3 block">
                                            Tamaño
                                        </label>
                                        <div className="flex gap-3 bg-white/5 p-1 rounded-xl">
                                            {['M', 'L', 'XL'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSize(s as any)}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all relative overflow-hidden ${size === s
                                                        ? 'bg-primary-500 text-white shadow-lg'
                                                        : 'text-white/50 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {s}
                                                    {size === s && (
                                                        <motion.div
                                                            layoutId="activeSize"
                                                            className="absolute inset-0 bg-white/20 mix-blend-overlay"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <span className="min-w-[40px] text-center text-xl font-bold text-white tabular-nums">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="w-12 h-12 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-xs text-neutral-400 font-medium">Total</p>
                                            <p className="text-3xl font-black text-white tabular-nums tracking-tight">
                                                ${(product.price * quantity).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full bg-[#fbbc04] hover:bg-[#eebb03] text-black font-black text-lg h-16 rounded-2xl shadow-[0_0_20px_rgba(251,188,4,0.3)] hover:shadow-[0_0_30px_rgba(251,188,4,0.5)] transition-all transform active:scale-[0.98]"
                                        onClick={handleAddToCart}
                                    >
                                        <span className="flex items-center gap-2">
                                            Agregar al Pedido <Check className="w-6 h-6" />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
