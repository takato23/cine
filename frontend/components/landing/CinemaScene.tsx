'use client';

import { useScroll, Text, Stars, Sparkles, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// === ENHANCED 3D MODELS ===

// Marquee Light Bulb Component - Individual flickering bulb
const MarqueeBulb = ({ position, delay }: { position: [number, number, number]; delay: number }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Create flickering effect with random-like variations
        const flicker = Math.sin(t * 8 + delay * 10) * 0.3 +
            Math.sin(t * 12 + delay * 7) * 0.2 +
            Math.sin(t * 3 + delay * 15) * 0.2 + 0.8;

        // Occasional "off" moments for more realistic flickering
        const randomOff = Math.sin(t * 0.5 + delay * 20) > 0.95 ? 0.3 : 1;

        const finalIntensity = Math.max(0.2, flicker * randomOff);

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = finalIntensity * 2;
        }
        if (lightRef.current) {
            lightRef.current.intensity = finalIntensity * 0.15;
        }
    });

    return (
        <group position={position}>
            {/* Bulb base/socket */}
            <mesh position={[0, 0, -0.02]}>
                <cylinderGeometry args={[0.04, 0.05, 0.04, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Light bulb */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                    color="#FFE066"
                    emissive="#FFD700"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
            {/* Point light for glow */}
            <pointLight
                ref={lightRef}
                color="#FFD700"
                intensity={0.15}
                distance={0.8}
            />
        </group>
    );
};

const GoldenTicket = React.forwardRef<THREE.Group, any>((props, ref) => {
    const innerRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);

    // Generate marquee bulb positions around the frame
    const marqueeBulbs = useMemo(() => {
        const bulbs: { position: [number, number, number]; delay: number }[] = [];
        const frameWidth = 4.5;
        const frameHeight = 2.2;
        const bulbSpacing = 0.35;

        // Top edge
        const topCount = Math.floor(frameWidth / bulbSpacing);
        for (let i = 0; i <= topCount; i++) {
            bulbs.push({
                position: [-frameWidth / 2 + i * bulbSpacing, frameHeight / 2 + 0.05, 0.1],
                delay: i * 0.1
            });
        }

        // Bottom edge
        for (let i = 0; i <= topCount; i++) {
            bulbs.push({
                position: [-frameWidth / 2 + i * bulbSpacing, -frameHeight / 2 - 0.05, 0.1],
                delay: i * 0.1 + 0.5
            });
        }

        // Left edge (excluding corners)
        const sideCount = Math.floor(frameHeight / bulbSpacing) - 1;
        for (let i = 1; i <= sideCount; i++) {
            bulbs.push({
                position: [-frameWidth / 2 - 0.05, frameHeight / 2 - i * bulbSpacing, 0.1],
                delay: i * 0.1 + 1
            });
        }

        // Right edge (excluding corners)
        for (let i = 1; i <= sideCount; i++) {
            bulbs.push({
                position: [frameWidth / 2 + 0.05, frameHeight / 2 - i * bulbSpacing, 0.1],
                delay: i * 0.1 + 1.5
            });
        }

        return bulbs;
    }, []);

    useFrame((state) => {
        if (innerRef.current) {
            innerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
            innerRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.03;
        }
        // Holographic shimmer effect
        if (materialRef.current) {
            const shimmer = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            materialRef.current.emissiveIntensity = shimmer * 0.15;
        }

    });

    return (
        <group ref={ref} {...props}>
            <group ref={innerRef}>
                {/* Main Ticket Body - Dark Cinema Board */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[4.5, 2.2, 0.15]} />
                    <meshPhysicalMaterial
                        ref={materialRef}
                        color="#1a1008"
                        roughness={0.3}
                        metalness={0.5}
                        clearcoat={0.5}
                        clearcoatRoughness={0.2}
                        reflectivity={0.5}
                        envMapIntensity={1.5}
                        emissive="#3a2500"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Gold Ornate Frame */}
                <mesh position={[0, 0, 0.08]} castShadow>
                    <boxGeometry args={[4.3, 2.0, 0.03]} />
                    <meshPhysicalMaterial
                        color="#8B7355"
                        roughness={0.4}
                        metalness={0.7}
                        emissive="#5a4020"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Inner Gold Frame Border */}
                <mesh position={[0, 0, 0.085]}>
                    <boxGeometry args={[4.0, 1.7, 0.01]} />
                    <meshPhysicalMaterial
                        color="#B8860B"
                        roughness={0.2}
                        metalness={0.9}
                        emissive="#FFD700"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* === MARQUEE LIGHT BULBS === */}
                {marqueeBulbs.map((bulb, i) => (
                    <MarqueeBulb key={i} position={bulb.position} delay={bulb.delay} />
                ))}



                {/* Star Decorations - Now with glow */}
                <mesh position={[-1.6, 0.6, 0.1]}>
                    <circleGeometry args={[0.12, 5]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} toneMapped={false} />
                </mesh>
                <mesh position={[1.6, 0.6, 0.1]}>
                    <circleGeometry args={[0.12, 5]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} toneMapped={false} />
                </mesh>
                <mesh position={[-1.6, -0.5, 0.1]}>
                    <circleGeometry args={[0.1, 5]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} toneMapped={false} />
                </mesh>
                <mesh position={[1.6, -0.5, 0.1]}>
                    <circleGeometry args={[0.1, 5]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} toneMapped={false} />
                </mesh>

                {/* Main Glow Effect from center */}
                <pointLight position={[0, 0, 1.5]} intensity={1} color="#FFD700" distance={4} />

                {/* Ambient glow behind the sign */}
                <mesh position={[0, 0, -0.1]}>
                    <planeGeometry args={[5, 2.8]} />
                    <meshBasicMaterial color="#FFD700" transparent opacity={0.1} />
                </mesh>
            </group>
        </group>
    );
});
GoldenTicket.displayName = 'GoldenTicket';

