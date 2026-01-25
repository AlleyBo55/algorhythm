'use client';

import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { dj } from '@/engine/djapi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/components/ui/Button';

interface DeckProps {
  id: 'A' | 'B' | 'C' | 'D';
  small?: boolean;
}

export const DeckComponent = memo(function DeckComponent({ id, small }: DeckProps) {
  const deck = dj.deck[id];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState('No Track Loaded');
  const [rotation, setRotation] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // EQ State syncing (local state for numeric inputs)
  const [eq, setEq] = useState({ high: 0, mid: 0, low: 0 });

  // Update deck EQ and local state
  const handleEqChange = useCallback((band: 'high' | 'mid' | 'low', val: number) => {
    const clamped = Math.max(-24, Math.min(12, val));
    deck.eq[band] = clamped;
    setEq(prev => ({ ...prev, [band]: clamped }));
  }, [deck]);

  // Rotation animation
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      const animate = () => {
        setRotation(r => (r + 1) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
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

  return (
    <Card
      variant="glass"
      className={cn(
        "p-4 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300",
        small ? "h-48" : "h-[560px]", // Keep height for large decks
        !isActive && "opacity-50 grayscale pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "w-6 h-6 rounded flex items-center justify-center font-bold shadow-inner transition-colors pointer-events-auto hover:scale-110",
              isActive
                ? (id === "A" || id === "C" ? "bg-cyan-400 text-black shadow-cyan-400/50" : "bg-purple-400 text-black shadow-purple-400/50")
                : "bg-zinc-800 text-zinc-600"
            )}
            title={isActive ? "Deactivate Deck" : "Activate Deck"}
          >
            {isActive ? id : <span className="text-[10px]">OFF</span>}
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Deck {id}</span>
            <span className="text-sm font-bold truncate max-w-[120px] text-white">{trackName}</span>
          </div>
        </div>
      </div>

      {/* EQ Strip - Absolute Right (All Decks) */}
      {trackName !== 'No Track Loaded' && (
        <div className={cn(
          "absolute right-2 z-40 flex bg-black/60 p-1.5 rounded-lg border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 translate-x-1 opacity-80 group-hover:opacity-100",
          small ? "top-2 gap-1" : "top-1/2 -translate-y-1/2 flex-col gap-4"
        )}>
          <EQControl label="H" value={eq.high} onChange={(v) => handleEqChange('high', v)} compact={small} />
          <EQControl label="M" value={eq.mid} onChange={(v) => handleEqChange('mid', v)} compact={small} />
          <EQControl label="L" value={eq.low} onChange={(v) => handleEqChange('low', v)} compact={small} />
        </div>
      )}

      {/* Main Visual Area */}
      {small && trackName === 'No Track Loaded' && (
        <div className="flex-1 flex items-center justify-center z-20">
          <Button
            variant="glow"
            size="lg"
            className="w-full h-16 border-dashed border-2 bg-transparent hover:bg-white/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-xl mr-2">+</span> Load Track
          </Button>
        </div>
      )}

      {!small && (
        <div className="flex-1 flex items-center justify-center relative py-2 group/vinyl min-h-0">
          <div className={cn(
            "relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-zinc-950 border-4 shadow-2xl flex items-center justify-center transition-all duration-500 shrink-0",
            trackName === 'No Track Loaded' ? "border-zinc-800 opacity-50 scale-90" : "border-zinc-900"
          )}
            style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(transparent_0deg,rgba(255,255,255,0.1)_180deg,transparent_360deg)] opacity-30" />
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors",
              id === "A" || id === "C" ? "bg-cyan-500/20" : "bg-purple-500/20")}>
              <div className={cn("w-2 h-2 rounded-full", id === "A" || id === "C" ? "bg-cyan-400" : "bg-purple-400")} />
            </div>
          </div>

          {trackName === 'No Track Loaded' && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Button
                variant="glow"
                size="lg"
                className="rounded-full w-32 h-32 flex flex-col gap-2 bg-black/60 backdrop-blur-sm border-2 border-primary/50 hover:border-primary hover:scale-105 transition-all text-wrap text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-2xl font-bold">+</span>
                <span className="text-xs font-bold uppercase tracking-widest">Load Track</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleLoad}
        className="hidden"
      />

      {/* Spacer to push controls to bottom in small mode */}
      {small && trackName !== 'No Track Loaded' && <div className="flex-1" />}

      {/* Controls Area */}
      {(!small || trackName !== 'No Track Loaded') && (
        <div className={cn(
          "z-30 bg-black/60 p-2 rounded-lg backdrop-blur-md border border-white/5 relative shrink-0",
          small ? "flex items-center gap-3" : "space-y-3 p-3"
        )}>

          {/* Transport Controls */}
          <div className={cn(
            "flex items-center justify-center gap-1.5",
            small ? "shrink-0" : "gap-2"
          )}>
            <Button
              size="icon"
              variant={isPlaying ? "glow" : "secondary"}
              onClick={handlePlay}
              className={cn(
                "rounded-full transition-all",
                small ? "h-7 w-7" : "h-10 w-10",
                isPlaying && !small ? "scale-110" : ""
              )}
              title="Play"
              disabled={trackName === 'No Track Loaded'}
            >
              <svg className={small ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handlePause}
              className={cn(
                "rounded-full border border-white/10 hover:bg-white/10",
                small ? "h-7 w-7" : "h-10 w-10"
              )}
              title="Pause"
              disabled={trackName === 'No Track Loaded'}
            >
              <svg className={small ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStop}
              className={cn(
                "rounded-full border border-white/10 hover:bg-red-500/20 hover:border-red-500/50",
                small ? "h-7 w-7" : "h-10 w-10"
              )}
              title="Stop"
              disabled={trackName === 'No Track Loaded'}
            >
              <svg className={small ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
            </Button>
          </div>

          {/* Sliders Area (Filter) */}
          {trackName !== 'No Track Loaded' && (
            <div className={cn(
              "flex-1 min-w-0",
              small ? "space-y-0.5" : "space-y-4"
            )}>
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-muted-foreground font-mono uppercase">
                  <span>Filter</span>
                </div>
                <Slider
                  min="20"
                  max="20000"
                  defaultValue="20000"
                  onChange={(e) => deck.filter.cutoff = Number(e.target.value)}
                  className="h-2 [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              {!small && <HotCues deck={deck} color={id === "A" || id === "C" ? "cyan" : "purple"} />}
            </div>
          )}

          {trackName !== 'No Track Loaded' && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "opacity-50 hover:opacity-100 shrink-0",
                small ? "h-7 px-1.5 text-[8px]" : "w-full text-[10px] h-7"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {small ? 'Swap' : 'Change Track'}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
});

const EQControl = memo(function EQControl({
  label,
  value,
  onChange,
  compact
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center group",
      compact ? "flex-col gap-0.5" : "flex-col gap-1.5"
    )}>
      <span className="text-[9px] font-bold text-muted-foreground group-hover:text-white transition-colors">{label}</span>
      <div className="relative group/input">
        <input
          type="number"
          min="-24"
          max="12"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "bg-zinc-900/50 border border-white/5 rounded text-[9px] text-center font-mono text-white focus:outline-none focus:border-primary/50 transition-all hover:bg-zinc-800 shadow-inner",
            compact ? "w-7 h-6" : "w-10 h-8"
          )}
        />
        {/* Helper overlay for drag gesture simulation if needed, but standard input is what user asked for */}
      </div>

      {/* Visual Meter Strip */}
      <div className={cn(
        "bg-white/5 rounded-full overflow-hidden relative border border-white/5",
        compact ? "w-1 h-8" : "w-1.5 h-14"
      )}>
        <div
          className={cn(
            "absolute left-0 right-0 rounded-full transition-all duration-300",
            value === 0 ? "bg-white/20" : value > 0 ? "bg-cyan-400" : "bg-red-400"
          )}
          style={{
            height: `${Math.max(4, (Math.abs(value) / (value >= 0 ? 12 : 24)) * 100)}%`,
            bottom: value >= 0 ? '50%' : 'auto',
            top: value < 0 ? '50%' : 'auto'
          }}
        />
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20" />
      </div>
    </div>
  )
})

const HotCues = memo(function HotCues({ deck, color }: { deck: any, color: "cyan" | "purple" }) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {[0, 1, 2, 3].map((i) => (
        <button
          key={i}
          onClick={() => deck.hotcue[i].trigger()}
          className={cn(
            "h-8 rounded bg-white/5 border border-white/5 hover:brightness-150 transition-all active:scale-95",
            color === "cyan" ? "hover:bg-cyan-500/50 hover:border-cyan-400" : "hover:bg-purple-500/50 hover:border-purple-400"
          )}
        />
      ))}
    </div>
  );
});
