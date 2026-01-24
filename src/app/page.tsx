'use client';

import { memo, useEffect, useState } from 'react';
import { DeckComponent } from '@/components/Deck';
import { MixerComponent } from '@/components/Mixer';
import { CodeEditorPanel } from '@/components/CodeEditor';
import { Visualizer } from '@/components/Visualizer';

import { dj } from '@/engine/djapi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { LoadingScreen } from '@/components/LoadingScreen';

export default function HomePage() {
  const [initStatus, setInitStatus] = useState<'idle' | 'booting' | 'ready'>('idle');

  const handleStart = async () => {
    setInitStatus('booting');

    try {
      // Initialize audio engine
      await dj.engine.init();
      await dj.init();

      // We rely on LoadingScreen's onComplete callback to switch to 'ready'
      // effectively waiting for the animation *and* the init.
    } catch (err) {
      console.error('Failed to initialize:', err);
      setInitStatus('idle'); // Reset on error
    }
  };

  if (initStatus === 'idle') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (initStatus === 'booting') {
    return <LoadingScreen onComplete={() => setInitStatus('ready')} />;
  }

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

        {/* LEFT COLUMN - Decks A & B */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <SectionTitle>Decks A / B</SectionTitle>
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <DeckComponent id="A" />
            <DeckComponent id="B" />
          </div>
        </div>

        {/* CENTER COLUMN - Code Editor (Main Stage) */}
        <div className="lg:col-span-6 flex flex-col gap-4 min-h-[600px]">
          <div className="flex items-center justify-between">
            <SectionTitle>Live Code Studio</SectionTitle>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <Card variant="glass" className="flex-1 overflow-hidden border-primary/20 shadow-[0_0_50px_-20px_rgba(167,139,250,0.3)]">
            <CodeEditorPanel />
          </Card>

          {/* Secondary Decks */}
          <div className="hidden xl:grid grid-cols-2 gap-4 mt-2 opacity-60 hover:opacity-100 transition-opacity">
            <DeckComponent id="C" small />
            <DeckComponent id="D" small />
          </div>
        </div>

        {/* RIGHT COLUMN - Mixer & AI */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <SectionTitle>Master Control</SectionTitle>
          <div className="flex-1 flex flex-col gap-4">
            {/* Visualizer on top */}
            <Card variant="neon" className="h-48 overflow-hidden relative">
              <Visualizer />
            </Card>

            <MixerComponent />

            {/* System Status */}
            <div className="flex-1 min-h-[100px] bg-black/20 rounded-xl border border-white/5 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
              System Ready
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2 ml-1">{children}</h2>
)

const Header = memo(function Header() {
  return (
    <header className="flex items-center justify-between py-2 mb-2">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white/90">
            Algo<span className="text-primary">Rhythm</span>
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Pro Audio Engine v0.1.0</p>
        </div>
      </div>

      <nav className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => alert("Hub feature coming soon!")}>Hub</Button>
        <Button variant="ghost" size="sm" onClick={() => alert("Documentation is under construction")}>Docs</Button>
        <Button variant="glow" size="sm" className="hidden sm:flex">
          Save Session
        </Button>
      </nav>
    </header>
  );
});

const WelcomeScreen = memo(function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden z-20">
      <div className="relative z-10 text-center space-y-8 p-12 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/30 animate-pulse-soft">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Rhythm<span className="text-primary">Code</span></h1>
          <p className="text-muted-foreground text-lg">Initialize Audio Engine</p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <Button
          onClick={onStart}
          variant="glow"
          size="lg"
          className="w-full text-lg h-14"
        >
          Initialize System
        </Button>
      </div>
    </div>
  );
});
