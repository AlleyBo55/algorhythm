'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface FeaturesSectionProps {
  theme: SectionTheme;
}

const CAPABILITIES = [
  {
    label: 'Latency',
    value: '<1ms',
    detail: 'Instant response',
  },
  {
    label: 'Hot Reload',
    value: 'Live',
    detail: 'No restart needed',
  },
  {
    label: 'Effects',
    value: '12+',
    detail: 'Studio-grade DSP',
  },
  {
    label: 'MIDI',
    value: '128ch',
    detail: 'Full control',
  },
  {
    label: 'Creativity',
    value: '∞',
    detail: 'No limits',
  },
  {
    label: 'Export',
    value: 'HD',
    detail: 'WAV & MP3',
  },
];

export const FeaturesSection = memo(function FeaturesSection({ theme }: FeaturesSectionProps) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="relative max-w-5xl mx-auto w-full">
        {/* Main content - centered, minimal with glass backdrop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          {/* Glass backdrop - matching Hero section style */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-3xl backdrop-blur-sm"
            style={{ backgroundColor: `${theme.bg}60` }}
          />
          
          <div className="relative">
            <h2 
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
              style={{ color: theme.text }}
            >
              Your code.
              <br />
              <span style={{ color: theme.primary }}>Your sound.</span>
            </h2>
            
            <p 
              className="text-xl max-w-xl mx-auto leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Every function is a note. Every loop is a rhythm. 
              Every variable holds a universe of sound.
            </p>
          </div>
        </motion.div>

        {/* Specs bar - horizontal, clean */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          {/* Glass container */}
          <div 
            className="rounded-3xl p-8 backdrop-blur-xl"
            style={{ 
              background: `linear-gradient(180deg, ${theme.primary}08 0%, ${theme.bg}60 100%)`,
              border: `1px solid ${theme.primary}15`,
            }}
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-4">
              {CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                  className="text-center"
                >
                  <div 
                    className="text-3xl sm:text-4xl font-black mb-1"
                    style={{ color: theme.primary }}
                  >
                    {cap.value}
                  </div>
                  <div 
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: theme.text }}
                  >
                    {cap.label}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: theme.textMuted }}
                  >
                    {cap.detail}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
        </motion.div>
      </div>
    </section>
  );
});
