'use client';

import { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

const GlitchBox = memo(function GlitchBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.02;

    if (Math.random() > 0.95) {
      const scale = 1 + (Math.random() - 0.5) * 0.5;
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (Math.random() > 0.98) {
      material.color.set('#ffffff');
    } else {
      material.color.set('#09090b');
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color="#09090b" transparent opacity={0.9} />
      <Edges scale={1} threshold={15} color="#1db954" />
    </mesh>
  );
});

const CubeLoading = memo(function CubeLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 absolute inset-0">
      <div className="w-48 h-48 relative">
        <Canvas>
          <GlitchBox />
        </Canvas>
        <div className="absolute bottom-0 w-full text-center text-[#1db954] font-medium text-xs animate-pulse tracking-wider">
          Processing...
        </div>
      </div>
    </div>
  );
});

export default CubeLoading;