const PopcornBucket = React.forwardRef<THREE.Group, any>((props, ref) => {
    const popcornKernels = useMemo(() => {
        return Array.from({ length: 35 }).map((_, i) => ({
            pos: [
                (Math.random() - 0.5) * 1.8,
                Math.random() * 0.8,
                (Math.random() - 0.5) * 1.8
            ] as [number, number, number],
            scale: 0.15 + Math.random() * 0.12,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
        }));
    }, []);

    const innerRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        if (innerRef.current) {
            innerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
        }
    });

    return (
        <group ref={ref} {...props}>
            <group ref={innerRef}>
                {/* Bucket - Main Body with Stripes */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.3, 0.95, 2.8, 32]} />
                    <meshPhysicalMaterial
                        color="#dc2626"
                        roughness={0.4}
                        metalness={0.1}
                        clearcoat={0.3}
                    />
                </mesh>

                {/* White Stripes */}
                {[0, 0.5, 1.0].map((yOffset, i) => (
                    <mesh key={i} position={[0, -0.7 + yOffset * 1.4, 0]}>
                        <cylinderGeometry args={[1.0 + yOffset * 0.12, 1.0 + yOffset * 0.1, 0.18, 32]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.5} />
                    </mesh>
                ))}

                {/* Bucket Rim */}
                <mesh position={[0, 1.4, 0]}>
                    <torusGeometry args={[1.3, 0.08, 8, 32]} />
                    <meshStandardMaterial color="#991b1b" roughness={0.6} />
                </mesh>

                {/* Popcorn Pile - More realistic kernels */}
                <group position={[0, 1.5, 0]}>
                    {popcornKernels.map((k, i) => (
                        <mesh key={i} position={k.pos} rotation={k.rotation} castShadow>
                            <icosahedronGeometry args={[k.scale, 1]} />
                            <meshStandardMaterial
                                color="#fef3c7"
                                roughness={0.9}
                                emissive="#fef3c7"
                                emissiveIntensity={0.05}
                            />
                        </mesh>
                    ))}
                </group>

                {/* Inner shadow */}
                <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.2, 32]} />
                    <meshBasicMaterial color="#7f1d1d" />
                </mesh>
            </group>
        </group>
    );
});
PopcornBucket.displayName = 'PopcornBucket';

