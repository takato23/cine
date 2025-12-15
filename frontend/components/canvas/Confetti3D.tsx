'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const CONFETTI_COLORS = ['#ee4b2b', '#ffffff', '#fbbf24', '#3b82f6', '#10b981'];

export function Confetti3D({ count = 100 }) {
    const mesh = useRef<THREE.InstancedMesh>(null!);

    const particles = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: new THREE.Vector3(0, -2, 0),
            velocity: new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 10 + 5, (Math.random() - 0.5) * 5),
            rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
            rotationSpeed: new THREE.Euler(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2),
            color: new THREE.Color(CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]),
            scale: Math.random() * 0.5 + 0.2
        }));
    }, [count]);

    const dummy = new THREE.Object3D();

    useFrame((state, delta) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            // Gravity
            particle.velocity.y -= 9.8 * delta * 0.5; // slow gravity

            // Move
            particle.position.addScaledVector(particle.velocity, delta);

            // Rotate
            particle.rotation.x += particle.rotationSpeed.x;
            particle.rotation.y += particle.rotationSpeed.y;
            particle.rotation.z += particle.rotationSpeed.z;

            dummy.position.copy(particle.position);
            dummy.rotation.copy(particle.rotation);
            dummy.scale.setScalar(particle.scale);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
            mesh.current.setColorAt(i, particle.color);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
        if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial side={THREE.DoubleSide} />
        </instancedMesh>
    );
}
