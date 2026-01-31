// Alan Walker Templates
// Melodic progressive house with signature reverb/delay sound

import type { DJTemplate } from './types';

/**
 * Faded Style - Alan Walker's breakthrough hit
 * 90 BPM, F# minor, emotional atmosphere
 */
export const fadedStyle: DJTemplate = {
  id: 'alan-walker-faded',
  name: 'Faded Style',
  artist: 'Alan Walker',
  genre: 'Progressive House',
  bpm: 90,
  key: 'F# minor',
  
  energy: 0.7,
  danceability: 0.75,
  valence: 0.4, // Melancholic
  
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      {
        type: 'filter-sweep',
        duration: 8,
        energy: 0.8,
      },
      {
        type: 'reverb-build',
        duration: 4,
        energy: 0.9,
      },
    ],
    progression: {
      introLength: 4,
      buildLength: 8,
      dropBar: 16,
    },
  },
  
  instruments: [
    {
      name: 'kick',
      type: 'kick',
      sound: 'deep-house-kick',
      pattern: 'four-on-floor',
      volume: 0.8,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
    {
      name: 'pluck-lead',
      type: 'pluck',
      sound: 'clean-pluck',
      pattern: 'melodic-arp',
      volume: 0.7,
      effects: ['reverb', 'delay'],
      frequencyProfile: { bass: false, mid: true, high: true },
    },
    {
      name: 'atmospheric-pad',
      type: 'pad',
      sound: 'warm-pad',
      pattern: 'sustained-chords',
      volume: 0.5,
      effects: ['reverb'],
      frequencyProfile: { bass: false, mid: true, high: false },
    },
    {
      name: 'bass',
      type: 'bass',
      sound: 'sub-bass',
      pattern: 'root-notes',
      volume: 0.75,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
  ],
  
  effects: {
    reverb: {
      type: 'hall',
      size: 2.5,
      decay: 3.5,
      mix: 0.4,
    },
    delay: {
      time: '1/4',
      feedback: 0.4,
      mix: 0.3,
    },
    filter: {
      type: 'lowpass',
      cutoff: 2000,
      resonance: 0.3,
      automation: 'slow-open',
    },
  },
  
  mix: {
    masterVolume: 0.85,
    compression: {
      threshold: -12,
      ratio: 4,
      attack: 0.01,
      release: 0.15,
    },
  },
};

/**
 * Alone Style - Uplifting progressive house
 * 120 BPM, uplifting energy
 */
export const aloneStyle: DJTemplate = {
  id: 'alan-walker-alone',
  name: 'Alone Style',
  artist: 'Alan Walker',
  genre: 'Progressive House',
  bpm: 120,
  key: 'C minor',
  
  energy: 0.8,
  danceability: 0.8,
  valence: 0.6,
  
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      {
        type: 'filter-sweep',
        duration: 8,
        energy: 0.85,
      },
    ],
    progression: {
      introLength: 4,
      buildLength: 8,
      dropBar: 16,
    },
  },
  
  instruments: [
    {
      name: 'kick',
      type: 'kick',
      sound: 'punchy-kick',
      pattern: 'four-on-floor',
      volume: 0.85,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
    {
      name: 'synth-lead',
      type: 'lead',
      sound: 'bright-synth',
      pattern: 'uplifting-melody',
      volume: 0.75,
      effects: ['reverb', 'delay'],
      frequencyProfile: { bass: false, mid: true, high: true },
    },
    {
      name: 'pad',
      type: 'pad',
      sound: 'lush-pad',
      pattern: 'chord-progression',
      volume: 0.6,
      effects: ['reverb'],
      frequencyProfile: { bass: false, mid: true, high: false },
    },
  ],
  
  effects: {
    reverb: {
      type: 'hall',
      size: 2.0,
      decay: 3.0,
      mix: 0.35,
    },
    delay: {
      time: '1/8',
      feedback: 0.35,
      mix: 0.25,
    },
  },
  
  mix: {
    masterVolume: 0.85,
    compression: {
      threshold: -10,
      ratio: 4,
      attack: 0.01,
      release: 0.15,
    },
  },
};

/**
 * Darkside Style - Collaboration feel with Au/Ra
 * 95 BPM, darker atmosphere
 */
