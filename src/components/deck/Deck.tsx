'use client';

import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dj } from '@/engine/djapi';

interface DeckProps {
  id: 'A' | 'B' | 'C' | 'D';
  expanded?: boolean;
  small?: boolean;
}

const DECK_COLORS: Record<string, { primary: string; glow: string }> = {
  A: { primary: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
  B: { primary: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  C: { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
  D: { primary: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
};

export const DeckComponent = memo(function DeckComponent({ id, expanded, small }: DeckProps) {
  const deck = dj.deck[id];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [rotation, setRotation] = useState(0);
  const colors = DECK_COLORS[id];

  // Generate waveform on track load
  useEffect(() => {
    if (trackName) {
      const bars = expanded ? 120 : small ? 40 : 80;
      setWaveform(Array.from({ length: bars }, (_, i) => {
        const x = i / bars;
        return 0.2 + Math.sin(x * Math.PI * 4) * 0.3 + Math.random() * 0.5;
      }));
    }
  }, [trackName, expanded, small]);

  // Vinyl rotation animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLoad = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    try { await (deck as any).load(file); } catch {}
  }, [deck]);

  const play = useCallback(() => { try { deck.play(); setIsPlaying(true); } catch {} }, [deck]);
  const pause = useCallback(() => { try { deck.pause(); setIsPlaying(false); } catch {} }, [deck]);
  const stop = useCallback(() => { try { deck.stop(); setIsPlaying(false); setRotation(0); } catch {} }, [deck]);

  // Compact deck - minimal horizontal layout
  if (small) {
    return (
      <motion.div 
        className="h-14 rounded-xl relative overflow-hidden"
        style={{ 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
        whileHover={{ borderColor: `${colors.primary}30` }}
      >
        {/* Ambient glow when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                background: `radial-gradient(ellipse at left, ${colors.glow} 0%, transparent 70%)`
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center px-3 gap-3">
          {/* Deck ID with vinyl indicator */}
          <div className="relative">
            <motion.div 
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ 
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
                border: `1px solid ${colors.primary}30`
              }}
              animate={{ rotate: isPlaying ? rotation : 0 }}
              transition={{ duration: 0, ease: 'linear' }}
            >
              {id}
            </motion.div>
            {isPlaying && (
              <motion.div 
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* Waveform / Load area */}
          <div className="flex-1 h-8 flex items-center">
            {!trackName ? (
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex items-center justify-center gap-2 rounded-lg border border-dashed transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                whileHover={{ borderColor: `${colors.primary}40`, backgroundColor: `${colors.primary}05` }}
              >
                <svg className="w-3.5 h-3.5" style={{ color: `${colors.primary}60` }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-[10px] text-white/40">Load Track</span>
              </motion.button>
            ) : (
              <div className="w-full h-full flex flex-col justify-center">
                <span className="text-[10px] text-white/70 truncate mb-1">{trackName}</span>
                <MiniWaveform waveform={waveform} color={colors.primary} isPlaying={isPlaying} />
              </div>
            )}
          </div>

          {/* Transport controls */}
          <div className="flex items-center gap-1">
            <SmallTransportBtn onClick={stop} icon="stop" color={colors.primary} />
            <motion.button 
              onClick={isPlaying ? pause : play}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ 
                backgroundColor: isPlaying ? colors.primary : 'rgba(255,255,255,0.06)',
                color: isPlaying ? 'black' : 'rgba(255,255,255,0.5)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </motion.button>
          </div>
        </div>
        
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleLoad} className="hidden" />
      </motion.div>
    );
  }

  // Expanded deck for performance view - full artsy experience
  if (expanded) {
    return (
      <motion.div 
        className="h-full rounded-2xl relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32"
            style={{ 
              background: `radial-gradient(ellipse at top, ${colors.glow} 0%, transparent 70%)`,
              opacity: isPlaying ? 0.6 : 0.2
            }}
            animate={{ opacity: isPlaying ? [0.4, 0.6, 0.4] : 0.2 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Waveform display - large, prominent */}
          <div className="h-32 border-b border-white/[0.04] relative overflow-hidden">
            {trackName ? (
              <ExpandedWaveform waveform={waveform} color={colors.primary} isPlaying={isPlaying} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-white/20">No waveform</span>
              </div>
            )}
            
            {/* Playhead */}
            {trackName && (
              <motion.div 
                className="absolute top-0 bottom-0 w-0.5"
                style={{ 
                  left: '30%',
                  background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary}50 100%)`,
                  boxShadow: `0 0 10px ${colors.glow}`
                }}
              />
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Track info + vinyl */}
            <div className="flex items-start gap-4">
              {/* Vinyl disc */}
              <VinylDisc 
                isPlaying={isPlaying} 
                rotation={rotation} 
                color={colors.primary}
                hasTrack={!!trackName}
              />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {trackName || 'No track loaded'}
                </p>
                <p className="text-xs text-white/40 mt-0.5">128 BPM • 4:32</p>
                
                {!trackName && (
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 h-8 px-4 rounded-lg text-xs font-medium transition-all"
                    style={{ 
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                      border: `1px solid ${colors.primary}30`
                    }}
                    whileHover={{ backgroundColor: `${colors.primary}25` }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Load Track
                  </motion.button>
                )}
              </div>
            </div>

            {/* Volume slider - artsy */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Volume</span>
                <span className="text-[10px] text-white/40 font-mono">{volume}%</span>
              </div>
              <ArtisticSlider 
                value={volume} 
                onChange={setVolume} 
                color={colors.primary}
              />
            </div>

            {/* Transport - centered, prominent */}
            <div className="mt-auto flex items-center justify-center gap-4">
              <TransportBtn onClick={stop} icon="stop" />
              <motion.button 
                onClick={isPlaying ? pause : play}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all relative"
                style={{ 
                  backgroundColor: isPlaying ? colors.primary : 'white',
                  color: 'black',
                  boxShadow: isPlaying 
                    ? `0 0 40px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.3)` 
                    : '0 8px 32px rgba(255,255,255,0.1)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                
                {/* Pulse ring when playing */}
                {isPlaying && (
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid ${colors.primary}` }}
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
              <TransportBtn onClick={() => fileInputRef.current?.click()} icon="load" />
            </div>
          </div>
        </div>
        
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleLoad} className="hidden" />
      </motion.div>
    );
  }

  return null;
});

// Mini waveform for compact view
const MiniWaveform = memo(function MiniWaveform({ 
  waveform, 
  color, 
  isPlaying 
}: { 
  waveform: number[]; 
  color: string; 
  isPlaying: boolean;
}) {
  return (
    <div className="h-3 flex items-end gap-px">
      {waveform.slice(0, 30).map((h, i) => (
        <motion.div 
          key={i} 
          className="flex-1 rounded-sm"
          style={{ 
            height: `${h * 100}%`, 
            backgroundColor: isPlaying ? color : `${color}50`,
          }}
          animate={isPlaying ? { 
            opacity: [0.4, 0.8, 0.4],
            scaleY: [1, 1.1, 1]
          } : {}}
          transition={{ 
            duration: 0.5, 
            delay: i * 0.02,
            repeat: Infinity 
          }}
        />
      ))}
    </div>
  );
});

// Expanded waveform with more detail
const ExpandedWaveform = memo(function ExpandedWaveform({ 
  waveform, 
  color, 
  isPlaying 
}: { 
  waveform: number[]; 
  color: string; 
  isPlaying: boolean;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="w-full h-20 flex items-center gap-px">
        {waveform.map((h, i) => (
          <motion.div 
            key={i} 
            className="flex-1 rounded-sm"
            style={{ 
              height: `${h * 100}%`, 
              backgroundColor: i < waveform.length * 0.3 ? color : `${color}40`,
            }}
            animate={isPlaying && i < waveform.length * 0.35 ? { 
              opacity: [0.6, 1, 0.6]
            } : {}}
            transition={{ 
              duration: 0.3, 
              delay: (i % 8) * 0.05,
              repeat: Infinity 
            }}
          />
        ))}
      </div>
    </div>
  );
});

// Vinyl disc component
const VinylDisc = memo(function VinylDisc({ 
  isPlaying, 
  rotation, 
  color,
  hasTrack
}: { 
  isPlaying: boolean; 
  rotation: number; 
  color: string;
  hasTrack: boolean;
}) {
  return (
    <motion.div 
      className="w-20 h-20 rounded-full relative shrink-0"
      style={{ 
        background: hasTrack 
          ? `conic-gradient(from ${rotation}deg, #1a1a1a 0deg, #2a2a2a 90deg, #1a1a1a 180deg, #2a2a2a 270deg, #1a1a1a 360deg)`
          : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
      animate={{ rotate: isPlaying ? rotation : 0 }}
      transition={{ duration: 0, ease: 'linear' }}
    >
      {/* Grooves */}
      {hasTrack && (
        <>
          <div className="absolute inset-2 rounded-full border border-white/[0.03]" />
          <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
          <div className="absolute inset-6 rounded-full border border-white/[0.03]" />
        </>
      )}
      
      {/* Center label */}
      <div 
        className="absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: hasTrack ? color : 'rgba(255,255,255,0.05)',
          boxShadow: hasTrack ? `0 0 20px ${color}40` : 'none'
        }}
      >
        <div className="w-2 h-2 rounded-full bg-black/50" />
      </div>
      
      {/* Spinning indicator */}
      {isPlaying && (
        <motion.div 
          className="absolute top-1 left-1/2 w-1 h-1 rounded-full -translate-x-1/2"
          style={{ backgroundColor: color }}
        />
      )}
    </motion.div>
  );
});

// Artistic slider with glow effect
const ArtisticSlider = memo(function ArtisticSlider({ 
  value, 
  onChange, 
  color 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  color: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <div className="relative h-2 group">
      {/* Track background */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
      >
        {/* Fill */}
        <motion.div 
          className="h-full rounded-full"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: isDragging ? `0 0 12px ${color}60` : 'none'
          }}
          animate={{ opacity: isDragging ? 1 : 0.8 }}
        />
      </div>
      
      {/* Input */}
      <input 
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      
      {/* Thumb */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full pointer-events-none"
        style={{ 
          left: `calc(${value}% - 6px)`,
          backgroundColor: 'white',
          boxShadow: `0 0 8px ${color}80`
        }}
        animate={{ scale: isDragging ? 1.2 : 1 }}
      />
    </div>
  );
});

// Transport button for expanded view
const TransportBtn = memo(function TransportBtn({ 
  onClick, 
  icon 
}: { 
  onClick: () => void; 
  icon: 'stop' | 'load';
}) {
  const icons = {
    stop: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="1" />
      </svg>
    ),
    load: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
  };
  
  return (
    <motion.button 
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/80 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icons[icon]}
    </motion.button>
  );
});

// Small transport button for compact view
const SmallTransportBtn = memo(function SmallTransportBtn({ 
  onClick, 
  icon, 
  color 
}: { 
  onClick: () => void; 
  icon: 'stop'; 
  color: string;
}) {
  return (
    <motion.button 
      onClick={onClick}
      className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.4)'
      }}
      whileHover={{ backgroundColor: `${color}15`, color: color }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="1" />
      </svg>
    </motion.button>
  );
});

// Play icon
const PlayIcon = memo(function PlayIcon() {
  return (
    <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
});

// Pause icon
const PauseIcon = memo(function PauseIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
});

export { DeckComponent as Deck };
export default DeckComponent;
