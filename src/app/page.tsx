'use client';

import { memo, useEffect, useState } from 'react';
import { DeckComponent } from '@/components/Deck';
import { MixerComponent } from '@/components/Mixer';
import { CodeEditorPanel } from '@/components/CodeEditor';
import { dj } from '@/engine/djapi';

export default function HomePage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await dj.engine.init();
      dj.init();
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize:', err);
      setIsInitializing(false);
    }
  };

  if (!isInitialized) {
    return <InitScreen onInit={handleInitialize} isInitializing={isInitializing} />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Decks */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <DeckComponent id="A" />
            <DeckComponent id="B" />
          </div>

          {/* Center: Code Editor */}
          <div className="col-span-12 lg:col-span-6">
            <div className="h-[800px]">
              <CodeEditorPanel />
            </div>
          </div>

          {/* Right: Mixer & Controls */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <MixerComponent />
            <SpectrumVisualizer />
          </div>
        </div>

        {/* Bottom: Additional Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DeckComponent id="C" />
          <DeckComponent id="D" />
        </div>
      </div>
    </main>
  );
}

const Header = memo(function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Algorhythm
              </h1>
              <p className="text-xs text-zinc-400">Code-Based DJ Platform</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <a href="/docs" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              Docs
            </a>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Save Project
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
});

const InitScreen = memo(function InitScreen({ onInit, isInitializing }: { onInit: () => void; isInitializing: boolean }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎧</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Algorhythm
        </h1>
        <p className="text-zinc-400 mb-8">Code-Based DJ Platform</p>
        
        {isInitializing ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Initializing Audio Engine...</p>
          </>
        ) : (
          <button
            onClick={onInit}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium transition-colors"
          >
            Start DJing
          </button>
        )}
      </div>
    </div>
  );
});

const SpectrumVisualizer = memo(function SpectrumVisualizer() {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <h3 className="text-sm font-medium text-white mb-3">Spectrum</h3>
      <div className="h-32 bg-zinc-950 rounded-lg flex items-end justify-around gap-1 p-2">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm"
            style={{ height: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
});
