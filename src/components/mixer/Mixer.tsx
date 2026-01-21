'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { dj } from '@/engine/djapi';
import { cn } from '../ui/Button';

interface MixerProps { compact?: boolean; }

export const MixerComponent = memo(function MixerComponent({ compact }: MixerProps) {
  const [crossfader, setCrossfader] = useState(0);
  const [masterVol, setMasterVol] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [meterLevel, setMeterLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const base = ((masterVol + 60) / 72) * 100;
      setMeterLevel(Math.min(100, base + Math.random() * 15));
    }, 100);
    return () => clearInterval(interval);
  }, [masterVol]);

  const handleCrossfader = useCallback((value: number) => { setCrossfader(value); try { dj.crossfader.position = value; } catch {} }, []);
  const handleMasterVolume = useCallback((value: number) => { setMasterVol(value); try { dj.master.volume = value; } catch {} }, []);

  if (compact) return <CompactMixer crossfader={crossfader} masterVol={masterVol} onCrossfader={handleCrossfader} onMasterVol={handleMasterVolume} />;

  return (
    <div className="h-full rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col overflow-hidden backdrop-blur-sm">
      <MixerHeader />
      <div className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto scrollbar-thin">
        <CrossfaderSection value={crossfader} onChange={handleCrossfader} />
        <MasterSection value={masterVol} onChange={handleMasterVolume} meterLevel={meterLevel} />
        <EffectsSection />
        <RecordSection isRecording={isRecording} setIsRecording={setIsRecording} />
      </div>
    </div>
  );
});

const CompactMixer = memo(function CompactMixer({ crossfader, masterVol, onCrossfader, onMasterVol }: { crossfader: number; masterVol: number; onCrossfader: (v: number) => void; onMasterVol: (v: number) => void }) {
  return (
    <div className="h-full rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-4 flex flex-col gap-4 backdrop-blur-sm">
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex justify-between text-[10px] font-bold"><span className="text-cyan-400">A</span><span className="text-amber-400">B</span></div>
        <Slider value={crossfader} min={-1} max={1} step={0.01} onChange={onCrossfader} gradient />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-medium text-zinc-500"><span>MASTER</span><span className={cn(masterVol > 0 && "text-red-400")}>{masterVol > 0 ? '+' : ''}{masterVol} dB</span></div>
        <Slider value={masterVol} min={-60} max={12} onChange={onMasterVol} />
      </div>
    </div>
  );
});

const MixerHeader = memo(function MixerHeader() {
  return (
    <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>
        </div>
        <span className="text-sm font-medium text-white">Mixer</span>
      </div>
      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] text-zinc-500">Active</span></div>
    </div>
  );
});

const CrossfaderSection = memo(function CrossfaderSection({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <section className="space-y-3">
      <span className="text-xs font-medium text-zinc-400">Crossfader</span>
      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
        <div className="flex justify-between text-[10px] font-bold mb-3"><span className="text-cyan-400">DECK A</span><span className="text-amber-400">DECK B</span></div>
        <Slider value={value} min={-1} max={1} step={0.01} onChange={onChange} gradient large />
        <div className="flex justify-center gap-2 mt-4">
          {['linear', 'power', 'constant'].map(curve => (<button key={curve} onClick={() => { try { dj.crossfader.curve = curve as any; } catch {} }} className="px-3 py-1.5 text-[9px] uppercase tracking-wide text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all border border-transparent hover:border-zinc-700">{curve}</button>))}
        </div>
      </div>
    </section>
  );
});

const MasterSection = memo(function MasterSection({ value, onChange, meterLevel }: { value: number; onChange: (v: number) => void; meterLevel: number }) {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center"><span className="text-xs font-medium text-zinc-400">Master Output</span><span className={cn("text-xs font-mono tabular-nums", value > 0 ? "text-red-400" : "text-zinc-500")}>{value > 0 ? '+' : ''}{value} dB</span></div>
      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 space-y-4">
        <Slider value={value} min={-60} max={12} onChange={onChange} />
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] text-zinc-600"><span>-60</span><span>-12</span><span>0</span><span>+12</span></div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden relative">
            <div className={cn("h-full transition-all duration-75 rounded-full", value > 0 ? "bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" : "bg-gradient-to-r from-emerald-500/50 to-emerald-500")} style={{ width: `${meterLevel}%` }} />
            <div className="absolute top-0 bottom-0 left-[83%] w-px bg-red-500/50" />
          </div>
        </div>
      </div>
    </section>
  );
});

