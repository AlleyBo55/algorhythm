'use client';

import { memo, Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import * as THREE from 'three';
import { useLandingPage, type SectionTheme, SECTION_THEMES } from '@/hooks/useLandingPage';
import {
  Navigation,
  HeroSection,
  FeaturesSection,
  CodeShowcaseSection,
  CTASection,
  HeroScene,
} from './index';

const SECTION_NAMES = ['Home', 'Code', 'Features', 'Start'] as const;

// Custom cursor component for Awwwards-level polish
const CustomCursor = memo(function CustomCursor({ theme }: { theme: SectionTheme }) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{ width: isHovering ? 60 : isClicking ? 8 : 12, height: isHovering ? 60 : isClicking ? 8 : 12 }}
          transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full border"
          style={{ borderColor: theme.primary }}
          animate={{ width: isHovering ? 80 : 40, height: isHovering ? 80 : 40, opacity: isHovering ? 0.8 : 0.3 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        />
      </motion.div>
    </>
  );
});

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
});

// Mobile 3D Scene - with section-specific shapes
const MobileHeroScene = memo(function MobileHeroScene({ theme, currentSection }: { theme: SectionTheme; currentSection: number }) {
  return (
    <>
      <fog attach="fog" args={['#000000', 15, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={theme.primary} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color={theme.accent} />
      
      {/* Section-specific shapes */}
      {currentSection === 0 && <MobileHeroOrb theme={theme} />}
      {currentSection === 1 && <MobileCodeShape theme={theme} />}
      {currentSection === 2 && <MobileFeatureGrid theme={theme} />}
      {currentSection === 3 && <MobilePlayOrb theme={theme} />}
      
      <MobileParticles theme={theme} />
    </>
  );
});

// Section 0: Hero - Morphing organic orb
const MobileHeroOrb = memo(function MobileHeroOrb({ theme }: { theme: SectionTheme }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.setScalar(scale * 3);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={[0, 0.5, 0]}>
        <mesh ref={glowRef}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={theme.primary} transparent opacity={0.1} />
        </mesh>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 12]} />
          <MeshDistortMaterial
            color={theme.primary}
            emissive={theme.primary}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            distort={0.35}
            speed={2.5}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshBasicMaterial color={theme.accent} transparent opacity={0.5} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[2.1, 2]} />
          <meshBasicMaterial color={theme.primary} wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  );
});

// Section 1: Code - Floating code brackets
const MobileCodeShape = memo(function MobileCodeShape({ theme }: { theme: SectionTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);
  
  const blocks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.4,
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
        <group position={[0, 0, 0]} scale={0.8}>
          <mesh position={[-1.5, 0, 0]}>
            <boxGeometry args={[0.12, 3, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-1.1, 1.4, 0]}>
            <boxGeometry args={[0.8, 0.12, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-1.1, -1.4, 0]}>
            <boxGeometry args={[0.8, 0.12, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.5, 0, 0]}>
            <boxGeometry args={[0.12, 3, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.1, 1.4, 0]}>
            <boxGeometry args={[0.8, 0.12, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.1, -1.4, 0]}>
            <boxGeometry args={[0.8, 0.12, 0.12]} />
            <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} />
          </mesh>
        </group>
      </Float>
    </group>
  );
});

