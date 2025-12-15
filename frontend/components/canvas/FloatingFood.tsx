'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Cylinder, Box, Sphere } from '@react-three/drei';

export function FloatingFood() {
    const popcornRef = useRef<THREE.Group>(null!);
    const drinkRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (popcornRef.current) {
            popcornRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
            popcornRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;
        }
        if (drinkRef.current) {
            drinkRef.current.rotation.y = Math.cos(t * 0.5) * 0.2;
            drinkRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
        }
    });

    return (
        <group>
            {/* Popcorn Bucket */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
                <group ref={popcornRef} position={[-1.5, 0, 0]} rotation={[0.2, 0.3, 0]}>
                    <Cylinder args={[0.5, 0.35, 1.2, 32]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#ee4b2b" roughness={0.3} striped="red" />
                        {/* Simple striped material logic would be complex here, stick to red for now */}
                    </Cylinder>
                    {/* Popcorn Kernels (Spheres) */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Sphere key={i} args={[0.12]} position={[(Math.random() - 0.5) * 0.8, 0.6 + Math.random() * 0.3, (Math.random() - 0.5) * 0.8]}>
                            <meshStandardMaterial color="#fcd34d" />
                        </Sphere>
                    ))}
                    <pointLight distance={3} intensity={0.5} color="#ffaa00" position={[0, 1, 1]} />
                </group>
            </Float>

            {/* Drink Cup */}
            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.1, 0.1]}>
                <group ref={drinkRef} position={[1.5, -0.2, 0]} rotation={[-0.1, -0.3, 0]}>
                    <Cylinder args={[0.35, 0.25, 1.4, 32]}>
                        <meshStandardMaterial color="#3b82f6" roughness={0.2} transparent opacity={0.9} />
                    </Cylinder>
                    {/* Straw */}
                    <Cylinder args={[0.03, 0.03, 1.8]} position={[0.1, 0.2, 0]} rotation={[0, 0, -0.2]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Cylinder>
                    <pointLight distance={3} intensity={0.5} color="#00aaff" position={[0, 1, 1]} />
                </group>
            </Float>

            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
        </group>
    );
}
