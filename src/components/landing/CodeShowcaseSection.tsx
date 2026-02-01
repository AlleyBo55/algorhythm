'use client';

import { memo, useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface CodeShowcaseSectionProps {
  theme: SectionTheme;
}

const CODE_LINES = [
  { text: '// Create a Future Bass drop in 10 lines', type: 'comment' },
  { text: 'dj.bpm = 150;', type: 'code' },
  { text: '', type: 'empty' },
  { text: 'const chords = [', type: 'code' },
  { text: "  ['F#4', 'A4', 'C#5'],", type: 'string' },
  { text: "  ['D4', 'F#4', 'A4'],", type: 'string' },
  { text: "  ['E4', 'G#4', 'B4'],", type: 'string' },
  { text: '];', type: 'code' },
  { text: '', type: 'empty' },
  { text: "dj.loop('4n', (time, tick) => {", type: 'code' },
  { text: "  dj.supersaw.play(chords[tick % 3], '2n');", type: 'code' },
  { text: '', type: 'empty' },
  { text: '  if (tick % 4 === 0) {', type: 'code' },
  { text: '    dj.kick.trigger();', type: 'code' },
  { text: '    dj.effects.sidechain(0.8);', type: 'code' },
  { text: '  }', type: 'code' },
  { text: '});', type: 'code' },
];

// Typewriter effect for code
const TypewriterCode = memo(function TypewriterCode({ 
  lines, 
  theme,
  isInView,
}: { 
  lines: typeof CODE_LINES;
  theme: SectionTheme;
  isInView: boolean;
}) {
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    const currentLine = lines[displayedLines];
    if (!currentLine) return;
    
    if (currentChar < currentLine.text.length) {
      const timeout = setTimeout(() => {
        setCurrentChar(c => c + 1);
      }, 20 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else if (displayedLines < lines.length - 1) {
      const timeout = setTimeout(() => {
        setDisplayedLines(l => l + 1);
        setCurrentChar(0);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [displayedLines, currentChar, lines, isInView]);

  const highlightLine = (text: string, type: string) => {
    if (type === 'comment') {
      return <span className="text-white/30">{text}</span>;
    }
    if (type === 'empty') {
      return <span>&nbsp;</span>;
    }
    
    // Syntax highlighting
    let highlighted = text
      .replace(/('.*?')/g, `<span style="color:${theme.primary}">$1</span>`)
      .replace(/\b(const|let|if|function)\b/g, '<span style="color:#A855F7">$1</span>')
      .replace(/\b(dj)\b/g, `<span style="color:${theme.primary}">$1</span>`)
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#FFE66D">$1</span>')
      .replace(/(\/\/.*)$/g, '<span style="color:rgba(255,255,255,0.3)">$1</span>');
    
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-8 text-right pr-4 text-white/20 select-none tabular-nums">
            {i + 1}
          </span>
          <span className="text-white/80">
            {i < displayedLines 
              ? highlightLine(line.text, line.type)
              : i === displayedLines 
                ? highlightLine(line.text.slice(0, currentChar), line.type)
                : null
            }
            {i === displayedLines && (
              <motion.span
                className="inline-block w-2 h-4 ml-0.5 align-middle"
                style={{ backgroundColor: theme.primary }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
});

// Audio visualizer bars
const AudioVisualizer = memo(function AudioVisualizer({ theme }: { theme: SectionTheme }) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full origin-bottom"
          style={{ backgroundColor: theme.primary }}
          animate={{ 
            scaleY: [0.2, 0.4 + Math.sin(i * 0.3) * 0.6, 0.2],
          }}
          transition={{ 
            duration: 0.6 + (i % 5) * 0.15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03,
          }}
          initial={{ height: 24 }}
        />
      ))}
    </div>
  );
});

// Feature item with icon
const FeatureItem = memo(function FeatureItem({ 
  label, 
  desc, 
  index,
  theme,
}: { 
  label: string; 
  desc: string;
  index: number;
  theme: SectionTheme;
}) {
  return (
    <motion.div 
      className="flex items-center gap-4 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
    >
      <motion.div 
        className="w-2 h-2 rounded-full transition-transform group-hover:scale-150"
        style={{ backgroundColor: theme.primary }}
      />
      <span className="text-white font-medium">{label}</span>
      <span className="text-white/30">—</span>
      <span className="text-white/40">{desc}</span>
    </motion.div>
  );
});

export const CodeShowcaseSection = memo(function CodeShowcaseSection({ theme }: CodeShowcaseSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden py-20 lg:py-0">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            {/* Section label */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-4 mb-6 lg:mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
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
                className="text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase"
                style={{ 
                  color: theme.primary,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Live Coding
              </span>
            </motion.div>

            {/* Headline */}
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-[-0.03em] mb-6 lg:mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
              >
                Type.
              </motion.span>
              <motion.span 
                className="block"
                style={{ color: theme.primary }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                Hear.
              </motion.span>
              <motion.span 
                className="block text-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                Instantly.
              </motion.span>
            </h2>

            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-white/50 max-w-md mx-auto lg:mx-0 mb-8 lg:mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Every keystroke becomes sound. No compile step. No waiting. 
              <span className="text-white font-medium"> Your code executes in real-time</span> with sub-millisecond latency.
            </motion.p>

            {/* Features list - hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:block space-y-3 lg:space-y-4 mb-8 lg:mb-10">
              {[
                { label: 'Hot Reload', desc: 'Change code while music plays' },
                { label: 'Autocomplete', desc: 'Intelligent audio API suggestions' },
                { label: 'Visualizer', desc: 'See your sound in real-time' },
                { label: 'Export', desc: 'WAV, MP3, or stream directly' },
              ].map((item, i) => (
                <FeatureItem key={item.label} {...item} index={i} theme={theme} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="flex justify-center lg:justify-start"
            >
              <Link href="/studio">
                <motion.button
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg overflow-hidden"
                  style={{ 
                    border: `1px solid ${theme.primary}`,
                    color: theme.primary,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: `${theme.primary}15` }}
                  />
                  <span className="relative flex items-center gap-2">
                    Try it now
                    <motion.svg 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
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
            </motion.div>
          </motion.div>

          {/* Right - Code block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Multi-layered glow effect */}
              <div 
                className="absolute -inset-8 rounded-3xl opacity-30 blur-3xl"
                style={{ backgroundColor: theme.primary }}
              />
              <div 
                className="absolute -inset-4 rounded-3xl opacity-20 blur-xl"
                style={{ backgroundColor: theme.accent }}
              />
              
              {/* Code container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span 
                      className="text-xs font-semibold tracking-wider"
                      style={{ 
                        color: theme.primary,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Code with typewriter effect */}
                <div className="p-6 min-h-[380px]">
                  <TypewriterCode lines={CODE_LINES} theme={theme} isInView={isInView} />
                </div>

                {/* Audio visualizer footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <span 
                      className="text-xs text-white/40 uppercase tracking-wider"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Output
                    </span>
                    <AudioVisualizer theme={theme} />
                    <motion.div 
                      className="w-3 h-3 rounded-full ml-auto"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ 
                        boxShadow: [
                          `0 0 8px ${theme.primary}`,
                          `0 0 20px ${theme.primary}`,
                          `0 0 8px ${theme.primary}`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="lg:hidden mt-10 grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Hot Reload', icon: '🔄' },
            { label: 'Autocomplete', icon: '⚡' },
            { label: 'Visualizer', icon: '📊' },
            { label: 'Export', icon: '💾' },
          ].map((item) => (
            <div 
              key={item.label}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-white/60">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
