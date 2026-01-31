'use client';

import { memo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandingPage, type SectionTheme } from '@/hooks/useLandingPage';
import {
  Navigation,
  HeroSection,
  FeaturesSection,
  CodeShowcaseSection,
  CTASection,
  HeroScene,
} from './index';

const SECTION_NAMES = ['hero', 'code', 'features', 'cta'] as const;

export const LandingPage = memo(function LandingPage() {
  const { mounted, containerRef, currentSection, theme, isTransitioning, goToSection } = useLandingPage();

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-screen overflow-hidden"
    >
      {/* Solid background that transitions */}
      <motion.div 
        className="fixed inset-0 z-0"
        animate={{ backgroundColor: theme.bg }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* WebGL 3D Scene - fullscreen, centered, behind content */}
      <motion.div 
        className="fixed inset-0 z-[1] pointer-events-none"
        animate={{ 
          opacity: 1,
          scale: 1, // Keep full scale for all sections
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <HeroScene currentSection={currentSection} />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Section content */}
      <div className="relative z-10 h-full">
        <Navigation mounted={mounted} theme={theme} goToSection={goToSection} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full"
          >
            {currentSection === 0 && <HeroSection theme={theme} />}
            {currentSection === 1 && <CodeShowcaseSection theme={theme} />}
            {currentSection === 2 && <FeaturesSection theme={theme} />}
            {currentSection === 3 && <CTASection theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section navigation dots */}
      <SectionDots 
        currentSection={currentSection} 
        goToSection={goToSection} 
        theme={theme}
        isTransitioning={isTransitioning}
      />

      {/* Section indicator */}
      <SectionIndicator currentSection={currentSection} theme={theme} />
    </div>
  );
});

interface SectionDotsProps {
  currentSection: number;
  goToSection: (index: number) => void;
  theme: SectionTheme;
  isTransitioning: boolean;
}

const SectionDots = memo(function SectionDots({ currentSection, goToSection, theme, isTransitioning }: SectionDotsProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {SECTION_NAMES.map((name, i) => (
        <button
          key={name}
          onClick={() => !isTransitioning && goToSection(i)}
          disabled={isTransitioning}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${name} section`}
        >
          {/* Label */}
          <motion.span 
            className="absolute right-8 opacity-0 group-hover:opacity-100 text-xs capitalize whitespace-nowrap font-medium"
            style={{ color: theme.text }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.span>
          
          {/* Dot */}
          <motion.div
            className="w-3 h-3 rounded-full border-2 transition-all duration-300"
            style={{
              backgroundColor: currentSection === i ? theme.primary : 'transparent',
              borderColor: currentSection === i ? theme.primary : `${theme.text}50`,
            }}
          />
        </button>
      ))}
    </div>
  );
});

const SectionIndicator = memo(function SectionIndicator({ currentSection, theme }: { currentSection: number; theme: SectionTheme }) {
  const labels = ['01', '02', '03', '04'];
  
  return (
    <div className="fixed left-6 bottom-6 z-50">
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <motion.div 
          className="w-8 h-0.5"
          style={{ backgroundColor: theme.primary }}
        />
        <span 
          className="text-xs font-mono tracking-widest"
          style={{ color: theme.text }}
        >
          {labels[currentSection]} / 04
        </span>
      </motion.div>
    </div>
  );
});
