'use client';

import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { dj } from '@/engine/djapi';
import { cn } from './ui/Button';

interface DeckProps {
  id: 'A' | 'B' | 'C' | 'D';
  expanded?: boolean;
  small?: boolean;
}

export const DeckComponent = memo(function DeckComponent({ id, expanded, small }: DeckProps) {
  const deck = dj.deck[id];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // EQ state
  const [eq, setEq] = useState({ high: 0, mid: 0, low: 0 });

  // Rotation animation
  useEffect(() => {
    if (!isPlaying) return;
    let frame: number;
    const animate = () => {
      setRotation(r => (r + 0.5) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const handleLoad = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    await (deck as any).load(file);
  }, [deck]);

  const handlePlay = useCallback(() => {
    deck.play();
    setIsPlaying(true);
  }, [deck]);

  const handlePause = useCallback(() => {
    deck.pause();
    setIsPlaying(false);
  }, [deck]);

  const handleStop = useCallback(() => {
    deck.stop();
    setIsPlaying(false);
  }, [deck]);

  const handleEqChange = useCallback((band: 'high' | 'mid' | 'low', val: number) => {
    const clamped = Math.max(-12, Math.min(12, val));
    deck.eq[band] = clamped;
    setEq(prev => ({ ...prev, [band]: clamped }));
  }, [deck]);

  const deckColor = id === 'A' || id === 'C' ? 'cyan' : 'amber';

  return (
    <div className={cn(
      "h-full rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col overflow-hidden",
      expanded && "bg-zinc-900/50"
    )}>
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold",
            deckColor === 'cyan' ? "bg-cyan-500/20 text-cyan-400" : "bg-amber-500/20 text-amber-400"
          )}>
            {id}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate max-w-[140px]">
              {trackName || 'No track'}
            </p>
          </div>
        </div>
        
        {trackName && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 font-mono">128 BPM</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 p-4 flex flex-col">
        {!trackName ? (
          /* Empty State */
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30 transition-colors group"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              deckColor === 'cyan' 
                ? "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20" 
                : "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20"
            )}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Load Track
            </span>
          </button>
        ) : (
          /* Track Loaded */
          <div className="flex-1 flex flex-col gap-4">
            {/* Vinyl / Waveform */}
            <div className="flex-1 flex items-center justify-center">
              <div 
                className="relative w-32 h-32 rounded-full bg-zinc-950 border-4 border-zinc-800"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Grooves */}
                <div className="absolute inset-2 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-6 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-10 rounded-full border border-zinc-800/50" />
                
                {/* Center label */}
                <div className={cn(
                  "absolute inset-0 m-auto w-10 h-10 rounded-full flex items-center justify-center",
                  deckColor === 'cyan' ? "bg-cyan-500/20" : "bg-amber-500/20"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    deckColor === 'cyan' ? "bg-cyan-400" : "bg-amber-400"
                  )} />
                </div>
              </div>
            </div>

            {/* EQ */}
            <div className="grid grid-cols-3 gap-2">
              <EQKnob label="HI" value={eq.high} onChange={v => handleEqChange('high', v)} />
              <EQKnob label="MID" value={eq.mid} onChange={v => handleEqChange('mid', v)} />
              <EQKnob label="LO" value={eq.low} onChange={v => handleEqChange('low', v)} />
            </div>
          </div>
        )}
      </div>

      {/* Transport Controls */}
      {trackName && (
        <div className="h-16 px-4 flex items-center justify-center gap-2 border-t border-zinc-800/50">
          <TransportButton onClick={handleStop} title="Stop">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </TransportButton>
          
          <TransportButton 
            onClick={isPlaying ? handlePause : handlePlay} 
            primary 
            active={isPlaying}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </TransportButton>
          
          <TransportButton onClick={() => fileInputRef.current?.click()} title="Load">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </TransportButton>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleLoad}
        className="hidden"
      />
    </div>
  );
});

const TransportButton = memo(function TransportButton({
  onClick,
  children,
  primary,
  active,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        primary 
          ? "w-12 h-12 bg-white text-black hover:scale-105 active:scale-95" 
          : "w-10 h-10 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700",
        active && primary && "bg-[#1db954]"
      )}
    >
      {children}
    </button>
  );
});

const EQKnob = memo(function EQKnob({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium text-zinc-500">{label}</span>
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-zinc-800 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
      <span className={cn(
        "text-[10px] font-mono tabular-nums",
        value === 0 ? "text-zinc-600" : value > 0 ? "text-cyan-400" : "text-amber-400"
      )}>
        {value > 0 ? '+' : ''}{value}
      </span>
    </div>
  );
});
