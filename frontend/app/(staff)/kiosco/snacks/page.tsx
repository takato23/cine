'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock products
const products = [
    {
        id: 'combo1',
        name: 'Combo Gigante',
        description: 'Pochoclo grande + 2 bebidas medianas',
        price: 8500,
        category: 'COMBOS',
        imageUrl: '/images/products/combo_family.png',
        featured: true,
    },
    {
        id: 'combo2',
        name: 'Combo Pareja',
        description: 'Pochoclo mediano + 2 bebidas chicas',
        price: 6500,
        category: 'COMBOS',
        imageUrl: '/images/products/combo_classic.png',
        featured: true,
    },
    {
        id: 'p1',
        name: 'Pochoclo Chico',
        description: 'Porción individual',
        price: 2500,
        category: 'POCHOCLOS',
        imageUrl: '/images/products/popcorn_large.png',
        variations: ['Dulce', 'Salado', 'Mix'],
    },
    {
        id: 'p2',
        name: 'Pochoclo Mediano',
        description: 'Para compartir',
        price: 3500,
        category: 'POCHOCLOS',
        imageUrl: '/images/products/popcorn_large.png',
        variations: ['Dulce', 'Salado', 'Mix'],
    },
    {
        id: 'p3',
        name: 'Pochoclo Grande',
        description: 'El más grande',
        price: 4500,
        category: 'POCHOCLOS',
        imageUrl: '/images/products/popcorn_large.png',
        variations: ['Dulce', 'Salado', 'Mix'],
    },
    {
        id: 'b1',
        name: 'Gaseosa Chica',
        description: 'Coca-Cola, Sprite o Fanta',
        price: 1500,
        category: 'BEBIDAS',
        imageUrl: '/images/products/soda_cup.png',
    },
    {
        id: 'b2',
        name: 'Gaseosa Mediana',
        description: 'Coca-Cola, Sprite o Fanta',
        price: 2000,
        category: 'BEBIDAS',
        imageUrl: '/images/products/soda_cup.png',
    },
    {
        id: 'b3',
        name: 'Gaseosa Grande',
        description: 'Coca-Cola, Sprite o Fanta',
        price: 2500,
        category: 'BEBIDAS',
        imageUrl: '/images/products/soda_cup.png',
    },
    {
        id: 's1',
        name: 'Nachos con Queso',
        description: 'Con salsa de queso cheddar',
        price: 3000,
        category: 'SNACKS',
        imageUrl: '/images/products/nachos_cheese.png',
    },
    {
        id: 's2',
        name: 'Hot Dog Premium',
        description: 'Con todos los aderezos',
        price: 4800,
        category: 'SNACKS',
        imageUrl: '/images/products/hotdog_premium.png',
    },
];

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variation?: string;
};

type Category = 'COMBOS' | 'POCHOCLOS' | 'BEBIDAS' | 'SNACKS';

