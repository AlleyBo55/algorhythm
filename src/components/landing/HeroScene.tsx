'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  currentSection: number;
}

const COLORS = {
  green: '#1db954',
  cyan: '#22d3ee',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  white: '#ffffff',
};

// Section-specific color palettes
const SECTION_PALETTES = [
  { primary: COLORS.green, secondary: COLORS.cyan, accent: COLORS.purple },    // Hero
  { primary: COLORS.purple, secondary: COLORS.cyan, accent: COLORS.green },    // Code
  { primary: COLORS.orange, secondary: COLORS.pink, accent: COLORS.green },    // Features
  { primary: COLORS.green, secondary: COLORS.cyan, accent: COLORS.orange },    // CTA
];

const CODE_SNIPPETS = [
  { text: 'play()', color: COLORS.green },
  { text: 'synth.osc()', color: COLORS.cyan },
  { text: 'bpm: 128', color: COLORS.orange },
  { text: 'reverb(0.8)', color: COLORS.purple },
  { text: '♪ => { }', color: COLORS.pink },
  { text: 'beat.drop()', color: COLORS.green },
  { text: 'mix(A, B)', color: COLORS.cyan },
  { text: 'filter.lp()', color: COLORS.orange },
  { text: '<Audio />', color: COLORS.purple },
  { text: 'gain: 0.7', color: COLORS.pink },
  { text: 'loop(4)', color: COLORS.green },
  { text: 'fx.delay()', color: COLORS.cyan },
];

export const HeroScene = memo(function HeroScene({ currentSection }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Smooth rotation based on section
      const speeds = [0.001, 0.002, 0.0015, 0.001];
      groupRef.current.rotation.y += speeds[currentSection];
    }
  });

  const palette = SECTION_PALETTES[currentSection];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.1} />
      <DynamicLights currentSection={currentSection} palette={palette} />
      <CentralShape currentSection={currentSection} palette={palette} />
      <FloatingCode currentSection={currentSection} />
      <SpectrumRing currentSection={currentSection} palette={palette} />
      <OrbitingElements currentSection={currentSection} palette={palette} />
      <DynamicParticles currentSection={currentSection} palette={palette} />
    </group>
  );
});

// Dynamic lighting per section
const DynamicLights = memo(function DynamicLights({ 
  currentSection, 
  palette 
}: { 
  currentSection: number; 
  palette: typeof SECTION_PALETTES[0];
}) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.5) * 8;
      light1Ref.current.position.y = Math.cos(t * 0.3) * 5;
      light1Ref.current.color.set(palette.primary);
      light1Ref.current.intensity = 0.6 + Math.sin(t * 2) * 0.2;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4) * 10;
      light2Ref.current.position.z = Math.sin(t * 0.6) * 8;
      light2Ref.current.color.set(palette.secondary);
      light2Ref.current.intensity = 0.4 + Math.cos(t * 1.5) * 0.15;
    }
    if (light3Ref.current) {
      light3Ref.current.color.set(palette.accent);
      light3Ref.current.intensity = 0.3;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[10, 10, 10]} />
      <pointLight ref={light2Ref} position={[-10, -5, -10]} />
      <spotLight ref={light3Ref} position={[0, 15, 0]} angle={0.5} penumbra={1} />
    </>
  );
});


