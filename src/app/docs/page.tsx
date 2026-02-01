'use client';

import { motion } from 'framer-motion';
import { CodeBlock, InlineCode } from '@/components/docs';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Getting Started</span>
        </div>
        <h1 
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Documentation
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Create music with code. Algorhythm gives you a powerful DJ API with 30+ instruments, 
          real-time effects, and professional mixing capabilities.
        </p>
      </motion.div>

      {/* Quick Start */}
      <Section title="Quick Start" delay={0.1}>
        <div className="space-y-4">
          <Step number={1} title="Initialize Audio">
            Click <InlineCode>Start Session</InlineCode> on the welcome screen to initialize the audio engine.
          </Step>
          
          <Step number={2} title="Write Your Code">
            Use the code editor to write music. The <InlineCode>dj</InlineCode> object is your main interface.
          </Step>
          
          <Step number={3} title="Run">
            Press <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> to execute your code and hear the result.
          </Step>
        </div>
      </Section>

      {/* Basic Example */}
      <Section title="Your First Beat" delay={0.2}>
        <p className="text-sm text-white/50 mb-4">
          Here&apos;s a simple 4-on-the-floor beat to get you started:
        </p>
        
        <CodeBlock filename="basic-beat.ts">{`// Set tempo to 128 BPM
dj.bpm = 128;

// Track position in the loop
let tick = 0;

// Start a 16th note loop
dj.loop('16n', (time) => {
  // Kick on every beat (every 4 ticks)
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat on offbeats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Snare on beats 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Core Concepts Grid */}
      <Section title="Core Concepts" delay={0.3}>
        <div className="grid sm:grid-cols-2 gap-3">
          <ConceptCard 
            title="BPM" 
            code="dj.bpm = 128"
            description="Set the global tempo. All loops sync to this."
          />
          <ConceptCard 
            title="Loops" 
            code="dj.loop('16n', fn)"
            description="Create timed loops at musical intervals."
          />
          <ConceptCard 
            title="Instruments" 
            code="dj.kick, dj.snare"
            description="30+ instruments from drums to synths."
          />
          <ConceptCard 
            title="Time" 
            code="time parameter"
            description="Use the time param for precise scheduling."
          />
        </div>
      </Section>

      {/* Time Notation */}
      <Section title="Time Notation" delay={0.4}>
        <p className="text-sm text-white/50 mb-4">
          Algorhythm uses musical time notation for loops and note durations:
        </p>
        
        <div className="overflow-hidden rounded-lg border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/40 text-xs uppercase tracking-wider">Notation</th>
                <th className="px-4 py-3 text-left font-medium text-white/40 text-xs uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left font-medium text-white/40 text-xs uppercase tracking-wider hidden sm:table-cell">At 120 BPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              <TimeRow notation="1m" desc="1 measure (4 beats)" ms="2000ms" />
              <TimeRow notation="2n" desc="Half note (2 beats)" ms="1000ms" />
              <TimeRow notation="4n" desc="Quarter note (1 beat)" ms="500ms" />
              <TimeRow notation="8n" desc="Eighth note" ms="250ms" />
              <TimeRow notation="16n" desc="Sixteenth note" ms="125ms" />
              <TimeRow notation="32n" desc="Thirty-second note" ms="62.5ms" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Available Instruments Preview */}
      <Section title="Instruments" delay={0.5}>
        <p className="text-sm text-white/50 mb-4">
          Algorhythm includes 30+ instruments, from basic drums to song-specific synths:
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['kick', 'snare', 'hihat', 'clap', 'bass', 'lead', 'pad', 'piano', 'supersaw', 'fadedPiano', 'levelsPiano', 'wobbleBass'].map((inst) => (
            <div 
              key={inst}
              className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <code className="text-xs text-emerald-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                dj.{inst}
              </code>
            </div>
          ))}
        </div>
        
        <Link 
          href="/docs/instruments"
          className="inline-flex items-center gap-2 mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View all instruments</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </Section>

      {/* Next Steps */}
      <Section title="Next Steps" delay={0.6}>
        <div className="grid sm:grid-cols-2 gap-3">
          <NextStepCard 
            href="/docs/api"
            title="DJ API Reference"
            description="Complete API documentation for decks, mixer, and effects."
          />
          <NextStepCard 
            href="/docs/examples"
            title="Examples"
            description="Ready-to-use code examples for common patterns."
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, delay = 0, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.section 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h2 
        className="text-lg font-semibold text-white"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div 
        className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-medium text-white/90 text-sm mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm text-white/50">{children}</p>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd 
      className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[11px] text-white/70"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </kbd>
  );
}

function ConceptCard({ title, code, description }: { title: string; code: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <h3 className="font-medium text-white/90 text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
      <code 
        className="text-xs text-emerald-400 block mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {code}
      </code>
      <p className="text-xs text-white/40">{description}</p>
    </div>
  );
}

function TimeRow({ notation, desc, ms }: { notation: string; desc: string; ms: string }) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-2.5">
        <code className="text-emerald-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>&apos;{notation}&apos;</code>
      </td>
      <td className="px-4 py-2.5 text-white/60 text-xs">{desc}</td>
      <td className="px-4 py-2.5 text-white/40 text-xs hidden sm:table-cell" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ms}</td>
    </tr>
  );
}

function NextStepCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link 
      href={href}
      className="group p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-white/90 text-sm group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h3>
        <svg className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-xs text-white/40">{description}</p>
    </Link>
  );
}
