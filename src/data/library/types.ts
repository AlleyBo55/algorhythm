/**
 * Library Types
 * Core type definitions for DJ templates and song configurations
 */

export interface FrequencyProfile {
  bass: boolean;
  mid: boolean;
  high: boolean;
}

export interface InstrumentConfig {
  name: string;
  type: string;
  sound: string;
  pattern: string;
  volume: number;
  effects?: string[];
  frequencyProfile: FrequencyProfile;
}

export interface TransitionConfig {
  type: 'filter-sweep' | 'reverb-build' | 'drop' | 'break' | string;
  duration: number;
  energy: number;
}

export interface TrueRemixConfig {
  enabled: boolean;
  intensity: number;
  style: string;
  transitions: TransitionConfig[];
  progression: {
    introLength: number;
    buildLength: number;
    dropBar: number;
  };
}

export interface ReverbConfig {
  type: string;
  size: number;
  decay: number;
  mix: number;
}

export interface DelayConfig {
  time: string;
  feedback: number;
  mix: number;
}

export interface FilterConfig {
  type: string;
  cutoff: number;
  resonance: number;
  automation?: string;
}

export interface EffectsConfig {
  reverb?: ReverbConfig;
  delay?: DelayConfig;
  filter?: FilterConfig;
}

export interface CompressionConfig {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface MixConfig {
  masterVolume: number;
  compression: CompressionConfig;
}

export interface DJTemplate {
  id: string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  energy: number;
  danceability: number;
  valence: number;
  trueRemix: TrueRemixConfig;
  instruments: InstrumentConfig[];
  effects: EffectsConfig;
  mix: MixConfig;
}

export interface ArtistProfile {
  id: string;
  name: string;
  genres: string[];
  templates: DJTemplate[];
}