// Central morphing shape - different geometry per section
const CentralShape = memo(function CentralShape({ 
  currentSection, 
  palette 
}: { 
  currentSection: number; 
  palette: typeof SECTION_PALETTES[0];
}) {
  const meshRef = useRef<THREE.Points>(null);
  const count = 3000; // More particles for richer visuals
  const transitionProgress = useRef(0);
  const prevSection = useRef(currentSection);

  const positions = useMemo(() => new Float32Array(count * 3), []);
  const colors = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Smooth section transition
    if (prevSection.current !== currentSection) {
      transitionProgress.current = 0;
      prevSection.current = currentSection;
    }
    transitionProgress.current = Math.min(1, transitionProgress.current + 0.02);
    const ease = 1 - Math.pow(1 - transitionProgress.current, 3); // Ease out cubic

    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    const colArray = meshRef.current.geometry.attributes.color.array as Float32Array;
    
    const c1 = new THREE.Color(palette.primary);
    const c2 = new THREE.Color(palette.secondary);
    const c3 = new THREE.Color(palette.accent);

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 * 8;
      const phi = Math.acos(2 * (i / count) - 1);
      const idx = i * 3;
      
      let x = 0, y = 0, z = 0;

      if (currentSection === 0) {
        // Hero: Pulsing waveform sphere with audio-reactive feel
        const wave = Math.sin(theta * 6 + t * 2) * 0.5 + Math.sin(phi * 4 + t * 3) * 0.3;
        const r = (3 + wave) * (1 + Math.sin(t * 1.5) * 0.08);
        x = r * Math.sin(phi) * Math.cos(theta + t * 0.15);
        y = r * Math.sin(phi) * Math.sin(theta + t * 0.15);
        z = r * Math.cos(phi);
      } else if (currentSection === 1) {
        // Code: Terminal/cube with glitch matrix effect
        const cubeSize = 2.5;
        const face = Math.floor((i / count) * 6);
        const u = ((i * 7) % 100) / 100 - 0.5;
        const v = ((i * 13) % 100) / 100 - 0.5;
        
        if (face === 0) { x = cubeSize; y = u * cubeSize * 2; z = v * cubeSize * 2; }
        else if (face === 1) { x = -cubeSize; y = u * cubeSize * 2; z = v * cubeSize * 2; }
        else if (face === 2) { y = cubeSize; x = u * cubeSize * 2; z = v * cubeSize * 2; }
        else if (face === 3) { y = -cubeSize; x = u * cubeSize * 2; z = v * cubeSize * 2; }
        else if (face === 4) { z = cubeSize; x = u * cubeSize * 2; y = v * cubeSize * 2; }
        else { z = -cubeSize; x = u * cubeSize * 2; y = v * cubeSize * 2; }
        
        // Matrix rain effect
        y += Math.sin(t * 3 + i * 0.1) * 0.1;
        // Glitch
        if (Math.random() < 0.005) x += (Math.random() - 0.5) * 0.8;
      } else if (currentSection === 2) {
        // Features: MASSIVE exploding DNA helix / sound wave spiral
        const helixT = (i / count) * Math.PI * 8;
        const helixRadius = 4 + Math.sin(helixT * 2 + t) * 0.8;
        const strand = i % 2;
        const phaseOffset = strand * Math.PI;
        
        // Double helix structure
        x = Math.cos(helixT + phaseOffset + t * 0.5) * helixRadius;
        z = Math.sin(helixT + phaseOffset + t * 0.5) * helixRadius;
        y = ((i / count) - 0.5) * 12 + Math.sin(t * 2 + helixT) * 0.5;
        
        // Add connecting rungs between strands
        if (i % 20 < 5) {
          const rungProgress = (i % 20) / 5;
          const baseAngle = helixT + t * 0.5;
          x = Math.cos(baseAngle) * helixRadius * (1 - rungProgress) + 
              Math.cos(baseAngle + Math.PI) * helixRadius * rungProgress;
          z = Math.sin(baseAngle) * helixRadius * (1 - rungProgress) + 
              Math.sin(baseAngle + Math.PI) * helixRadius * rungProgress;
        }
        
        // Pulsing expansion
        const pulse = 1 + Math.sin(t * 3) * 0.15;
        x *= pulse;
        z *= pulse;
      } else {
        // CTA: EPIC infinity symbol / möbius strip with particles flowing through
        const mobT = theta * 2;
        const scale = 5; // Much bigger
        const twist = t * 0.3;
        
        // Möbius strip parametric equations
        const halfT = mobT / 2 + twist;
        const width = 1.5 + Math.sin(mobT * 4 + t * 2) * 0.3;
        const s = ((i % 50) / 50 - 0.5) * width;
        
        // Figure-8 / infinity base path
        const denom = 1 + Math.sin(mobT) * Math.sin(mobT);
        const baseX = Math.cos(mobT) / denom * scale;
        const baseZ = Math.sin(mobT) * Math.cos(mobT) / denom * scale;
        
        // Add twist and width
        x = baseX + s * Math.cos(halfT) * Math.cos(mobT) * 0.5;
        y = s * Math.sin(halfT) * 1.5 + Math.sin(t * 2 + mobT * 3) * 0.3;
        z = baseZ + s * Math.cos(halfT) * Math.sin(mobT) * 0.5;
        
        // Flowing particle effect
        const flow = (t * 2 + i * 0.01) % (Math.PI * 2);
        x += Math.sin(flow) * 0.2;
        z += Math.cos(flow) * 0.2;
      }

      // Apply transition easing
      const prevX = posArray[idx] || 0;
      const prevY = posArray[idx + 1] || 0;
      const prevZ = posArray[idx + 2] || 0;
      
      posArray[idx] = THREE.MathUtils.lerp(prevX, x, ease * 0.1 + 0.02);
      posArray[idx + 1] = THREE.MathUtils.lerp(prevY, y, ease * 0.1 + 0.02);
      posArray[idx + 2] = THREE.MathUtils.lerp(prevZ, z, ease * 0.1 + 0.02);

      // Dynamic color gradient based on position
      const colorMix = (Math.sin(theta + t) + 1) / 2;
      const color = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      colArray[idx] = THREE.MathUtils.lerp(c1.r, color.r, colorMix);
      colArray[idx + 1] = THREE.MathUtils.lerp(c1.g, color.g, colorMix);
      colArray[idx + 2] = THREE.MathUtils.lerp(c1.b, color.b, colorMix);
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });

  // Bigger particles for features and CTA sections
  const particleSize = currentSection >= 2 ? 0.05 : 0.04;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={particleSize} vertexColors transparent opacity={0.95} sizeAttenuation />
    </points>
  );
});

