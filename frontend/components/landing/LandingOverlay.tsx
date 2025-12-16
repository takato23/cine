'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Ticket, Popcorn, Film } from 'lucide-react';
import Link from 'next/link';

export default function LandingOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none select-none"> {/* Pass-through clicks to canvas if needed, but usually we want buttons to capture */}

            {/* SECTION 1: HERO */}
            <section className="h-screen flex items-center justify-start container mx-auto px-6 pointer-events-none">
                <div className="max-w-xl pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <p className="text-xl text-neutral-200 mb-8 max-w-md font-light leading-relaxed drop-shadow-lg">
                            Donde las historias cobran vida. Viví la magia del cine con la mejor proyección y sonido.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/cartelera">
                                <Button size="lg" className="shadow-xl shadow-primary-500/20">
                                    Comprar Entradas <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/confiteria">
                                <Button variant="secondary" size="lg" className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    Confitería
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: SNACKS / CONFITERIA */}
            <section className="h-screen flex items-center justify-end container mx-auto px-6 pointer-events-none">
                <div className="max-w-lg text-right pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center justify-end gap-2 text-secondary-400 mb-4">
                            <Popcorn className="w-6 h-6" />
                            <span className="font-bold tracking-wider uppercase text-sm">Snacks Premium</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            SABOR QUE <br /> <span className="text-primary-500">CRUJEN</span>
                        </h2>
                        <p className="text-lg text-neutral-300 mb-8 ml-auto">
                            Nuestros pochoclos gourmet y snacks son el compañero perfecto para tu película. Pedí online y saltate la fila.
                        </p>
                        <Link href="/confiteria">
                            <Button variant="outline" size="lg" className="border-secondary-500 text-secondary-400 hover:bg-secondary-500 hover:text-white">
                                Ver Menú
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: CARTELERA / TECHNOLOGY */}
            <section className="h-screen flex items-center justify-start container mx-auto px-6 pointer-events-none">
                <div className="max-w-xl pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-20%" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 text-blue-400 mb-4">
                            <Film className="w-6 h-6" />
                            <span className="font-bold tracking-wider uppercase text-sm">En Cartelera</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            MOMENTOS <br /> <span className="text-blue-500">INOLVIDABLES</span>
                        </h2>
                        <p className="text-lg text-neutral-300 mb-8">
                            Desde grandes estrenos hasta joyas independientes. Descubrí qué hay esta semana y reservá tus butacas favoritas.
                        </p>
                        <Link href="/cartelera">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                Ver Horarios <Ticket className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