const FilmReel = React.forwardRef<THREE.Group, any>((props, ref) => {
    const innerRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        if (innerRef.current) {
            innerRef.current.rotation.z -= delta * 0.8;
        }
    });

    const spokes = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => ({
            angle: (i / 5) * Math.PI * 2
        }));
    }, []);

    return (
        <group ref={ref} {...props}>
            <group ref={innerRef}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    {/* Outer Ring - Chrome */}
                    <mesh castShadow>
                        <torusGeometry args={[2.2, 0.15, 16, 64]} />
                        <meshPhysicalMaterial
                            color="#e5e5e5"
                            metalness={1}
                            roughness={0.05}
                            clearcoat={1}
                            reflectivity={1}
                        />
                    </mesh>

                    {/* Inner Film Spool */}
                    <mesh>
                        <cylinderGeometry args={[1.9, 1.9, 0.5, 64]} />
                        <meshStandardMaterial
                            color="#1a1a1a"
                            roughness={0.3}
                            metalness={0.2}
                        />
                    </mesh>

                    {/* Center Hub */}
                    <mesh>
                        <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
                        <meshPhysicalMaterial
                            color="#c0c0c0"
                            metalness={1}
                            roughness={0.1}
                        />
                    </mesh>

                    {/* Spokes */}
                    {spokes.map((spoke, i) => (
                        <mesh
                            key={i}
                            position={[
                                Math.cos(spoke.angle) * 1.1,
                                0,
                                Math.sin(spoke.angle) * 1.1
                            ]}
                            rotation={[0, 0, spoke.angle]}
                        >
                            <boxGeometry args={[1.8, 0.55, 0.15]} />
                            <meshPhysicalMaterial
                                color="#a3a3a3"
                                metalness={0.9}
                                roughness={0.2}
                            />
                        </mesh>
                    ))}

                    {/* Film Perforations - decorative dots around edge */}
                    {Array.from({ length: 24 }).map((_, i) => {
                        const angle = (i / 24) * Math.PI * 2;
                        return (
                            <mesh
                                key={i}
                                position={[Math.cos(angle) * 1.7, 0.26, Math.sin(angle) * 1.7]}
                            >
                                <boxGeometry args={[0.15, 0.02, 0.08]} />
                                <meshBasicMaterial color="#fafafa" />
                            </mesh>
                        );
                    })}
                </group>
            </group>

            {/* Glow */}
            <pointLight position={[0, 0, 0]} intensity={0.3} color="#60a5fa" distance={4} />
        </group>
    );
});
FilmReel.displayName = 'FilmReel';

// === SCENE MANAGER ===

