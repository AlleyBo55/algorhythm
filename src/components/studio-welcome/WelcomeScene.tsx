'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface WelcomeSceneProps {
  hovered: boolean;
  mousePosition?: { x: number; y: number };
}

export const WelcomeScene = memo(function WelcomeScene({ hovered, mousePosition = { x: 0, y: 0 } }: WelcomeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = t * 0.05 + mousePosition.x * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05 + mousePosition.y * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft ambient */}
      <ambientLight intensity={0.15} />
      
      {/* Key lights */}
      <spotLight 
        position={[8, 8, 5]} 
        intensity={1.5} 
        color="#10b981" 
        angle={0.5}
        penumbra={1}
        castShadow={false}
      />
      <spotLight 
        position={[-8, -5, 8]} 
        intensity={0.8} 
        color="#06b6d4" 
        angle={0.6}
        penumbra={1}
      />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#ffffff" />
      
      {/* Main glass torus - hero element */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <GlassTorus hovered={hovered} />
      </Float>
      
      {/* Orbiting geometric shapes */}
      <OrbitingShapes hovered={hovered} />
      
      {/* Floating grid plane */}
      <GridPlane />
      
      {/* Particle field */}
      <ParticleField hovered={hovered} />
      
      {/* Sound wave rings */}
      <SoundWaveRings hovered={hovered} />
    </group>
  );
});

// Glass torus with transmission material
const GlassTorus = memo(function GlassTorus({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.z = t * 0.15;
    
    const scale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
      innerRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <group>
      {/* Main glass torus */}
      <mesh ref={meshRef}>
        <torusGeometry args={[2, 0.6, 64, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.5}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#10b981"
          transmission={0.95}
          roughness={0.05}
          ior={1.5}
        />
      </mesh>
      
      {/* Inner icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>
    </group>
  );
});

// Orbiting geometric shapes
const OrbitingShapes = memo(function OrbitingShapes({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => [
    { type: 'octahedron', radius: 4, speed: 0.3, size: 0.25, color: '#10b981', offset: 0 },
    { type: 'tetrahedron', radius: 4.5, speed: -0.25, size: 0.2, color: '#06b6d4', offset: Math.PI * 0.5 },
    { type: 'dodecahedron', radius: 3.8, speed: 0.35, size: 0.18, color: '#f59e0b', offset: Math.PI },
    { type: 'icosahedron', radius: 4.2, speed: -0.2, size: 0.22, color: '#10b981', offset: Math.PI * 1.5 },
    { type: 'octahedron', radius: 5, speed: 0.15, size: 0.15, color: '#06b6d4', offset: Math.PI * 0.25 },
    { type: 'tetrahedron', radius: 5.2, speed: -0.18, size: 0.12, color: '#f59e0b', offset: Math.PI * 0.75 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <OrbitingShape key={i} {...shape} hovered={hovered} index={i} />
      ))}
    </group>
  );
});

interface OrbitingShapeProps {
  type: string;
  radius: number;
  speed: number;
  size: number;
  color: string;
  offset: number;
  hovered: boolean;
  index: number;
}

const OrbitingShape = memo(function OrbitingShape({ 
  type, radius, speed, size, color, offset, hovered, index 
}: OrbitingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const angle = t * speed + offset;
    
    meshRef.current.position.x = Math.cos(angle) * radius;
    meshRef.current.position.z = Math.sin(angle) * radius;
    meshRef.current.position.y = Math.sin(t * 0.5 + index) * 0.5;
    
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.y = t * 0.3;
    
    const scale = hovered ? size * 1.3 : size;
    meshRef.current.scale.setScalar(scale);
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[1, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      default: return <octahedronGeometry args={[1, 0]} />;
    }
  }, [type]);

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
});

// Floating grid plane
const GridPlane = memo(function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshBasicMaterial
        color="#10b981"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
});

// Particle field
const ParticleField = memo(function ParticleField({ hovered }: { hovered: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const emerald = new THREE.Color('#10b981');
    const cyan = new THREE.Color('#06b6d4');
    const amber = new THREE.Color('#f59e0b');
    const colorOptions = [emerald, cyan, amber];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6 + Math.random() * 8;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={hovered ? 0.06 : 0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Sound wave rings
const SoundWaveRings = memo(function SoundWaveRings({ hovered }: { hovered: boolean }) {
  const ringsRef = useRef<THREE.Group>(null);
  const ringMeshes = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    ringMeshes.current.forEach((ring, i) => {
      if (ring) {
        const wave = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5;
        const baseScale = 2.5 + i * 0.4;
        const scale = baseScale + (hovered ? wave * 0.3 : wave * 0.15);
        ring.scale.setScalar(scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - i * 0.15) * (hovered ? 0.25 : 0.15);
      }
    });
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={ringsRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringMeshes.current[i] = el; }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1, 1.02, 64]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
});
