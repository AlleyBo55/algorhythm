'use client';

import { memo, useCallback, useRef, useEffect } from 'react';
import { dj } from '@/engine/djapi';

interface DeckProps {
  id: 'A' | 'B' | 'C' | 'D';
}

export const DeckComponent = memo(function DeckComponent({ id }: DeckProps) {
  const deck = dj.deck[id];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await deck.load(file);
  }, [deck]);

  const handlePlay = useCallback(() => deck.play(), [deck]);
  const handlePause = useCallback(() => deck.pause(), [deck]);

  return (
    <div className="deck bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Deck {id}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            ▶
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            ⏸
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleLoad}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors mb-4"
      >
        Load Track
      </button>

      <EQControls deck={deck} />
      <FilterControl deck={deck} />
      <HotCues deck={deck} />
    </div>
  );
});

const EQControls = memo(function EQControls({ deck }: { deck: any }) {
  return (
    <div className="space-y-2 mb-4">
      <Knob label="HIGH" onChange={(v) => deck.eq.high = v} />
      <Knob label="MID" onChange={(v) => deck.eq.mid = v} />
      <Knob label="LOW" onChange={(v) => deck.eq.low = v} />
    </div>
  );
});

const FilterControl = memo(function FilterControl({ deck }: { deck: any }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-zinc-400 mb-1 block">FILTER</label>
      <input
        type="range"
        min="20"
        max="20000"
        defaultValue="20000"
        onChange={(e) => deck.filter.cutoff = Number(e.target.value)}
        className="w-full"
      />
    </div>
  );
});

const HotCues = memo(function HotCues({ deck }: { deck: any }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <button
          key={i}
          onClick={() => deck.hotcue[i].trigger()}
          className="aspect-square bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
});

const Knob = memo(function Knob({ label, onChange }: { label: string; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 mb-1 block">{label}</label>
      <input
        type="range"
        min="-24"
        max="12"
        defaultValue="0"
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
});
