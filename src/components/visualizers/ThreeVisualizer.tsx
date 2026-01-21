'use client';

import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as Tone from 'tone';

const AudioReactiveScene = memo(function AudioReactiveScene() {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const analyser = useMemo(() => { const a = new Tone.Analyser('fft', 64); Tone.Destination.connect(a); return a; }, []);

  useFrame(() => {
    const values = analyser.getValue();
    if (values instanceof Float32Array) {
      let energy = 0;
      for (let i = 0; i < values.length; i++) energy += (values[i] + 100);
      energy = energy / values.length / 50;
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.001;
        meshRef.current.rotation.y += 0.002 + (energy * 0.01);
        const scale = 1 + energy * 0.5;
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      }
      if (particlesRef.current) particlesRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <group>
      <group ref={meshRef}>
        <mesh><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial color="#1db954" wireframe /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2, 0.015, 16, 100]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4} /></mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[2.5, 0.015, 16, 100]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.3} /></mesh>
      </group>
      <points ref={particlesRef}><sphereGeometry args={[5, 64, 64]} /><pointsMaterial size={0.03} color="#3f3f46" transparent opacity={0.5} /></points>
    </group>
  );
});

const ThreeVisualizer = memo(function ThreeVisualizer() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#09090b']} />
        <fog attach="fog" args={['#09090b', 5, 15]} />
        <AudioReactiveScene />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} enablePan={false} />
      </Canvas>
    </div>
  );
});

export default ThreeVisualizer;