// Floating code snippets
const FloatingCode = memo(function FloatingCode({ currentSection }: { currentSection: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const snippetData = useMemo(() => {
    return CODE_SNIPPETS.map((_, i) => ({
      baseAngle: (i / CODE_SNIPPETS.length) * Math.PI * 2,
      baseRadius: 5 + (i % 3) * 1.2,
      baseY: (Math.random() - 0.5) * 3,
      floatSpeed: 0.8 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      const data = snippetData[i];
      
      // Section-based behavior
      let radius = data.baseRadius;
      let opacity = 0.5;
      let scale = 0.8;
      let rotSpeed = 0.08;

      switch (currentSection) {
        case 0:
          radius = data.baseRadius;
          opacity = 0.6;
          scale = 0.9;
          break;
        case 1:
          // Code section: expand and highlight
          radius = data.baseRadius + 2;
          opacity = 0.95;
          scale = 1.2;
          break;
        case 2:
          // Features: spread out wide, visible
          radius = data.baseRadius + 3;
          opacity = 0.7;
          scale = 1;
          rotSpeed = 0.12;
          break;
        default:
          // CTA: elegant orbit
          radius = data.baseRadius + 1;
          opacity = 0.8;
          scale = 1.1;
          rotSpeed = 0.06;
      }

      const angle = data.baseAngle + t * rotSpeed;
      child.position.x = Math.cos(angle) * radius;
      child.position.z = Math.sin(angle) * radius;
      child.position.y = data.baseY + Math.sin(t * data.floatSpeed + i) * 0.4;
      
      child.lookAt(0, child.position.y, 0);
      child.rotateY(Math.PI);
      child.scale.setScalar(scale);
      
      const mesh = child as THREE.Mesh;
      if (mesh.material && 'opacity' in mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {CODE_SNIPPETS.map((snippet, i) => (
        <Text
          key={i}
          fontSize={0.35}
          color={snippet.color}
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0.6}
        >
          {snippet.text}
        </Text>
      ))}
    </group>
  );
});

// Spectrum ring visualizer
const SpectrumRing = memo(function SpectrumRing({ 
  currentSection, 
  palette 
}: { 
  currentSection: number; 
  palette: typeof SECTION_PALETTES[0];
}) {
  const barsRef = useRef<THREE.Group>(null);
  const barCount = 80;

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => ({
      angle: (i / barCount) * Math.PI * 2,
      speed: 2 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!barsRef.current) return;
    const t = state.clock.elapsedTime;

    // Section-based visibility and intensity
    let baseRadius = 3.5;
    let heightMult = 1;
    let groupOpacity = 0.6;
    let yOffset = -2;
    let rotationSpeed = 0.08;

    if (currentSection === 0) {
      heightMult = 0.6;
      groupOpacity = 0.5;
    } else if (currentSection === 1) {
      heightMult = 0.4;
      groupOpacity = 0.3;
      yOffset = -3;
    } else if (currentSection === 2) {
      // Features: subtle accent ring, not overwhelming
      baseRadius = 5;
      heightMult = 0.8;
      groupOpacity = 0.5;
      yOffset = -3;
      rotationSpeed = 0.1;
    } else {
      // CTA: minimal, elegant surrounding
      baseRadius = 5.5;
      heightMult = 0.6;
      groupOpacity = 0.4;
      yOffset = -3;
      rotationSpeed = 0.05;
    }

    barsRef.current.position.y = yOffset;

    barsRef.current.children.forEach((bar, i) => {
      const { angle, speed, phase } = bars[i];
      
      const audioSim = Math.abs(Math.sin(t * speed + phase)) + 
                       Math.abs(Math.sin(t * speed * 0.6 + phase * 1.3)) * 0.4 +
                       Math.abs(Math.cos(t * speed * 0.3 + i * 0.1)) * 0.3;
      const height = (0.2 + audioSim * 1.5) * heightMult;
      
      bar.scale.y = height;
      bar.position.y = height / 2;
      
      const currentAngle = angle + t * rotationSpeed;
      bar.position.x = Math.cos(currentAngle) * baseRadius;
      bar.position.z = Math.sin(currentAngle) * baseRadius;
      bar.rotation.y = -currentAngle;

      const material = (bar as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = groupOpacity;
      material.emissiveIntensity = 0.3;
    });
  });

  const barColors = useMemo(() => {
    return bars.map((_, i) => {
      const colors = [palette.primary, palette.secondary, palette.accent];
      return colors[i % 3];
    });
  }, [bars, palette]);

  return (
    <group ref={barsRef}>
      {bars.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.08, 1, 0.04]} />
          <meshStandardMaterial
            color={barColors[i]}
            emissive={barColors[i]}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
});

// Orbiting code brackets and symbols
const OrbitingElements = memo(function OrbitingElements({ 
  currentSection, 
  palette 
}: { 
  currentSection: number; 
  palette: typeof SECTION_PALETTES[0];
}) {
  const groupRef = useRef<THREE.Group>(null);

  const elements = useMemo(() => [
    { text: '{', color: palette.secondary, radius: 4.5, speed: 0.3, yOffset: 1.5 },
    { text: '}', color: palette.secondary, radius: 4.5, speed: 0.3, yOffset: -1.5 },
    { text: '</', color: palette.accent, radius: 5, speed: -0.25, yOffset: 0 },
    { text: '>', color: palette.accent, radius: 5, speed: -0.25, yOffset: 0.5 },
    { text: '()', color: palette.primary, radius: 5.5, speed: 0.2, yOffset: -1 },
    { text: '=>', color: palette.primary, radius: 4, speed: -0.35, yOffset: 2 },
  ], [palette]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Section-based spread
    let spread = 1;
    let opacity = 0.5;
    let fontSize = 0.8;

    if (currentSection === 1) {
      spread = 1.3;
      opacity = 0.9;
      fontSize = 1;
    } else if (currentSection === 2) {
      // Features: bigger, more spread
      spread = 1.6;
      opacity = 0.85;
      fontSize = 1.2;
    } else if (currentSection === 3) {
      // CTA: elegant surrounding
      spread = 1.4;
      opacity = 0.9;
      fontSize = 1.1;
    }

    groupRef.current.children.forEach((child, i) => {
      const el = elements[i];
      const angle = t * el.speed + (i * Math.PI) / 3;
      
      child.position.x = Math.cos(angle) * el.radius * spread;
      child.position.z = Math.sin(angle) * el.radius * spread;
      child.position.y = el.yOffset * spread + Math.sin(t + i) * 0.3;
      
      child.lookAt(0, child.position.y, 0);
      child.rotateY(Math.PI);
      child.scale.setScalar(fontSize);

      const mesh = child as THREE.Mesh;
      if (mesh.material && 'opacity' in mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <Text
          key={i}
          fontSize={0.8}
          color={el.color}
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0.5}
        >
          {el.text}
        </Text>
      ))}
    </group>
  );
});

// Dynamic sparkle particles
const DynamicParticles = memo(function DynamicParticles({ 
  currentSection, 
  palette 
}: { 
  currentSection: number; 
  palette: typeof SECTION_PALETTES[0];
}) {
  const configs = [
    { count: 80, size: 1.2, speed: 0.1, scale: 18 },
    { count: 100, size: 0.8, speed: 0.15, scale: 15 },
    { count: 200, size: 2, speed: 0.25, scale: 25 },    // Features: MORE particles, BIGGER
    { count: 150, size: 1.8, speed: 0.15, scale: 22 },  // CTA: Elegant but prominent
  ];
  
  const config = configs[currentSection];

  return (
    <>
      <Sparkles 
        count={config.count} 
        scale={config.scale} 
        size={config.size} 
        speed={config.speed} 
        color={palette.primary} 
        opacity={currentSection >= 2 ? 0.7 : 0.5} 
      />
      <Sparkles 
        count={config.count / 2} 
        scale={config.scale * 0.8} 
        size={config.size * 0.7} 
        speed={config.speed * 0.7} 
        color={palette.secondary} 
        opacity={currentSection >= 2 ? 0.5 : 0.3} 
      />
      {/* Extra layer for features and CTA */}
      {currentSection >= 2 && (
        <Sparkles 
          count={config.count / 3} 
          scale={config.scale * 1.2} 
          size={config.size * 0.5} 
          speed={config.speed * 1.5} 
          color={palette.accent} 
          opacity={0.4} 
        />
      )}
    </>
  );
});
