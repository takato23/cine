'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Experiment3_TypographyHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 50]);
    const opacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);

    // Content behind
    const contentOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

    return (
        <div ref={containerRef} className="relative w-full h-[250vh] bg-black">

            {/* Sticky Container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

                {/* Background Video/Image (Revealed) */}
                <motion.div
                    style={{ opacity: contentOpacity }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="w-full h-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">Bienvenido al Cine</h2>
                            <p className="text-xl text-zinc-300">La magia comienza aqui.</p>
                        </div>
                    </div>
                </motion.div>

                {/* The Masking Text */}
                <motion.div
                    style={{ scale, opacity }}
                    className="relative z-20 mix-blend-difference text-white"
                >
                    <h1 className="text-[15vw] font-black leading-none tracking-tighter text-center">
                        CINE<br />PERGAMINO
                    </h1>
                </motion.div>

                {/* White background to create the fill effect manually if mix-blend fails or for style */}
                {/* Instead of mix-blend, we can use SVG clip path for better support, but scaling huge text works too */}

            </div>

            <div className="relative z-0 h-full w-full pointer-events-none" />
        </div>
    );
}
