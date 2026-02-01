'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface FeaturesSectionProps {
  theme: SectionTheme;
}

const FEATURES = [
  {
    category: 'DJ Engine',
    icon: '🎛️',
    items: [
      '4-Deck Professional Mixer',
      'Beat Sync & BPM Detection',
      'Hot Cues & Loop Controls',
      'Crossfader Curves',
      'Vinyl Mode & Scratching',
      'Waveform Display',
    ],
  },
  {
    category: 'Instruments',
    icon: '🎹',
    items: [
      '30+ Built-in Sounds',
      'Drums, Synths, Keys',
      'Producer Presets',
      'Custom Sound Design',
      'Orchestra & Strings',
      'Song-specific Presets',
    ],
  },
  {
    category: 'Effects',
    icon: '✨',
    items: [
      'Studio-grade Reverb',
      'Stereo Delay',
      'LP/HP/BP Filters',
      'Distortion & Bitcrusher',
      'Chorus & Phaser',
      'Auto-filter',
    ],
  },
  {
    category: 'Pro Tools',
    icon: '⚡',
    items: [
      'MIDI Support (128 ch)',
      'Recording & Export',
      'Key Detection',
      'Time Stretching',
      'Automation',
      'Real-time Visualizer',
    ],
  },
];

// Feature card with hover effects
const FeatureCard = memo(function FeatureCard({ 
  feature, 
  index,
  theme,
  isInView,
}: { 
  feature: typeof FEATURES[0];
  index: number;
  theme: SectionTheme;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Glow on hover */}
      <div 
        className="absolute -inset-1 rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: `${theme.primary}20` }}
      />
      
      <div className="relative p-3 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden h-full">
        {/* Gradient overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}08 0%, transparent 50%, ${theme.accent}05 100%)`,
          }}
        />
        
        {/* Icon */}
        <motion.div 
          className="text-xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4 lg:mb-6"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {feature.icon}
        </motion.div>
        
        {/* Category title */}
        <h3 
          className="text-xs sm:text-base lg:text-xl font-bold mb-2 sm:mb-4 lg:mb-6 relative"
          style={{ 
            color: theme.primary,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {feature.category}
        </h3>
        
        {/* Items list - show only 3 on mobile */}
        <ul className="space-y-1 sm:space-y-2 lg:space-y-3 relative">
          {feature.items.slice(0, 3).map((item, i) => (
            <motion.li 
              key={item} 
              className="flex items-start gap-1.5 sm:gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1 + i * 0.05 }}
            >
              <motion.div 
                className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full mt-1 sm:mt-1.5 lg:mt-2 flex-shrink-0"
                style={{ backgroundColor: theme.primary }}
                whileHover={{ scale: 2 }}
              />
              <span className="text-[9px] sm:text-xs lg:text-sm text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
});

// Animated stat counter
const StatCounter = memo(function StatCounter({ 
  value, 
  label, 
  index,
  theme,
  isInView,
}: { 
  value: string; 
  label: string;
  index: number;
  theme: SectionTheme;
  isInView: boolean;
}) {
  return (
    <motion.div 
      className="text-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6 + index * 0.1 }}
    >
      <motion.div 
        className="text-xl sm:text-4xl lg:text-5xl font-bold mb-0.5 sm:mb-1 lg:mb-2 tabular-nums"
        style={{ 
          color: theme.primary,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {value}
      </motion.div>
      <div className="text-[9px] sm:text-xs lg:text-sm text-white/40 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
});

export const FeaturesSection = memo(function FeaturesSection({ theme }: FeaturesSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="relative lg:min-h-screen flex items-center overflow-hidden py-12 sm:py-16 lg:py-0">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-6 sm:mb-10 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section label */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-4 sm:mb-6 lg:mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="h-[1px] rounded-full hidden sm:block"
              style={{ backgroundColor: theme.primary }}
              initial={{ width: 0 }}
              animate={isInView ? { width: 40 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <span 
              className="text-[10px] sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase"
              style={{ 
                color: theme.primary,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Capabilities
            </span>
            <motion.div 
              className="h-[1px] rounded-full hidden sm:block"
              style={{ backgroundColor: theme.primary }}
              initial={{ width: 0 }}
              animate={isInView ? { width: 40 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>

          <h2 
            className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-[-0.03em] mb-2 sm:mb-4 lg:mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <motion.span 
              className="block text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              Everything a
            </motion.span>
            <motion.span 
              className="block"
              style={{ color: theme.primary }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              pro needs.
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-sm sm:text-lg lg:text-xl text-white/50 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            From bedroom producer to festival stage.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-10 lg:mb-16">
          {FEATURES.map((feature, index) => (
            <FeatureCard 
              key={feature.category} 
              feature={feature} 
              index={index}
              theme={theme}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Stats row - show only 3 on mobile */}
        <motion.div 
          className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-16 justify-items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: '30+', label: 'Sounds' },
            { value: '8', label: 'Effects' },
            { value: '4', label: 'Decks' },
          ].map((stat, index) => (
            <StatCounter 
              key={stat.label} 
              value={stat.value}
              label={stat.label}
              index={index}
              theme={theme}
              isInView={isInView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});
