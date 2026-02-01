'use client';

import { useState, useEffect, useCallback, memo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { areSamplesCached, preloadAllSamples, type LoadProgress } from '@/engine/samplePlayer';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = memo(function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Checking cache...');
  const [phase, setPhase] = useState<'init' | 'cached' | 'download' | 'process' | 'ready'>('init');
  const [mounted, setMounted] = useState(false);
  const [needsDownload, setNeedsDownload] = useState<boolean | null>(null);

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
    let isMounted = true;

    const load = async () => {
      try {
        setPhase('init');
        setProgress(10);
        
        // Check if samples are already cached in IndexedDB
        const cached = await areSamplesCached();
        setNeedsDownload(!cached);
        
        if (cached) {
          // All samples cached - fast path!
          setStatus('Restoring from cache...');
          setPhase('cached');
          setProgress(50);
          
          // Just load from IndexedDB (fast, no network)
          await preloadAllSamples(handleProgress);
          
          if (isMounted) {
            setProgress(100);
            setStatus('Ready');
            setPhase('ready');
            setTimeout(onComplete, 400);
          }
        } else {
          // Need to download - show download phase
          setStatus('Downloading samples...');
          setPhase('download');
          setProgress(15);
          
          await preloadAllSamples(handleProgress);

          if (isMounted) {
            setProgress(100);
            setStatus('Ready');
            setPhase('ready');
            setTimeout(onComplete, 600);
          }
        }
      } catch (error) {
        console.error('Load failed:', error);
        if (isMounted) {
          setStatus('Continuing...');
          setTimeout(onComplete, 400);
        }
      }
    };

    const timer = setTimeout(load, 100);
    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, [onComplete, handleProgress]);

  // Fast path for cached samples - minimal UI
  const isFastPath = needsDownload === false;

  return (
    <div className="fixed inset-0 bg-[#030303] overflow-hidden">
      {/* Noise texture */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Scene - only show for download path */}
      {!isFastPath && (
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <LoadingScene progress={progress} phase={phase} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_70%)] pointer-events-none" />

      {/* Content */}
      <AnimatePresence>
        {mounted && (
          <motion.div 
            className="relative z-10 h-full flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-lg px-8">
              {/* Animated logo */}
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 rounded-2xl blur-3xl"
                    style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
                    animate={{
                      opacity: phase === 'ready' ? 0.6 : [0.2, 0.4, 0.2],
                      scale: phase === 'ready' ? 1.8 : [1.3, 1.5, 1.3],
                    }}
                    transition={{ 
                      duration: phase === 'ready' ? 0.5 : 2,
                      repeat: phase === 'ready' ? 0 : Infinity,
                    }}
                  />
                  <motion.div 
                    className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]"
                    animate={{ rotate: phase === 'ready' || isFastPath ? 0 : [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: phase === 'ready' ? 0 : Infinity, ease: 'easeInOut' }}
                  >
                    <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                      <motion.svg 
                        className="w-12 h-12 text-emerald-400"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        animate={{ scale: phase === 'ready' ? 1.1 : 1 }}
                      >
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
                        <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
                      </motion.svg>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h1 className="text-4xl font-light tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Algo<span className="font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span>
                </h1>
              </motion.div>

              {/* Progress section */}
              <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
                <div className="relative">
                  <div className="h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full relative"
                      style={{ background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="absolute top-0 left-0 h-1.5 rounded-full blur-sm"
                    style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                    initial={{ width: 0, opacity: 0.5 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <StatusDot phase={phase} />
                    <motion.span className="text-sm text-zinc-400" key={status} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                      {status}
                    </motion.span>
                  </div>
                  <motion.span className="text-sm font-mono text-zinc-500 tabular-nums" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {Math.round(progress)}%
                  </motion.span>
                </div>
              </motion.div>

              {/* Phase timeline - only show for download path */}
              {!isFastPath && (
                <motion.div className="mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <PhaseTimeline phase={phase} />
                </motion.div>
              )}

              {/* Cached indicator */}
              {isFastPath && phase !== 'ready' && (
                <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-xs text-zinc-500">✓ Using cached samples</span>
                </motion.div>
              )}

              {/* Ready indicator */}
              <AnimatePresence>
                {phase === 'ready' && (
                  <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                      <span className="text-sm text-emerald-400 font-medium">Entering studio...</span>
                      <motion.svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const StatusDot = memo(function StatusDot({ phase }: { phase: string }) {
  const isActive = phase !== 'ready';
  return (
    <div className="relative">
      {isActive && (
        <motion.div className="absolute inset-0 rounded-full bg-emerald-400" animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }} />
      )}
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
    </div>
  );
});

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
        return (
          <div key={p.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="relative">
                {isCurrent && (
                  <motion.div className="absolute inset-0 rounded-full bg-emerald-400/50" animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
                )}
                <motion.div 
                  className="w-3 h-3 rounded-full border-2"
                  animate={{ backgroundColor: isComplete || isCurrent ? '#10b981' : 'transparent', borderColor: isComplete || isCurrent ? '#10b981' : '#3f3f46' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.span className="mt-3 text-[10px] uppercase tracking-wider" animate={{ color: isComplete || isCurrent ? '#d4d4d8' : '#52525b' }} style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {p.label}
              </motion.span>
            </div>
            {i < phases.length - 1 && (
              <div className="flex-1 mx-3 h-[2px] rounded-full overflow-hidden bg-zinc-800">
                <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" initial={{ width: '0%' }} animate={{ width: isComplete ? '100%' : isCurrent ? '50%' : '0%' }} transition={{ duration: 0.5 }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});


// 3D Loading Scene
const LoadingScene = memo(function LoadingScene({ progress, phase }: { progress: number; phase: string }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#10b981" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#06b6d4" />
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <MorphingCore progress={progress} phase={phase} />
      </Float>
      <OrbitingElements progress={progress} />
      <Sparkles count={80} scale={10} size={1.2} speed={0.4} color="#10b981" opacity={0.5} />
      <EnergyRings progress={progress} />
    </>
  );
});

const MorphingCore = memo(function MorphingCore({ progress, phase }: { progress: number; phase: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    const baseScale = 0.8 + (progress / 100) * 0.4;
    const pulseScale = phase === 'ready' ? 1.15 : 1 + Math.sin(t * 3) * 0.03;
    meshRef.current.scale.setScalar(baseScale * pulseScale);
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.25} roughness={0.15} metalness={0.85} distort={phase === 'ready' ? 0.6 : 0.4} speed={3} transparent opacity={0.9} />
      </mesh>
    </group>
  );
});

const OrbitingElements = memo(function OrbitingElements({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 12;
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const visible = (i / count) * 100 <= progress;
        return (
          <mesh key={i} position={[x, 0, z]} scale={visible ? 1 : 0}>
            <octahedronGeometry args={[0.1]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#10b981' : '#06b6d4'} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
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
      {[1.8, 2.3, 2.8].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.008, 16, 100]} />
          <meshBasicMaterial color={i === 1 ? '#06b6d4' : '#10b981'} transparent opacity={Math.min(0.5, progress / 100 * 0.6) - i * 0.1} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
});

export default LoadingScreen;
