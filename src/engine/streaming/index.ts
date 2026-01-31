// Streaming Integration Module
// World-class patterns from: Spotify, Netflix, TikTok, OBS, Twitch

// Types
export * from './types';

// Storage
export { 
  dbManager, 
  recoveryManager, 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  removeFromLocalStorage,
  STORAGE_KEYS 
} from './storage';

// Audio Router
export { AudioRouter, audioRouter } from './audioRouter';

// Recording Engine
export { RecordingEngine, recordingEngine } from './recordingEngine';

// Theme Manager
export { ThemeManager, themeManager } from './themeManager';

// Overlay Renderer
export { OverlayRenderer, overlayRenderer } from './overlayRenderer';

// Chat Integration
export { ChatIntegration, chatIntegration } from './chatIntegration';

// Command Parser
export { CommandParser, commandParser, CooldownManager, EffectQueue } from './commandParser';

// Integration
export { streamingIntegration } from './integration';

// Re-export existing streaming modules
export { audioCache } from './cache';
export { audioPreloader } from './preloader';
export { AdaptiveAudioStream } from './adaptiveStream';
export { BandwidthMonitor } from './bandwidth';
export { realtimeProcessor } from './realtime';
