'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { forwardRef, ReactNode } from 'react'

// ============================================
// Animation Variants
// ============================================

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
}

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
}

export const scaleIn: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
}

export const slideInRight: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
}

export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
}

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
}

// ============================================
// Spring Configs
// ============================================

export const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30
}

export const softSpring = {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25
}

export const snappySpring = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35
}

// ============================================
// Motion Components
// ============================================

interface MotionCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    delay?: number
    hover?: boolean
    tap?: boolean
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
    ({ children, delay = 0, hover = true, tap = true, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ ...springConfig, delay }}
                whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
                whileTap={tap ? { scale: 0.98 } : undefined}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
MotionCard.displayName = 'MotionCard'

interface GlowButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }, ref) => {
        const baseStyles = 'relative inline-flex items-center justify-center font-bold rounded-xl overflow-hidden transition-colors'

        const variantStyles = {
            primary: 'bg-primary text-white',
            secondary: 'bg-white/10 text-white border border-white/10',
            ghost: 'bg-transparent text-white hover:bg-white/10'
        }

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg'
        }

        return (
            <motion.button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                whileHover={{
                    scale: 1.02,
                    boxShadow: variant === 'primary'
                        ? '0 0 30px rgba(238, 75, 43, 0.5)'
                        : '0 0 20px rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={snappySpring}
                disabled={isLoading}
                {...props}
            >
                {/* Shimmer effect overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                        <motion.span
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    ) : children}
                </span>
            </motion.button>
        )
    }
)
GlowButton.displayName = 'GlowButton'

// ============================================
// Page Transition Wrapper
// ============================================

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Stagger List Container
// ============================================

interface StaggerListProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function StaggerList({ children, className = '', delay = 0 }: StaggerListProps) {
    return (
        <motion.div
            className={className}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
                animate: {
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: delay
                    }
                }
            }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Stagger List Item
// ============================================

interface StaggerItemProps extends HTMLMotionProps<'div'> {
    children: ReactNode
}

export function StaggerItem({ children, className = '', ...props }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={staggerItem}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Animated Counter
// ============================================

interface AnimatedCounterProps {
    value: number
    className?: string
    duration?: number
}

export function AnimatedCounter({ value, className = '', duration = 1 }: AnimatedCounterProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={value}
        >
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {value}
            </motion.span>
        </motion.span>
    )
}

// ============================================
// Floating Element (for ambient effects)
// ============================================

interface FloatingElementProps {
    children: ReactNode
    duration?: number
    distance?: number
    className?: string
}

export function FloatingElement({
    children,
    duration = 3,
    distance = 10,
    className = ''
}: FloatingElementProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [-distance, distance, -distance]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Glass Panel with Hover Effect
// ============================================

interface GlassPanelProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    active?: boolean
    hover?: boolean
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ children, active = false, hover = true, className = '', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={`
          backdrop-blur-xl rounded-2xl border transition-colors
          ${active
                        ? 'bg-primary/85 border-white/20 shadow-[0_4px_30px_rgba(238,75,43,0.3)]'
                        : 'bg-white/5 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                    }
          ${className}
        `}
                whileHover={hover ? {
                    backgroundColor: active ? undefined : 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.15)'
                } : undefined}
                whileTap={hover ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.2 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
GlassPanel.displayName = 'GlassPanel'

// ============================================
// Staggered Text Reveal
// ============================================

export function StaggerText({
    text,
    className = '',
    delay = 0,
    duration = 0.5
}: {
    text: string
    className?: string
    delay?: number
    duration?: number
}) {
    // Split text into words and characters
    const words = text.split(' ')

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay }
        }
    }

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring' as const,
                damping: 12,
                stiffness: 100
            }
        }
    }

    return (
        <motion.div
            className={`flex flex-wrap overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="mr-[0.25em] whitespace-nowrap"
                    variants={child}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}

// ============================================
// Magnetic Hover Effect
// ============================================

export function Magnetic({ children, strength = 0.5 }: { children: ReactNode; strength?: number }) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Ambient Blob (Background decoration)
// ============================================

interface AmbientBlobProps {
    color: string
    size: number
    position: { top?: string; right?: string; bottom?: string; left?: string }
    delay?: number
}

export function AmbientBlob({ color, size, position, delay = 0 }: AmbientBlobProps) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                background: color,
                filter: 'blur(100px)',
                ...position
            }}
            animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay
            }}
        />
    )
}
