'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface HeroSectionProps {
  theme: SectionTheme;
}

// Magnetic button component for Awwwards-level interaction
const MagneticButton = memo(function MagneticButton({ 
  children, 
  href, 
  variant = 'primary',
  theme,
}: { 
  children: React.ReactNode; 
  href: string;
  variant?: 'primary' | 'secondary';
  theme: SectionTheme;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (button) {
      button.style.transform = 'translate(0, 0)';
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <Link href={href}>
      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          relative inline-flex items-center justify-center px-10 py-5 rounded-full font-semibold text-lg
          transition-all duration-300 ease-out overflow-hidden group cursor-pointer
          ${isPrimary ? 'text-black' : 'text-white border border-white/20'}
        `}
        style={{ 
          backgroundColor: isPrimary ? theme.primary : 'transparent',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isPrimary 
              ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`
              : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
          }}
        />
        
        {/* Button text */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {isPrimary && (
            <motion.svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          )}
        </span>
      </motion.div>
    </Link>
  );
});

// Animated text reveal component
const TextReveal = memo(function TextReveal({ 
  children, 
  delay = 0,
  className = '',
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '100%', rotateX: -80 }}
        animate={isInView ? { y: 0, rotateX: 0 } : {}}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.span>
    </span>
  );
});

// Floating stat card with glassmorphism
const StatCard = memo(function StatCard({ 
  value, 
  label, 
  desc, 
  index,
  theme,
}: { 
  value: string; 
  label: string; 
  desc: string;
  index: number;
  theme: SectionTheme;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ 
        delay: 0.5 + index * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.3 } 
      }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: `${theme.primary}30` }}
      />
      
      <div className="relative flex items-center gap-6 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
        {/* Animated border gradient */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}20 0%, transparent 50%, ${theme.accent}10 100%)`,
          }}
        />
        
        {/* Value */}
        <div 
          className="relative text-4xl font-bold min-w-[90px] tracking-tight"
          style={{ 
            color: theme.primary,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {value}
        </div>
        
        {/* Labels */}
        <div className="relative">
          <div className="font-semibold text-white text-lg">{label}</div>
          <div className="text-sm text-white/40">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
});

export const HeroSection = memo(function HeroSection({ theme }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0">
      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left - Typography */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Eyebrow with animated line */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-4 mb-6 lg:mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div 
                className="h-[1px] rounded-full hidden sm:block"
                style={{ backgroundColor: theme.primary }}
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <span 
                className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase"
                style={{ 
                  color: theme.primary,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Code-First Music
              </span>
            </motion.div>

            {/* Main headline with staggered reveal */}
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-[-0.03em] mb-6 lg:mb-10"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <TextReveal delay={0.1}>Where</TextReveal>
              <span className="block">
                <TextReveal delay={0.2}>
                  <span style={{ color: theme.primary }}>{'{'}</span>
                  <span className="text-white">code</span>
                  <span style={{ color: theme.primary }}>{'}'}</span>
                </TextReveal>
              </span>
              <TextReveal delay={0.3}>becomes</TextReveal>
              <TextReveal delay={0.4}>
                <span style={{ color: theme.primary }}>&lt;music/&gt;</span>
              </TextReveal>
            </h1>

            {/* Subheadline */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-white/50 max-w-lg mx-auto lg:mx-0 mb-8 lg:mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Write JavaScript. Hear music. In real-time. 
              <span className="text-white font-medium"> The world's first code-based professional DJ platform.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <MagneticButton href="/studio" variant="primary" theme={theme}>
                Start Creating
              </MagneticButton>
              <MagneticButton href="/docs" variant="secondary" theme={theme}>
                Read Docs
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right - Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="space-y-5">
              {[
                { value: '<1ms', label: 'Latency', desc: 'Real-time audio processing' },
                { value: '30+', label: 'Instruments', desc: 'From kicks to orchestras' },
                { value: '4', label: 'Decks', desc: 'Professional mixing setup' },
                { value: '$0', label: 'Forever', desc: 'Open source & free' },
              ].map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} theme={theme} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile stats - shown only on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="lg:hidden mt-12 grid grid-cols-2 gap-3"
        >
          {[
            { value: '<1ms', label: 'Latency' },
            { value: '30+', label: 'Instruments' },
            { value: '4', label: 'Decks' },
            { value: '$0', label: 'Forever' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center"
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: theme.primary, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator with animation - hidden on mobile */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
        >
          <span 
            className="text-xs text-white/30 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Scroll
          </span>
          <motion.div
            className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
});
