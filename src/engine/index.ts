// Audio Engine - Main Entry Point
// Clean Architecture: Organized by domain

// Core Audio (Deck, Mixer, Master Bus)
export { Deck } from './core/deck';
export type { HotCue, DeckState } from './core/deck';
export { DeckBus } from './core/deckBus';
export { MasterBus, masterBus } from './core/masterBus';
export { Mixer, mixer } from './core/mixer';
export type { CrossfaderCurve } from './core/mixer';
export { MixingConsole, ChannelStrip, AuxBus, mixingConsole } from './core/mixingConsole';

// Timing & Synchronization
export { BeatSyncEngine, beatSyncEngine } from './timing/beatSync';
export { BeatSync } from './timing/sync';
export type { SyncState } from './timing/sync';
export { Quantize } from './timing/quantize';
export type { QuantizeValue } from './timing/quantize';
export { TimeStretcher, calculateTempoRatio, calculatePitchShift } from './timing/timestretch';
export type { TimeStretchOptions } from './timing/timestretch';
export { SlipMode } from './timing/slip';

// Instruments & Synthesis
export { getInstruments, getEffects, waitForSamplersLoaded } from './instruments/instruments';
export { ACCURATE_PRESETS, SONG_INSTRUMENTS } from './instruments/accurateInstruments';
export { getR2Instruments, getR2Effects } from './instruments/r2Instruments';

// Remix & Production
export { RemixEngine, remixEngine, InstrumentTracker, instrumentTracker } from './remix/remixEngine';
export { StyleProcessor, styleProcessor } from './remix/styleProcessor';
export { SoundDesignManager, createConfiguredSynth, SOUND_PRESETS } from './remix/soundDesign';
export { HarmonicMixing } from './remix/harmonic';

// Control & Input (Vinyl, MIDI)
export { VinylMode, JogWheel, ScratchPattern } from './control/vinyl';
export { MIDIController, midiController } from './control/midi';
export type { MIDIMapping, MIDIMessage } from './control/midi';

// Audio Analysis
export { AudioAnalyzer, audioAnalyzer } from './analysis/analyzer';
export { SpectrumAnalyzer, SpectrumVisualizer } from './analysis/spectrum';
export { PerformanceAnalytics, performanceAnalytics } from './analysis/performance';

// Playback & Samples
export { SamplePlayer, samplePlayer, addSampleSupport } from './playback/samplePlayer';
export { sampleCache, ALL_SAMPLES, preloadAllSamples, areSamplesCached } from './playback/sampleCache';
export { SamplePad, SampleDeck } from './playback/sampler';
export { SampleManager, sampleManager } from './playback/samples';

// DSP Effects
export { StereoDelay } from './dsp/delay';
export { StudioReverb } from './dsp/studioReverb';
export { ParametricEQ } from './dsp/parametricEQ';
export { DynamicsProcessor } from './dsp/dynamics';

// Streaming
export * from './streaming';

// Effects Rack
export { Effect, EffectsRack, ColorFX } from './effects';
export type { EffectType, EffectChain } from './effects';

// Main Audio Engine
export { AudioEngine, audioEngine } from './audio';

// Runner
export { Runner, runner } from './runner';
export type { CompileError } from './runner';

// Native Audio
export { nativeAudio, playSample, isSampleReady } from './nativeAudio';

// Audio Quality
export { AudioQualityOptimizer, audioQualityOptimizer } from './audioQuality';

// Latency Compensation
export { LatencyCompensator, latencyCompensator } from './latencyCompensator';

// Recorder
export { RecordingEngine, recordingEngine } from './recorder';
export type { RecordingOptions } from './recorder';

// Stems
export { StemSeparator } from './stems';
export type { StemType, StemData } from './stems';

// Automation
export { AutomationRecorder } from './automation';
export type { AutomationPoint, AutomationClip } from './automation';

// Pattern Parser
export { PatternParser } from './patternParser';

// Presets
export { createPresets } from './presets';
export type { PresetMap } from './presets';

// Templates
export { TemplateLibrary, TEMPLATES } from './templates';
export type { Template } from './templates';

// Cloud
export { CloudStorage } from './cloud';
export type { Project, TrackData, EffectData, AutomationData } from './cloud';

// DJ API
export { DJAPI, dj } from './djapi';
