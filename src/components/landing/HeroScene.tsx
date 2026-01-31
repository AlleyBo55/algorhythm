'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

interface HeroSceneProps {
  scrollProgress: MotionValue<number>;
}

export const HeroScene = memo(function HeroScene({ scrollProgress }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
      <pointLight position={[0, 10, -10]} intensity={0.3} color="#06b6d4" />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <AudioOrb />
      </Float>

      <FrequencyRings />
      <Sparkles count={200} scale={20} size={2} speed={0.2} color="#10b981" opacity={0.4} />
      <WaveformParticles />
    </group>
  );
});

const AudioOrb = memo(function AudioOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 2) * 0.1 + 1;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    meshRef.current.rotation.y = t * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 12]} />
      <MeshDistortMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.3}
        roughness={0.1}
        metalness={0.95}
        distort={0.35}
        speed={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
});


const FrequencyRings = memo(function FrequencyRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => [
    { radius: 3.5, color: '#10b981', opacity: 0.4, speed: 1 },
    { radius: 4.5, color: '#8b5cf6', opacity: 0.3, speed: -0.8 },
    { radius: 5.5, color: '#06b6d4', opacity: 0.2, speed: 0.6 },
    { radius: 6.5, color: '#f59e0b', opacity: 0.15, speed: -0.4 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    groupRef.current.rotation.z = t * 0.08;
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} index={i} />
      ))}
    </group>
  );
});

const Ring = memo(function Ring({
  radius,
  color,
  opacity,
  speed,
  index,
}: {
  radius: number;
  color: string;
  opacity: number;
  speed: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2 + index * 0.15, index * 0.2, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
});

const WaveformParticles = memo(function WaveformParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8;
      const radius = 3 + Math.sin(angle * 3) * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (i / count - 0.5) * 10;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.1;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8 + t * 0.5;
      const radius = 3 + Math.sin(angle * 3 + t) * 1.5;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={bufferGeometry}>
      <pointsMaterial size={0.05} color="#10b981" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
});
