'use client';

import { useState, useRef, useCallback, useEffect, memo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

const Studio = dynamic(() => import('@/components/Studio'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

type AppState = 'welcome' | 'loading' | 'ready';

export default function StudioPage() {
  const [state, setState] = useState<AppState>('welcome');
  const djRef = useRef<typeof import('@/engine/djapi').dj | null>(null);

  const handleStart = useCallback(async () => {
    setState('loading');
    try {
      const { dj } = await import('@/engine/djapi');
      djRef.current = dj;
      await dj.engine.init();
      dj.init();
    } catch (err) {
      console.error('Init failed:', err);
      setState('welcome');
    }
  }, []);

  if (state === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (state === 'loading') {
    return <LoadingScreen onComplete={() => setState('ready')} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Studio />
    </Suspense>
  );
}

const LoadingFallback = memo(function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-[#030303] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
});

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <WelcomeScene hovered={hovered} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-transparent to-[#030303]/80 pointer-events-none" />

      <div className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-lg px-8">
          <div className={`flex justify-center mb-16 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 p-[2px] shadow-2xl shadow-emerald-500/25">
                <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                  <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={`text-center mb-16 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-6xl font-extralight tracking-tight text-white mb-4">
              Algo<span className="font-normal bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span>
            </h1>
            <p className="text-lg text-zinc-500 font-light tracking-wide">Live coding meets DJ performance</p>
          </div>

          <div className={`flex justify-center mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button onClick={onStart} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold text-lg shadow-xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-active:scale-95">
                <span>Launch Studio</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {['50+ Templates', 'Real-time DSP', 'MIDI Support', 'Live Coding'].map((feature) => (
              <div key={feature} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 backdrop-blur-sm">{feature}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const WelcomeScene = memo(function WelcomeScene({ hovered }: { hovered: boolean }) {
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
      <MeshDistortMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.15} roughness={0.1} metalness={0.9} distort={hovered ? 0.5 : 0.3} speed={2} transparent opacity={0.85} />
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

const FloatingSphere = memo(function FloatingSphere({ position, scale, speed, index }: { position: [number, number, number]; scale: number; speed: number; index: number }) {
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
