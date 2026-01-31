// Remix & Production
// Remix engine, style processing, sound design, harmonic mixing

export { 
  RemixEngine, 
  remixEngine, 
  InstrumentTracker, 
  instrumentTracker 
} from './remixEngine';
export type { FrequencyProfile, RemixConfig } from './remixEngine';

export { StyleProcessor, styleProcessor } from './styleProcessor';
export type { StyleProfile } from './styleProcessor';

export { 
  SoundDesignManager, 
  createConfiguredSynth, 
  SOUND_PRESETS, 
  PRESET_NAMES 
} from './soundDesign';
export type { SynthConfig, SoundPresetName } from './soundDesign';

export { HarmonicMixing } from './harmonic';
export type { MusicalKey, CamelotKey, HarmonicMatch } from './harmonic';
