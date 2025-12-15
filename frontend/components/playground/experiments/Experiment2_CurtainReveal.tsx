'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Experiment2_CurtainReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Curtains move apart
    const leftCurtainX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);
    const rightCurtainX = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

    // Content reveals
    const contentScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1]);
    const contentOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

    return (
        <div ref={containerRef} className="relative w-full h-[250vh] bg-black">

            {/* Sticky Container for the "Stage" */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">

                {/* The "Stage" Content (Behind Curtains) */}
                <motion.div
                    style={{ scale: contentScale, opacity: contentOpacity }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 text-center">
                        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4">
                            CINEMA
                            <span className="block text-[#fbbf24]">PERGAMINO</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto">
                            Donde las historias cobran vida.
                        </p>
                        <button className="mt-8 px-8 py-3 bg-[#be123c] text-white font-bold rounded-full hover:bg-[#9f1239] transition-colors">
                            Ver Cartelera
                        </button>
                    </div>
                </motion.div>

                {/* Left Curtain */}
                <motion.div
                    style={{ x: leftCurtainX }}
                    className="absolute top-0 left-0 w-[51%] h-full bg-[#3f0808] z-20 flex items-center justify-end border-r-4 border-[#2d0505] shadow-[10px_0_50px_rgba(0,0,0,0.8)]"
                >
                    {/* Fabric Texture/Folds */}
                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#000_50px,transparent_60px)] mix-blend-multiply" />
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                    style={{ x: rightCurtainX }}
                    className="absolute top-0 right-0 w-[51%] h-full bg-[#3f0808] z-20 flex items-center justify-start border-l-4 border-[#2d0505] shadow-[-10px_0_50px_rgba(0,0,0,0.8)]"
                >
                    {/* Fabric Texture/Folds */}
                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#000_50px,transparent_60px)] mix-blend-multiply" />
                </motion.div>

                {/* "Welcome" Text on top of curtains */}
                <motion.div
                    style={{ opacity }}
                    className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded border border-white/10">
                        <span className="text-white/80 font-mono uppercase text-sm tracking-[0.3em]">
                            Desliza para abrir
                        </span>
                    </div>
                </motion.div>

            </div>

            {/* Scroll Spacer */}
            <div className="relative z-0 h-full w-full pointer-events-none" />

        </div>
    );
}
