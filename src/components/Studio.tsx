'use client';

import { memo, useState, Suspense, lazy, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Deck } from './deck';
import { Mixer } from './mixer';
import { CodeEditor } from './editor';

const Visualizer = lazy(() => import('./visualizers').then(m => ({ default: m.Visualizer })));

type View = 'studio' | 'performance';

export const Studio = memo(function Studio() {
  const [view, setView] = useState<View>('studio');
  const [time, setTime] = useState('00:00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(128);
  const [position, setPosition] = useState(0);
  const [masterVol, setMasterVol] = useState(80);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden select-none">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-5">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 p-[1.5px] group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow">
              <div className="w-full h-full rounded-[5px] bg-[#050505] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Algorhythm</span>
          </a>
          
          <div className="h-5 w-px bg-white/[0.06]" />
          
          {/* View Toggle - Pill style */}
          <div className="flex p-1 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            {(['studio', 'performance'] as const).map(v => (
              <motion.button
                key={v}
                onClick={() => setView(v)}
                className="relative px-4 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{ color: view === v ? 'white' : 'rgba(255,255,255,0.4)' }}
              >
                {view === v && (
                  <motion.div
                    layoutId="viewToggle"
                    className="absolute inset-0 rounded-md bg-white/[0.08]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{v === 'studio' ? 'Studio' : 'Performance'}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <StatusIndicator active label="AUDIO" color="#10b981" />
            <StatusIndicator label="MIDI" color="#f59e0b" />
          </div>
          
          <div className="h-5 w-px bg-white/[0.06]" />
          
          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-white/40 font-mono tabular-nums tracking-wider">{time}</span>
          </div>
          
          <div className="h-5 w-px bg-white/[0.06]" />
          
          {/* Actions */}
          <a href="/docs" className="text-xs text-white/40 hover:text-white/70 transition-colors">Docs</a>
          
          <motion.button 
            className="h-8 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-black shadow-lg shadow-emerald-500/20"
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(16,185,129,0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Export
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'studio' ? (
            <motion.div
              key="studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <StudioView />
            </motion.div>
          ) : (
            <motion.div
              key="performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PerformanceView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Transport */}
      <TransportBar 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        bpm={bpm}
        setBpm={setBpm}
        position={position}
        setPosition={setPosition}
        masterVol={masterVol}
        setMasterVol={setMasterVol}
      />
    </div>
  );
});

const StatusIndicator = memo(function StatusIndicator({ 
  active, 
  label, 
  color 
}: { 
  active?: boolean; 
  label: string; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: active ? color : 'rgba(255,255,255,0.15)' }}
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className={`text-[10px] uppercase tracking-wider ${active ? 'text-white/60' : 'text-white/25'}`}>
        {label}
      </span>
    </div>
  );
});

// Resizable hooks
function useResizable(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      setWidth(Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta)));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  return { width, handleMouseDown };
}

function useResizableRight(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startX.current - e.clientX;
      setWidth(Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta)));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  return { width, handleMouseDown };
}

const ResizeHandle = memo(function ResizeHandle({ 
  onMouseDown, 
  side 
}: { 
  onMouseDown: (e: React.MouseEvent) => void; 
  side: 'left' | 'right';
}) {
  return (
    <div 
      onMouseDown={onMouseDown}
      className={`absolute top-0 bottom-0 w-1.5 cursor-col-resize z-20 group ${side === 'right' ? 'right-0' : 'left-0'}`}
    >
      <div 
        className="absolute inset-y-0 w-px bg-transparent group-hover:bg-emerald-500/50 transition-colors duration-200" 
        style={{ [side]: '50%' }} 
      />
    </div>
  );
});

const StudioView = memo(function StudioView() {
  const leftPanel = useResizable(280, 220, 400);
  const rightPanel = useResizableRight(280, 220, 400);

  return (
    <div className="h-full flex">
      {/* Left Panel - Decks */}
      <div 
        className="relative flex flex-col border-r border-white/[0.04]" 
        style={{ width: leftPanel.width }}
      >
        <PanelHeader title="Decks" icon="🎚️" />
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
          <Deck id="A" small />
          <Deck id="B" small />
          <Deck id="C" small />
          <Deck id="D" small />
        </div>
        <ResizeHandle onMouseDown={leftPanel.handleMouseDown} side="right" />
      </div>
      
      {/* Center - Code Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <CodeEditor />
      </div>
      
      {/* Right Panel - Output & Mixer */}
      <div 
        className="relative flex flex-col border-l border-white/[0.04]" 
        style={{ width: rightPanel.width }}
      >
        <ResizeHandle onMouseDown={rightPanel.handleMouseDown} side="left" />
        <PanelHeader title="Output" icon="📊" />
        <div className="h-36 border-b border-white/[0.04] relative overflow-hidden">
          {/* Visualizer glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          <Suspense fallback={<VisualizerPlaceholder />}>
            <Visualizer />
          </Suspense>
        </div>
        <div className="flex-1 overflow-hidden">
          <Mixer />
        </div>
      </div>
    </div>
  );
});

const PerformanceView = memo(function PerformanceView() {
  const mixerPanel = useResizable(240, 180, 340);

  return (
    <div className="h-full flex">
      {/* Deck A */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.04]">
        <DeckHeader label="A" color="#06b6d4" bpm={128} />
        <div className="flex-1 p-4 relative">
          {/* Deck glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          <Deck id="A" expanded />
        </div>
      </div>
      
      {/* Center - Mixer */}
      <div className="relative flex flex-col" style={{ width: mixerPanel.width }}>
        <PanelHeader title="Mixer" icon="🎛️" />
        <div className="flex-1 relative">
          {/* Center glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <Mixer compact />
        </div>
        <ResizeHandle onMouseDown={mixerPanel.handleMouseDown} side="right" />
      </div>
      
      {/* Deck B */}
      <div className="flex-1 flex flex-col min-w-0 border-l border-white/[0.04]">
        <DeckHeader label="B" color="#f59e0b" bpm={128} />
        <div className="flex-1 p-4 relative">
          {/* Deck glow */}
          <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <Deck id="B" expanded />
        </div>
      </div>
    </div>
  );
});

