'use client';

import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { dj } from '@/engine/djapi';

export const MixerComponent = memo(function MixerComponent() {
  const [crossfaderPos, setCrossfaderPos] = useState(0);
  const [masterVol, setMasterVol] = useState(0);
  const isDragging = useRef(false);

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
    <div className="mixer bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-xl font-bold text-white mb-6">Mixer</h3>

      {/* Crossfader */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-zinc-400">A</span>
          <span className="text-sm text-white font-medium">CROSSFADER</span>
          <span className="text-xs text-zinc-400">B</span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={crossfaderPos}
          onChange={handleCrossfaderChange}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={() => dj.crossfader.curve = 'linear'}
            className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Linear
          </button>
          <button
            onClick={() => dj.crossfader.curve = 'power'}
            className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Power
          </button>
          <button
            onClick={() => dj.crossfader.curve = 'constant'}
            className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Constant
          </button>
        </div>
      </div>

      {/* Master Volume */}
      <div className="mb-6">
        <label className="text-sm text-white font-medium mb-2 block">MASTER</label>
        <input
          type="range"
          min="-60"
          max="12"
          value={masterVol}
          onChange={handleMasterVolume}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center text-xs text-zinc-400 mt-1">{masterVol} dB</div>
      </div>

      {/* Effects */}
      <EffectsPanel />

      {/* Recording */}
      <RecordingControls />
    </div>
  );
});

const EffectsPanel = memo(function EffectsPanel() {
  const [reverbWet, setReverbWet] = useState(0);
  const [delayWet, setDelayWet] = useState(0);

  return (
    <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
      <h4 className="text-sm font-medium text-white mb-3">Effects</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Reverb</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbWet}
            onChange={(e) => setReverbWet(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Delay</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delayWet}
            onChange={(e) => setDelayWet(Number(e.target.value))}
            className="w-full"
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
    <div className="flex gap-2">
      <button
        onClick={handleRecord}
        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
        }`}
      >
        {isRecording ? '⏹ Stop' : '⏺ Record'}
      </button>
    </div>
  );
});
