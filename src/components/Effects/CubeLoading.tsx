'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

function GlitchBox() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Rotation
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.02;

        // Glitch scaling
        if (Math.random() > 0.95) {
            const scale = 1 + (Math.random() - 0.5) * 0.5;
            meshRef.current.scale.set(scale, scale, scale);
        } else {
            meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        // Color flash
        if (Math.random() > 0.98) {
            (meshRef.current.material as THREE.MeshBasicMaterial).color.set('#FFF');
        } else {
            (meshRef.current.material as THREE.MeshBasicMaterial).color.set('#000');
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial color="black" transparent opacity={0.8} />
            <Edges
                scale={1}
                threshold={15} // Display edges only when the angle between two faces exceeds this value
                color={hovered ? "white" : "#CCFF00"}
            />
        </mesh>
    );
}

export default function CubeLoading() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 absolute inset-0">
            <div className="w-64 h-64 relative">
                <Canvas>
                    <GlitchBox />
                </Canvas>
                <div className="absolute bottom-0 w-full text-center text-[#CCFF00] font-mono text-xs font-bold animate-pulse tracking-widest">
                    AI_PROCESSING...
                </div>
            </div>
        </div>
    );
}
