'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface HeroSceneProps {
  currentSection: number;
  theme: SectionTheme;
}

export const HeroScene = memo(function HeroScene({ currentSection, theme }: HeroSceneProps) {
  return (
    <>
      {/* Deep space starfield */}
      <Starfield />
      
      {/* Cosmic fog for depth */}
      <fog attach="fog" args={['#000000', 25, 60]} />
      
      {/* Dramatic lighting setup */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-8, -5, -8]} intensity={0.4} color={theme.primary} />
      <pointLight position={[0, 5, -10]} intensity={0.3} color={theme.accent} />
      
      {/* Section-specific shapes */}
      {currentSection === 0 && <HeroOrb theme={theme} />}
      {currentSection === 1 && <CodeMatrix theme={theme} />}
      {currentSection === 2 && <FeatureGrid theme={theme} />}
      {currentSection === 3 && <PlayOrb theme={theme} />}
      
      {/* Orbital rings - always present */}
      <OrbitalRings theme={theme} />
      
      {/* Floating particles */}
      <CosmicDust theme={theme} />
    </>
  );
});

// Enhanced starfield with depth
const Starfield = memo(function Starfield() {
  const starsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      // Varied star colors - some warm, some cool
      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        // Warm stars
        col[i * 3] = 1;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.6 + Math.random() * 0.2;
      } else if (colorChoice > 0.8) {
        // Blue stars
        col[i * 3] = 0.7 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 2] = 1;
      } else {
        // White stars
        const brightness = 0.5 + Math.random() * 0.5;
        col[i * 3] = brightness;
        col[i * 3 + 1] = brightness;
        col[i * 3 + 2] = brightness;
      }
      
      siz[i] = Math.random() * 0.08 + 0.02;
    }
    
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.002;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.1;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.08} 
        vertexColors 
        transparent 
        opacity={0.9} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Hero: Morphing organic orb with distortion
const HeroOrb = memo(function HeroOrb({ theme }: { theme: SectionTheme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
    }
    
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      glowRef.current.scale.setScalar(scale * 4.5);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={[3, 0, -2]}>
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial 
            color={theme.primary} 
            transparent 
            opacity={0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Main distorted sphere */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2.5, 20]} />
          <MeshDistortMaterial
            color={theme.primary}
            emissive={theme.primary}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </mesh>
        
        {/* Inner core */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial 
            color={theme.accent} 
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* Wireframe overlay */}
        <mesh>
          <icosahedronGeometry args={[2.8, 3]} />
          <meshBasicMaterial 
            color={theme.primary} 
            wireframe 
            transparent 
            opacity={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
});

