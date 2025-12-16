'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, useTexture, CameraControls } from '@react-three/drei';
import * as THREE from 'three';

interface SeatProps {
    position: [number, number, number];
    status: 'available' | 'occupied' | 'selected';
    onClick: () => void;
    baseColor: string;
    interactive?: boolean;
}

const SEAT_COLORS = {
    occupied: '#262626',  // Visible Dark Grey (was #1a1a1a - invisible)
    selected: '#ee4b2b',  // Primary Brand Red
    availableHover: '#ff6b4a',
};

// Shared Geometries & Materials to reduce draw calls
const seatGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
const armRestGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.6); // Simplified from RoundedBox for perf
const armSupportGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.08);
const cushionGeometry = new THREE.BoxGeometry(0.7, 0.15, 0.7); // Simplified from RoundedBox
const backrestGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.15); // Simplified from RoundedBox

const plasticMaterial = new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.2,
    metalness: 0.5,
});

// We create a base material, but we will clone/modify it slightly or use instance colors if we went full instance.
// For now, to keep animation logic, we will just optimize the creation.

// Material Factory to prevent runtime creation
const useSeatMaterials = (baseColor: string) => {
    return useMemo(() => {
        const available = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.8,
            metalness: 0.1,
        });

        const occupied = new THREE.MeshStandardMaterial({
            color: SEAT_COLORS.occupied,
            roughness: 0.8,
            metalness: 0.1,
            emissive: '#1a1a1a', // Slight emission to be visible in dark
            emissiveIntensity: 0.2,
        });

        const selected = new THREE.MeshStandardMaterial({
            color: SEAT_COLORS.selected,
            roughness: 0.8,
            metalness: 0.1,
            emissive: SEAT_COLORS.selected,
            emissiveIntensity: 0.5,
        });

        const hover = new THREE.MeshStandardMaterial({
            color: SEAT_COLORS.availableHover,
            roughness: 0.8,
            metalness: 0.1,
        });

        return { available, occupied, selected, hover };
    }, [baseColor]);
};

function Seat({ position, status, onClick, materials, interactive = true }: SeatProps & { materials: any }) {
    const group = useRef<THREE.Group>(null!);
    const [hovered, setHover] = useState(false);

    // Spring-like animation for selection
    useFrame((state) => {
        if (!group.current) return;
        // Optimization: Skip animation frame for static/non-interactive seats
        if (!interactive && status !== 'selected') return;

        const targetY = position[1] + (status === 'selected' ? 0.2 : 0);
        if (Math.abs(group.current.position.y - targetY) > 0.01) {
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);
        }

        if (status === 'selected') {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        } else if (group.current.rotation.y !== 0) {
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1);
        }
    });

    const isSelected = status === 'selected';
    const isOccupied = status === 'occupied';

    // Pick the right material reference efficiently
    const activeMaterial = isOccupied
        ? materials.occupied
        : isSelected
            ? materials.selected
            : (hovered && interactive)
                ? materials.hover
                : materials.available;

    return (
        <group
            ref={group}
            position={position}
            onClick={(e) => { e.stopPropagation(); interactive && !isOccupied && onClick(); }}
            onPointerOver={() => interactive && !isOccupied && setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* 1. Base / Legs */}
            <mesh position={[0, 0.1, 0]} geometry={seatGeometry} material={plasticMaterial} />

            {/* 2. Seat Cushion */}
            <mesh position={[0, 0.35, 0]} geometry={cushionGeometry} material={activeMaterial} castShadow receiveShadow />

            {/* 3. Backrest */}
            <group position={[0, 0.85, -0.25]} rotation={[-0.1, 0, 0]}>
                <mesh geometry={backrestGeometry} material={activeMaterial} castShadow receiveShadow />
            </group>

            {/* 4. Armrests */}
            <group position={[-0.45, 0.5, 0]}>
                <mesh geometry={armRestGeometry} material={plasticMaterial} castShadow />
                <mesh position={[0, -0.2, 0]} geometry={armSupportGeometry} material={plasticMaterial} />
            </group>

            <group position={[0.45, 0.5, 0]}>
                <mesh geometry={armRestGeometry} material={plasticMaterial} castShadow />
                <mesh position={[0, -0.2, 0]} geometry={armSupportGeometry} material={plasticMaterial} />
            </group>
        </group>
    );
}

interface SeatData {
    row: string;
    number: number;
    type: string;
    available: boolean;
    locked?: boolean;
}

