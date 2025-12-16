'use client';

import { motion } from 'framer-motion';

export default function LandingOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none select-none">
            {/* Minimal hint at the bottom */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
            >
                <motion.p
                    className="text-neutral-400 text-sm tracking-widest uppercase"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Tocá el ticket para entrar
                </motion.p>
            </motion.div>
        </div>
    );
}
