'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface HeroSectionProps {
  theme: SectionTheme;
}

export const HeroSection = memo(function HeroSection({ theme }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Content container with subtle backdrop for readability */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Glass card behind content */}
        <div 
          className="absolute -inset-8 sm:-inset-12 rounded-3xl backdrop-blur-sm"
          style={{ backgroundColor: `${theme.bg}60` }}
        />
        
        <div className="relative">
          <OpenSourceBadge theme={theme} />
          <Headline theme={theme} />
          <Subheadline theme={theme} />
          <CTAButtons theme={theme} />
          <QuickStats theme={theme} />
        </div>
      </motion.div>
      
      <ScrollHint theme={theme} />
    </section>
  );
});

const OpenSourceBadge = memo(function OpenSourceBadge({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
      style={{ 
        backgroundColor: `${theme.primary}25`,
        border: `1px solid ${theme.primary}50`,
      }}
    >
      <span className="relative flex h-2 w-2">
        <span 
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: theme.primary }}
        />
        <span 
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: theme.primary }}
        />
      </span>
      <span style={{ color: theme.text }} className="text-sm font-medium">
        100% Open Source • Free Forever
      </span>
    </motion.div>
  );
});

const Headline = memo(function Headline({ theme }: { theme: SectionTheme }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
      style={{ color: theme.text }}
    >
      <span className="block">
        <span style={{ color: theme.textMuted }}>Where</span>{' '}
        <span style={{ color: theme.accent }}>{'{'}</span>
        <span style={{ color: theme.text }}>code</span>
        <span style={{ color: theme.accent }}>{'}'}</span>
      </span>
      <span className="block mt-2">
        <span style={{ color: theme.textMuted }}>becomes</span>{' '}
        <span style={{ color: theme.primary }}>&lt;music/&gt;</span>
      </span>
    </motion.h1>
  );
});

const Subheadline = memo(function Subheadline({ theme }: { theme: SectionTheme }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 leading-relaxed"
      style={{ color: theme.textMuted }}
    >
      You've spent years mastering code. Now{' '}
      <span style={{ color: theme.text }} className="font-medium">make it sing</span>.
      Turn your logic into melodies, your algorithms into art.
    </motion.p>
  );
});

const CTAButtons = memo(function CTAButtons({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
    >
      <Link href="/studio" className="group w-full sm:w-auto">
        <motion.div 
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg"
          style={{ backgroundColor: theme.primary, color: theme.bg }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Start Creating</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </Link>

      <Link 
        href="#demo" 
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium w-full sm:w-auto transition-colors"
        style={{ 
          border: `2px solid ${theme.primary}60`,
          color: theme.text,
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
        <span>See it in Action</span>
      </Link>
    </motion.div>
  );
});

const STATS = [
  { value: '<1ms', label: 'Latency', icon: '⚡' },
  { value: '100%', label: 'Open Source', icon: '💚' },
  { value: '∞', label: 'Possibilities', icon: '🎵' },
];

const QuickStats = memo(function QuickStats({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-wrap justify-center gap-10"
    >
      {STATS.map((stat, i) => (
        <motion.div 
          key={stat.label} 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">{stat.icon}</span>
            <span 
              className="text-3xl font-bold"
              style={{ color: i === 0 ? theme.secondary : i === 1 ? theme.primary : theme.accent }}
            >
              {stat.value}
            </span>
          </div>
          <div 
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: theme.textMuted }}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

const ScrollHint = memo(function ScrollHint({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2"
        style={{ color: theme.textMuted }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
        <div 
          className="w-5 h-9 rounded-full flex justify-center pt-2"
          style={{ border: `1px solid ${theme.textMuted}50` }}
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});
