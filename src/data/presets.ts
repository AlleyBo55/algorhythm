// Signature presets from world-class producers
export interface Preset {
  id: string;
  name: string;
  artist: string;
  description: string;
  apply: () => void;
}

export const PRESETS: Preset[] = [
  {
    id: 'alan_walker_signature',
    name: 'Alan Walker Signature',
    artist: 'Alan Walker',
    description: 'Clean pluck lead, emotional pads, subtle reverb',
    apply: () => {
      dj.synth.set({ oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } });
      dj.effects.reverb.set({ wet: 0.2, decay: 2.0 });
      dj.effects.delay.set({ wet: 0.15, delayTime: '8n', feedback: 0.3 });
    }
  },
  {
    id: 'marshmello_bounce',
    name: 'Marshmello Bounce',
    artist: 'Marshmello',
    description: 'Bouncy bass, bright supersaws, happy vibes',
    apply: () => {
      dj.bass.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 } });
      dj.synth.set({ oscillator: { type: 'sawtooth', count: 7, spread: 40 } });
      dj.effects.chorus.set({ wet: 0.4, frequency: 1.5 });
    }
  },
  {
    id: 'deadmau5_progressive',
    name: 'Deadmau5 Progressive',
    artist: 'Deadmau5',
    description: 'Long builds, minimal percussion, emotional arps',
    apply: () => {
      dj.synth.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 1.0 } });
      dj.effects.filter.set({ type: 'lowpass', frequency: 500, Q: 5 });
      dj.effects.reverb.set({ wet: 0.3, decay: 4.0 });
    }
  },
  {
    id: 'diplo_moombahton',
    name: 'Diplo Moombahton',
    artist: 'Diplo',
    description: 'World music influences, horn stabs, dembow rhythm',
    apply: () => {
      dj.brass.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.3 } });
      dj.effects.distortion.set({ wet: 0.3, distortion: 0.4 });
      dj.bpm = 98; // Moombahton tempo
    }
  },
  {
    id: 'sawano_epic',
    name: 'Sawano Epic Orchestral',
    artist: 'Sawano Hiroyuki',
    description: 'Orchestral + EDM, dramatic strings, cinematic',
    apply: () => {
      dj.strings.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.3, decay: 0.5, sustain: 0.8, release: 1.5 } });
      dj.brass.set({ oscillator: { type: 'square' }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.8 } });
      dj.effects.reverb.set({ wet: 0.5, decay: 5.0, preDelay: 0.05 });
    }
  },
  {
    id: 'weeknd_synthwave',
    name: 'The Weeknd Synthwave',
    artist: 'The Weeknd',
    description: '80s nostalgia, driving bass, vintage synths',
    apply: () => {
      dj.synth.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.3 } });
      dj.bass.set({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.8, release: 0.5 } });
      dj.effects.chorus.set({ wet: 0.5, frequency: 0.5, depth: 0.8 });
      dj.bpm = 171; // Blinding Lights tempo
    }
  },
  {
    id: 'teddy_park_kpop',
    name: 'Teddy Park K-pop',
    artist: 'Teddy Park',
    description: 'K-pop trap, Middle Eastern scales, powerful 808s',
    apply: () => {
      dj.bass.set({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 } });
      dj.synth.set({ oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } });
      dj.effects.distortion.set({ wet: 0.4, distortion: 0.6 });
    }
  },
  {
    id: 'pitbull_party',
    name: 'Pitbull Party Anthem',
    artist: 'Pitbull',
    description: 'Big room energy, Latin influences, club ready',
    apply: () => {
      dj.kick.set({ envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 } });
      dj.clap.set({ envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } });
      dj.effects.reverb.set({ wet: 0.25, decay: 2.5 });
    }
  },
  {
    id: 'far_east_electropop',
    name: 'Far East Movement Electro-Pop',
    artist: 'Far East Movement',
    description: 'Auto-tune vocals, club synths, party energy',
    apply: () => {
      dj.synth.set({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 } });
      dj.effects.pitchShift.set({ wet: 0.3, pitch: 0 });
      dj.effects.delay.set({ wet: 0.2, delayTime: '16n', feedback: 0.4 });
    }
  },
  {
    id: 'black_eyed_peas_futuristic',
    name: 'Black Eyed Peas Futuristic',
    artist: 'Black Eyed Peas',
    description: 'Robotic vocals, heavy bass, futuristic FX',
    apply: () => {
      dj.synth.set({ oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.2 } });
      dj.effects.vocoder.set({ wet: 0.8 });
      dj.effects.bitcrusher.set({ wet: 0.5, bits: 6 });
    }
  }
];

// Helper to get presets by artist
export function getPresetsByArtist(artist: string): Preset[] {
  return PRESETS.filter(p => p.artist === artist);
}

// Helper to apply preset by ID
export function applyPreset(id: string): boolean {
  const preset = PRESETS.find(p => p.id === id);
  if (preset) {
    preset.apply();
    return true;
  }
  return false;
}
