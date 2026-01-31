'use client';

import { memo, useState } from 'react';

const styles = [
  { name: 'Stranger Things', desc: 'Dark pulsing 80s arps' },
  { name: 'Mandalorian', desc: 'Cinematic western, flute' },
  { name: 'Anime OST', desc: 'Emotional piano & strings' },
  { name: 'Anime Battle', desc: 'Fast intense action' },
  { name: 'Alan Walker', desc: 'Ethereal EDM faded style' },
  { name: 'Synthwave', desc: 'Retro neon 80s drive' },
  { name: 'Lofi', desc: 'Chill dusty beats' },
  { name: 'Traps', desc: 'Heavy 808s and hihat rolls' },
];

const keywords = ['Intro', 'Verse', 'Chorus', 'Bridge', 'Drop', 'Outro'];

export const HelpGuide = memo(function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 h-8 px-3 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span>Guide</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-scale-in">
        <Header onClose={() => setIsOpen(false)} />
        <Content />
      </div>
    </div>
  );
});


const Header = memo(function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
      <h2 className="text-base font-semibold text-white">Quick Start Guide</h2>
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

const Content = memo(function Content() {
  return (
    <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(80vh-60px)] scrollbar-thin">
      <WorkflowSection />
      <StylesSection />
      <StructureSection />
    </div>
  );
});

const WorkflowSection = memo(function WorkflowSection() {
  return (
    <section className="space-y-2">
      <SectionTitle color="text-[#1db954]">01 — Workflow</SectionTitle>
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 space-y-2 text-sm text-zinc-400">
        <p>1. <span className="text-white">Start</span>: "make a synthwave song with intro"</p>
        <p>2. <span className="text-white">Extend</span>: "add a verse with bass"</p>
        <p>3. <span className="text-white">Evolve</span>: "add a chorus with energetic chords"</p>
        <p className="text-xs pt-2 text-zinc-500 italic">
          The AI reads your existing code and adds new sections chronologically.
        </p>
      </div>
    </section>
  );
});

const StylesSection = memo(function StylesSection() {
  return (
    <section className="space-y-2">
      <SectionTitle color="text-blue-400">02 — Styles & Presets</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {styles.map(style => (
          <div 
            key={style.name} 
            className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-sm font-medium text-white">{style.name}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{style.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

const StructureSection = memo(function StructureSection() {
  return (
    <section className="space-y-2">
      <SectionTitle color="text-purple-400">03 — Structure Control</SectionTitle>
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 text-sm text-zinc-400">
        <p className="mb-2">Keywords to use for song structure:</p>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map(k => (
            <span 
              key={k} 
              className="bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-md text-xs border border-purple-500/30"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});

const SectionTitle = memo(function SectionTitle({ 
  color, 
  children 
}: { 
  color: string; 
  children: React.ReactNode;
}) {
  return (
    <h3 className={`${color} font-semibold text-xs tracking-wide uppercase`}>
      {children}
    </h3>
  );
});

export default HelpGuide;
