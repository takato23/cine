'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function TiltCard({ children, className, onClick }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const xPos = clientX - left - width / 2;
        const yPos = clientY - top - height / 2;
        x.set(xPos);
        y.set(yPos);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
    const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className={cn(
                'relative cursor-pointer rounded-2xl bg-white/5 border border-white/10 p-4 shadow-xl backdrop-blur-sm transition-colors hover:bg-white/10',
                className
            )}
        >
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>

            {/* Gloss effect */}
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 rounded-2xl pointer-events-none"
                style={{ opacity: useTransform(rotateX, (val) => Math.abs(val) / 10) }}
            />
        </motion.div>
    );
}
