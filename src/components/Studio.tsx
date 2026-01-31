'use client';

import { memo, useState, Suspense, lazy } from 'react';
import { DeckComponent } from './Deck';
import { MixerComponent } from './Mixer';
import { CodeEditorPanel } from './CodeEditor';
import { cn } from './ui/Button';

const Visualizer = lazy(() => import('./Visualizer').then(m => ({ default: m.Visualizer })));

type View = 'studio' | 'performance';

export const Studio = memo(function Studio() {
  const [view, setView] = useState<View>('studio');

  return (
    <div className="h-screen flex flex-col bg-[#030303] overflow-hidden">
      <Header view={view} onViewChange={setView} />
      <main className="flex-1 min-h-0 p-4 pb-0">
        {view === 'studio' ? <StudioView /> : <PerformanceView />}
      </main>
      <NowPlayingBar />
    </div>
  );
});

const Header = memo(function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 bg-[#030303]/80 backdrop-blur-xl">
      <Logo />
      <ViewTabs view={view} onViewChange={onViewChange} />
      <HeaderActions />
    </header>
  );
});

const Logo = memo(function Logo() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1.5px]">
        <div className="w-full h-full rounded-[10px] bg-[#030303] flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" /><circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </div>
      <span className="hidden sm:block text-lg font-light text-white">Algo<span className="font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span></span>
    </div>
  );
});


const ViewTabs = memo(function ViewTabs({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  return (
    <div className="flex items-center p-1 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
      <TabButton active={view === 'studio'} onClick={() => onViewChange('studio')} icon={<GridIcon />}>Studio</TabButton>
      <TabButton active={view === 'performance'} onClick={() => onViewChange('performance')} icon={<CircleIcon />}>Performance</TabButton>
    </div>
  );
});

const TabButton = memo(function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-lg transition-all duration-200", active ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}>
      {icon}<span className="hidden sm:inline">{children}</span>
    </button>
  );
});

const HeaderActions = memo(function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => window.location.href = '/docs'} className="h-9 px-4 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50">Docs</button>
      <button className="h-9 px-5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black text-sm font-medium rounded-lg transition-all shadow-lg shadow-emerald-500/20">Save</button>
    </div>
  );
});

const GridIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
const CircleIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>;


const StudioView = memo(function StudioView() {
  return (
    <div className="h-full grid grid-cols-12 gap-4">
      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        <DeckComponent id="A" />
        <DeckComponent id="B" />
      </div>
      <div className="col-span-6 min-h-0"><CodeEditorPanel /></div>
      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        <div className="h-44 rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
          <Suspense fallback={<VisualizerSkeleton />}><Visualizer /></Suspense>
        </div>
        <div className="flex-1 min-h-0"><MixerComponent /></div>
      </div>
    </div>
  );
});

const PerformanceView = memo(function PerformanceView() {
  return (
    <div className="h-full grid grid-cols-12 gap-4">
      <div className="col-span-5 min-h-0"><DeckComponent id="A" expanded /></div>
      <div className="col-span-2 min-h-0"><MixerComponent compact /></div>
      <div className="col-span-5 min-h-0"><DeckComponent id="B" expanded /></div>
    </div>
  );
});

const VisualizerSkeleton = memo(function VisualizerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900/30">
      <div className="flex gap-1 items-end h-12">
        {[...Array(7)].map((_, i) => (<div key={i} className="w-1 bg-emerald-500/30 rounded-full animate-pulse" style={{ height: `${15 + Math.random() * 25}px`, animationDelay: `${i * 80}ms` }} />))}
      </div>
    </div>
  );
});


const NowPlayingBar = memo(function NowPlayingBar() {
  const [volume, setVolume] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="h-24 border-t border-zinc-800/50 bg-[#030303]/90 backdrop-blur-xl px-6 flex items-center justify-between">
      <TrackInfo />
      <TransportControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} progress={progress} setProgress={setProgress} />
      <VolumeControls volume={volume} setVolume={setVolume} />
    </div>
  );
});

const TrackInfo = memo(function TrackInfo() {
  return (
    <div className="flex items-center gap-4 w-1/4">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shadow-lg group hover:border-emerald-500/30 transition-colors cursor-pointer">
        <svg className="w-7 h-7 text-zinc-600 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">No track loaded</p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">Select a template to begin</p>
      </div>
    </div>
  );
});


const TransportControls = memo(function TransportControls({ isPlaying, setIsPlaying, progress, setProgress }: { isPlaying: boolean; setIsPlaying: (v: boolean) => void; progress: number; setProgress: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-3 w-2/4">
      <div className="flex items-center gap-5">
        <TransportBtn icon={<SkipBackIcon />} />
        <button onClick={() => setIsPlaying(!isPlaying)} className={cn("w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl", isPlaying ? "bg-emerald-500 shadow-emerald-500/30" : "bg-white shadow-white/10")}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <TransportBtn icon={<SkipForwardIcon />} />
      </div>
      <ProgressBar progress={progress} setProgress={setProgress} />
    </div>
  );
});

const TransportBtn = memo(function TransportBtn({ icon }: { icon: React.ReactNode }) {
  return <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50">{icon}</button>;
});

const ProgressBar = memo(function ProgressBar({ progress, setProgress }: { progress: number; setProgress: (v: number) => void }) {
  return (
    <div className="w-full max-w-lg flex items-center gap-3">
      <span className="text-[11px] text-zinc-500 tabular-nums w-10 text-right font-mono">0:00</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer relative" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - rect.left) / rect.width) * 100); }}>
        <div className="absolute inset-0 bg-zinc-700 scale-y-100 group-hover:scale-y-150 transition-transform origin-center rounded-full" />
        <div className="relative h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-[11px] text-zinc-500 tabular-nums w-10 font-mono">0:00</span>
    </div>
  );
});


const VolumeControls = memo(function VolumeControls({ volume, setVolume }: { volume: number; setVolume: (v: number) => void }) {
  return (
    <div className="flex items-center justify-end gap-4 w-1/4">
      <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50"><QueueIcon /></button>
      <div className="flex items-center gap-2 group">
        <button onClick={() => setVolume(volume > 0 ? 0 : 70)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50">
          {volume === 0 ? <VolumeMuteIcon /> : volume < 50 ? <VolumeLowIcon /> : <VolumeHighIcon />}
        </button>
        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100)); }}>
          <div className="h-full bg-white group-hover:bg-emerald-400 transition-colors rounded-full" style={{ width: `${volume}%` }} />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono w-8">{volume}%</span>
      </div>
      <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50"><FullscreenIcon /></button>
    </div>
  );
});

// Icons
const PlayIcon = () => <svg className="w-6 h-6 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
const SkipBackIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>;
const SkipForwardIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>;
const QueueIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
const VolumeHighIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const VolumeLowIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>;
const VolumeMuteIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;
const FullscreenIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>;

export default Studio;
