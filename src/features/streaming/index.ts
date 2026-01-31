// Streaming Feature Module
// Clean Architecture: Feature layer for live streaming
// 
// Structure:
// - services/     Core streaming services (AudioRouter, Recording, Theme, Overlay)
// - chat/         Chat integration (Twitch, YouTube, Commands)
// - storage/      Persistence (IndexedDB, LocalStorage)
// - infrastructure/ Network & caching (Adaptive, Bandwidth, Cache)

// Types
export * from './types';

// Services
export * from './services';

// Chat
export * from './chat';

// Storage
export * from './storage';

// Infrastructure
export * from './infrastructure';

// Integration (singleton only)
export { streamingIntegration } from '@/engine/streaming/integration';
