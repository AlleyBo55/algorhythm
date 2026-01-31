'use client';

import { memo, useState, useEffect } from 'react';
import { getEffects } from '@/engine/instruments';

export const InstrumentsVolumePanel = memo(function InstrumentsVolumePanel() {
  const [volume, setVolume] = useState(30);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const effects = getEffects();
    if (effects.instrumentsGain) {
      effects.instrumentsGain.gain.value = muted ? 0 : volume / 100;
    }
  }, [volume, muted]);

  return (
    <div className="fixed bottom-24 right-4 z-50 bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setMuted(!muted)}
          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-800 rounded-md transition-colors"
        >
          {muted ? (
            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#1db954]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </button>
        <span className="text-xs font-medium text-zinc-300">Instruments</span>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-28"
        />
        <span className="text-[10px] font-mono text-zinc-500 w-8 tabular-nums">{volume}%</span>
      </div>
    </div>
  );
});

export default InstrumentsVolumePanel;
