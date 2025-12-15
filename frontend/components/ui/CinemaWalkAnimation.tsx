'use client'

import { motion } from 'framer-motion'

/**
 * CinemaWalkAnimation - Premium animated illustration of a person walking to a cinema seat
 * Used in General admission mode where no seat selection is needed
 */
export function CinemaWalkAnimation() {
    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />

            {/* Cinema Screen */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-b from-white/20 to-white/5 rounded-lg border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 rounded-lg" />
            </motion.div>

            {/* Row of seats */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        className="relative"
                    >
                        {/* Seat back */}
                        <div className="w-10 h-12 rounded-t-lg bg-gradient-to-b from-[#8B4513] to-[#5D2E0C] border border-white/10 shadow-lg" />
                        {/* Seat cushion */}
                        <div className="w-10 h-4 -mt-1 rounded-b-md bg-gradient-to-b from-[#A0522D] to-[#8B4513] border border-white/10" />
                    </motion.div>
                ))}
            </div>

            {/* Walking Person SVG */}
            <motion.svg
                viewBox="0 0 100 150"
                className="absolute w-20 h-30"
                initial={{ x: -100, opacity: 0 }}
                animate={{
                    x: [null, 0, 0],
                    opacity: [0, 1, 1],
                    y: [0, 0, 15]
                }}
                transition={{
                    duration: 2.5,
                    times: [0, 0.6, 1],
                    ease: 'easeInOut'
                }}
                style={{ bottom: '60px' }}
            >
                {/* Head */}
                <motion.circle
                    cx="50"
                    cy="20"
                    r="15"
                    fill="#FFD7B5"
                    stroke="#E5C4A1"
                    strokeWidth="1"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -2, 0, -2, 0, 0, 0] }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1],
                        repeat: 0
                    }}
                />

                {/* Hair */}
                <motion.path
                    d="M35 18 Q50 5 65 18"
                    fill="none"
                    stroke="#4A3728"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -2, 0, -2, 0, 0, 0] }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]
                    }}
                />

                {/* Body */}
                <motion.rect
                    x="40"
                    y="35"
                    width="20"
                    height="35"
                    rx="5"
                    fill="#EE4B2B"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -2, 0, -2, 0, 0, 0] }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]
                    }}
                />

                {/* Arms - Walking then resting */}
                <motion.path
                    d="M40 40 L25 55"
                    stroke="#FFD7B5"
                    strokeWidth="6"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            'M40 40 L25 55',
                            'M40 40 L30 60',
                            'M40 40 L25 55',
                            'M40 40 L30 60',
                            'M40 45 L35 70',
                            'M40 45 L35 70'
                        ]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />
                <motion.path
                    d="M60 40 L75 55"
                    stroke="#FFD7B5"
                    strokeWidth="6"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            'M60 40 L75 55',
                            'M60 40 L70 60',
                            'M60 40 L75 55',
                            'M60 40 L70 60',
                            'M60 45 L65 70',
                            'M60 45 L65 70'
                        ]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />

                {/* Legs - Walking then sitting */}
                <motion.path
                    d="M45 70 L35 100 L35 120"
                    stroke="#2D3748"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                        d: [
                            'M45 70 L35 100 L35 120',
                            'M45 70 L55 95 L50 120',
                            'M45 70 L35 100 L35 120',
                            'M45 70 L55 95 L50 120',
                            'M45 70 L30 85 L25 100',
                            'M45 70 L30 85 L25 100'
                        ]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />
                <motion.path
                    d="M55 70 L65 100 L65 120"
                    stroke="#2D3748"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                        d: [
                            'M55 70 L65 100 L65 120',
                            'M55 70 L45 95 L50 120',
                            'M55 70 L65 100 L65 120',
                            'M55 70 L45 95 L50 120',
                            'M55 70 L70 85 L75 100',
                            'M55 70 L70 85 L75 100'
                        ]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />

                {/* Shoes */}
                <motion.ellipse
                    cx="35"
                    cy="120"
                    rx="8"
                    ry="4"
                    fill="#1A1A1A"
                    animate={{
                        cx: [35, 50, 35, 50, 25, 25],
                        cy: [120, 120, 120, 120, 100, 100]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />
                <motion.ellipse
                    cx="65"
                    cy="120"
                    rx="8"
                    ry="4"
                    fill="#1A1A1A"
                    animate={{
                        cx: [65, 50, 65, 50, 75, 75],
                        cy: [120, 120, 120, 120, 100, 100]
                    }}
                    transition={{
                        duration: 2.5,
                        times: [0, 0.15, 0.3, 0.45, 0.6, 1]
                    }}
                />
            </motion.svg>

            {/* Sparkle effect when seated */}
            <motion.div
                className="absolute"
                style={{ bottom: '100px' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 1.2, 1.5] }}
                transition={{ duration: 2.5, times: [0, 0.6, 0.8, 1] }}
            >
                <svg viewBox="0 0 50 50" className="w-16 h-16">
                    <motion.path
                        d="M25 5 L27 20 L45 25 L27 30 L25 45 L23 30 L5 25 L23 20 Z"
                        fill="none"
                        stroke="url(#sparkleGradient)"
                        strokeWidth="2"
                        animate={{ rotate: [0, 180] }}
                        transition={{ duration: 1, delay: 1.8, ease: 'easeOut' }}
                    />
                    <defs>
                        <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EE4B2B" />
                            <stop offset="100%" stopColor="#FFD700" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Text overlay */}
            <motion.p
                className="absolute bottom-0 text-sm font-medium text-white/60 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
            >
                ¡Elegí tu cantidad y disfrutá!
            </motion.p>
        </div>
    )
}
