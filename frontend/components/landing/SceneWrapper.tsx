'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Loader } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import CinemaScene from '@/components/landing/CinemaScene';
import LandingOverlay from '@/components/landing/LandingOverlay';

export default function SceneWrapper() {
    const router = useRouter();

    const handleTicketClick = () => {
        router.push('/cartelera');
    };

    return (
        <>
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 30 }}>
                <ScrollControls pages={1} damping={0.1}>
                    {/* 3D Scene */}
                    <CinemaScene onTicketClick={handleTicketClick} />

                    {/* HTML Overlay with hint */}
                    <Scroll html style={{ width: '100%', height: '100%' }}>
                        <LandingOverlay />
                    </Scroll>
                </ScrollControls>
            </Canvas>
            <Loader />
        </>
    );
}
