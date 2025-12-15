'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

const MOVIES = [
    {
        id: 1,
        title: "DUNE: PART TWO",
        poster: "/images/playground/poster-dune.png",
        color: "#d97706"
    },
    {
        id: 2,
        title: "OPPENHEIMER",
        poster: "/images/playground/poster-oppenheimer.png",
        color: "#be123c"
    },
    {
        id: 3,
        title: "POOR THINGS",
        poster: "/images/playground/poster-poor-things.png",
        color: "#4338ca"
    },
    {
        id: 4,
        title: "KILLERS OF THE FLOWER MOON",
        poster: "/images/playground/poster-killers.png",
        color: "#b45309"
    }
];

export default function Experiment1_ParallaxEvents() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
    const y2 = useTransform(smoothProgress, [0, 1], [0, -400]);
    const y3 = useTransform(smoothProgress, [0, 1], [0, -600]);
    const y4 = useTransform(smoothProgress, [0, 1], [0, -800]);

    // Background gradient that shifts
    const bgGradient = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [
            "linear-gradient(to bottom, #000000, #1e1b4b)",
            "linear-gradient(to bottom, #1e1b4b, #4c0519)",
            "linear-gradient(to bottom, #4c0519, #000000)"
        ]
    );

    return (
        <div ref={containerRef} className="relative w-full h-[250vh]">
            <motion.div
                className="fixed inset-0 w-full h-full -z-10"
                style={{ background: bgGradient }}
            />

            <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none">
                <motion.h1
                    style={{
                        y: useTransform(smoothProgress, [0, 0.3], [0, -300]),
                        opacity: useTransform(smoothProgress, [0, 0.2], [1, 0])
                    }}
                    className="text-8xl font-black tracking-tighter text-white/10 uppercase"
                >
                    Proximamente
                </motion.h1>
            </div>

            {/* Parallax Layers */}
            <div className="fixed inset-0 w-full h-screen flex items-center justify-center overflow-hidden pointer-events-none">

                {/* Card 1 - Top Left */}
                <motion.div
                    style={{ y: y1, rotate: -5, x: '-30vw', opacity: useTransform(smoothProgress, [0, 0.2, 0.4], [0, 1, 0]) }}
                    className="absolute top-1/2 left-1/2 w-64 h-96 bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-white/10"
                >
                    <div className="absolute inset-0">
                        <Image src={MOVIES[0].poster} alt={MOVIES[0].title} fill className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="p-4 h-full flex flex-col justify-end relative z-10">
                        <h2 className="text-2xl font-bold">{MOVIES[0].title}</h2>
                    </div>
                </motion.div>

                {/* Card 2 - Bottom Right */}
                <motion.div
                    style={{ y: y2, rotate: 5, x: '25vw', opacity: useTransform(smoothProgress, [0.1, 0.4, 0.7], [0, 1, 0]) }}
                    className="absolute top-2/3 left-1/2 w-72 h-[450px] bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-white/10"
                >
                    <div className="absolute inset-0">
                        <Image src={MOVIES[1].poster} alt={MOVIES[1].title} fill className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="p-4 h-full flex flex-col justify-end relative z-10">
                        <h2 className="text-2xl font-bold">{MOVIES[1].title}</h2>
                    </div>
                </motion.div>

                {/* Card 3 - Center (Hero) */}
                <motion.div
                    style={{
                        y: y3,
                        scale: useTransform(smoothProgress, [0.4, 0.6], [0.8, 1.2]),
                        opacity: useTransform(smoothProgress, [0.3, 0.6, 0.9], [0, 1, 0])
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[500px] bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-white/10 z-10"
                >
                    <div className="absolute inset-0">
                        <Image src={MOVIES[2].poster} alt={MOVIES[2].title} fill className="object-cover opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="p-6 h-full flex flex-col justify-end relative z-10">
                        <span className="text-xs font-bold tracking-widest uppercase mb-2 text-white/80">Estreno Mundial</span>
                        <h2 className="text-4xl font-black leading-none">{MOVIES[2].title}</h2>
                    </div>
                </motion.div>

                {/* Card 4 - Top Right */}
                <motion.div
                    style={{ y: y4, rotate: 10, x: '20vw', opacity: useTransform(smoothProgress, [0.6, 0.8, 1], [0, 1, 1]) }}
                    className="absolute top-1/3 left-1/2 w-60 h-80 bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-white/10"
                >
                    <div className="absolute inset-0">
                        <Image src={MOVIES[3].poster} alt={MOVIES[3].title} fill className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="p-4 h-full flex flex-col justify-end relative z-10">
                        <h2 className="text-xl font-bold">{MOVIES[3].title}</h2>
                    </div>
                </motion.div>
            </div>

            <div className="relative z-0 h-full w-full pointer-events-none" />
        </div>
    );
}
