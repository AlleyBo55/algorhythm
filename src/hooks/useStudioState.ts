import { useState, useRef, useCallback } from 'react';

type StudioState = 'welcome' | 'loading' | 'ready';

export function useStudioState() {
  const [state, setState] = useState<StudioState>('welcome');
  const djRef = useRef<typeof import('@/engine/djapi').dj | null>(null);

  const handleStart = useCallback(async () => {
    setState('loading');
    try {
      const { dj } = await import('@/engine/djapi');
      djRef.current = dj;
      await dj.engine.init();
      dj.init();
    } catch (err) {
      console.error('Init failed:', err);
      setState('welcome');
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setState('ready');
  }, []);

  return {
    state,
    djRef,
    handleStart,
    handleLoadingComplete,
  };
}
