// Shared Hooks
// Clean Architecture: Presentation layer utilities

export { 
  useAudioStore,
  useDeckState,
  useMixerState,
  useEffectsState,
  useIsInitialized,
  useIsAnyDeckPlaying,
  useActiveDeckCount,
} from '@/hooks/useAudioState';
export { useDJ } from '@/hooks/useDJ';
export { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
export { useStreamingStore } from '@/hooks/useStreamingState';