// Section 2: Features - Animated grid of shapes
const MobileFeatureGrid = memo(function MobileFeatureGrid({ theme }: { theme: SectionTheme }) {
  const groupRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<THREE.Mesh[]>([]);
  
  const gridItems = useMemo(() => {
    const items = [];
    const cols = 4;
    const rows = 3;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        items.push({
          position: [
            (col - (cols - 1) / 2) * 2,
            (row - (rows - 1) / 2) * 1.8,
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
      groupRef.current.rotation.x = -0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    itemsRef.current.forEach((item, i) => {
      if (item) {
        const wave = Math.sin(t * 2 + gridItems[i].delay * 5);
        item.scale.setScalar(0.6 + wave * 0.15);
        item.position.z = wave * 0.3;
        item.rotation.y = t * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {gridItems.map((item, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) itemsRef.current[i] = el; }}
          position={item.position}
        >
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? theme.primary : theme.accent}
            emissive={i % 2 === 0 ? theme.primary : theme.accent}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
});

// Section 3: CTA - Pulsing play orb with rings
const MobilePlayOrb = memo(function MobilePlayOrb({ theme }: { theme: SectionTheme }) {
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
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.2, 24, 24]} />
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
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.2, 0, 0]}>
          <coneGeometry args={[0.5, 0.9, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Energy rings */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(el) => { if (el) ringsRef.current[i] = el; }}>
            <torusGeometry args={[2 + i * 0.6, 0.02, 16, 48]} />
            <meshBasicMaterial color={theme.primary} transparent opacity={0.4 - i * 0.1} />
          </mesh>
        ))}
        
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[3, 24, 24]} />
          <meshBasicMaterial color={theme.primary} transparent opacity={0.05} />
        </mesh>
      </group>
    </Float>
  );
});

// Simplified particles for mobile
const MobileParticles = memo(function MobileParticles({ theme }: { theme: SectionTheme }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color(theme.primary);
    const color2 = new THREE.Color(theme.accent);
    
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const mixedColor = color1.clone().lerp(color2, Math.random());
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
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
});

// Mobile Landing Page - scrollable version with 3D background
const MobileLandingPage = memo(function MobileLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate which section based on scroll
  const currentSection = useMemo(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return Math.min(Math.floor(scrollY / (vh * 0.7)), 3);
  }, [scrollY]);

  // Get theme for current section
  const currentTheme = useMemo(() => {
    const themes = [SECTION_THEMES.hero, SECTION_THEMES.code, SECTION_THEMES.features, SECTION_THEMES.cta];
    return themes[currentSection];
  }, [currentSection]);

  return (
    <div className="relative min-h-screen w-full bg-[#0D0D0D] overflow-x-hidden">
      <NoiseOverlay />
      
      {/* Fixed 3D background with section-specific shapes */}
      <div className="fixed inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }} 
          dpr={[1, 1.5]} 
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <MobileHeroScene theme={currentTheme} currentSection={currentSection} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Animated gradient overlay that changes with scroll */}
      <motion.div 
        className="fixed inset-0 z-[1] pointer-events-none"
        animate={{ 
          background: `radial-gradient(ellipse 100% 60% at 50% 30%, ${currentTheme.primary}20 0%, transparent 60%)`
        }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5">
        <motion.div 
          className="h-full"
          style={{ 
            backgroundColor: currentTheme.primary,
            width: `${Math.min((scrollY / (typeof window !== 'undefined' ? document.body.scrollHeight - window.innerHeight : 1)) * 100, 100)}%`
          }}
        />
      </div>
      
      <Navigation mounted={mounted} theme={currentTheme} goToSection={() => {}} />
      
      <div className="relative z-10">
        <HeroSection theme={SECTION_THEMES.hero} />
        <CodeShowcaseSection theme={SECTION_THEMES.code} />
        <FeaturesSection theme={SECTION_THEMES.features} />
        <CTASection theme={SECTION_THEMES.cta} />
      </div>
      
      {/* Mobile section dots indicator */}
      <MobileSectionDots scrollY={scrollY} />
    </div>
  );
});

// Mobile section dots navigation
const MobileSectionDots = memo(function MobileSectionDots({ scrollY }: { scrollY: number }) {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const currentSection = Math.min(Math.floor(scrollY / (vh * 0.7)), 3);
  const themes = [SECTION_THEMES.hero, SECTION_THEMES.code, SECTION_THEMES.features, SECTION_THEMES.cta];
  
  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: currentSection === i ? themes[i].primary : 'rgba(255,255,255,0.2)',
            scale: currentSection === i ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
});

