'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { View } from '@react-three/drei';

interface SceneContainerProps {
    children: React.ReactNode;
    className?: string;
    camera?: any;
}

export function SceneContainer({
    children,
    className,
    camera = { position: [0, 0, 5], fov: 50 }
}: SceneContainerProps) {
    return (
        <div className={className}>
            <Canvas
                camera={camera}
                dpr={[1, 1.5]} // Optimization: limit pixel ratio
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}

export default SceneContainer;
