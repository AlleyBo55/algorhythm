// Streaming Integration Types
// Patterns: Spotify (audio routing), Netflix (adaptive), TikTok (real-time), OBS (broadcast)

// ============================================================================
// AUDIO ROUTER TYPES
// ============================================================================

export type VirtualDeviceType = 'vb-cable' | 'blackhole' | 'voicemeeter' | 'obs-virtual' | 'unknown';

export interface VirtualAudioDevice {
  id: string;
  name: string;
  type: VirtualDeviceType;
  sampleRate: number;
  channels: number;
}

export interface AudioLevelMeter {
  current: number;      // dB (-60 to 0)
  peak: number;         // dB (peak hold)
  peakTimestamp: number;
  isClipping: boolean;  // > 0dB
  isWarning: boolean;   // > -3dB
}

export interface AudioChannel {
  id: string;
  name: string;
  deviceId: string;
  volume: number;       // 0-1
  muted: boolean;
  meter: AudioLevelMeter;
}

export interface AudioRouterConfig {
  primaryOutput: string;
  secondaryOutput?: string;
  enableLevelMonitoring: boolean;
  peakHoldDuration: number;  // ms (default: 3000)
}

// ============================================================================
// RECORDING ENGINE TYPES
// ============================================================================

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'processing';
export type ExportFormat = 'wav' | 'mp3' | 'webm';
export type MarkerExportFormat = 'json' | 'cue';

export interface RecordingMarker {
  id: string;
  timestamp: number;    // ms from start
  label?: string;
  createdAt: Date;
}

export interface RecordingState {
  status: RecordingStatus;
  startTime: number | null;
  duration: number;
  fileSize: number;
  markers: RecordingMarker[];
}

export interface RecordingConfig {
  format: ExportFormat;
  bitrate: number;
  sampleRate: number;
  autoSaveInterval: number;  // ms (default: 30000)
  maxDuration: number;       // ms (0 = unlimited)
}

export interface RecoveryData {
  id: string;
  chunks: Blob[];
  markers: RecordingMarker[];
  startTime: number;
  lastSaveTime: number;
}

// ============================================================================
// THEME & OVERLAY TYPES
// ============================================================================

export type ThemeId = 'dark' | 'neon' | 'minimal' | 'retro';
export type LayoutId = 'landscape-16-9' | 'vertical-9-16' | 'square-1-1';
export type ChromaKeyColor = '#00FF00' | '#0000FF' | '#FF00FF';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  effects: {
    glow: boolean;
    blur: boolean;
    gradients: boolean;
  };
}

export interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

export interface Layout {
  id: LayoutId;
  name: string;
  aspectRatio: string;
  width: number;
  height: number;
  componentPositions: Map<string, ComponentPosition>;
}

// ============================================================================
// OVERLAY TYPES
// ============================================================================

export type OverlayComponentType = 
  | 'now-playing' 
  | 'bpm-display' 
  | 'waveform' 
  | 'time-elapsed' 
  | 'next-track'
  | 'visualizer'
  | 'chat-notification';

export type VisualizerType = 'waveform' | 'frequency-bars' | 'circular-spectrum';
export type NotificationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type NotificationAnimation = 'slide' | 'fade' | 'bounce';

export interface OverlayComponent {
  id: string;
  type: OverlayComponentType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  config: Record<string, unknown>;
}

export interface VisualizerConfig {
  type: VisualizerType;
  colors: string[];
  intensity: number;    // 0-100
  smoothing: number;    // 0-1
  barCount?: number;
  lineWidth?: number;
}

export interface NotificationConfig {
  duration: number;     // ms
  position: NotificationPosition;
  maxVisible: number;
  animation: NotificationAnimation;
}

// ============================================================================
// CHAT INTEGRATION TYPES
// ============================================================================

export type ChatPlatform = 'twitch' | 'youtube';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface ChatMessage {
  id: string;
  platform: ChatPlatform;
  username: string;
  displayName: string;
  message: string;
  timestamp: Date;
  badges: string[];
  isModerator: boolean;
  isSubscriber: boolean;
  isBroadcaster: boolean;
}

export interface TwitchConfig {
  channel: string;
  anonymous: boolean;
}

export interface YouTubeConfig {
  liveStreamId: string;
  pollInterval: number;
  apiKey?: string;
}

// ============================================================================
// COMMAND PARSER TYPES
// ============================================================================

export type CommandParameterType = 'number' | 'string' | 'boolean';

export interface CommandParameter {
  name: string;
  type: CommandParameterType;
  required: boolean;
  default?: unknown;
  min?: number;
  max?: number;
}

export interface CommandContext {
  message: ChatMessage;
  platform: ChatPlatform;
  timestamp: Date;
}

export interface ParsedCommand {
  name: string;
  parameters: Record<string, unknown>;
  raw: string;
}

export interface CommandDefinition {
  name: string;
  aliases: string[];
  description: string;
  parameters: CommandParameter[];
  cooldown: number;       // ms
  moderatorOnly: boolean;
  enabled: boolean;
  action: (params: Record<string, unknown>, context: CommandContext) => void;
}

// ============================================================================
// COOLDOWN & QUEUE TYPES
// ============================================================================

export interface CooldownState {
  command: string;
  expiresAt: number;
  remainingMs: number;
}

export interface QueuedEffect {
  id: string;
  command: ParsedCommand;
  context: CommandContext;
  queuedAt: number;
  priority: number;
}

export interface QueueConfig {
  maxSize: number;
  processInterval: number;  // ms between effects
  allowDuplicates: boolean;
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface RecordingChunk {
  id: string;
  recordingId: string;
  index: number;
  data: Blob;
  timestamp: number;
}

export interface RecordingMetadata {
  id: string;
  startTime: number;
  lastSaveTime: number;
  duration: number;
  format: string;
  markers: RecordingMarker[];
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  THEME_PREFERENCES: 'streaming:theme',
  OVERLAY_LAYOUT: 'streaming:overlay',
  COMMAND_CONFIG: 'streaming:commands',
  AUDIO_ROUTING: 'streaming:audio-routing',
  CHAT_CONFIG: 'streaming:chat',
} as const;
