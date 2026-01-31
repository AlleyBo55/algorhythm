// Audio Feature Module
// Clean Architecture: Re-exports from engine layer

// Core Audio Engine
export { AudioEngine, audioEngine } from '@/engine/audio';

// Core (Deck, Mixer, Master Bus)
export { Deck } from '@/engine/core/deck';
export type { HotCue, DeckState } from '@/engine/core/deck';
export { DeckBus } from '@/engine/core/deckBus';
export { MasterBus, masterBus } from '@/engine/core/masterBus';
export { Mixer, mixer } from '@/engine/core/mixer';
export type { CrossfaderCurve } from '@/engine/core/mixer';
export { MixingConsole, ChannelStrip, AuxBus, mixingConsole } from '@/engine/core/mixingConsole';

// Timing & Synchronization
export { BeatSyncEngine, beatSyncEngine } from '@/engine/timing/beatSync';
export { BeatSync } from '@/engine/timing/sync';
export type { SyncState } from '@/engine/timing/sync';
export { Quantize } from '@/engine/timing/quantize';
export type { QuantizeValue } from '@/engine/timing/quantize';
export { TimeStretcher, calculateTempoRatio, calculatePitchShift } from '@/engine/timing/timestretch';
export type { TimeStretchOptions } from '@/engine/timing/timestretch';
export { SlipMode } from '@/engine/timing/slip';

// DSP Effects
export * from './dsp';

// Analysis
export { AudioAnalyzer, audioAnalyzer } from '@/engine/analysis/analyzer';
export { SpectrumAnalyzer, SpectrumVisualizer } from '@/engine/analysis/spectrum';

// Utilities
export { LatencyCompensator, latencyCompensator } from '@/engine/latencyCompensator';
export { AudioQualityOptimizer, audioQualityOptimizer } from '@/engine/audioQuality';

// Control
export { VinylMode, JogWheel, ScratchPattern } from '@/engine/control/vinyl';
export { MIDIController, midiController } from '@/engine/control/midi';
export type { MIDIMapping, MIDIMessage } from '@/engine/control/midi';

// Instruments
export { getInstruments, getEffects, waitForSamplersLoaded } from '@/engine/instruments/instruments';
export { getR2Instruments, getR2Effects } from '@/engine/instruments/r2Instruments';

// Remix
export { RemixEngine, remixEngine, InstrumentTracker, instrumentTracker } from '@/engine/remix/remixEngine';
export { StyleProcessor, styleProcessor } from '@/engine/remix/styleProcessor';
export { HarmonicMixing } from '@/engine/remix/harmonic';

// Playback
export { SamplePlayer, samplePlayer, addSampleSupport } from '@/engine/playback/samplePlayer';
export { SampleManager, sampleManager } from '@/engine/playback/samples';
