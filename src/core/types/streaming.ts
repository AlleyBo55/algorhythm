// Streaming Domain Types
// Re-export from streaming module for clean architecture compliance

export type {
  // Audio Router
  VirtualDeviceType,
  VirtualAudioDevice,
  AudioLevelMeter,
  AudioChannel,
  AudioRouterConfig,
  
  // Recording
  RecordingStatus,
  ExportFormat,
  MarkerExportFormat,
  RecordingMarker,
  RecordingState,
  RecordingConfig,
  RecoveryData,
  
  // Theme & Overlay
  ThemeId,
  LayoutId,
  ChromaKeyColor,
  ThemeColors,
  Theme,
  ComponentPosition,
  Layout,
  OverlayComponentType,
  VisualizerType,
  NotificationPosition,
  NotificationAnimation,
  OverlayComponent,
  VisualizerConfig,
  NotificationConfig,
  
  // Chat
  ChatPlatform,
  ConnectionStatus,
  ChatMessage,
  TwitchConfig,
  YouTubeConfig,
  
  // Commands
  CommandParameterType,
  CommandParameter,
  CommandContext,
  ParsedCommand,
  CommandDefinition,
  CooldownState,
  QueuedEffect,
  QueueConfig,
  
  // Storage
  RecordingChunk,
  RecordingMetadata,
} from '@/features/streaming/types';
