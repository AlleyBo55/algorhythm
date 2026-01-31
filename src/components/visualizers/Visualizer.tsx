'use client';

import { useEffect, useRef, useState, useMemo, memo } from 'react';
import * as Tone from 'tone';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type Mode = 'bars' | 'wave' | 'ring';

export const Visualizer = memo(function Visualizer() {
  const [mode, setMode] = useState<Mode>('bars');
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (analyserRef.current) return;
      analyserRef.current = new Tone.Analyser('fft', 64);
      Tone.Destination.connect(analyserRef.current);
      setReady(true);
    } catch (e) { console.warn('Visualizer init failed:', e); }
  }, []);

  return (
    <div className="relative w-full h-full bg-zinc-950 group">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        {ready && analyserRef.current && <Scene mode={mode} analyser={analyserRef.current} />}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {(['bars', 'wave', 'ring'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-2 py-1 text-[9px] uppercase font-medium rounded transition-colors ${mode === m ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>{m}</button>
        ))}
      </div>
    </div>
  );
});

const Scene = memo(function Scene({ mode, analyser }: { mode: Mode; analyser: Tone.Analyser }) {
  return (
    <group>
      {mode === 'bars' && <BarsVisualizer analyser={analyser} />}
      {mode === 'wave' && <WaveVisualizer analyser={analyser} />}
      {mode === 'ring' && <RingVisualizer analyser={analyser} />}
    </group>
  );
});

const BarsVisualizer = memo(function BarsVisualizer({ analyser }: { analyser: Tone.Analyser }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 32;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!meshRef.current) return;
    const values = analyser.getValue();
    const data = values instanceof Float32Array ? values : new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const val = data[i % data.length];
      const normalized = Math.max(0, (val + 100) / 100);
      const height = 0.1 + normalized * 2;
      const x = (i - count / 2) * 0.15;
      dummy.position.set(x, height / 2 - 0.5, 0);
      dummy.scale.set(0.1, height, 0.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (<instancedMesh ref={meshRef} args={[undefined, undefined, count]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#1db954" /></instancedMesh>);
});

const WaveVisualizer = memo(function WaveVisualizer({ analyser }: { analyser: Tone.Analyser }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 64;
  const positions = useMemo(() => new Float32Array(count * 3), []);
  useFrame((state) => {
    if (!ref.current) return;
    const values = analyser.getValue();
    const data = values instanceof Float32Array ? values : new Float32Array(count);
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const val = data[i % data.length];
      const normalized = Math.max(0, (val + 100) / 100);
      positions[i * 3] = (i / count) * 6 - 3;
      positions[i * 3 + 1] = Math.sin(i * 0.2 + time) * 0.3 + normalized * 1.5 - 0.5;
      positions[i * 3 + 2] = 0;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  useEffect(() => { if (ref.current) ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); }, [positions]);
  return (<points ref={ref}><bufferGeometry /><pointsMaterial size={0.08} color="#1db954" transparent opacity={0.8} /></points>);
});

const RingVisualizer = memo(function RingVisualizer({ analyser }: { analyser: Tone.Analyser }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 32;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!meshRef.current) return;
    const values = analyser.getValue();
    const data = values instanceof Float32Array ? values : new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const val = data[i % data.length];
      const normalized = Math.max(0, (val + 100) / 100);
      const angle = (i / count) * Math.PI * 2;
      const height = 0.1 + normalized * 1.5;
      dummy.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
      dummy.rotation.y = -angle;
      dummy.scale.set(0.08, height, 0.08);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y += 0.002;
  });
  return (<instancedMesh ref={meshRef} args={[undefined, undefined, count]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#1db954" /></instancedMesh>);
});

export default Visualizer;
