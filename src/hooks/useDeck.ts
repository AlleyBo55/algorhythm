// Deck Hook - Extracts playback and EQ logic from Deck component
import { useState, useCallback, useEffect, useRef } from 'react';
import { dj } from '@/engine/djapi';

interface EQState {
  high: number;
  mid: number;
  low: number;
}

interface UseDeckOptions {
  id: 'A' | 'B' | 'C' | 'D';
}

export function useDeck({ id }: UseDeckOptions) {
  const deck = dj.deck[id];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [eq, setEq] = useState<EQState>({ high: 0, mid: 0, low: 0 });

  // Vinyl rotation animation
  useEffect(() => {
    if (!isPlaying) return;
    let frame: number;
    const animate = () => {
      setRotation(r => (r + 0.5) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const loadTrack = useCallback(async (file: File) => {
    setTrackName(file.name.replace(/\.[^/.]+$/, ''));
    await (deck as any).load(file);
  }, [deck]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await loadTrack(file);
  }, [loadTrack]);

  const play = useCallback(() => {
    deck.play();
    setIsPlaying(true);
  }, [deck]);

  const pause = useCallback(() => {
    deck.pause();
    setIsPlaying(false);
  }, [deck]);

  const stop = useCallback(() => {
    deck.stop();
    setIsPlaying(false);
  }, [deck]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const setEqBand = useCallback((band: keyof EQState, value: number) => {
    const clamped = Math.max(-12, Math.min(12, value));
    deck.eq[band] = clamped;
    setEq(prev => ({ ...prev, [band]: clamped }));
  }, [deck]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const deckColor = id === 'A' || id === 'C' ? 'cyan' : 'amber';

  return {
    // State
    isPlaying,
    trackName,
    rotation,
    eq,
    deckColor,
    fileInputRef,
    // Actions
    play,
    pause,
    stop,
    togglePlayPause,
    setEqBand,
    loadTrack,
    handleFileChange,
    openFilePicker,
  };
}
