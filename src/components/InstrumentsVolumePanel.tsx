import { memo, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
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
    <div className="fixed bottom-24 right-4 z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-red-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-emerald-400" />
          )}
        </button>
        <span className="text-xs font-medium text-white">Code Instruments</span>
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-32 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-emerald-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:hover:bg-emerald-400"
        />
        <span className="text-xs font-mono text-zinc-400 w-10">{volume}%</span>
      </div>
    </div>
  );
});