const PanelHeader = memo(function PanelHeader({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="h-10 px-4 flex items-center gap-2 border-b border-white/[0.04] bg-white/[0.01]">
      {icon && <span className="text-xs">{icon}</span>}
      <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{title}</span>
    </div>
  );
});

const DeckHeader = memo(function DeckHeader({ 
  label, 
  color, 
  bpm 
}: { 
  label: string; 
  color: string; 
  bpm: number;
}) {
  return (
    <div className="h-12 px-5 flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01]">
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ 
            backgroundColor: `${color}15`,
            color: color,
            border: `1px solid ${color}30`
          }}
          animate={{ boxShadow: [`0 0 0px ${color}00`, `0 0 20px ${color}30`, `0 0 0px ${color}00`] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}
        </motion.div>
        <div>
          <span className="text-xs text-white/60 font-medium">Deck {label}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-white/30">Ready</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/30 uppercase">BPM</span>
        <span className="text-sm text-white/70 font-mono tabular-nums">{bpm}</span>
      </div>
    </div>
  );
});

const VisualizerPlaceholder = memo(function VisualizerPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#050505]">
      <div className="flex gap-0.5 items-end h-10">
        {[...Array(40)].map((_, i) => (
          <motion.div 
            key={i} 
            className="w-1 bg-emerald-500/30 rounded-sm"
            animate={{ height: [4 + Math.sin(i * 0.3) * 8, 4 + Math.cos(i * 0.3) * 12, 4 + Math.sin(i * 0.3) * 8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.02 }}
          />
        ))}
      </div>
    </div>
  );
});

const TransportBar = memo(function TransportBar({
  isPlaying, setIsPlaying, bpm, setBpm, position, setPosition, masterVol, setMasterVol
}: {
  isPlaying: boolean; setIsPlaying: (v: boolean) => void;
  bpm: number; setBpm: (v: number) => void;
  position: number; setPosition: (v: number) => void;
  masterVol: number; setMasterVol: (v: number) => void;
}) {
  return (
    <div className="h-[72px] border-t border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl px-5 flex items-center justify-between relative z-20">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-56">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
          <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-white/70 font-medium">No track loaded</p>
          <p className="text-[11px] text-white/30">Select a template to start</p>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-3">
          <TransportBtn icon="prev" />
          <motion.button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              background: isPlaying 
                ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' 
                : 'rgba(255,255,255,0.08)',
              color: isPlaying ? 'black' : 'white',
              boxShadow: isPlaying ? '0 8px 32px -8px rgba(16,185,129,0.5)' : 'none'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying && (
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(16,185,129,0.5)' }}
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
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
          </motion.button>
          <TransportBtn icon="next" />
          <TransportBtn icon="stop" />
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-3 w-96">
          <span className="text-[10px] text-white/30 font-mono w-10 text-right tabular-nums">0:00</span>
          <div 
            className="flex-1 h-1.5 bg-white/[0.06] rounded-full cursor-pointer overflow-hidden group relative"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPosition(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                width: `${position}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
              }}
            />
            {/* Hover indicator */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[10px] text-white/30 font-mono w-10 tabular-nums">0:00</span>
        </div>
      </div>

      {/* BPM & Volume */}
      <div className="flex items-center gap-6 w-56 justify-end">
        {/* BPM */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-wide">BPM</span>
          <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.04]">
            <button 
              onClick={() => setBpm(Math.max(60, bpm - 1))} 
              className="w-7 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="w-10 text-center text-sm text-white font-mono tabular-nums">{bpm}</span>
            <button 
              onClick={() => setBpm(Math.min(200, bpm + 1))} 
              className="w-7 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMasterVol(masterVol > 0 ? 0 : 80)} 
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              {masterVol === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              )}
            </svg>
          </button>
          <div 
            className="w-20 h-1.5 bg-white/[0.06] rounded-full cursor-pointer overflow-hidden group"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMasterVol(Math.round(((e.clientX - rect.left) / rect.width) * 100));
            }}
          >
            <div 
              className="h-full bg-white/50 rounded-full transition-all group-hover:bg-white/70" 
              style={{ width: `${masterVol}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const TransportBtn = memo(function TransportBtn({ icon }: { icon: 'prev' | 'next' | 'stop' }) {
  const icons = {
    prev: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>,
    next: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>,
    stop: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>,
  };
  return (
    <motion.button 
      className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 bg-white/[0.03] border border-white/[0.04] hover:text-white/70 hover:bg-white/[0.06] transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icons[icon]}
    </motion.button>
  );
});

export default Studio;
