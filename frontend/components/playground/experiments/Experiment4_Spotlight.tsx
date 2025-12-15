'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/cn';

const MOVIES = [
    { id: 1, title: "DUNE: PART TWO", poster: "/images/playground/poster-dune.png", col: "col-span-2 row-span-2" },
    { id: 2, title: "OPPENHEIMER", poster: "/images/playground/poster-oppenheimer.png", col: "col-span-1 row-span-1" },
    { id: 3, title: "POOR THINGS", poster: "/images/playground/poster-poor-things.png", col: "col-span-1 row-span-2" },
    { id: 4, title: "KILLERS OF THE FLOWER MOON", poster: "/images/playground/poster-killers.png", col: "col-span-2 row-span-1" },
    // Duplicating for grid filler
    { id: 5, title: "DUNE: PART TWO", poster: "/images/playground/poster-dune.png", col: "col-span-1 row-span-1" },
    { id: 6, title: "OPPENHEIMER", poster: "/images/playground/poster-oppenheimer.png", col: "col-span-1 row-span-1" },
];

export default function Experiment4_Spotlight() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden cursor-none">

            {/* 1. Underlying Colorful Grid (The Content) */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4 opacity-50 grayscale transition-all duration-700 hover:grayscale-0">
                {MOVIES.map((movie, i) => (
                    <div key={i} className={cn("relative overflow-hidden rounded-xl", movie.col)}>
                        <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                    </div>
                ))}
                {MOVIES.map((movie, i) => (
                    <div key={`dup-${i}`} className={cn("relative overflow-hidden rounded-xl", movie.col)}>
                        <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                    </div>
                ))}
            </div>

            {/* 2. Dark Overlay with Mask */}
            <div
                className="absolute inset-0 bg-black z-10 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.9) 50%, #000 100%)`
                }}
            />

            {/* 3. Text that only appears when lit? OR sits on top */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-overlay">
                <h1 className="text-[10vw] font-black text-white/50 tracking-tighter uppercase text-center leading-none">
                    Descubri<br />Tu Cine
                </h1>
            </div>

            {/* 4. Custom Cursor / Flashlight ring */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 border-2 border-white/50 rounded-full z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
            />

        </div>
    );
}
