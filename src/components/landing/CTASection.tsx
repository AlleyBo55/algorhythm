'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface CTASectionProps {
  theme: SectionTheme;
}

const PRODUCER_PRESETS = [
  'Alan Walker', 'Marshmello', 'Daft Punk', 'Avicii', 
  'Deadmau5', 'Skrillex', 'The Weeknd', 'Hans Zimmer'
];

// Animated preset tag
const PresetTag = memo(function PresetTag({ 
  name, 
  index,
  theme,
  isInView,
}: { 
  name: string;
  index: number;
  theme: SectionTheme;
  isInView: boolean;
}) {
  return (
    <motion.span 
      className="group relative px-2 sm:px-5 py-1 sm:py-2.5 rounded-full text-[10px] sm:text-sm border border-white/10 text-white/50 cursor-default overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 200 }}
      whileHover={{ 
        borderColor: `${theme.primary}50`,
        color: 'rgba(255,255,255,0.9)',
      }}
    >
      {/* Hover gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}15 0%, transparent 100%)`,
        }}
      />
      <span className="relative">{name}</span>
    </motion.span>
  );
});

// Feature badge
const FeatureBadge = memo(function FeatureBadge({ 
  icon, 
  label, 
  desc, 
  index,
  theme,
  isInView,
}: { 
  icon: string;
  label: string;
  desc: string;
  index: number;
  theme: SectionTheme;
  isInView: boolean;
}) {
  return (
    <motion.div 
      className="group relative p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.7 + index * 0.1 }}
      whileHover={{ y: -4, borderColor: `${theme.primary}30` }}
    >
      {/* Hover gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}08 0%, transparent 100%)`,
        }}
      />
      
      <motion.div 
        className="text-lg sm:text-3xl mb-1 sm:mb-3 relative"
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {icon}
      </motion.div>
      <div className="text-[10px] sm:text-base font-semibold text-white relative">{label}</div>
      <div className="text-[9px] sm:text-sm text-white/40 relative">{desc}</div>
    </motion.div>
  );
});

export const CTASection = memo(function CTASection({ theme }: CTASectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative lg:min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-0">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section marker */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-4 sm:mb-6 lg:mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <motion.div 
            className="h-[1px] rounded-full hidden sm:block"
            style={{ backgroundColor: theme.primary }}
            initial={{ width: 0 }}
            animate={isInView ? { width: 40 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          <span 
            className="text-[10px] sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase"
            style={{ 
              color: theme.primary,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Get Started
          </span>
          <motion.div 
            className="h-[1px] rounded-full hidden sm:block"
            style={{ backgroundColor: theme.primary }}
            initial={{ width: 0 }}
            animate={isInView ? { width: 40 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          <h2 
            className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-[-0.03em] mb-4 sm:mb-6 lg:mb-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <motion.span 
              className="block text-white/30"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              Your code.
            </motion.span>
            <motion.span 
              className="block text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Your sound.
            </motion.span>
            <motion.span 
              className="block"
              style={{ color: theme.primary }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Your stage.
            </motion.span>
          </h2>

          <motion.p 
            className="text-sm sm:text-lg lg:text-xl text-white/50 max-w-lg mx-auto mb-6 sm:mb-8 lg:mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <span className="hidden sm:inline">Some things can't be said with words. </span>
            <span className="text-white font-medium">Let your algorithms speak.</span>
          </motion.p>
        </motion.div>

        {/* Producer presets - show fewer on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <p 
            className="text-[10px] sm:text-sm text-white/30 mb-3 sm:mb-4 lg:mb-5 uppercase tracking-wider"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Producer presets
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3">
            {PRODUCER_PRESETS.slice(0, 6).map((preset, index) => (
              <PresetTag 
                key={preset} 
                name={preset} 
                index={index}
                theme={theme}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 mb-6 sm:mb-10 lg:mb-16"
        >
          <Link href="/studio">
            <motion.button
              className="group relative w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-6 rounded-full font-semibold text-sm sm:text-xl text-black overflow-hidden"
              style={{ backgroundColor: theme.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated gradient on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                Launch Studio
                <motion.svg 
                  className="w-4 h-4 sm:w-6 sm:h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </span>
            </motion.button>
          </Link>

          <Link href="/docs">
            <motion.button
              className="group relative w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-6 rounded-full font-semibold text-sm sm:text-xl text-white border border-white/20 overflow-hidden"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5"
              />
              <span className="relative">Documentation</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: '💻', label: 'Browser-based', desc: 'No install' },
            { icon: '🆓', label: 'Free forever', desc: 'Open source' },
            { icon: '⚡', label: '<1ms latency', desc: 'Pro-grade' },
            { icon: '🎹', label: 'MIDI ready', desc: 'Use your gear' },
          ].map((item, index) => (
            <FeatureBadge 
              key={item.label} 
              {...item} 
              index={index}
              theme={theme}
              isInView={isInView}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer - hidden on mobile */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] hidden lg:block"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}15` }}
              whileHover={{ scale: 1.1 }}
            >
              <svg className="w-4 h-4" style={{ color: theme.primary }} viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="2" height="8" />
                <rect x="8" y="5" width="2" height="14" />
                <rect x="12" y="7" width="2" height="10" />
                <rect x="16" y="4" width="2" height="16" />
              </svg>
            </motion.div>
            <span 
              className="text-sm font-semibold text-white/60"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Algorhythm
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/30">
            <motion.a 
              href="https://github.com" 
              className="hover:text-white/60 transition-colors"
              whileHover={{ y: -2 }}
            >
              GitHub
            </motion.a>
            <span>MIT License</span>
            <span>2024</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
});
