'use client';

import { memo, useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export type CompilationPhase = 
  | 'analyzing' 
  | 'downloading' 
  | 'loading' 
  | 'compiling' 
  | 'running'
  | 'success'
  | 'error';

interface CompilationOverlayProps {
  phase: CompilationPhase;
  progress: number;
  message: string;
  onClose?: () => void;
}

const PHASE_CONFIG: Record<CompilationPhase, { 
  label: string; 
  color: string; 
  icon: string;
  description: string;
}> = {
  analyzing: { 
    label: 'Analyzing', 
    color: '#8b5cf6', 
    icon: '🔍',
    description: 'Parsing your code...'
  },
  downloading: { 
    label: 'Downloading', 
    color: '#06b6d4', 
    icon: '📥',
    description: 'Fetching samples from CDN...'
  },
  loading: { 
    label: 'Loading', 
    color: '#f59e0b', 
    icon: '🎹',
    description: 'Initializing instruments...'
  },
  compiling: { 
    label: 'Compiling', 
    color: '#10b981', 
    icon: '⚡',
    description: 'Building audio graph...'
  },
  running: { 
    label: 'Running', 
    color: '#10b981', 
    icon: '▶️',
    description: 'Starting playback...'
  },
  success: { 
    label: 'Live', 
    color: '#10b981', 
    icon: '🎵',
    description: 'Music is playing!'
  },
  error: { 
    label: 'Error', 
    color: '#ef4444', 
    icon: '❌',
    description: 'Something went wrong'
  },
};

export const CompilationOverlay = memo(function CompilationOverlay({
  phase,
  progress,
  message,
  onClose,
}: CompilationOverlayProps) {
  const config = PHASE_CONFIG[phase];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (phase === 'success') {
      const timer = setTimeout(() => onClose?.(), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onClose]);

  return (
    <div 
      className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CompilationScene phase={phase} progress={progress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm px-8">
        {/* Phase icon with glow */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full blur-2xl animate-pulse"
              style={{ background: config.color, opacity: 0.4 }}
            />
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ 
                background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                border: `1px solid ${config.color}40`,
                boxShadow: `0 0 40px ${config.color}30`,
              }}
            >
              {config.icon}
            </div>
          </div>
        </div>

        {/* Phase label */}
        <div 
          className="text-2xl font-light mb-2 tracking-wide"
          style={{ color: config.color }}
        >
          {config.label}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-8">
          {message || config.description}
        </p>

        {/* Progress bar */}
        {phase !== 'success' && phase !== 'error' && (
          <div className="space-y-3">
            <div className="relative h-1.5 rounded-full overflow-hidden bg-zinc-800">
              <div 
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${config.color}, ${config.color}cc)`,
                }}
              />
              {/* Shimmer */}
              <div 
                className="absolute inset-0 animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">{config.description}</span>
              <span className="text-zinc-400 font-mono tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Success animation */}
        {phase === 'success' && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-bounce"
                  style={{
                    height: `${12 + Math.random() * 20}px`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '600ms',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// 3D Scene for compilation
const CompilationScene = memo(function CompilationScene({ 
  phase, 
  progress 
}: { 
  phase: CompilationPhase; 
  progress: number;
}) {
  const config = PHASE_CONFIG[phase];
  
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={config.color} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color={config.color} />

      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
        <CompilationOrb phase={phase} progress={progress} color={config.color} />
      </Float>

      <OrbitingDots progress={progress} color={config.color} />

      <Sparkles
        count={40}
        scale={6}
        size={1.5}
        speed={0.5}
        color={config.color}
        opacity={0.5}
      />
    </>
  );
});

const CompilationOrb = memo(function CompilationOrb({ 
  phase, 
  progress,
  color 
}: { 
  phase: CompilationPhase; 
  progress: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;

    // Rotation speed based on phase
    const speed = phase === 'success' ? 0.5 : 0.3;
    meshRef.current.rotation.y = t * speed;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;

    // Scale pulse
    const baseScale = 0.8 + (progress / 100) * 0.3;
    const pulse = phase === 'success' ? 1.2 : 1 + Math.sin(t * 4) * 0.05;
    meshRef.current.scale.setScalar(baseScale * pulse);

    // Distortion
    const targetDistort = phase === 'success' ? 0.6 : 0.3 + Math.sin(t * 2) * 0.1;
    materialRef.current.distort += (targetDistort - materialRef.current.distort) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.8}
        distort={0.4}
        speed={4}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
});

const OrbitingDots = memo(function OrbitingDots({ 
  progress, 
  color 
}: { 
  progress: number; 
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 12;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 1.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const visible = (i / count) * 100 <= progress;

        return (
          <mesh 
            key={i} 
            position={[x, 0, z]}
            scale={visible ? 1 : 0}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
});

// ============================================================================
// PLAYBACK EFFECT - Shows when music starts playing
// ============================================================================

export const PlaybackStartEffect = memo(function PlaybackStartEffect({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Radial burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[200vmax] h-[200vmax] rounded-full animate-ping"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 50%)',
            animationDuration: '1s',
          }}
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center animate-scale-in">
        <div className="text-6xl mb-4">🎵</div>
        <div className="text-2xl font-light text-white mb-2">Now Playing</div>
        <div className="flex items-center justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-emerald-400 rounded-full"
              style={{
                height: `${8 + Math.random() * 24}px`,
                animation: `bounce 0.5s ease-in-out ${i * 0.1}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner flashes */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-emerald-500/20 to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-cyan-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-emerald-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.4s' }} />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-cyan-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.6s' }} />
    </div>
  );
});

// ============================================================================
// LIVE INDICATOR - Pulsing indicator when music is playing
// ============================================================================

export const LiveIndicator = memo(function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <div className="relative w-2 h-2 rounded-full bg-emerald-400" />
      </div>
      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
      <div className="flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 bg-emerald-400 rounded-full animate-bounce"
            style={{
              height: `${6 + Math.random() * 8}px`,
              animationDelay: `${i * 100}ms`,
              animationDuration: '500ms',
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default CompilationOverlay;
