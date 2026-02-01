'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dj } from '@/engine/djapi';

interface MixerProps { 
  compact?: boolean; 
}

const COLORS = {
  cyan: '#06b6d4',
  amber: '#f59e0b',
  emerald: '#10b981',
};

export const MixerComponent = memo(function MixerComponent({ compact }: MixerProps) {
  const [crossfader, setCrossfader] = useState(0);
  const [masterVol, setMasterVol] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [meterL, setMeterL] = useState(0);
  const [meterR, setMeterR] = useState(0);
  const [activeCurve, setActiveCurve] = useState<'linear' | 'power' | 'constant'>('linear');

  useEffect(() => {
    const interval = setInterval(() => {
      const base = ((masterVol + 60) / 72) * 100;
      setMeterL(Math.min(100, base + Math.random() * 15));
      setMeterR(Math.min(100, base + Math.random() * 15));
    }, 100);
    return () => clearInterval(interval);
  }, [masterVol]);

  const handleCrossfader = useCallback((v: number) => { 
    setCrossfader(v); 
    try { dj.crossfader.position = v; } catch {} 
  }, []);
  
  const handleMasterVol = useCallback((v: number) => { 
    setMasterVol(v); 
    try { dj.master.volume = v; } catch {} 
  }, []);

  const handleCurve = useCallback((curve: 'linear' | 'power' | 'constant') => {
    setActiveCurve(curve);
    try { dj.crossfader.curve = curve; } catch {}
  }, []);

  if (compact) {
    return (
      <div className="h-full p-3 flex flex-col gap-4">
        {/* Crossfader - Artsy */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <DeckIndicator label="A" color={COLORS.cyan} position={crossfader} side="left" />
            <span className="text-[9px] text-white/20 uppercase tracking-widest">Crossfader</span>
            <DeckIndicator label="B" color={COLORS.amber} position={crossfader} side="right" />
          </div>
          <CrossfaderSlider value={crossfader} onChange={handleCrossfader} />
        </div>
        
        {/* Master Volume */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-white/30 uppercase tracking-wide">Master</span>
            <span className={`text-[10px] font-mono tabular-nums ${masterVol > 0 ? 'text-red-400' : 'text-white/40'}`}>
              {masterVol > 0 ? '+' : ''}{masterVol}dB
            </span>
          </div>
          <VolumeSlider value={masterVol} onChange={handleMasterVol} />
          
          {/* Mini meters */}
          <div className="flex gap-1.5 h-1">
            <MiniMeter value={meterL} clip={masterVol > 0} />
            <MiniMeter value={meterR} clip={masterVol > 0} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3 gap-4 overflow-y-auto">
      {/* Crossfader Section */}
      <Section title="Crossfader">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <DeckIndicator label="A" color={COLORS.cyan} position={crossfader} side="left" />
            <DeckIndicator label="B" color={COLORS.amber} position={crossfader} side="right" />
          </div>
          
          <CrossfaderSlider value={crossfader} onChange={handleCrossfader} />
          
          {/* Curve selector */}
          <div className="flex justify-center gap-1">
            {(['linear', 'power', 'constant'] as const).map(curve => (
              <motion.button 
                key={curve}
                onClick={() => handleCurve(curve)}
                className="px-2 py-1 text-[8px] uppercase tracking-wide rounded transition-all"
                style={{ 
                  backgroundColor: activeCurve === curve ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                  color: activeCurve === curve ? COLORS.emerald : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${activeCurve === curve ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.04)'}`
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {curve === 'constant' ? 'const' : curve}
              </motion.button>
            ))}
          </div>
        </div>
      </Section>

      {/* Master Section */}
      <Section 
        title="Master" 
        right={
          <span className={`text-[10px] font-mono tabular-nums ${masterVol > 0 ? 'text-red-400' : 'text-white/40'}`}>
            {masterVol > 0 ? '+' : ''}{masterVol}dB
          </span>
        }
      >
        <div className="space-y-3">
          <VolumeSlider value={masterVol} onChange={handleMasterVol} />
          
          {/* VU Meters */}
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <VUMeter value={meterL} label="L" clip={masterVol > 0} />
              <VUMeter value={meterR} label="R" clip={masterVol > 0} />
            </div>
            <div className="flex justify-between text-[7px] text-white/15 px-1">
              <span>-60</span>
              <span>-24</span>
              <span>-12</span>
              <span>0</span>
              <span>+12</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Effects Section */}
      <Section title="FX Send">
        <div className="grid grid-cols-3 gap-2">
          <FXKnob label="REV" color={COLORS.cyan} />
          <FXKnob label="DLY" color={COLORS.amber} />
          <FXKnob label="FLT" color={COLORS.emerald} />
        </div>
      </Section>

      {/* Record Button */}
      <div className="mt-auto pt-3 border-t border-white/[0.04]">
        <motion.button 
          onClick={() => {
            if (isRecording) { try { dj.record?.stop(); } catch {} setIsRecording(false); }
            else { try { dj.record?.start(); } catch {} setIsRecording(true); }
          }}
          className="w-full h-9 rounded-lg flex items-center justify-center gap-2 text-[10px] font-medium transition-all relative overflow-hidden"
          style={{ 
            backgroundColor: isRecording ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)',
            color: isRecording ? '#ef4444' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${isRecording ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.04)'}`
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Recording pulse effect */}
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ backgroundColor: '#ef4444' }}
              />
            )}
          </AnimatePresence>
          
          <div className="relative z-10 flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isRecording ? '#ef4444' : 'rgba(239,68,68,0.4)' }}
              animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span>{isRecording ? 'Recording...' : 'Record'}</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
});

// Section wrapper
const Section = memo(function Section({ 
  title, 
  right, 
  children 
}: { 
  title: string; 
  right?: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[9px] text-white/30 uppercase tracking-widest">{title}</span>
        {right}
      </div>
      <div 
        className="p-3 rounded-xl"
        style={{ 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        {children}
      </div>
    </div>
  );
});

// Deck indicator with glow
const DeckIndicator = memo(function DeckIndicator({ 
  label, 
  color, 
  position, 
  side 
}: { 
  label: string; 
  color: string; 
  position: number; 
  side: 'left' | 'right';
}) {
  const isActive = side === 'left' ? position <= 0 : position >= 0;
  const intensity = side === 'left' 
    ? Math.max(0, -position) 
    : Math.max(0, position);
  
  return (
    <motion.div 
      className="flex items-center gap-1.5"
      animate={{ opacity: 0.4 + intensity * 0.6 }}
    >
      <motion.div 
        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
        style={{ 
          backgroundColor: `${color}${isActive ? '25' : '10'}`,
          color: color,
          boxShadow: isActive ? `0 0 12px ${color}40` : 'none'
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
});

// Crossfader slider
const CrossfaderSlider = memo(function CrossfaderSlider({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (v: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const position = ((value + 1) / 2) * 100;
  
  return (
    <div className="relative h-3 group">
      {/* Track */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
      >
        {/* Left fill (cyan) */}
        <div 
          className="absolute left-0 top-0 bottom-0 rounded-l-full"
          style={{ 
            width: `${position}%`,
            background: `linear-gradient(90deg, ${COLORS.cyan}40 0%, transparent 100%)`
          }}
        />
        {/* Right fill (amber) */}
        <div 
          className="absolute right-0 top-0 bottom-0 rounded-r-full"
          style={{ 
            width: `${100 - position}%`,
            background: `linear-gradient(270deg, ${COLORS.amber}40 0%, transparent 100%)`
          }}
        />
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
      </div>
      
      {/* Input */}
      <input 
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      
      {/* Thumb */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-md pointer-events-none"
        style={{ 
          left: `calc(${position}% - 8px)`,
          backgroundColor: 'white',
          boxShadow: isDragging 
            ? '0 0 16px rgba(255,255,255,0.5)' 
            : '0 2px 8px rgba(0,0,0,0.3)'
        }}
        animate={{ scale: isDragging ? 1.1 : 1 }}
      >
        {/* Grip lines */}
        <div className="absolute inset-0 flex items-center justify-center gap-0.5">
          <div className="w-px h-2 bg-black/20" />
          <div className="w-px h-2 bg-black/20" />
        </div>
      </motion.div>
    </div>
  );
});

// Volume slider
const VolumeSlider = memo(function VolumeSlider({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (v: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const position = ((value + 60) / 72) * 100;
  const isClipping = value > 0;
  
  return (
    <div className="relative h-2 group">
      {/* Track */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
      >
        {/* Fill */}
        <motion.div 
          className="h-full rounded-full"
          style={{ 
            width: `${position}%`,
            backgroundColor: isClipping ? '#ef4444' : COLORS.emerald,
            boxShadow: isDragging ? `0 0 8px ${isClipping ? '#ef4444' : COLORS.emerald}60` : 'none'
          }}
        />
        {/* 0dB marker */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-white/20"
          style={{ left: `${(60 / 72) * 100}%` }}
        />
      </div>
      
      {/* Input */}
      <input 
        type="range"
        min="-60"
        max="12"
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
          left: `calc(${position}% - 6px)`,
          backgroundColor: 'white',
          boxShadow: `0 0 6px ${isClipping ? '#ef4444' : COLORS.emerald}80`
        }}
        animate={{ scale: isDragging ? 1.15 : 1 }}
      />
    </div>
  );
});

// VU Meter
const VUMeter = memo(function VUMeter({ 
  value, 
  label, 
  clip 
}: { 
  value: number; 
  label: string; 
  clip?: boolean;
}) {
  return (
    <div className="flex-1 flex items-center gap-1.5">
      <span className="text-[8px] text-white/20 w-2">{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden relative" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
        {/* Segments */}
        <div className="absolute inset-0 flex gap-px p-px">
          {Array.from({ length: 20 }).map((_, i) => {
            const segmentPos = (i / 20) * 100;
            const isLit = segmentPos < value;
            const isRed = i >= 17;
            const isYellow = i >= 14 && i < 17;
            
            let color = COLORS.emerald;
            if (isYellow) color = COLORS.amber;
            if (isRed) color = '#ef4444';
            
            return (
              <motion.div 
                key={i}
                className="flex-1 rounded-sm"
                style={{ 
                  backgroundColor: isLit ? color : 'rgba(255,255,255,0.03)',
                  opacity: isLit ? 1 : 0.3
                }}
                animate={isLit && clip && isRed ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Mini meter for compact view
const MiniMeter = memo(function MiniMeter({ 
  value, 
  clip 
}: { 
  value: number; 
  clip?: boolean;
}) {
  return (
    <div className="flex-1 h-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
      <motion.div 
        className="h-full rounded-full transition-all duration-75"
        style={{ 
          width: `${value}%`,
          backgroundColor: clip ? '#ef4444' : COLORS.emerald
        }}
      />
    </div>
  );
});

// FX Knob
const FXKnob = memo(function FXKnob({ 
  label, 
  color 
}: { 
  label: string; 
  color: string;
}) {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const rotation = (value / 100) * 270 - 135;
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[8px] text-white/30 uppercase tracking-wide">{label}</span>
      
      {/* Knob */}
      <div 
        className="relative w-10 h-10 cursor-pointer"
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Track ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-[135deg]" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
            strokeDasharray="70.7 23.6"
            strokeLinecap="round"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${(value / 100) * 70.7} 94.3`}
            strokeLinecap="round"
            style={{ 
              filter: isDragging ? `drop-shadow(0 0 4px ${color})` : 'none'
            }}
          />
        </svg>
        
        {/* Knob body */}
        <motion.div 
          className="absolute inset-1 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
          animate={{ rotate: rotation }}
        >
          {/* Indicator */}
          <div 
            className="absolute top-1.5 w-1 h-1 rounded-full"
            style={{ backgroundColor: color }}
          />
        </motion.div>
        
        {/* Hidden input for interaction */}
        <input 
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      
      <span className="text-[9px] text-white/25 font-mono tabular-nums">{value}%</span>
    </div>
  );
});

export default MixerComponent;
