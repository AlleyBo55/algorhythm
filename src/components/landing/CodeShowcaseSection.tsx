'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface CodeShowcaseSectionProps {
  theme: SectionTheme;
}

const CODE_LINES = [
  { text: '// 🎵 Future Bass Drop', type: 'comment' },
  { text: 'dj.bpm = 150;', type: 'code' },
  { text: '', type: 'empty' },
  { text: 'const chords = [', type: 'code' },
  { text: "  ['F4', 'A4', 'C5'],", type: 'code' },
  { text: "  ['G4', 'B4', 'D5'],", type: 'code' },
  { text: "  ['A4', 'C5', 'E5'],", type: 'code' },
  { text: '];', type: 'code' },
  { text: '', type: 'empty' },
  { text: 'dj.effects.reverb.set({', type: 'code' },
  { text: '  wet: 0.4, decay: 2.5', type: 'code' },
  { text: '});', type: 'code' },
  { text: '', type: 'empty' },
  { text: "dj.loop('16n', (time) => {", type: 'code' },
  { text: '  const beat = tick % 16;', type: 'code' },
  { text: '  if (beat % 4 === 0) {', type: 'code' },
  { text: "    dj.sample('kick-808');", type: 'code' },
  { text: '  }', type: 'code' },
  { text: '});', type: 'code' },
];

const FEATURES = [
  { text: 'Change your code, hear it live — zero interruption', icon: '🔥' },
  { text: 'Autocomplete that speaks your musical language', icon: '✨' },
  { text: 'Watch your sound come alive in real-time', icon: '📊' },
  { text: 'Share your creation with the world, any format', icon: '📤' },
];

export const CodeShowcaseSection = memo(function CodeShowcaseSection({ theme }: CodeShowcaseSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <CodeEditor theme={theme} />
          <Description theme={theme} />
        </div>
      </div>
    </section>
  );
});

const CodeEditor = memo(function CodeEditor({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative order-2 lg:order-1"
    >
      {/* Editor container */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          backgroundColor: `${theme.bg}`,
          border: `1px solid ${theme.primary}30`,
        }}
      >
        {/* Chrome */}
        <div 
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ 
            backgroundColor: `${theme.bg}`,
            borderColor: `${theme.primary}20`,
          }}
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
              future-bass.js
            </span>
          </div>
          <span 
            className="px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{ backgroundColor: `${theme.primary}30`, color: theme.primary }}
          >
            ▶ Live
          </span>
        </div>

        {/* Code content - all lines visible, staggered fade in */}
        <div className="p-5 font-mono text-sm leading-relaxed max-h-[380px] overflow-hidden">
          <pre style={{ color: theme.text }}>
            {CODE_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex"
              >
                <span 
                  className="w-7 select-none text-right pr-4 text-xs"
                  style={{ color: theme.textMuted }}
                >
                  {line.type !== 'empty' ? i + 1 : ''}
                </span>
                <span dangerouslySetInnerHTML={{ __html: highlightLine(line.text, theme) }} />
              </motion.div>
            ))}
          </pre>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-t text-xs"
          style={{ 
            backgroundColor: `${theme.bg}`,
            borderColor: `${theme.primary}20`,
            color: theme.textMuted,
          }}
        >
          <div className="flex items-center gap-4">
            <span>JavaScript</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.primary }}
            />
            <span>Connected</span>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute -bottom-3 -right-3 px-4 py-2 rounded-full text-sm font-semibold shadow-xl"
        style={{ backgroundColor: theme.primary, color: theme.bg }}
      >
        ▶ Playing Live
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute -top-3 -left-3 px-3 py-1.5 rounded-lg text-xs font-medium"
        style={{ 
          backgroundColor: theme.bg, 
          border: `1px solid ${theme.primary}50`, 
          color: theme.primary,
        }}
      >
        Hot Reload Active
      </motion.div>
    </motion.div>
  );
});

const Description = memo(function Description({ theme }: { theme: SectionTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      className="order-1 lg:order-2"
    >
      {/* Glass backdrop */}
      <div 
        className="absolute -inset-6 rounded-2xl backdrop-blur-sm -z-10"
        style={{ backgroundColor: `${theme.bg}70` }}
      />
      
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
        style={{ 
          backgroundColor: `${theme.primary}25`, 
          border: `1px solid ${theme.primary}40`,
        }}
      >
        <span 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: theme.primary }}
        />
        <span className="text-sm font-medium" style={{ color: theme.primary }}>
          Live Coding
        </span>
      </motion.div>
      
      {/* Headline */}
      <h2 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight"
        style={{ color: theme.text }}
      >
        <span style={{ color: theme.textMuted }}>Think it.</span>
        <br />
        <span style={{ color: theme.primary }}>Play it.</span>
        <br />
        <span style={{ color: theme.secondary }}>Instantly.</span>
      </h2>
      
      {/* Description */}
      <p 
        className="text-lg mb-8 leading-relaxed max-w-lg"
        style={{ color: theme.textMuted }}
      >
        The moment you type, the music plays. No barriers. No waiting. 
        <span style={{ color: theme.text }}> Your ideas deserve to be heard the second they're born.</span>
      </p>

      {/* Features list */}
      <ul className="space-y-4 mb-10">
        {FEATURES.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            className="flex items-center gap-4"
            style={{ color: theme.text }}
          >
            <span 
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              {item.icon}
            </span>
            <span className="text-base">{item.text}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/studio" 
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: theme.primary, color: theme.bg }}
        >
          <span>Make Your First Beat</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link 
          href="/docs/examples" 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-colors"
          style={{ 
            border: `2px solid ${theme.primary}50`,
            color: theme.text,
          }}
        >
          <span>See What's Possible</span>
        </Link>
      </div>
    </motion.div>
  );
});

function highlightLine(code: string, theme: SectionTheme): string {
  if (!code) return '&nbsp;';
  
  return code
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/.*)/g, `<span style="color:${theme.textMuted}">$1</span>`)
    .replace(/('.*?')/g, `<span style="color:${theme.primary}">$1</span>`)
    .replace(/\b(const|let|if|function)\b/g, `<span style="color:${theme.accent}">$1</span>`)
    .replace(/\b(dj)\b/g, `<span style="color:${theme.secondary}">$1</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${theme.secondary}">$1</span>`);
}
