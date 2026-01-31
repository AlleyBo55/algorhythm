/**
 * Sound Design Engine
 * Allows templates to configure unique synth sounds per song
 * This is what makes each template sound like the original
 */

import * as Tone from 'tone';

// Sound presets for different song styles
export interface SynthConfig {
  oscillator: {
    type: OscillatorType | 'fatsawtooth' | 'fatsaw' | 'fattriangle' | 'fatsquare' | 'pwm' | 'pulse';
    count?: number;      // For fat oscillators
    spread?: number;     // Detuning spread
    modulationFrequency?: number; // For PWM
  };
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  filter?: {
    type: BiquadFilterType;
    frequency: number;
    Q?: number;
  };
  filterEnvelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    baseFrequency: number;
    octaves: number;
  };
}

// Pre-built sound presets matching real songs
export const SOUND_PRESETS = {
  // === ALAN WALKER - FADED ===
  fadedPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 1.5 },
    filter: { type: 'lowpass' as const, frequency: 2000, Q: 2 },
  },
  fadedPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 5, spread: 40 },
    envelope: { attack: 2, decay: 1, sustain: 0.8, release: 5 },
  },

  // === AVICII - LEVELS ===
  levelsPiano: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.8 },
    filter: { type: 'lowpass' as const, frequency: 3000 },
  },
  levelsSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 7, spread: 50 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.9, release: 0.5 },
    filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.5, baseFrequency: 500, octaves: 4 },
  },

  // === DEADMAU5 - STROBE ===
  strobeArp: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.2, release: 0.3 },
    filter: { type: 'lowpass' as const, frequency: 4000, Q: 3 },
    filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.3, release: 0.5, baseFrequency: 800, octaves: 3 },
  },
  strobePad: {
    oscillator: { type: 'fatsawtooth' as const, count: 4, spread: 20 },
    envelope: { attack: 3, decay: 2, sustain: 0.9, release: 8 },
  },

  // === MARSHMELLO - ALONE ===
  aloneLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.3 },
    filter: { type: 'lowpass' as const, frequency: 2500 },
  },
  aloneSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 6, spread: 35 },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.7, release: 0.8 },
  },

  // === SKRILLEX - SCARY MONSTERS ===
  wobbleBass: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.2 },
    filter: { type: 'lowpass' as const, frequency: 500, Q: 8 },
    filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.3, baseFrequency: 100, octaves: 4 },
  },
  growlBass: {
    oscillator: { type: 'fatsawtooth' as const, count: 3, spread: 10 },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.8, release: 0.1 },
    filter: { type: 'bandpass' as const, frequency: 800, Q: 5 },
  },

  // === MARTIN GARRIX - ANIMALS ===
  animalsLead: {
    oscillator: { type: 'fatsawtooth' as const, count: 5, spread: 30 },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.4 },
    filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.4, baseFrequency: 600, octaves: 3 },
  },
  animalsDrop: {
    oscillator: { type: 'fatsawtooth' as const, count: 8, spread: 60 },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.9, release: 0.3 },
  },

  // === DIPLO / MAJOR LAZER - LEAN ON ===
  leanOnHorn: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.5 },
    filter: { type: 'lowpass' as const, frequency: 3000 },
  },
  dembowBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
  },

  // === ED SHEERAN - SHAPE OF YOU ===
  marimba: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.1, release: 0.8 },
    filter: { type: 'bandpass' as const, frequency: 2000, Q: 2 },
  },
  tropicalPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.25, sustain: 0.15, release: 0.6 },
  },

  // === SAWANO HIROYUKI - ATTACK ON TITAN ===
  epicStrings: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2 },
    filter: { type: 'lowpass' as const, frequency: 4000 },
  },
  choirPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 6, spread: 25 },
    envelope: { attack: 1.5, decay: 1, sustain: 0.9, release: 4 },
  },
  epicBrass: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 },
    filter: { type: 'lowpass' as const, frequency: 2500 },
  },

  // === TEDDY PARK - DDU-DU DDU-DU ===
  trapLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2 },
    filter: { type: 'lowpass' as const, frequency: 3000, Q: 3 },
  },
  phrygianLead: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.4 },
    filter: { type: 'bandpass' as const, frequency: 1500, Q: 4 },
  },

  // === PEGGY GOU - NANANA ===
  houseOrgan: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.5 },
  },
  houseBass: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.3 },
    filter: { type: 'lowpass' as const, frequency: 800 },
  },

  // === JENNIE - LIKE JENNIE ===
  phonkLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.2 },
    filter: { type: 'lowpass' as const, frequency: 2000, Q: 4 },
  },
  brazilianBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.005, decay: 0.5, sustain: 0.3, release: 0.8 },
  },
  metallicSynth: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.15 },
    filter: { type: 'bandpass' as const, frequency: 2500, Q: 6 },
  },

  // === GHIBLI / JOE HISAISHI ===
  ghibliPiano: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.6, sustain: 0.4, release: 1.5 },
  },
  ghibliStrings: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.85, release: 3 },
    filter: { type: 'lowpass' as const, frequency: 3500 },
  },
  ghibliFlute: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.15, decay: 0.2, sustain: 0.8, release: 1 },
  },

  // === GENERIC PRESETS ===
  supersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 7, spread: 50 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
  },
  plucky: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.5 },
  },
  warmPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 4, spread: 30 },
    envelope: { attack: 1.5, decay: 1, sustain: 0.9, release: 4 },
  },
  sub808: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.8, sustain: 0.3, release: 1.2 },
  },
} as const;

export type SoundPresetName = keyof typeof SOUND_PRESETS;

/**
 * Creates a configured synth with the given preset
 */
export function createConfiguredSynth(
  preset: SynthConfig,
  destination: Tone.ToneAudioNode
): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: preset.oscillator as any,
    envelope: preset.envelope,
    volume: -6,
  });

  if (preset.filter) {
    const filter = new Tone.Filter({
      type: preset.filter.type,
      frequency: preset.filter.frequency,
      Q: preset.filter.Q || 1,
    });
    synth.connect(filter);
    filter.connect(destination);
  } else {
    synth.connect(destination);
  }

  return synth;
}

/**
 * Sound Design Manager - allows runtime synth configuration
 */
export class SoundDesignManager {
  private activeSynths: Map<string, Tone.PolySynth> = new Map();
  private destination: Tone.ToneAudioNode;

  constructor(destination: Tone.ToneAudioNode) {
    this.destination = destination;
  }

  /**
   * Get or create a synth with the specified preset
   */
  getSynth(name: string, preset: SynthConfig | SoundPresetName): Tone.PolySynth {
    const config = typeof preset === 'string' ? SOUND_PRESETS[preset] : preset;
    
    // Check if we already have this synth
    const key = `${name}-${JSON.stringify(config)}`;
    if (this.activeSynths.has(key)) {
      return this.activeSynths.get(key)!;
    }

    // Create new synth
    const synth = createConfiguredSynth(config, this.destination);
    this.activeSynths.set(key, synth);
    return synth;
  }

  /**
   * Dispose all synths
   */
  dispose(): void {
    this.activeSynths.forEach(synth => synth.dispose());
    this.activeSynths.clear();
  }
}

// Export preset names for type safety
export const PRESET_NAMES = Object.keys(SOUND_PRESETS) as SoundPresetName[];
