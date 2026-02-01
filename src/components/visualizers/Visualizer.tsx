'use client';

import { useEffect, useRef, useState, useMemo, memo } from 'react';
import * as Tone from 'tone';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

type Mode = 'bars' | 'wave' | 'ring';

const COLORS = {
  emerald: '#10b981',
  cyan: '#06b6d4',
  amber: '#f59e0b',
};

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
    <div className="relative w-full h-full group" style={{ background: '#050505' }}>
      {/* Subtle ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ 
          background: `radial-gradient(ellipse at center, ${COLORS.emerald}15 0%, transparent 70%)`
        }}
      />
      
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color={COLORS.emerald} />
        <pointLight position={[-5, -5, 5]} intensity={0.2} color={COLORS.cyan} />
        {ready && analyserRef.current && <Scene mode={mode} analyser={analyserRef.current} />}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
      
      {/* Mode selector */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {(['bars', 'wave', 'ring'] as Mode[]).map(m => (
          <motion.button 
            key={m} 
            onClick={() => setMode(m)} 
            className="px-2 py-1 text-[8px] uppercase font-medium rounded transition-all"
            style={{ 
              backgroundColor: mode === m ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
              color: mode === m ? COLORS.emerald : 'rgba(255,255,255,0.3)',
              border: `1px solid ${mode === m ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)'}`
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {m}
          </motion.button>
        ))}
      </div>
      
      {/* Mode indicator */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.emerald }} />
        <span className="text-[8px] text-white/30 uppercase tracking-wider">Live</span>
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
  const color = useMemo(() => new THREE.Color(COLORS.emerald), []);
  
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
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </instancedMesh>
  );
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
  
  useEffect(() => { 
    if (ref.current) ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); 
  }, [positions]);
  
  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial size={0.1} color={COLORS.cyan} transparent opacity={0.9} />
    </points>
  );
});

const RingVisualizer = memo(function RingVisualizer({ analyser }: { analyser: Tone.Analyser }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 32;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(COLORS.amber), []);
  
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
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </instancedMesh>
  );
});

export default Visualizer;
