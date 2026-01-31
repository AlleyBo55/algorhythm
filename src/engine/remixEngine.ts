import * as Tone from 'tone';
import { Deck } from './deck';
import type { TrueRemixConfig, InstrumentConfig, TransitionConfig } from '@/data/library/types';

export interface FrequencyProfile {
  bass: number;    // 0-250Hz
  mid: number;     // 250-4kHz
  high: number;    // 4k-20kHz
}

export interface RemixConfig {
  intensity: number;        // 0-1: original → remix
  eqCarving: boolean;       // Auto-cut conflicting frequencies
  sidechain: boolean;       // Duck track on kick/bass
  dynamicVolume: boolean;   // Auto-balance track vs instruments
}

export class RemixEngine {
  private analyser: Tone.Analyser | null = null;
  private compressor: Tone.Compressor | null = null;
  private sidechainTrigger: Tone.Signal | null = null;
  
  constructor() {
    // Lazy initialization - only create when needed
    // This allows tests to run without full audio context
  }

  private ensureInitialized(): void {
    if (!this.analyser) {
      this.analyser = new Tone.Analyser('fft', 2048);
    }
    if (!this.compressor) {
      this.compressor = new Tone.Compressor({
        threshold: -24,
        ratio: 12,
        attack: 0.003,
        release: 0.25
      });
    }
    if (!this.sidechainTrigger) {
      this.sidechainTrigger = new Tone.Signal(0);
    }
  }

  /**
   * Analyze track frequency content in real-time
   */
  analyzeTrack(deck: Deck): FrequencyProfile {
    this.ensureInitialized();
    deck.player.connect(this.analyser!);
    const values = this.analyser!.getValue() as Float32Array;
    
    // FFT bins to frequency ranges
    const bassEnd = Math.floor(250 / (44100 / 2048));
    const midEnd = Math.floor(4000 / (44100 / 2048));
    
    const bass = this.getAverageEnergy(values, 0, bassEnd);
    const mid = this.getAverageEnergy(values, bassEnd, midEnd);
    const high = this.getAverageEnergy(values, midEnd, values.length);
    
    return { bass, mid, high };
  }

