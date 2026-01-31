// Instruments
// Synths, samplers, and instrument presets

export { 
  DefaultInstruments, 
  getInstruments, 
  getEffects,
  waitForSamplersLoaded 
} from './instruments';
export type { InstrumentMap } from './instruments';

export { ACCURATE_PRESETS, SONG_INSTRUMENTS, presets } from './accurateInstruments';
export type { AccuratePresetName } from './accurateInstruments';

export { R2Instruments, getR2Instruments, getR2Effects } from './r2Instruments';
export type { R2InstrumentMap } from './r2Instruments';
