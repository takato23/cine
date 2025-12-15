'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function Ticket3D({ quantity = 1, price = 0, validated = false }) {
    const group = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            // Floating and slight rotation
            // If validated, maybe spin faster or stabilize? Let's stabilize to show it off clearly
            if (validated) {
                group.current.rotation.x = Math.sin(t) * 0.05;
                group.current.rotation.y = Math.cos(t) * 0.05;
                group.current.rotation.z = 0;
            } else {
                group.current.rotation.x = Math.cos(t / 4) / 8;
                group.current.rotation.y = Math.sin(t / 4) / 8;
                group.current.rotation.z = Math.sin(t / 1.5) / 20;
            }
        }
    });

    return (
        <Float floatIntensity={validated ? 0.5 : 2} rotationIntensity={validated ? 0.5 : 1} speed={1.5}>
            <group ref={group}>
                {/* Main Ticket Body */}
                <RoundedBox args={[3.5, 1.8, 0.1]} radius={0.1} smoothness={4} castShadow receiveShadow>
                    <meshStandardMaterial
                        color={validated ? "#22c55e" : "#1a1a1a"} // Green if validated
                        roughness={0.2}
                        metalness={0.8}
                        emissive={validated ? "#4ade80" : "#ee4b2b"} // Primary Glow
                        emissiveIntensity={0.2}
                    />
                </RoundedBox>

                {/* Holographic/Shiny Overlay (simulated with a slightly larger plane or second box) */}
                <mesh position={[0, 0, 0.06]}>
                    <planeGeometry args={[3.3, 1.6]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        roughness={0.1}
                        metalness={0.9}
                        transmission={0.2} // Glassy
                        thickness={0.1}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Text Content */}
                <Text
                    position={[-1.2, 0.4, 0.07]}
                    fontSize={0.25}
                    color="white"
                    anchorX="left"
                    anchorY="middle"
                    font="/fonts/Inter-Bold.ttf" // Assuming standard font availability or fallback
                >
                    {validated ? "ACCESO PERMITIDO" : "ADMIT ONE"}
                </Text>

                <Text
                    position={[-1.2, 0, 0.07]}
                    fontSize={0.15}
                    color={validated ? "#e0f2fe" : "#cccccc"}
                    anchorX="left"
                    anchorY="middle"
                >
                    {quantity}x ENTRADA{quantity > 1 ? 'S' : ''}
                </Text>

                <Text
                    position={[1.2, -0.6, 0.07]}
                    fontSize={0.2}
                    color={validated ? "#ffffff" : "#ee4b2b"}
                    anchorX="right"
                    anchorY="middle"
                >
                    ${price.toLocaleString()}
                </Text>

                {/* Validation Stamp */}
                {validated && (
                    <Text
                        position={[0, 0, 0.08]}
                        fontSize={0.8}
                        color="#ffffff"
                        font="/fonts/Inter-Bold.ttf"
                        rotation={[0, 0, 0.3]}
                        outlineWidth={0.02}
                        outlineColor="#15803d"
                        fillOpacity={0.8}
                        outlineOpacity={0.8}
                    >
                        PAGADO
                    </Text>
                )}

                {/* Decorative Stub Line */}
                <mesh position={[0.8, 0, 0.06]}>
                    <planeGeometry args={[0.02, 1.4]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
                    {/* Dotted line simulation */}
                </mesh>
            </group>
        </Float>
    );
}
