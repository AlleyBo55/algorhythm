// Effects Hook - Extracts effects logic from Mixer component
import { useState, useCallback } from 'react';
import { dj } from '@/engine/djapi';

interface UseEffectsReturn {
  reverb: number;
  delay: number;
  filter: number;
  setReverb: (value: number) => void;
  setDelay: (value: number) => void;
  setFilter: (value: number) => void;
}

export function useEffects(): UseEffectsReturn {
  const [reverb, setReverbState] = useState(0);
  const [delay, setDelayState] = useState(0);
  const [filter, setFilterState] = useState(50);

  const setReverb = useCallback((value: number) => {
    setReverbState(value);
    try {
      dj.effects?.reverb?.set({ wet: value });
    } catch {}
  }, []);

  const setDelay = useCallback((value: number) => {
    setDelayState(value);
    try {
      dj.effects?.delay?.set({ wet: value });
    } catch {}
  }, []);

  const setFilter = useCallback((value: number) => {
    setFilterState(value);
    // Filter logic can be added here
  }, []);

  return {
    reverb,
    delay,
    filter,
    setReverb,
    setDelay,
    setFilter,
  };
}
