// Hooks - Main Entry Point
// Organized by domain

// Audio State Management
export { useAudioStore, useDeckState, useMixerState, useEffectsState, useIsInitialized, useIsAnyDeckPlaying, useActiveDeckCount } from './useAudioState';
export type { DeckState, MixerState, EffectsState } from './useAudioState';

// DJ Engine
export { useDJ } from './useDJ';
export type { CompileError } from './useDJ';

// Deck Controls
export { useDeck } from './useDeck';

// Mixer Controls
export { useMixer } from './useMixer';

// Effects Controls
export { useEffects } from './useEffects';

// Code Compilation
export { useCodeCompilation } from './useCodeCompilation';
export type { CompilationPhase } from './useCodeCompilation';

// AI Chat
export { useAIChat, MODELS } from './useAIChat';
export type { Provider, Message, AIConfig } from './useAIChat';

// Keyboard Shortcuts
export { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from './useKeyboardShortcuts';

// Streaming State
export { useStreamingStore, selectIsRecording, selectIsChatConnected, selectQueueLength, selectActiveNotifications } from './useStreamingState';

// Landing Page
export { useLandingPage, useNavigation } from './useLandingPage';

// Studio State
export { useStudioState } from './useStudioState';
