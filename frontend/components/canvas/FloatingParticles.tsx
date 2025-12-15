'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingParticlesProps {
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
}

export function FloatingParticles({
    count = 200,
    color = '#ee4b2b',
    size = 0.05,
    speed = 0.5
}: FloatingParticlesProps) {
    const ref = useRef<THREE.Points>(null!);

    // Generate random positions using useMemo so it doesn't regenerate on re-render
    const [positions, phases] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const phs = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;     // x: -5 to 5
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y: -5 to 5
            pos[i * 3 + 2] = (Math.random() - 0.5) * 5;  // z: -2.5 to 2.5
            phs[i] = Math.random() * Math.PI * 2;
        }

        return [pos, phs];
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;

        const t = state.clock.getElapsedTime() * speed;
        const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Floating motion using sine waves
            const y = positions[i * 3 + 1];
            positionsArray[i * 3 + 1] = y + Math.sin(t + phases[i]) * 0.1;

            // Update position array (strictly needed if we were changing x/z too)
        }

        ref.current.geometry.attributes.position.needsUpdate = true;
        ref.current.rotation.y = t * 0.05; // Slow rotation of the whole cloud
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={size}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}
