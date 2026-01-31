'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface CTASectionProps {
  theme: SectionTheme;
}

export const CTASection = memo(function CTASection({ theme }: CTASectionProps) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Subtle ambient glow */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${theme.primary}15 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Glass backdrop - matching Hero section style */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-3xl backdrop-blur-sm"
            style={{ backgroundColor: `${theme.bg}60` }}
          />
          
          <div className="relative">
            {/* The emotional hook */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg mb-8"
              style={{ color: theme.textMuted }}
            >
              Some things are hard to say with words.
            </motion.p>
            
            {/* The big statement */}
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-8"
              style={{ color: theme.text }}
            >
              Let your code
              <br />
              <span style={{ color: theme.primary }}>speak for you.</span>
            </h2>
            
            {/* The inspiration */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Every developer has a rhythm. A pattern. A flow state where logic becomes art. 
              <span style={{ color: theme.text }}> This is where that feeling becomes sound.</span>
            </motion.p>
            
            {/* Single powerful CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-16"
            >
              <Link href="/studio" className="group inline-block">
                <motion.div 
                  className="relative flex items-center justify-center gap-3 px-12 py-6 rounded-full font-bold text-xl"
                  style={{ backgroundColor: theme.primary, color: theme.bg }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Creating</span>
                  <motion.svg 
                    className="w-6 h-6" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </motion.svg>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Closing thought */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm italic"
              style={{ color: theme.textMuted }}
            >
              "The code you write today could be the song someone remembers forever."
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Minimal footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <svg className="w-2.5 h-2.5" style={{ color: theme.bg }} viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="8" width="2" height="8" rx="1" />
              <rect x="8" y="5" width="2" height="14" rx="1" />
              <rect x="12" y="7" width="2" height="10" rx="1" />
              <rect x="16" y="4" width="2" height="16" rx="1" />
              <rect x="20" y="9" width="2" height="6" rx="1" />
            </svg>
          </div>
          <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
            AlgoRhythm
          </span>
        </div>
      </motion.div>
    </section>
  );
});
