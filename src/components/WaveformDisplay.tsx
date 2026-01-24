'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
  audioFile?: File;
  beatGrid?: number[];
  hotCues?: Map<number, { time: number; label?: string }>;
  onReady?: (wavesurfer: WaveSurfer) => void;
  height?: number;
}

export default function WaveformDisplay({
  audioFile,
  beatGrid = [],
  hotCues = new Map(),
  onReady,
  height = 128
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#00FF00',
      progressColor: '#CCFF00',
      cursorColor: '#FFFFFF',
      barWidth: 2,
      barGap: 1,
      height,
      normalize: true,
      backend: 'WebAudio',
      interact: true
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      setIsReady(true);
      onReady?.(wavesurfer);
    });

    return () => {
      wavesurfer.destroy();
    };
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

  // Draw beat grid
  useEffect(() => {
    if (!isReady || !wavesurferRef.current || beatGrid.length === 0) return;

    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const duration = wavesurferRef.current.getDuration();
    const width = canvas.width;
    const height = canvas.height;

    // Draw beat markers
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    beatGrid.forEach((beatTime) => {
      const x = (beatTime / duration) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
  }, [isReady, beatGrid]);

  // Draw hot cues
  useEffect(() => {
    if (!isReady || !wavesurferRef.current || hotCues.size === 0) return;

    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const duration = wavesurferRef.current.getDuration();
    const width = canvas.width;
    const height = canvas.height;

    // Draw cue markers
    ctx.fillStyle = '#FF0000';
    ctx.globalAlpha = 0.7;

    hotCues.forEach((cue, index) => {
      const x = (cue.time / duration) * width;
      
      // Draw triangle marker
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 5, 10);
      ctx.lineTo(x + 5, 10);
      ctx.closePath();
      ctx.fill();

      // Draw label
      if (cue.label) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.fillText(cue.label, x + 7, 10);
        ctx.fillStyle = '#FF0000';
      }
    });

    ctx.globalAlpha = 1;
  }, [isReady, hotCues]);

  return (
    <div className="relative w-full bg-black border border-[#333]">
      <div ref={containerRef} className="w-full" />
      {!isReady && audioFile && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-[#CCFF00] text-xs font-mono">ANALYZING...</div>
        </div>
      )}
    </div>
  );
}
