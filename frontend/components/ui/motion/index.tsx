'use client';

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';
import React from 'react';

// Re-export common motion components
export const FadeIn = ({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
} & HTMLMotionProps<'div'>) => {
    const directions = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { x: 20, y: 0 },
        right: { x: -20, y: 0 },
        none: { x: 0, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...directions[direction] }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const ScaleIn = ({
    children,
    className,
    delay = 0,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
} & HTMLMotionProps<'div'>) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const AnimatePres = AnimatePresence;
