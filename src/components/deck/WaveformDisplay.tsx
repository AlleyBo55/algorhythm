'use client';

import { useEffect, useRef, useState, memo } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
  audioFile?: File;
  beatGrid?: number[];
  hotCues?: Map<number, { time: number; label?: string }>;
  onReady?: (wavesurfer: WaveSurfer) => void;
  height?: number;
}

export const WaveformDisplay = memo(function WaveformDisplay({
  audioFile, beatGrid = [], hotCues = new Map(), onReady, height = 80
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#3f3f46', progressColor: '#1db954', cursorColor: '#ffffff',
      barWidth: 2, barGap: 1, barRadius: 1, height, normalize: true, backend: 'WebAudio', interact: true
    });
    wavesurferRef.current = wavesurfer;
    wavesurfer.on('ready', () => { setIsReady(true); onReady?.(wavesurfer); });
    return () => wavesurfer.destroy();
  }, [height, onReady]);

  useEffect(() => {
    if (!audioFile || !wavesurferRef.current) return;
    const loadAudio = async () => {
      const arrayBuffer = await audioFile.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: audioFile.type });
      wavesurferRef.current?.loadBlob(blob);
    };
    loadAudio();
  }, [audioFile]);

  useEffect(() => {
    if (!isReady || !wavesurferRef.current || beatGrid.length === 0) return;
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const duration = wavesurferRef.current.getDuration();
    const width = canvas.width;
    const canvasHeight = canvas.height;
    ctx.strokeStyle = '#52525b'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    beatGrid.forEach((beatTime) => {
      const x = (beatTime / duration) * width;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }, [isReady, beatGrid]);

  useEffect(() => {
    if (!isReady || !wavesurferRef.current || hotCues.size === 0) return;
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const duration = wavesurferRef.current.getDuration();
    const width = canvas.width;
    ctx.fillStyle = '#ef4444'; ctx.globalAlpha = 0.8;
    hotCues.forEach((cue) => {
      const x = (cue.time / duration) * width;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 4, 8); ctx.lineTo(x + 4, 8); ctx.closePath(); ctx.fill();
      if (cue.label) {
        ctx.fillStyle = '#ffffff'; ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.fillText(cue.label, x + 6, 10); ctx.fillStyle = '#ef4444';
      }
    });
    ctx.globalAlpha = 1;
  }, [isReady, hotCues]);

  return (
    <div className="relative w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      <div ref={containerRef} className="w-full" />
      {!isReady && audioFile && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-zinc-400">Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default WaveformDisplay;
