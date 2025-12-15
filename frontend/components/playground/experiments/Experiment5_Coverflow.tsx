'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/cn';

const MOVIES = [
    { id: 1, title: "DUNE: PART TWO", poster: "/images/playground/poster-dune.png" },
    { id: 2, title: "OPPENHEIMER", poster: "/images/playground/poster-oppenheimer.png" },
    { id: 3, title: "POOR THINGS", poster: "/images/playground/poster-poor-things.png" },
    { id: 4, title: "KILLERS OF THE FLOWER MOON", poster: "/images/playground/poster-killers.png" },
];

export default function Experiment5_Coverflow() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % MOVIES.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + MOVIES.length) % MOVIES.length);
    };

    return (
        <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden perspective-[1000px]">

            {/* Background Ambience */}
            <div className="absolute inset-0 opacity-30">
                <Image
                    src={MOVIES[activeIndex].poster}
                    alt="bg"
                    fill
                    className="object-cover blur-[100px] scale-110 transition-all duration-700"
                />
            </div>

            <div className="relative z-10 w-full h-[600px] flex items-center justify-center perspective-[1200px] transform-style-3d">
                {MOVIES.map((movie, index) => {
                    // Calculate offset from active
                    const offset = index - activeIndex;
                    const isActive = index === activeIndex;

                    // Logic for looping/circular (simplify for prototype: limits)
                    // Let's just handle simple list first, or simple circular logic
                    // For pure coverflow feeling, we usually clamp view to -2 to +2

                    if (Math.abs(offset) > 2) return null; // Optimization

                    return (
                        <motion.div
                            key={movie.id}
                            layout
                            className={cn(
                                "absolute w-[300px] h-[450px] rounded-2xl shadow-2xl overflow-hidden cursor-pointer",
                                "border border-white/10"
                            )}
                            initial={false}
                            animate={{
                                x: offset * 220, // Spacing
                                z: isActive ? 200 : -200, // Depth
                                rotateY: isActive ? 0 : offset * -45, // Rotation
                                scale: isActive ? 1.2 : 0.9,
                                opacity: Math.abs(offset) > 1 ? 0.5 : 1
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 30
                            }}
                            onClick={() => setActiveIndex(index)}
                        >
                            <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-0 left-0 w-full p-6 text-center"
                                >
                                    <h2 className="text-2xl font-bold text-white drop-shadow-md">{movie.title}</h2>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation controls hint */}
            <div className="absolute bottom-32 flex gap-4 z-20">
                <button onClick={handlePrev} className="p-4 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur">←</button>
                <button onClick={handleNext} className="p-4 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur">→</button>
            </div>

        </div>
    );
}
