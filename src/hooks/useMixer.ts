// Mixer Hook - Extracts mixer logic from Mixer component
import { useState, useCallback, useEffect } from 'react';
import { dj } from '@/engine/djapi';

interface UseMixerReturn {
  crossfader: number;
  masterVolume: number;
  meterLevel: number;
  isRecording: boolean;
  setCrossfader: (value: number) => void;
  setMasterVolume: (value: number) => void;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
}

export function useMixer(): UseMixerReturn {
  const [crossfader, setCrossfaderState] = useState(0);
  const [masterVolume, setMasterVolumeState] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [meterLevel, setMeterLevel] = useState(0);

  // Simulated meter level based on master volume
  useEffect(() => {
    const interval = setInterval(() => {
      const base = ((masterVolume + 60) / 72) * 100;
      setMeterLevel(Math.min(100, base + Math.random() * 15));
    }, 100);
    return () => clearInterval(interval);
  }, [masterVolume]);

  const setCrossfader = useCallback((value: number) => {
    setCrossfaderState(value);
    try {
      dj.crossfader.position = value;
    } catch {}
  }, []);

  const setMasterVolume = useCallback((value: number) => {
    setMasterVolumeState(value);
    try {
      dj.master.volume = value;
    } catch {}
  }, []);

  const startRecording = useCallback(() => {
    try {
      dj.record?.start();
    } catch {}
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    try {
      dj.record?.stop();
    } catch {}
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return {
    crossfader,
    masterVolume,
    meterLevel,
    isRecording,
    setCrossfader,
    setMasterVolume,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