// Desktop Landing Page - section-based navigation
const DesktopLandingPage = memo(function DesktopLandingPage() {
  const { mounted, containerRef, currentSection, theme, isTransitioning, goToSection } = useLandingPage();
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window;
    setShowCursor(!isTouchDevice);
    if (!isTouchDevice) document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = 'auto'; };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden" style={{ cursor: showCursor ? 'none' : 'auto' }}>
      {showCursor && mounted && <CustomCursor theme={theme} />}
      <NoiseOverlay />
      <motion.div className="fixed inset-0 z-0" animate={{ backgroundColor: theme.bg }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      <motion.div 
        className="fixed inset-0 z-[1] pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${theme.primary}25 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 100% 50%, ${theme.secondary}15 0%, transparent 40%), radial-gradient(ellipse 50% 30% at 0% 80%, ${theme.accent}10 0%, transparent 30%)` }}
        transition={{ duration: 1.2 }}
      />
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          animate={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)`, x: ['-20%', '10%', '-20%'], y: ['-30%', '-10%', '-30%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
          animate={{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`, x: ['20%', '-10%', '20%'], y: ['30%', '10%', '30%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <HeroScene currentSection={currentSection} theme={theme} />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10 h-full">
        <Navigation mounted={mounted} theme={theme} goToSection={goToSection} />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            {currentSection === 0 && <HeroSection theme={theme} />}
            {currentSection === 1 && <CodeShowcaseSection theme={theme} />}
            {currentSection === 2 && <FeaturesSection theme={theme} />}
            {currentSection === 3 && <CTASection theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <SectionNav currentSection={currentSection} goToSection={goToSection} theme={theme} isTransitioning={isTransitioning} />
      <SectionIndicator currentSection={currentSection} theme={theme} />
    </div>
  );
});

export const LandingPage = memo(function LandingPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return isMobile ? <MobileLandingPage /> : <DesktopLandingPage />;
});

interface SectionNavProps {
  currentSection: number;
  goToSection: (index: number) => void;
  theme: SectionTheme;
  isTransitioning: boolean;
}

const SectionNav = memo(function SectionNav({ currentSection, goToSection, theme, isTransitioning }: SectionNavProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-4">
        {SECTION_NAMES.map((name, i) => (
          <button key={name} onClick={() => !isTransitioning && goToSection(i)} disabled={isTransitioning} className="group relative flex items-center justify-end gap-4" aria-label={`Go to ${name} section`}>
            <motion.span className="text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" style={{ color: currentSection === i ? theme.primary : 'rgba(255,255,255,0.4)', fontFamily: "'Space Grotesk', sans-serif" }}>{name}</motion.span>
            <div className="relative w-8 h-[2px] overflow-hidden">
              <motion.div className="absolute inset-0 rounded-full" animate={{ backgroundColor: currentSection === i ? theme.primary : 'rgba(255,255,255,0.2)', scaleX: currentSection === i ? 1 : 0.5, originX: 1 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

const SectionIndicator = memo(function SectionIndicator({ currentSection, theme }: { currentSection: number; theme: SectionTheme }) {
  return (
    <div className="fixed left-8 bottom-8 z-50">
      <motion.div key={currentSection} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-6">
        <div className="relative w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div className="absolute left-0 top-0 h-full rounded-full" animate={{ width: `${((currentSection + 1) / 4) * 100}%`, backgroundColor: theme.primary }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span className="text-2xl font-light tabular-nums" style={{ color: theme.primary, fontFamily: "'Space Grotesk', sans-serif" }} key={currentSection} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{String(currentSection + 1).padStart(2, '0')}</motion.span>
          <span className="text-sm text-white/30">/</span>
          <span className="text-sm text-white/30">04</span>
        </div>
      </motion.div>
    </div>
  );
});