export const darksideStyle: DJTemplate = {
  id: 'alan-walker-darkside',
  name: 'Darkside Style',
  artist: 'Alan Walker',
  genre: 'Progressive House',
  bpm: 95,
  key: 'G minor',
  
  energy: 0.75,
  danceability: 0.7,
  valence: 0.35,
  
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      {
        type: 'reverb-build',
        duration: 6,
        energy: 0.8,
      },
    ],
    progression: {
      introLength: 4,
      buildLength: 8,
      dropBar: 16,
    },
  },
  
  instruments: [
    {
      name: 'kick',
      type: 'kick',
      sound: 'deep-kick',
      pattern: 'four-on-floor',
      volume: 0.8,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
    {
      name: 'dark-pluck',
      type: 'pluck',
      sound: 'dark-pluck',
      pattern: 'minor-melody',
      volume: 0.7,
      effects: ['reverb', 'delay'],
      frequencyProfile: { bass: false, mid: true, high: false },
    },
    {
      name: 'vocal-chop',
      type: 'vocal-chop',
      sound: 'processed-vocal',
      pattern: 'rhythmic-chops',
      volume: 0.6,
      effects: ['reverb'],
      frequencyProfile: { bass: false, mid: true, high: true },
    },
  ],
  
  effects: {
    reverb: {
      type: 'chamber',
      size: 2.2,
      decay: 3.2,
      mix: 0.4,
    },
    delay: {
      time: '1/4',
      feedback: 0.4,
      mix: 0.3,
    },
  },
  
  mix: {
    masterVolume: 0.85,
    compression: {
      threshold: -12,
      ratio: 4,
      attack: 0.01,
      release: 0.15,
    },
  },
};

/**
 * On My Way Style - Festival energy
 * 128 BPM, high energy
 */
export const onMyWayStyle: DJTemplate = {
  id: 'alan-walker-on-my-way',
  name: 'On My Way Style',
  artist: 'Alan Walker',
  genre: 'Progressive House',
  bpm: 128,
  key: 'D minor',
  
  energy: 0.85,
  danceability: 0.85,
  valence: 0.7,
  
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      {
        type: 'filter-sweep',
        duration: 8,
        energy: 0.9,
      },
      {
        type: 'drop',
        duration: 1,
        energy: 1.0,
      },
    ],
    progression: {
      introLength: 4,
      buildLength: 8,
      dropBar: 16,
    },
  },
  
  instruments: [
    {
      name: 'kick',
      type: 'kick',
      sound: 'festival-kick',
      pattern: 'four-on-floor',
      volume: 0.9,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
    {
      name: 'energetic-lead',
      type: 'lead',
      sound: 'festival-lead',
      pattern: 'anthem-melody',
      volume: 0.8,
      effects: ['reverb', 'delay'],
      frequencyProfile: { bass: false, mid: true, high: true },
    },
    {
      name: 'power-bass',
      type: 'bass',
      sound: 'powerful-bass',
      pattern: 'driving-bass',
      volume: 0.8,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
  ],
  
  effects: {
    reverb: {
      type: 'hall',
      size: 2.8,
      decay: 3.5,
      mix: 0.35,
    },
    delay: {
      time: '1/8',
      feedback: 0.3,
      mix: 0.25,
    },
  },
  
  mix: {
    masterVolume: 0.9,
    compression: {
      threshold: -10,
      ratio: 4,
      attack: 0.01,
      release: 0.15,
    },
  },
};

/**
 * The Spectre Style - Mysterious atmosphere
 * 128 BPM, mysterious vibe
 */
export const spectreStyle: DJTemplate = {
  id: 'alan-walker-spectre',
  name: 'The Spectre Style',
  artist: 'Alan Walker',
  genre: 'Progressive House',
  bpm: 128,
  key: 'A minor',
  
  energy: 0.8,
  danceability: 0.75,
  valence: 0.5,
  
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      {
        type: 'filter-sweep',
        duration: 10,
        energy: 0.85,
      },
    ],
    progression: {
      introLength: 4,
      buildLength: 10,
      dropBar: 16,
    },
  },
  
  instruments: [
    {
      name: 'kick',
      type: 'kick',
      sound: 'tight-kick',
      pattern: 'four-on-floor',
      volume: 0.85,
      frequencyProfile: { bass: true, mid: false, high: false },
    },
    {
      name: 'mysterious-pluck',
      type: 'pluck',
      sound: 'mysterious-pluck',
      pattern: 'haunting-melody',
      volume: 0.75,
      effects: ['reverb', 'delay'],
      frequencyProfile: { bass: false, mid: true, high: true },
    },
    {
      name: 'atmospheric-pad',
      type: 'pad',
      sound: 'dark-pad',
      pattern: 'ambient-texture',
      volume: 0.55,
      effects: ['reverb'],
      frequencyProfile: { bass: false, mid: true, high: false },
    },
  ],
  
  effects: {
    reverb: {
      type: 'hall',
      size: 3.0,
      decay: 4.0,
      mix: 0.45,
    },
    delay: {
      time: '1/4',
      feedback: 0.45,
      mix: 0.35,
    },
    filter: {
      type: 'lowpass',
      cutoff: 1500,
      resonance: 0.4,
      automation: 'slow-open',
    },
  },
  
  mix: {
    masterVolume: 0.85,
    compression: {
      threshold: -12,
      ratio: 4,
      attack: 0.01,
      release: 0.15,
    },
  },
};

// Export all templates
export const alanWalkerTemplates = [
  fadedStyle,
  aloneStyle,
  darksideStyle,
  onMyWayStyle,
  spectreStyle,
];