// Code section: Matrix-style floating code blocks
const CodeMatrix = memo(function CodeMatrix({ theme }: { theme: SectionTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);
  
  const blocks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8 - 2,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.5,
        speed: 0.5 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    }
    
    blocksRef.current.forEach((block, i) => {
      if (block) {
        const data = blocks[i];
        block.position.y = data.position[1] + Math.sin(t * data.speed + data.offset) * 0.5;
        block.rotation.x = t * 0.2;
        block.rotation.y = t * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) blocksRef.current[i] = el; }}
          position={block.position}
          scale={block.scale}
        >
          <boxGeometry args={[1, 0.6, 0.1]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.accent : '#ffffff'}
            emissive={i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.accent : '#ffffff'}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Central bracket structure */}
      <Float speed={1.5} rotationIntensity={0.3}>
        <group position={[0, 0, 0]}>
          {/* Left bracket */}
          <mesh position={[-2, 0, 0]}>
            <boxGeometry args={[0.15, 4, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-1.5, 1.9, 0]}>
            <boxGeometry args={[1, 0.15, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[-1.5, -1.9, 0]}>
            <boxGeometry args={[1, 0.15, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Right bracket */}
          <mesh position={[2, 0, 0]}>
            <boxGeometry args={[0.15, 4, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[1.5, 1.9, 0]}>
            <boxGeometry args={[1, 0.15, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[1.5, -1.9, 0]}>
            <boxGeometry args={[1, 0.15, 0.15]} />
            <meshStandardMaterial 
              color={theme.primary} 
              emissive={theme.primary} 
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
});

// Features: 3D grid of floating feature icons
const FeatureGrid = memo(function FeatureGrid({ theme }: { theme: SectionTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<THREE.Mesh[]>([]);
  
  const gridItems = useMemo(() => {
    const items = [];
    const cols = 5;
    const rows = 3;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        items.push({
          position: [
            (col - (cols - 1) / 2) * 2.5,
            (row - (rows - 1) / 2) * 2,
            0,
          ] as [number, number, number],
          delay: (row * cols + col) * 0.1,
        });
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.x = -0.2;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    
    itemsRef.current.forEach((item, i) => {
      if (item) {
        const wave = Math.sin(t * 2 + gridItems[i].delay * 5);
        item.scale.setScalar(0.8 + wave * 0.2);
        item.position.z = wave * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {gridItems.map((item, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) itemsRef.current[i] = el; }}
          position={item.position}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <MeshWobbleMaterial
            color={i % 2 === 0 ? theme.primary : theme.accent}
            emissive={i % 2 === 0 ? theme.primary : theme.accent}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
            factor={0.3}
            speed={2}
          />
        </mesh>
      ))}
      
      {/* Connecting lines */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial 
          color={theme.primary} 
          transparent 
          opacity={0.03}
          wireframe
        />
      </mesh>
    </group>
  );
});

// CTA: Pulsing play orb with energy rings
const PlayOrb = memo(function PlayOrb({ theme }: { theme: SectionTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.1;
      coreRef.current.scale.setScalar(pulse);
    }
    
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = t * (0.3 + i * 0.1);
        ring.rotation.z = t * (0.2 - i * 0.05);
        const scale = 1 + Math.sin(t * 2 + i) * 0.1;
        ring.scale.setScalar(scale);
      }
    });
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Core sphere */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color={theme.primary}
            emissive={theme.primary}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            distort={0.2}
            speed={3}
          />
        </mesh>
        
        {/* Play triangle */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.3, 0, 0]}>
          <coneGeometry args={[0.8, 1.4, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Energy rings */}
        {[0, 1, 2].map((i) => (
          <mesh 
            key={i}
            ref={(el) => { if (el) ringsRef.current[i] = el; }}
          >
            <torusGeometry args={[2.5 + i * 0.8, 0.03, 16, 64]} />
            <meshBasicMaterial 
              color={theme.primary} 
              transparent 
              opacity={0.4 - i * 0.1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial 
            color={theme.primary} 
            transparent 
            opacity={0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
});

// Enhanced orbital rings
const OrbitalRings = memo(function OrbitalRings({ theme }: { theme: SectionTheme }) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (group1Ref.current) {
      group1Ref.current.rotation.x = t * 0.05;
      group1Ref.current.rotation.y = t * 0.03;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.x = t * 0.04;
      group2Ref.current.rotation.z = t * 0.035;
    }
    if (group3Ref.current) {
      group3Ref.current.rotation.y = t * 0.025;
      group3Ref.current.rotation.z = t * 0.02;
    }
  });

  return (
    <>
      <group ref={group1Ref}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[9, 0.02, 16, 100]} />
          <meshBasicMaterial 
            color={theme.primary} 
            transparent 
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      <group ref={group2Ref}>
        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[11, 0.015, 16, 100]} />
          <meshBasicMaterial 
            color={theme.secondary} 
            transparent 
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      <group ref={group3Ref}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 3]}>
          <torusGeometry args={[13, 0.01, 16, 100]} />
          <meshBasicMaterial 
            color={theme.accent} 
            transparent 
            opacity={0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
});

// Enhanced cosmic dust
const CosmicDust = memo(function CosmicDust({ theme }: { theme: SectionTheme }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color(theme.primary);
    const color2 = new THREE.Color(theme.accent);
    
    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const mixFactor = Math.random();
      const mixedColor = color1.clone().lerp(color2, mixFactor);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, [theme.primary, theme.accent]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    return geo;
  }, [particles]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    
    pointsRef.current.rotation.y = t * 0.01;
    pointsRef.current.rotation.x = t * 0.005;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.06} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});
