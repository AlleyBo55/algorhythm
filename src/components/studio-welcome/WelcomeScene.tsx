'use client';

import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface WelcomeSceneProps {
  hovered: boolean;
}

export const WelcomeScene = memo(function WelcomeScene({ hovered }: WelcomeSceneProps) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <MainOrb hovered={hovered} />
      </Float>
      <OrbitingRings />
      <Sparkles count={100} scale={10} size={1.5} speed={0.3} color="#10b981" opacity={0.3} />
      <BackgroundSpheres />
    </>
  );
});

const MainOrb = memo(function MainOrb({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 8]} />
      <MeshDistortMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.15}
        roughness={0.1}
        metalness={0.9}
        distort={hovered ? 0.5 : 0.3}
        speed={2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
});

const OrbitingRings = memo(function OrbitingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {[2.2, 2.8, 3.4].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, i * 0.3, 0]}>
          <torusGeometry args={[radius, 0.008, 16, 100]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
    </group>
  );
});

const BackgroundSpheres = memo(function BackgroundSpheres() {
  const spheres = useRef(
    Array.from({ length: 20 }, () => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5] as [number, number, number],
      scale: 0.05 + Math.random() * 0.15,
      speed: 0.2 + Math.random() * 0.3,
    }))
  ).current;

  return (
    <group>
      {spheres.map((sphere, i) => (
        <FloatingSphere key={i} {...sphere} index={i} />
      ))}
    </group>
  );
});

interface FloatingSphereProps {
  position: [number, number, number];
  scale: number;
  speed: number;
  index: number;
}

const FloatingSphere = memo(function FloatingSphere({ position, scale, speed, index }: FloatingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
    </mesh>
  );
});
