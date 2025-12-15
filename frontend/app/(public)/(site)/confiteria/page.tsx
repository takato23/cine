'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, Popcorn, Sparkles, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states';
import { ProductDetailsModal } from '@/components/kiosko/ProductDetailsModal';
import SceneContainer from '@/components/canvas/SceneContainer';
import { FloatingFood } from '@/components/canvas/FloatingFood';

import { useProducts } from '@/lib/queries/products';
import { Product, ProductCategory } from '@/lib/types';
import { useCheckoutStore } from '@/lib/store/checkout';

const categoryLabels: Record<ProductCategory | 'ALL', string> = {
  ALL: 'Todo',
  POCHOCLOS: 'Pochoclos',
  BEBIDAS: 'Bebidas',
  SNACKS: 'Snacks',
  COMBOS: 'Combos',
};

function formatMoneyARS(amount: number) {
  return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

export default function ConfiteriaPage() {
  const router = useRouter();
  const [category, setCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const { data, isLoading, isError, error, refetch } = useProducts({ active: true });

  const { seats, cart, addToCart } = useCheckoutStore();

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = useMemo(() => {
    const list = data ?? [];
    if (category === 'ALL') return list;
    return list.filter((p) => p.category === category);
  }, [data, category]);

  const ticketsCount = seats.length;
  const ticketsTotal = ticketsCount * 5000; // TODO: pricing rules real
  const productsTotal = cart.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const total = ticketsTotal + productsTotal;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCartFromModal = (product: Product, quantity: number, customization?: any) => {
    // Logic to add multiple items
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-x-hidden selection:bg-primary-500/30">

      {/* 1. IMMERSIVE ANIMATED BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20 mix-blend-overlay"></div>
        {/* Floating Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* 2. TOP NAVIGATION (Kiosk Header) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cartelera" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
              <LogOut className="w-5 h-5 rotate-180" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight">Cinema Pergamino</span>
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Kiosco Autoservicio</span>
            </div>
          </Link>
        </div>

        {/* Steps Indicator (Simplified) */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 rounded-full p-1.5 px-4 border border-white/5">
          <span className="text-white/40 text-xs font-bold uppercase">Pasos:</span>
          <div className="flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-primary-500/50"></span>
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            <span className="w-2 h-2 rounded-full bg-white/10"></span>
          </div>
          <span className="text-white text-xs font-bold uppercase">Confitería</span>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-40 px-4 md:px-8 container mx-auto max-w-7xl">

        {/* 3. HERO / PROMO SECTION */}
        <section className="relative h-[240px] md:h-[320px] rounded-3xl overflow-hidden bg-gradient-to-r from-primary-900/20 to-black border border-white/10 mb-10 group">
          {/* 3D Elements */}
          <div className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-700">
            <SceneContainer className="w-full h-full" camera={{ position: [0, 0, 6], fov: 40 }}>
              <FloatingFood />
            </SceneContainer>
          </div>
          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                <Sparkles className="w-3 h-3 inline mr-1" /> Premium Experience
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-4">
                Sabores de <br /><span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-orange-400">Película</span>
              </h1>
              <p className="text-lg text-white/60 max-w-md font-light leading-relaxed">
                Personalizá tu combo. Más grande, más rico, más tuyo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 4. CATEGORY TABS (Sticky) */}
        <div className="sticky top-20 z-30 pt-4 pb-8 -mx-4 px-4 bg-gradient-to-b from-neutral-950 via-neutral-950/95 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mask-linear-fade pb-1">
            {(['ALL', 'COMBOS', 'POCHOCLOS', 'BEBIDAS', 'SNACKS'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c as any)}
                className={`
                                    relative px-6 py-3 rounded-full text-sm font-bold tracking-wide border transition-all duration-300 whitespace-nowrap
                                    ${c === category
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105'
                    : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }
                                `}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        {/* 5. PRODUCT GRID (Mosaic Style) */}
        {isLoading ? (
          <div className="min-h-[400px]"><LoadingState title="Preparando el menú..." /></div>
        ) : isError ? (
          <div className="min-h-[400px]"><ErrorState title="Error cargando menú" onRetry={() => refetch()} /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => {
              const inCart = cart.find((l) => l.product.id === p.id);
              const qty = inCart?.quantity || 0;

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TiltCard
                    onClick={() => handleProductClick(p)}
                    className="h-full flex flex-col p-0 overflow-hidden group bg-neutral-900 hover:bg-neutral-800/80 border-white/5 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(238,75,43,0.15)] transition-all duration-500"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
                      <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                        {p.imageUrl ? (
                          <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover rounded-2xl shadow-2xl"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Popcorn className="w-12 h-12 text-white/20 group-hover:text-primary-400 transition-colors" />
                          </div>
                        )}
                      </div>

                      {/* Badge if added */}
                      {qty > 0 && (
                        <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20 animate-in fade-in zoom-in">
                          x{qty}
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                          {p.name}
                        </h3>
                      </div>
                      <p className="text-white/40 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">
                        {p.description || "Delicioso y fresco, ideal para disfrutar en tu función."}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-black text-white tracking-tight">
                          {formatMoneyARS(p.price)}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-primary-500 group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. FLOATING BOTTOM CART BAR (Mobile/Kiosk Friendly) */}
      <AnimatePresence>
        {(ticketsCount > 0 || productsTotal > 0) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 lg:pb-8 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-3xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 pl-6 pr-3 shadow-2xl flex items-center justify-between gap-6 ring-1 ring-white/10">

              <div className="flex items-center gap-6">
                {/* Cart Icon & Badge */}
                <div className="relative cursor-pointer group" onClick={() => {/* Open Mini Cart Details? */ }}>
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border border-black">
                    {ticketsCount + cart.reduce((acc, i) => acc + i.quantity, 0)}
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="flex flex-col">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Total Pedido</span>
                  <span className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter">
                    {formatMoneyARS(total)}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => router.push('/checkout')}
                className="h-14 px-8 md:px-12 rounded-[1.5rem] bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-lg shadow-[0_0_30px_rgba(238,75,43,0.3)] hover:shadow-[0_0_40px_rgba(238,75,43,0.5)] transition-all transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Pagar Ahora <ChevronRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCartFromModal}
      />

    </div>
  );
}
