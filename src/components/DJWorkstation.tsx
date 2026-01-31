'use client';

import { memo, Suspense, lazy } from 'react';
import { DeckComponent } from './Deck';
import { MixerComponent } from './Mixer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDJ } from '@/hooks/useDJ';

const Visualizer = lazy(() => import('./Visualizer').then(m => ({ default: m.Visualizer })));
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'));

export const DJWorkstation = memo(function DJWorkstation() {
  const { togglePlay, stop } = useDJ();

  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onStop: stop,
    onSeekForward: () => {},
    onSeekBackward: () => {},
    onLoadDeck: () => {},
  });

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Visualizer */}
      <div className="h-40 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <Suspense fallback={<LoadingFallback />}>
          <Visualizer />
        </Suspense>
      </div>

      {/* Main: Decks + Mixer */}
      <div className="flex-1 grid grid-cols-[1fr_280px_1fr] gap-4 min-h-0">
        <DeckComponent id="A" />
        <MixerComponent />
        <DeckComponent id="B" />
      </div>

      {/* Secondary Decks */}
      <div className="grid grid-cols-2 gap-4 h-44">
        <DeckComponent id="C" small />
        <DeckComponent id="D" small />
      </div>

      <Suspense fallback={null}>
        <PerformanceDashboard />
      </Suspense>
    </div>
  );
});

const LoadingFallback = memo(function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-sm text-zinc-600">Loading...</div>
    </div>
  );
});

export default DJWorkstation;
