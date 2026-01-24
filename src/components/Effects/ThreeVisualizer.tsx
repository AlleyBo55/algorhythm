'use client';
import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import * as Tone from 'tone';

function AudioReactiveScene() {
    const meshRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // We need to access the Tone context audio manually or reuse an analyser
    // For simplicity in this demo, we'll create a transient analyser if one doesn't exist contextually,
    // but ideally we pass data in. However, to keep it self-contained:
    const analyser = useMemo(() => {
        // Warning: This creates a NEW analyser connected to Master. 
        // In a real app, you might want to share this reference.
        const a = new Tone.Analyser('fft', 64);
        Tone.Destination.connect(a);
        return a;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const count = 50;

    useFrame((state) => {
        const values = analyser.getValue();
        if (values instanceof Float32Array) {

            // Get average energy
            let energy = 0;
            for (let i = 0; i < values.length; i++) energy += (values[i] + 100);
            energy = energy / values.length / 50; // Normalize somewhat

            if (meshRef.current) {
                meshRef.current.rotation.x += 0.001;
                meshRef.current.rotation.y += 0.002 + (energy * 0.01);

                // Pulse scale
                const scale = 1 + energy * 0.5;
                meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
            }

            if (particlesRef.current) {
                particlesRef.current.rotation.y -= 0.002;
            }
        }
    });

    return (
        <group>
            <group ref={meshRef}>
                {/* Central Core */}
                <mesh>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial color="#CCFF00" wireframe />
                </mesh>

                {/* Orbital Rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#FFF" />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[2.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#FFF" />
                </mesh>
            </group>

            {/* Particle Field */}
            <points ref={particlesRef}>
                <sphereGeometry args={[5, 64, 64]} />
                <pointsMaterial size={0.05} color="#555" transparent opacity={0.5} />
            </points>
        </group>
    );
}

export default function ThreeVisualizer() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#000', 5, 15]} />

                <AudioReactiveScene />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