interface SeatRow {
    letter: string;
    seats: SeatData[];
}

const SCREEN_POS = new THREE.Vector3(0, 4, -12);
// Adjusted target to be "higher" and "deeper" into the seating area.
// Previously (0,0,0) meant looking at the floor in front of row 1.
// Now (0, 4, 3) aims at roughly the middle-height rows, so zooming in keeps the formation centered.
const DEFAULT_POV_TARGET = new THREE.Vector3(0, 4, 3);

interface SeatMap3DProps {
    rows: SeatRow[];
    selectedSeats: { row: string; seatNumber: number }[];
    onToggleSeat: (row: string, number: number) => void;
    roomName?: string;
    viewMode?: 'POV' | 'AERIAL';
    focusedSeat?: { row: string; seatNumber: number } | null;
    seatingType?: 'assigned' | 'general' | 'ASSIGNED' | 'GENERAL';
}

export default function SeatMap3D({ rows, selectedSeats, onToggleSeat, roomName = '', viewMode = 'AERIAL', focusedSeat = null, seatingType = 'assigned' }: SeatMap3DProps) {
    // For General Admission, ALWAYS generate a full "Premium" layout for visualization, ignoring specific room data
    // This ensures a consistent "spectacular" backdrop even if the general admission room has no defined seats in DB.
    const displayRows = useMemo(() => {
        if (seatingType === 'general' || seatingType === 'GENERAL') {
            return Array.from({ length: 12 }, (_, r) => ({
                letter: String.fromCharCode(65 + r),
                seats: Array.from({ length: 18 }, (_, s) => ({
                    row: String.fromCharCode(65 + r),
                    number: s + 1,
                    type: 'STANDARD',
                    available: true,
                    locked: false
                } as any))
            }));
        }
        return rows || [];
    }, [rows, seatingType]);

    const isYellowRoom = useMemo(() => roomName.toLowerCase().includes('amarilla'), [roomName]);
    const seatBaseColor = isYellowRoom ? '#fbbf24' : '#8a1c1c'; // Yellow-400 vs Deep Red
    const wallColor = isYellowRoom ? '#fbbf24' : '#ffaa00'; // Lighting adaptation

    // Load logo texture
    const logoTexture = useTexture('/images/cinema-logo.png');

    // Optimization: Pre-calculate materials
    const materials = useSeatMaterials(seatBaseColor);

    const cameraControlsRef = useRef<CameraControls>(null!);

    // NEW: Mobile Detection for initial camera pos
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const defaultCameraPos = useMemo(() => {
        // Mobile needs to be further back/higher to fit width vertically
        if (isMobile) return new THREE.Vector3(0, 40, 15);
        return new THREE.Vector3(0, 30, 20); // Moved camera back slightly (Z=20) to maintain framing with new target
    }, [isMobile]);

    // Calculate seat positions map for quick lookup
    const seatPositions = useMemo(() => {
        const map = new Map<string, THREE.Vector3>();
        displayRows.forEach((rowData, rIndex) => {
            const seatSpacing = 1.2;
            const rowSpacing = 2.0;
            const rowWidth = rowData.seats.length * seatSpacing;
            const rowOffset = -rowWidth / 2;
            const rowZ = -8 + (rIndex * rowSpacing);
            const rowY = rIndex * 0.9; // FIXED: Must match render loop (was 0.6, now 0.9)

            rowData.seats.forEach((seat, sIndex) => {
                const x = rowOffset + (sIndex * seatSpacing) + (seatSpacing / 2);
                map.set(`${seat.row}-${seat.number}`, new THREE.Vector3(x, rowY, rowZ));
            });
        });
        return map;
    }, [displayRows]);

    // Camera Transition Logic
    useEffect(() => {
        if (!cameraControlsRef.current) return;

        // Use focusedSeat if explicitly set, otherwise fallback to last selected
        const activeSeat = focusedSeat || selectedSeats[selectedSeats.length - 1];

        // LOGIC: POV only if mode is POV AND we have a seat. Otherwise Aerial.
        if (viewMode === 'POV' && activeSeat) {
            const pos = seatPositions.get(`${activeSeat.row}-${activeSeat.seatNumber}`);
            if (pos) {
                // POV: Seat Position + Eye Level
                // Eye height = seat cushion (0.35) + backrest height (0.7) + head (~0.45) = ~1.5
                // This simulates proper eye height of a seated person looking over the front row
                const eyePos = pos.clone().add(new THREE.Vector3(0, 1.5, 0)); // Proper seated eye height

                // Animate to Seat POV
                cameraControlsRef.current.setLookAt(
                    eyePos.x, eyePos.y, eyePos.z,
                    SCREEN_POS.x, SCREEN_POS.y, SCREEN_POS.z,
                    true // animated
                );
            }
        } else {
            // No selection OR Aerial Mode requested -> Aerial View
            cameraControlsRef.current.setLookAt(
                defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z,
                DEFAULT_POV_TARGET.x, DEFAULT_POV_TARGET.y, DEFAULT_POV_TARGET.z,
                true
            );
        }
    }, [selectedSeats, seatPositions, viewMode, defaultCameraPos, focusedSeat]);

    return (
        <group>
            {/* --- IMPROVED LIGHTING --- */}

            {/* 1. Screen Light (Bright and Wide) */}
            <spotLight
                position={[0, 8, -15]}
                target-position={[0, 0, 5]}
                intensity={isYellowRoom ? 23 : 17.5}
                angle={0.8}
                penumbra={0.5}
                color={isYellowRoom ? "#fffbeb" : "#e0f2fe"} // Warm white vs Cool white
                castShadow
                shadow-bias={-0.0001}
                distance={60}
            />

            {/* 2. Overhead Environment Fill - more visibility */}
            <hemisphereLight
                intensity={isYellowRoom ? 0.5 : 0.25}
                groundColor="#000000"
                color={isYellowRoom ? "#422006" : "#222222"}
            />

            {/* 3. Warm Side Lights for atmosphere - Boosted for Walls */}
            <pointLight position={[-12, 6, 0]} intensity={5} color={wallColor} distance={20} decay={2} />
            <pointLight position={[12, 6, 0]} intensity={5} color={wallColor} distance={20} decay={2} />

            {/* 4. Volumetric-ish Fog */}
            <fog attach="fog" args={['#050505', 10, 120]} />
            <group>
                <CameraControls
                    ref={cameraControlsRef}
                    enabled={seatingType !== 'general' && seatingType !== 'GENERAL'}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.1} // Prevent going under floor
                    minAzimuthAngle={-Math.PI / 3} // Limit left rotation
                    maxAzimuthAngle={Math.PI / 3}  // Limit right rotation
                    minDistance={2}
                    maxDistance={60}
                    truckSpeed={0} // Disable Pan
                    smoothTime={0.6}
                />

                {displayRows.map((rowData, rIndex) => {
                    // SPACING & LAYOUT
                    const seatSpacing = 1.2;
                    const rowSpacing = 2.0;
                    const rowWidth = rowData.seats.length * seatSpacing;
                    const rowOffset = -rowWidth / 2;
                    const rowZ = -8 + (rIndex * rowSpacing);
                    const rowY = rIndex * 0.9;

                    return (
                        <group key={`row-${rIndex}`}>
                            {/* STADIUM RISER (The concrete step) */}
                            <mesh position={[0, rowY - 0.3, rowZ]} receiveShadow>
                                <boxGeometry args={[rowWidth + 2, 0.6, rowSpacing]} />
                                <meshStandardMaterial color="#333333" roughness={0.9} />
                            </mesh>

                            {rowData.seats.map((seat, sIndex) => {
                                const isSelected = selectedSeats.some(s => s.row === seat.row && s.seatNumber === seat.number);
                                const isOccupied = !seat.available || seat.locked;
                                const x = rowOffset + (sIndex * seatSpacing) + (seatSpacing / 2);

                                if (seat.type === 'GAP' || seat.type === 'gap') return null;

                                return (
                                    <group
                                        key={`${seat.row}-${seat.number}`}
                                        position={[x, rowY, rowZ]}
                                        rotation={[0, Math.PI, 0]}
                                    >
                                        <Seat
                                            position={[0, 0, 0]}
                                            status={isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}
                                            onClick={() => seatingType === 'assigned' && onToggleSeat(seat.row, seat.number)}
                                            baseColor={seatBaseColor}
                                            interactive={seatingType === 'assigned'}
                                            materials={materials}
                                        />
                                    </group>
                                );
                            })}
                        </group>
                    );
                })}
            </group>

            {/* --- SCREEN GEOMETRY --- */}
            <mesh position={[0, 4, -12]}>
                <boxGeometry args={[18, 8, 0.1]} />
                <meshStandardMaterial
                    map={logoTexture}
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                    toneMapped={false}
                    roughness={0.2}
                />
            </mesh>

            {/* Screen Halo */}
            <pointLight position={[0, 4, -10]} intensity={2} distance={15} color="#aabbff" />

            {/* Floor */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    roughness={0.5}
                    metalness={0.2}
                />
            </mesh>

            {/* Side Stairs with Lights */}
            {displayRows.map((_, rIndex) => {
                const stepZ = -8 + (rIndex * 2.0); // Matches rowZ
                const stepY = rIndex * 0.9;        // Matches new rowY

                return (
                    <group key={`stair-${rIndex}`}>
                        {/* Left Stair Block */}
                        <mesh position={[-12, stepY - 0.45, stepZ]} receiveShadow>
                            <boxGeometry args={[2, 0.9, 2.0]} />
                            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                        </mesh>
                        {/* Right Stair Block */}
                        <mesh position={[12, stepY - 0.45, stepZ]} receiveShadow>
                            <boxGeometry args={[2, 0.9, 2.0]} />
                            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                        </mesh>

                        {/* Step Lights - FAKE GLOW (Emissive Mesh instead of PointLight) */}
                        <mesh position={[-11.1, stepY - 0.1, stepZ + 0.9]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="#ff0000" toneMapped={false} />
                        </mesh>
                        {/* Fake light bounce on floor using a purely visual circle on the step if needed, or just relying on the bright dot */}

                        <mesh position={[11.1, stepY - 0.1, stepZ + 0.9]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="#ff0000" toneMapped={false} />
                        </mesh>
                    </group>
                );
            })}

            {/* WALLS & CURTAINS (Visual Enclosure) */}
            {Array.from({ length: 11 }).map((_, i) => {
                const zPos = -10 + (i * 4);
                return (
                    <group key={`wall-${i}`}>
                        {/* Left Curtain */}
                        <mesh position={[-14, 5, zPos]} receiveShadow>
                            <cylinderGeometry args={[0.8, 0.8, 20, 16]} />
                            <meshStandardMaterial color="#3f0808" roughness={0.8} />
                        </mesh>
                        {/* Right Curtain */}
                        <mesh position={[14, 5, zPos]} receiveShadow>
                            <cylinderGeometry args={[0.8, 0.8, 20, 16]} />
                            <meshStandardMaterial color="#3f0808" roughness={0.8} />
                        </mesh>

                        {/* Density Folds */}
                        <mesh position={[-14, 5, zPos + 2]} receiveShadow>
                            <cylinderGeometry args={[0.8, 0.8, 20, 16]} />
                            <meshStandardMaterial color="#2d0505" roughness={0.8} />
                        </mesh>
                        <mesh position={[14, 5, zPos + 2]} receiveShadow>
                            <cylinderGeometry args={[0.8, 0.8, 20, 16]} />
                            <meshStandardMaterial color="#2d0505" roughness={0.8} />
                        </mesh>

                        {/* SCONCES (Lamps) */}
                        {i % 2 === 0 && (
                            <group>
                                {/* Left Lamp */}
                                <mesh position={[-13.2, 8, zPos]}>
                                    <boxGeometry args={[0.4, 1.5, 0.8]} />
                                    <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={2} toneMapped={false} />
                                </mesh>
                                {/* Removed PointLight for performance - relying on emissive bloom or ambient light */}

                                {/* Right Lamp */}
                                <mesh position={[13.2, 8, zPos]}>
                                    <boxGeometry args={[0.4, 1.5, 0.8]} />
                                    <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={2} toneMapped={false} />
                                </mesh>
                            </group>
                        )}
                    </group>
                );
            })}

            {/* BACK STAGE / ENTRANCE AREAS (Behind Screen) */}
            <group position={[0, 0, -18]}>
                <mesh position={[0, 5, -2]} receiveShadow>
                    <planeGeometry args={[40, 20]} />
                    <meshStandardMaterial color="#222" roughness={0.9} />
                </mesh>

                <mesh position={[-12, 2, 2]}>
                    <boxGeometry args={[4, 6, 8]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <pointLight position={[-12, 4, 4]} intensity={5} color="#00ff00" distance={5} />

                <mesh position={[12, 2, 2]}>
                    <boxGeometry args={[4, 6, 8]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <pointLight position={[12, 4, 4]} intensity={5} color="#00ff00" distance={5} />
            </group>

            {/* Ceiling */}
            <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[40, 60]} />
                <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>

            <ContactShadows opacity={0.5} scale={50} blur={2.5} far={4} color="#000000" />
        </group>
    );
}
