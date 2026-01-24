'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<THREE.Points>(null!);

    // Generate particles
    const count = 2000;
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spread evenly but focused on center
            positions[i * 3] = (Math.random() - 0.5) * 25; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Slow rotation
        ref.current.rotation.x += delta / 50;
        ref.current.rotation.y += delta / 60;

        // Gentle floating
        // We could access positions here for wave effect but keeping it static for performance
        // unless requested. Just rotating the entire cloud is very cheap.
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#8b5cf6" // Violet/Primary color
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
}

function GridBackground() {
    // A retro-vaporwave aesthetics grid
    return (
        <gridHelper
            args={[30, 30, 0x444444, 0x222222]}
            position={[0, -5, 0]}
            rotation={[0, 0, 0]}
        />
    )
}

export function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 opacity-60 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                dpr={[1, 2]} // Handle high-DPI screens but limit to 2x for perf
                gl={{ antialias: false, alpha: true }} // Disable antialias for speed, not needed for nebula
                style={{ pointerEvents: 'none' }}
            >
                <ParticleField />
                {/* Fog to blend particles into distance */}
                <fog attach="fog" args={['#000000', 5, 20]} />
            </Canvas>
        </div>
    );
}
