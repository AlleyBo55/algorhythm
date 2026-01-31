'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const CODE_EXAMPLE = `// 🎵 Future Bass Drop - Alan Walker Style
dj.bpm = 150;

const chords = [
  ['F4', 'A4', 'C5', 'E5'],   // Fmaj7
  ['G4', 'B4', 'D5', 'F5'],   // G7
  ['A4', 'C5', 'E5', 'G5'],   // Am7
  ['E4', 'G4', 'B4', 'D5'],   // Em7
];

dj.effects.reverb.set({ wet: 0.4, decay: 2.5 });

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  const chord = chords[bar % 4];

  if (beat % 4 === 0) {
    dj.sample('kick-808', { time, volume: -2 });
  }

  if (beat === 0 || beat === 6 || beat === 10) {
    dj.synth.triggerAttackRelease(chord, '8n', time);
  }

  tick++;
});`;

const FEATURES_LIST = [
  'Hot-reload without stopping playback',
  'Intelligent autocomplete for audio APIs',
  'Built-in visualizer synced to your code',
  'Export to WAV, MP3, or stream directly',
  'Version control your compositions',
];

export const CodeShowcaseSection = memo(function CodeShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="demo" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <CodeEditor isInView={isInView} />
          <Description isInView={isInView} />
        </div>
      </div>
    </section>
  );
});

const CodeEditor = memo(function CodeEditor({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative order-2 lg:order-1"
    >
      <div className="rounded-2xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0a] shadow-2xl shadow-black/50">
        <EditorChrome />
        <CodeContent code={CODE_EXAMPLE} />
      </div>
      <FloatingBadges />
    </motion.div>
  );
});

const EditorChrome = memo(function EditorChrome() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/50">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <span className="ml-4 text-sm text-zinc-500 font-mono">future-bass-drop.js</span>
      <div className="ml-auto">
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">Live</span>
      </div>
    </div>
  );
});

const CodeContent = memo(function CodeContent({ code }: { code: string }) {
  return (
    <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin">
      <pre className="text-zinc-300">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
});

const FloatingBadges = memo(function FloatingBadges() {
  return (
    <>
      <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full bg-emerald-500 text-black text-sm font-semibold shadow-lg shadow-emerald-500/30">
        ▶ Playing Live
      </div>
      <div className="absolute -top-4 -left-4 px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium backdrop-blur-sm">
        Hot Reload Active
      </div>
    </>
  );
});


const Description = memo(function Description({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="order-1 lg:order-2"
    >
      <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
        Live Coding
      </span>
      <h2 className="text-4xl sm:text-5xl font-extralight text-white mb-6 leading-tight">
        Code is your <span className="font-medium text-emerald-400">instrument</span>
      </h2>
      <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
        Write JavaScript that generates music in real-time. Every keystroke reflects instantly.
        No compile step. No waiting. Just pure creative flow.
      </p>

      <ul className="space-y-4 mb-10">
        {FEATURES_LIST.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-300">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-4">
        <Link href="/studio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
          <span>Try it now</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href="/docs/examples" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all">
          <span>View examples</span>
        </Link>
      </div>
    </motion.div>
  );
});

function highlightCode(code: string): string {
  return code
    .replace(/(\/\/.*)/g, '<span class="text-zinc-600">$1</span>')
    .replace(/('.*?')/g, '<span class="text-emerald-400">$1</span>')
    .replace(/\b(const|let|if|function)\b/g, '<span class="text-violet-400">$1</span>')
    .replace(/\b(dj)\b/g, '<span class="text-cyan-400">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');
}
