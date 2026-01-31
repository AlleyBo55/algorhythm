// Audio Domain Types

export interface AudioConfig {
  sampleRate: number;
  bitDepth: number;
  channels: number;
  latency: number;
}

export interface DeckState {
  id: string;
  isPlaying: boolean;
  volume: number;
  bpm: number;
  position: number;
  trackId: string | null;
}

export interface MixerChannel {
  id: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  eq: {
    low: number;
    mid: number;
    high: number;
  };
}

export interface EffectParams {
  type: string;
  wet: number;
  params: Record<string, number>;
}

export type PlaybackState = 'stopped' | 'playing' | 'paused' | 'loading';