  private getAverageEnergy(values: Float32Array, start: number, end: number): number {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += Math.abs(values[i]);
    }
    return sum / (end - start);
  }

  /**
   * Smart EQ carving - cut track frequencies where instruments play
   * Enhanced for Phase 2 with InstrumentConfig support
   */
  carveEQ(deck: Deck, activeInstruments: Set<string>): void {
    // Reset to neutral
    let lowCut = 0;
    let midCut = 0;
    let highCut = 0;

    // Cut based on active instruments
    if (activeInstruments.has('bass') || activeInstruments.has('kick') || activeInstruments.has('sub')) {
      lowCut = -12; // Heavy bass cut
    }
    
    if (activeInstruments.has('lead') || activeInstruments.has('synth') || activeInstruments.has('pluck')) {
      midCut = -6; // Moderate mid cut
    }
    
    if (activeInstruments.has('hihat') || activeInstruments.has('cymbal') || activeInstruments.has('shaker')) {
      highCut = -6; // Moderate high cut
    }

    // Apply smoothly
    deck.eq.low.gain.rampTo(lowCut, 0.05);
    deck.eq.mid.gain.rampTo(midCut, 0.05);
    deck.eq.high.gain.rampTo(highCut, 0.05);
  }

  /**
   * Apply EQ carving based on active instruments with frequency profiles
   * Phase 2 enhanced version
   */
  applyEQCarving(deck: Deck, activeInstruments: Set<InstrumentConfig>): void {
    let lowCut = 0;
    let midCut = 0;
    let highCut = 0;
    
    // Analyze active instruments
    for (const instrument of activeInstruments) {
      if (instrument.frequencyProfile.bass) {
        lowCut = Math.max(lowCut, -12); // Heavy bass cut
      }
      if (instrument.frequencyProfile.mid) {
        midCut = Math.max(midCut, -6);  // Moderate mid cut
      }
      if (instrument.frequencyProfile.high) {
        highCut = Math.max(highCut, -6); // Moderate high cut
      }
    }
    
    // Apply smoothly (50ms ramp)
    deck.eq.low.gain.rampTo(lowCut, 0.05);
    deck.eq.mid.gain.rampTo(midCut, 0.05);
    deck.eq.high.gain.rampTo(highCut, 0.05);
  }

  /**
   * Dynamic volume automation - crossfade original ↔ remix
   */
  autoVolume(deck: Deck, remixIntensity: number, instrumentsGain: Tone.Gain): void {
    // remixIntensity: 0 = 100% original, 1 = 100% remix
    const trackVolume = Tone.gainToDb((1 - remixIntensity) * 0.8); // Max -2dB
    const remixVolume = remixIntensity * 0.9; // Max -1dB (linear gain)
    
    deck.volume.volume.rampTo(trackVolume, 0.1);
    instrumentsGain.gain.rampTo(remixVolume, 0.1);
  }

  /**
   * Crossfade between original and remix
   * Phase 2 enhanced version with proper volume scaling
   */
  crossfadeVolumes(deck: Deck, instrumentsGain: Tone.Gain, intensity: number): void {
    // Original track: loud at 0, silent at 1
    const trackVolume = Tone.gainToDb((1 - intensity) * 0.8);
    
    // Remix instruments: silent at 0, loud at 1
    const remixVolume = intensity * 0.9;
    
    // Apply with smooth ramp (100ms)
    deck.volume.volume.rampTo(trackVolume, 0.1);
    instrumentsGain.gain.rampTo(remixVolume, 0.1);
  }

  /**
   * Real sidechain compression - duck track when kick/bass hits
   */
  setupSidechain(deck: Deck): void {
    this.ensureInitialized();
    // Connect deck through sidechain compressor
    deck.player.disconnect();
    deck.player.chain(this.compressor!, deck.volume);
    
    // Sidechain trigger controls compression
    this.sidechainTrigger!.connect(this.compressor!.threshold);
  }

  /**
   * Trigger sidechain duck
   */
  triggerSidechain(duration: string = '8n'): void {
    this.ensureInitialized();
    const now = Tone.now();
    const durationSeconds = Tone.Time(duration).toSeconds();
    
    // Duck: lower threshold = more compression
    this.sidechainTrigger!.setValueAtTime(-40, now);
    this.sidechainTrigger!.linearRampToValueAtTime(-24, now + durationSeconds);
  }

  /**
   * Trigger sidechain compression
   * Phase 2 enhanced version with precise control
   * Ducks original track when kick/bass hits
   */
  triggerSidechainDuck(deck: Deck, duckAmount: number = 8, duration: number = 125): void {
    const currentVolume = deck.volume.volume.value;
    const duckedVolume = currentVolume - duckAmount;
    
    // Duck immediately
    deck.volume.volume.setValueAtTime(duckedVolume, Tone.now());
    
    // Restore smoothly
    deck.volume.volume.linearRampToValueAtTime(
      currentVolume,
      Tone.now() + duration / 1000
    );
  }

  /**
   * Calculate optimal remix intensity based on bar progression
   */
  calculateIntensity(bar: number, config: {
    introLength: number;    // Bars before remix starts
    buildLength: number;    // Bars to reach full remix
    dropBar: number;        // Bar where drop happens
  }): number {
    const { introLength, buildLength, dropBar } = config;
    
    // Intro: 0% remix
    if (bar < introLength) return 0;
    
    // Build-up: gradual increase
    if (bar < dropBar) {
      const progress = (bar - introLength) / buildLength;
      return Math.min(progress, 0.7); // Max 70% during build
    }
    
    // Drop: full remix
    return 1.0;
  }

  /**
   * Frequency-aware sample triggering
   * Only play sample if track frequency is low in that range
   */
  shouldPlaySample(profile: FrequencyProfile, sampleType: string): boolean {
    const threshold = 0.3; // Energy threshold
    
    switch (sampleType) {
      case 'bass':
      case 'kick':
      case 'sub':
        return profile.bass < threshold;
      
      case 'lead':
      case 'synth':
      case 'pluck':
        return profile.mid < threshold;
      
      case 'hihat':
      case 'cymbal':
      case 'shaker':
        return profile.high < threshold;
      
      default:
        return true;
    }
  }

  /**
   * Smooth transition between remix states
   */
  transition(
    deck: Deck,
    from: RemixConfig,
    to: RemixConfig,
    duration: number = 2
  ): void {
    const steps = 20;
    const interval = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const intensity = from.intensity + (to.intensity - from.intensity) * progress;
      
      setTimeout(() => {
        // Smooth volume transition
        const trackVol = Tone.gainToDb((1 - intensity) * 0.8);
        deck.volume.volume.rampTo(trackVol, interval);
      }, i * interval * 1000);
    }
  }

  /**
   * Execute transition between remix states
   * Phase 2 enhanced version with transition types
   */
  executeTransition(
    transition: TransitionConfig,
    deck: Deck,
    currentBar: number,
    bpm: number
  ): void {
    const durationSeconds = (transition.duration * 4 * 60) / bpm;
    
    switch (transition.type) {
      case 'filter-sweep':
        // Sweep filter from low to high
        if (deck.filter) {
          deck.filter.frequency.rampTo(20000, durationSeconds);
        }
        break;
        
      case 'reverb-build':
        // Increase reverb amount (placeholder - will connect to DSP in task 21)
        console.log(`Reverb build over ${durationSeconds}s`);
        break;
        
      case 'drop':
        // Instant energy change
        if (deck.filter) {
          deck.filter.frequency.setValueAtTime(20000, Tone.now());
        }
        break;
        
      case 'break':
        // Reduce to minimal elements (placeholder)
        console.log(`Break transition over ${durationSeconds}s`);
        break;
        
      default:
        console.warn(`Unknown transition type: ${transition.type}`);
    }
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    if (this.analyser) {
      this.analyser.dispose();
      this.analyser = null;
    }
    if (this.compressor) {
      this.compressor.dispose();
      this.compressor = null;
    }
    if (this.sidechainTrigger) {
      this.sidechainTrigger.dispose();
      this.sidechainTrigger = null;
    }
  }
}

// Singleton instance
export const remixEngine = new RemixEngine();

// Helper: Track active instruments for EQ carving
export class InstrumentTracker {
  private active = new Map<string, {
    config: InstrumentConfig;
    timeout: NodeJS.Timeout;
  }>();

  play(instrument: InstrumentConfig, duration: number = 500): void {
    // Clear existing timeout
    const existing = this.active.get(instrument.name);
    if (existing) {
      clearTimeout(existing.timeout);
    }

    // Add with auto-removal
    const timeout = setTimeout(() => {
      this.active.delete(instrument.name);
    }, duration);

    this.active.set(instrument.name, { config: instrument, timeout });
  }

  getActive(): Set<InstrumentConfig> {
    return new Set(
      Array.from(this.active.values()).map(v => v.config)
    );
  }

  clear(): void {
    for (const { timeout } of this.active.values()) {
      clearTimeout(timeout);
    }
    this.active.clear();
  }
}

export const instrumentTracker = new InstrumentTracker();
