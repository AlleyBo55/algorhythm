'use client';

import { memo, useCallback, useState, useRef } from 'react';
import { dj } from '@/engine/djapi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/components/ui/Button';

export const MixerComponent = memo(function MixerComponent() {
  const [crossfaderPos, setCrossfaderPos] = useState(0);
  const [masterVol, setMasterVol] = useState(0);

  const handleCrossfaderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCrossfaderPos(value);
    dj.crossfader.position = value;
  }, []);

  const handleMasterVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMasterVol(value);
    dj.master.volume = value;
  }, []);

  return (
    <Card variant="glass" className="p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Mixer</h3>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
      </div>

      {/* Crossfader Section */}
      <div className="space-y-4 p-4 bg-black/20 rounded-xl border border-white/5">
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground tracking-widest">
          <span className="text-cyan-400">DECK A</span>
          <span>CROSSFADER</span>
          <span className="text-purple-400">DECK B</span>
        </div>

        <Slider
          min="-1" max="1" step="0.01"
          value={crossfaderPos}
          onChange={handleCrossfaderChange}
          className="h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-track]:h-2 [&::-webkit-slider-track]:bg-black/50"
        />

        <div className="flex justify-center gap-1">
          {['linear', 'power', 'constant'].map((curve) => (
            <button
              key={curve}
              onClick={() => dj.crossfader.curve = curve as any}
              className="px-3 py-1 text-[9px] uppercase tracking-wider bg-white/5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white transition-colors border border-transparent hover:border-white/10"
            >
              {curve}
            </button>
          ))}
        </div>
      </div>

      {/* Master Volume */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>MASTER GAIN</span>
          <span className={cn(masterVol > 0 ? "text-red-400" : "text-white")}>{masterVol > 0 ? "+" : ""}{masterVol} dB</span>
        </div>
        <Slider
          min="-60" max="12"
          value={masterVol}
          onChange={handleMasterVolume}
          className="[&::-webkit-slider-track]:bg-gradient-to-r [&::-webkit-slider-track]:from-emerald-900 [&::-webkit-slider-track]:via-emerald-500 [&::-webkit-slider-track]:to-red-500"
        />
      </div>

      {/* Effects */}
      <EffectsPanel />

      {/* Recording */}
      <RecordingControls />
    </Card>
  );
});

const EffectsPanel = memo(function EffectsPanel() {
  const [reverbWet, setReverbWet] = useState(0);
  const [delayWet, setDelayWet] = useState(0);

  return (
    <div className="space-y-4 pt-4 border-t border-white/5">
      <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">FX Chain</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs text-secondary-foreground font-mono">Reverb</span>
          <Slider
            min="0" max="1" step="0.01" value={reverbWet}
            onChange={(e) => {
              const v = Number(e.target.value);
              setReverbWet(v);
              // Assuming simple API for now, would likely need debouncing/ref if real object
              // dj.effects.reverb.wet.value = v; 
            }}
            className="[&::-webkit-slider-thumb]:bg-cyan-400"
          />
        </div>
        <div className="space-y-2">
          <span className="text-xs text-secondary-foreground font-mono">Delay</span>
          <Slider
            min="0" max="1" step="0.01" value={delayWet}
            onChange={(e) => setDelayWet(Number(e.target.value))}
            className="[&::-webkit-slider-thumb]:bg-purple-400"
          />
        </div>
      </div>
    </div>
  );
});

const RecordingControls = memo(function RecordingControls() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = useCallback(() => {
    if (isRecording) {
      dj.record.stop();
      setIsRecording(false);
    } else {
      dj.record.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <Button
      onClick={handleRecord}
      variant={isRecording ? "destructive" : "outline"}
      className={cn("w-full h-12 text-sm uppercase tracking-widest font-bold transition-all", isRecording && "animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]")}
    >
      <div className={cn("mr-2 w-3 h-3 rounded-full", isRecording ? "bg-white" : "bg-red-500")} />
      {isRecording ? "REC [ON AIR]" : "Start Recording"}
    </Button>
  );
});