const EffectsSection = memo(function EffectsSection() {
  const [reverb, setReverb] = useState(0);
  const [delay, setDelay] = useState(0);
  const [filter, setFilter] = useState(50);
  const handleReverb = useCallback((v: number) => { setReverb(v); try { dj.effects?.reverb?.set({ wet: v }); } catch {} }, []);
  const handleDelay = useCallback((v: number) => { setDelay(v); try { dj.effects?.delay?.set({ wet: v }); } catch {} }, []);
  return (
    <section className="space-y-3">
      <span className="text-xs font-medium text-zinc-400">Effects</span>
      <div className="grid grid-cols-3 gap-3">
        <EffectKnob label="Reverb" value={reverb} onChange={handleReverb} color="cyan" />
        <EffectKnob label="Delay" value={delay} onChange={handleDelay} color="amber" />
        <EffectKnob label="Filter" value={filter} onChange={setFilter} color="purple" />
      </div>
    </section>
  );
});

const EffectKnob = memo(function EffectKnob({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: 'cyan' | 'amber' | 'purple' }) {
  const colors = { cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400', amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400', purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400' };
  return (
    <div className={cn("p-3 rounded-xl bg-gradient-to-b border space-y-3", colors[color])}>
      <div className="flex justify-between items-center"><span className="text-[10px] font-medium text-zinc-400">{label}</span><span className={cn("text-[10px] font-mono tabular-nums", value > 0 ? colors[color].split(' ').pop() : "text-zinc-600")}>{Math.round(value * 100)}%</span></div>
      <Slider value={value} min={0} max={1} step={0.01} onChange={onChange} color={color} />
    </div>
  );
});

const RecordSection = memo(function RecordSection({ isRecording, setIsRecording }: { isRecording: boolean; setIsRecording: (v: boolean) => void }) {
  const handleRecord = useCallback(() => {
    if (isRecording) { try { dj.record?.stop(); } catch {} setIsRecording(false); }
    else { try { dj.record?.start(); } catch {} setIsRecording(true); }
  }, [isRecording, setIsRecording]);
  return (
    <section className="mt-auto pt-4 border-t border-zinc-800/50">
      <button onClick={handleRecord} className={cn("w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all", isRecording ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10" : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700/50")}>
        <div className="relative">{isRecording && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />}<div className={cn("w-3 h-3 rounded-full", isRecording ? "bg-red-500" : "bg-red-500/50")} /></div>
        {isRecording ? 'Recording...' : 'Record Session'}
      </button>
    </section>
  );
});

const Slider = memo(function Slider({ value, min, max, step = 1, onChange, gradient, large, color }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; gradient?: boolean; large?: boolean; color?: 'cyan' | 'amber' | 'purple' }) {
  const percent = ((value - min) / (max - min)) * 100;
  const colorMap = { cyan: '#06b6d4', amber: '#f59e0b', purple: '#a855f7' };
  const trackColor = color ? colorMap[color] : gradient ? `linear-gradient(90deg, #06b6d4, #f59e0b)` : '#10b981';
  return (
    <div className="relative group">
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className={cn("w-full appearance-none bg-transparent cursor-pointer", large ? "h-8" : "h-6")}
        style={{ background: `linear-gradient(to right, ${typeof trackColor === 'string' && trackColor.startsWith('linear') ? '#10b981' : trackColor} 0%, ${typeof trackColor === 'string' && trackColor.startsWith('linear') ? '#10b981' : trackColor} ${percent}%, #27272a ${percent}%, #27272a 100%)`, borderRadius: '9999px', height: large ? '8px' : '6px' }} />
      <style jsx>{`input[type="range"]::-webkit-slider-thumb { appearance: none; width: ${large ? '20px' : '14px'}; height: ${large ? '20px' : '14px'}; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: transform 0.15s ease; } input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); } input[type="range"]::-moz-range-thumb { width: ${large ? '20px' : '14px'}; height: ${large ? '20px' : '14px'}; border-radius: 50%; background: white; cursor: pointer; border: none; }`}</style>
    </div>
  );
});

export default MixerComponent;
