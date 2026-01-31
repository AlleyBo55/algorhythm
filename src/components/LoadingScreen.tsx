'use client';

import { useState, useEffect, useCallback, memo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { preloadAllSamples, areSamplesCached, type LoadProgress } from '@/engine/samplePlayer';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = memo(function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [phase, setPhase] = useState<'init' | 'download' | 'process' | 'ready'>('init');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleProgress = useCallback((p: LoadProgress) => {
    setProgress(p.percent);
    setStatus(p.message);
    if (p.status === 'ready') setPhase('ready');
    else if (p.status === 'loading') setPhase('download');
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setPhase('init');
        const cached = await areSamplesCached();
        
        if (cached) {
          setStatus('Restoring session...');
          setProgress(40);
          setPhase('process');
        } else {
          setStatus('Downloading audio samples...');
          setPhase('download');
        }

        await preloadAllSamples(handleProgress);

        if (mounted) {
          setProgress(100);
          setStatus('Ready');
          setPhase('ready');
          setTimeout(onComplete, 600);
        }
      } catch (error) {
        console.error('Load failed:', error);
        if (mounted) {
          setStatus('Continuing...');
          setTimeout(onComplete, 800);
        }
      }
    };

    const timer = setTimeout(load, 300);
    return () => { 
      mounted = false; 
      clearTimeout(timer);
    };
  }, [onComplete, handleProgress]);

  return (
    <div className="fixed inset-0 bg-[#030303] overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <LoadingScene progress={progress} phase={phase} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_70%)] pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-md px-8">
          
          {/* Animated logo */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Pulsing glow */}
              <div 
                className="absolute inset-0 rounded-2xl blur-2xl transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  opacity: phase === 'ready' ? 0.6 : 0.3,
                  transform: `scale(${1.5 + progress / 200})`,
                }}
              />
              
              {/* Logo */}
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                  <svg 
                    className="w-10 h-10 text-emerald-400 transition-transform duration-300"
                    style={{ transform: phase === 'ready' ? 'scale(1.1)' : 'scale(1)' }}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">
              Algo<span className="font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span>
            </h1>
          </div>

          {/* Progress section */}
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="relative">
              {/* Track */}
              <div className="h-1 rounded-full bg-zinc-800/80 overflow-hidden">
                {/* Fill */}
                <div 
                  className="h-full rounded-full transition-all duration-300 ease-out relative"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                  }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>
              
              {/* Glow under progress */}
              <div 
                className="absolute top-0 left-0 h-1 rounded-full blur-sm"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                  opacity: 0.5,
                }}
              />
            </div>

            {/* Status */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <StatusDot phase={phase} />
                <span className="text-sm text-zinc-400">{status}</span>
              </div>
              <span className="text-sm font-mono text-zinc-500 tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Phase timeline */}
          <div className="mt-12">
            <PhaseTimeline phase={phase} />
          </div>

          {/* Tips */}
          <div className={`mt-12 text-center transition-all duration-500 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-emerald-400">Entering studio...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Status indicator dot
const StatusDot = memo(function StatusDot({ phase }: { phase: string }) {
  const isActive = phase !== 'ready';
  
  return (
    <div className="relative">
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
      )}
      <div 
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          phase === 'ready' ? 'bg-emerald-400' : 'bg-emerald-400'
        }`}
      />
    </div>
  );
});

// Phase timeline
const PhaseTimeline = memo(function PhaseTimeline({ phase }: { phase: string }) {
  const phases = [
    { id: 'init', label: 'Initialize' },
    { id: 'download', label: 'Download' },
    { id: 'process', label: 'Process' },
    { id: 'ready', label: 'Ready' },
  ];

  const currentIndex = phases.findIndex(p => p.id === phase);

  return (
    <div className="flex items-center justify-between">
      {phases.map((p, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;

        return (
          <div key={p.id} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping" />
                )}
                <div 
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    isComplete 
                      ? 'bg-emerald-400 border-emerald-400' 
                      : isCurrent 
                        ? 'bg-emerald-400 border-emerald-400' 
                        : 'bg-transparent border-zinc-700'
                  }`}
                />
              </div>
              <span 
                className={`mt-2 text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                  isComplete || isCurrent ? 'text-zinc-300' : 'text-zinc-600'
                }`}
              >
                {p.label}
              </span>
            </div>

            {/* Connector line */}
            {i < phases.length - 1 && (
              <div className="flex-1 mx-2 h-[2px] rounded-full overflow-hidden bg-zinc-800 min-w-[40px]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: isComplete ? '100%' : isCurrent ? '50%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

// ============================================================================
// 3D LOADING SCENE
// ============================================================================

const LoadingScene = memo(function LoadingScene({ 
  progress, 
  phase 
}: { 
  progress: number; 
  phase: string;
}) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#10b981" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#06b6d4" />

      {/* Main morphing shape */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <MorphingCore progress={progress} phase={phase} />
      </Float>

      {/* Orbiting elements */}
      <OrbitingElements progress={progress} />

      {/* Particle system */}
      <Sparkles
        count={60}
        scale={8}
        size={1}
        speed={0.4}
        color="#10b981"
        opacity={0.4}
      />

      {/* Energy rings */}
      <EnergyRings progress={progress} />
    </>
  );
});

const MorphingCore = memo(function MorphingCore({ 
  progress, 
  phase 
}: { 
  progress: number; 
  phase: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;

    // Rotation
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;

    // Scale based on progress
    const baseScale = 0.8 + (progress / 100) * 0.4;
    const pulseScale = phase === 'ready' ? 1.1 : 1 + Math.sin(t * 3) * 0.03;
    meshRef.current.scale.setScalar(baseScale * pulseScale);

    // Distortion intensity
    const targetDistort = phase === 'ready' ? 0.6 : 0.35 + Math.sin(t * 2) * 0.1;
    materialRef.current.distort += (targetDistort - materialRef.current.distort) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 6]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.2}
        roughness={0.15}
        metalness={0.85}
        distort={0.4}
        speed={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
});

const OrbitingElements = memo(function OrbitingElements({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 8;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const visible = (i / count) * 100 <= progress;

        return (
          <mesh 
            key={i} 
            position={[x, 0, z]}
            scale={visible ? 1 : 0}
          >
            <octahedronGeometry args={[0.08]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
});

const EnergyRings = memo(function EnergyRings({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    groupRef.current.rotation.z = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      {[1.8, 2.2, 2.6].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.006, 16, 100]} />
          <meshBasicMaterial 
            color={i === 1 ? '#06b6d4' : '#10b981'} 
            transparent 
            opacity={Math.min(0.4, progress / 100 * 0.5) - i * 0.08} 
          />
        </mesh>
      ))}
    </group>
  );
});

export default LoadingScreen;
