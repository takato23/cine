'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

// Experiments will be imported here
import Experiment1_ParallaxEvents from './experiments/Experiment1_ParallaxEvents';
import Experiment2_CurtainReveal from './experiments/Experiment2_CurtainReveal';
import Experiment3_TypographyHero from './experiments/Experiment3_TypographyHero';
import Experiment4_Spotlight from './experiments/Experiment4_Spotlight';
import Experiment5_Coverflow from './experiments/Experiment5_Coverflow';

const EXPERIMENTS = [
    {
        id: 'parallax',
        name: 'Parallax Events',
        component: Experiment1_ParallaxEvents,
        description: 'Depth-based scrolling with floating cards',
    },
    {
        id: 'curtain',
        name: 'Curtain Reveal',
        component: Experiment2_CurtainReveal,
        description: 'Classic cinema curtain opening effect',
    },
    {
        id: 'typography',
        name: 'Typography Hero',
        component: Experiment3_TypographyHero,
        description: 'Bold text masking video reveal',
    },
    {
        id: 'spotlight',
        name: 'Spotlight Reveal',
        component: Experiment4_Spotlight,
        description: 'Interactive flashlight revealing posters',
    },
    {
        id: 'coverflow',
        name: '3D Carousel',
        component: Experiment5_Coverflow,
        description: 'Classic 3D poster browser',
    },
];

export default function PlaygroundContainer() {
    const [activeExperimentId, setActiveExperimentId] = useState(EXPERIMENTS[0].id);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const activeExperiment = EXPERIMENTS.find(e => e.id === activeExperimentId);
    const ActiveComponent = activeExperiment?.component || (() => <div>Not Found</div>);

    return (
        <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
            {/* Experiment Render Area */}
            <div className="w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeExperimentId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <ActiveComponent />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Control Menu */}
            <motion.div
                className={cn(
                    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
                    "bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4",
                    "shadow-[0_0_40px_rgba(0,0,0,0.5)]",
                    "flex flex-col gap-4 min-w-[320px] transition-all duration-300"
                )}
                animate={{
                    y: isMenuOpen ? 0 : 'calc(100% - 20px)',
                    opacity: isMenuOpen ? 1 : 0.5
                }}
            >
                {/* Header / Toggle */}
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <h3 className="text-sm font-bold tracking-widest text-[#fbbf24] uppercase">Design Playground</h3>
                    <span className="text-xs text-zinc-500">{isMenuOpen ? '▼' : '▲'}</span>
                </div>

                {isMenuOpen && (
                    <div className="flex flex-col gap-2">
                        {EXPERIMENTS.map((exp) => (
                            <button
                                key={exp.id}
                                onClick={() => setActiveExperimentId(exp.id)}
                                className={cn(
                                    "text-left p-3 rounded-xl transition-all duration-200 border",
                                    activeExperimentId === exp.id
                                        ? "bg-white/10 border-[#fbbf24]/50 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                                        : "bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="text-sm font-semibold">{exp.name}</div>
                                <div className="text-xs opacity-60">{exp.description}</div>
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