export default function KioscoSnacksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seats = searchParams.get('seats')?.split(',') || [];

    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category>('COMBOS');
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [selectedVariation, setSelectedVariation] = useState<string>('');

    const TICKET_PRICE = 6000;
    const ticketsTotal = seats.length * TICKET_PRICE;

    const addToCart = (product: typeof products[0], variation?: string) => {
        const itemId = variation ? `${product.id}-${variation}` : product.id;

        setCart((prev) => {
            const existing = prev.find((item) => item.id === itemId);
            if (existing) {
                return prev.map((item) =>
                    item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id: itemId,
                    name: variation ? `${product.name} (${variation})` : product.name,
                    price: product.price,
                    quantity: 1,
                    variation,
                },
            ];
        });
        setSelectedProduct(null);
        setSelectedVariation('');
    };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prev.filter((item) => item.id !== itemId);
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = ticketsTotal + cartTotal;

    const handleContinue = () => {
        router.push('/kiosco/checkout');
    };

    const filteredProducts = products.filter((p) => p.category === activeCategory);
    const featuredProducts = products.filter((p) => p.featured);

    const categories: { key: Category; label: string; icon: string }[] = [
        { key: 'COMBOS', label: 'Combos', icon: 'local_offer' },
        { key: 'POCHOCLOS', label: 'Pochoclos', icon: 'bakery_dining' },
        { key: 'BEBIDAS', label: 'Bebidas', icon: 'local_drink' },
        { key: 'SNACKS', label: 'Snacks', icon: 'cookie' },
    ];

    return (
        <div className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-12 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/kiosco/asientos" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
                    </div>
                    <span className="text-white text-xl font-semibold">Volver</span>
                </Link>

                <h1 className="text-white text-3xl font-bold">¿Querés agregar algo más?</h1>

                <Link href="/kiosco" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-white text-2xl">home</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex gap-8 px-12 py-6 overflow-hidden">
                {/* Left: Products */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Category Tabs */}
                    <div className="flex gap-4 mb-6 flex-shrink-0">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${activeCategory === cat.key
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_30px_rgba(251,146,60,0.3)]'
                                    : 'glass-panel text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{cat.icon}</span>
                                {cat.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <motion.div
                        className="flex-1 overflow-y-auto no-scrollbar"
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="grid grid-cols-3 gap-6 pb-8">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (product.variations) {
                                            setSelectedProduct(product);
                                        } else {
                                            addToCart(product);
                                        }
                                    }}
                                    className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {product.featured && (
                                            <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold">
                                                ⭐ Popular
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="text-white text-xl font-bold mb-1">{product.name}</h3>
                                        <p className="text-white/50 text-sm mb-3">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-2xl font-bold">
                                                ${product.price.toLocaleString('es-AR')}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow-primary transition-all">
                                                <span className="material-symbols-outlined text-white">add</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Cart Summary */}
                <div className="w-[380px] flex-shrink-0">
                    <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
                        <h2 className="text-white text-2xl font-bold mb-6">Tu Pedido</h2>

                        {/* Tickets */}
                        {seats.length > 0 && (
                            <div className="pb-4 mb-4 border-b border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">confirmation_number</span>
                                        <span className="text-white font-medium">Entradas ({seats.length})</span>
                                    </div>
                                    <span className="text-white font-bold">
                                        ${ticketsTotal.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {seats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold"
                                        >
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-white/20 text-6xl mb-4 block">
                                        restaurant
                                    </span>
                                    <p className="text-white/40">Tu carrito de snacks está vacío</p>
                                    <p className="text-white/30 text-sm mt-1">¡Agregá algo rico!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-white/50 text-sm">
                                                    ${item.price.toLocaleString('es-AR')} x {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-white text-lg">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-white font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        const product = products.find((p) => item.id.startsWith(p.id));
                                                        if (product) addToCart(product, item.variation);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-white text-lg">add</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Total & Continue */}
                        <div className="pt-6 mt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/60">Total</span>
                                <span className="text-white text-3xl font-bold">
                                    ${grandTotal.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="w-full btn-cta-premium py-5 text-xl flex items-center justify-center gap-3"
                            >
                                <span>Ir a Pagar</span>
                                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Variation Modal */}
            <AnimatePresence>
                {selectedProduct && selectedProduct.variations && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            className="glass-card rounded-3xl p-8 max-w-md w-full mx-4"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                            <p className="text-white/50 mb-6">Elegí tu sabor preferido</p>

                            <div className="space-y-3 mb-6">
                                {selectedProduct.variations.map((variation) => (
                                    <button
                                        key={variation}
                                        onClick={() => setSelectedVariation(variation)}
                                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${selectedVariation === variation
                                            ? 'bg-primary/20 border-2 border-primary'
                                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-white text-lg font-medium">{variation}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="flex-1 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => addToCart(selectedProduct, selectedVariation)}
                                    disabled={!selectedVariation}
                                    className="flex-1 btn-cta-premium py-4 disabled:opacity-50"
                                >
                                    Agregar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