export default function CinemaScene() {
    const scroll = useScroll();
    const { width, height } = useThree((state) => state.viewport);
    const groupRef = useRef<THREE.Group>(null!);

    const ticketRef = useRef<THREE.Group>(null!);
    const popcornRef = useRef<THREE.Group>(null!);
    const reelRef = useRef<THREE.Group>(null!);

    // Mobile-first: smaller orbit radius on small screens
    const isMobile = width < 6; // ~768px viewport
    const orbitRadius = isMobile ? 3.5 : 5;
    const baseScale = isMobile ? 0.7 : 1;

    useFrame((state, delta) => {
        // === ORBIT CAROUSEL ANIMATION ===
        const baseAngle = scroll.offset * Math.PI * 2;

        // === TICKET ===
        if (ticketRef.current) {
            const angle = baseAngle;
            ticketRef.current.position.x = Math.sin(angle) * orbitRadius;
            ticketRef.current.position.z = Math.cos(angle) * orbitRadius - 5;
            ticketRef.current.position.y = Math.sin(angle * 2) * 0.5;
            ticketRef.current.rotation.y = -angle;

            const zNormalized = (ticketRef.current.position.z + 10) / 10;
            ticketRef.current.scale.setScalar(baseScale * (0.8 + zNormalized * 0.4));
        }

        // === POPCORN ===
        if (popcornRef.current) {
            const angle = baseAngle + (Math.PI * 2 / 3);
            popcornRef.current.position.x = Math.sin(angle) * orbitRadius;
            popcornRef.current.position.z = Math.cos(angle) * orbitRadius - 5;
            popcornRef.current.position.y = Math.sin(angle * 2) * 0.5 - 1;
            popcornRef.current.rotation.y = -angle + 0.3;

            const zNormalized = (popcornRef.current.position.z + 10) / 10;
            popcornRef.current.scale.setScalar(baseScale * (0.6 + zNormalized * 0.3));
        }

        // === FILM REEL ===
        if (reelRef.current) {
            const angle = baseAngle + (Math.PI * 4 / 3);
            reelRef.current.position.x = Math.sin(angle) * orbitRadius;
            reelRef.current.position.z = Math.cos(angle) * orbitRadius - 5;
            reelRef.current.position.y = Math.sin(angle * 2) * 0.5 + 0.5;
            reelRef.current.rotation.y = -angle;

            const zNormalized = (reelRef.current.position.z + 10) / 10;
            reelRef.current.scale.setScalar(baseScale * (0.5 + zNormalized * 0.3));
        }

        // Camera sway (reduced on mobile)
        const swayAmount = isMobile ? 0.15 : 0.3;
        state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.15) * swayAmount;
        state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.1) * (swayAmount * 0.7);
        state.camera.lookAt(0, 0, -5);
    });

    return (
        <group ref={groupRef}>
            {/* === DARK CINEMA BACKGROUND === */}
            <color attach="background" args={['#0a0505']} />
            <fog attach="fog" args={['#0a0505', 8, 30]} />

            {/* === LIGHTING === */}
            <ambientLight intensity={0.6} color="#ffffff" />

            {/* Main Key Light - Warm Gold */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={2}
                color="#ffd700"
                castShadow
            />

            {/* Fill Light - Warm */}
            <pointLight position={[-6, 3, -3]} intensity={2} color="#ff8c00" distance={20} />

            {/* Rim Light - Cool Blue */}
            <pointLight position={[6, -2, 6]} intensity={1.5} color="#4da6ff" distance={15} />

            {/* Top Accent - Red Cinema feel */}
            <spotLight
                position={[0, 12, 0]}
                angle={0.8}
                penumbra={1}
                intensity={3}
                color="#ff3333"
            />

            {/* === STARS & PARTICLES === */}
            <Stars
                radius={100}
                depth={60}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.8}
            />

            {/* Golden Sparkles - Cinema Magic */}
            <Sparkles
                count={60}
                scale={12}
                size={3}
                speed={0.4}
                opacity={0.5}
                color="#ffd700"
            />

            {/* Red Sparkles - Cinema Accent */}
            <Sparkles
                count={30}
                scale={15}
                size={2}
                speed={0.3}
                opacity={0.3}
                color="#ff4444"
            />

            {/* === FLOATING FILM STRIPS (Decorative) === */}
            <FloatingFilmStrips />

            {/* === 3D OBJECTS === */}
            <GoldenTicket ref={ticketRef} position={[0, 0, 0]} />
            <PopcornBucket ref={popcornRef} position={[0, 0, 0]} />
            <FilmReel ref={reelRef} position={[0, 0, 0]} />

        </group>
    );
}

// Floating Film Strips - Decorative background element
function FloatingFilmStrips() {
    const groupRef = useRef<THREE.Group>(null!);

    const strips = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15,
                -10 - Math.random() * 15
            ] as [number, number, number],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ] as [number, number, number],
            speed: 0.1 + Math.random() * 0.2,
            scale: 0.3 + Math.random() * 0.4
        }));
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.rotation.x += strips[i].speed * 0.01;
                child.rotation.y += strips[i].speed * 0.015;
                child.position.y += Math.sin(state.clock.elapsedTime * strips[i].speed + i) * 0.002;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {strips.map((strip, i) => (
                <mesh key={i} position={strip.position} rotation={strip.rotation} scale={strip.scale}>
                    <boxGeometry args={[4, 0.8, 0.02]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        transparent
                        opacity={0.4}
                        emissive="#333333"
                        emissiveIntensity={0.1}
                    />
                </mesh>
            ))}
        </group>
    );
}
