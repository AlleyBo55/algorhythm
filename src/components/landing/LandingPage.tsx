'use client';

import { memo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLandingPage } from '@/hooks/useLandingPage';
import {
  Navigation,
  HeroSection,
  TrustedBySection,
  FeaturesSection,
  CodeShowcaseSection,
  TestimonialsSection,
  TechStackSection,
  PricingSection,
  CTASection,
  Footer,
  HeroScene,
} from './index';

export const LandingPage = memo(function LandingPage() {
  const { mounted, containerRef, scrollYProgress } = useLandingPage();

  return (
    <div ref={containerRef} className="relative bg-[#030303] min-h-screen">
      {/* WebGL Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <HeroScene scrollProgress={scrollYProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation mounted={mounted} />
        <HeroSection mounted={mounted} />
        <TrustedBySection />
        <FeaturesSection />
        <CodeShowcaseSection />
        <TestimonialsSection />
        <TechStackSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
});
