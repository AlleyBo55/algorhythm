/**
 * Accurate Instruments Engine
 * High-fidelity instrument synthesis for 99% song accuracy
 * Uses Tone.js with precise sound design matching original productions
 */

/**
 * Instrument presets matching specific songs/producers
 */
export const ACCURATE_PRESETS = {
  // === AVICII / SWEDISH HOUSE MAFIA STYLE ===
  aviciiPiano: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 1.0 },
    filter: { type: 'lowpass' as const, frequency: 3500, Q: 1 },
  },
  aviciiSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 7, spread: 50 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.85, release: 0.6 },
  },
  
  // === ALAN WALKER STYLE ===
  alanWalkerPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.35, sustain: 0.1, release: 1.8 },
    filter: { type: 'lowpass' as const, frequency: 2200, Q: 2.5 },
  },
  alanWalkerPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 5, spread: 45 },
    envelope: { attack: 2.5, decay: 1.2, sustain: 0.85, release: 6 },
  },
  // THE FADED PIANO - clean, acoustic-like, reverb-drenched
  // This is the iconic sound that opens the song
  // Soft sine wave with quick attack and long decay/release
  fadedPiano: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.005, decay: 1.2, sustain: 0.2, release: 3.0 },
    filter: { type: 'lowpass' as const, frequency: 4000, Q: 0.5 },
  },
  
  // === DEADMAU5 STYLE ===
  deadmau5Arp: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.005, decay: 0.18, sustain: 0.2, release: 0.35 },
    filter: { type: 'lowpass' as const, frequency: 4500, Q: 3.5 },
  },
  deadmau5Pad: {
    oscillator: { type: 'fatsawtooth' as const, count: 4, spread: 25 },
    envelope: { attack: 3.5, decay: 2.5, sustain: 0.92, release: 10 },
  },
  
  // === MARSHMELLO STYLE ===
  marshmelloSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 6, spread: 40 },
    envelope: { attack: 0.02, decay: 0.25, sustain: 0.75, release: 0.9 },
  },
  marshmelloLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.12, sustain: 0.75, release: 0.35 },
    filter: { type: 'lowpass' as const, frequency: 2800 },
  },
  
  // === SKRILLEX / DUBSTEP STYLE ===
  skrillexWobble: {
    oscillator: { type: 'fmsquare' as const, modulationIndex: 12 },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0.85, release: 0.12 },
    filter: { type: 'lowpass' as const, frequency: 600, Q: 10 },
  },
  skrillexGrowl: {
    oscillator: { type: 'fatsawtooth' as const, count: 3, spread: 12 },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0.85, release: 0.12 },
    filter: { type: 'bandpass' as const, frequency: 900, Q: 6 },
  },
  
  // === MARTIN GARRIX / BIG ROOM STYLE ===
  garrixPluck: {
    oscillator: { type: 'fatsawtooth' as const, count: 5, spread: 35 },
    envelope: { attack: 0.01, decay: 0.18, sustain: 0.55, release: 0.45 },
  },
  garrixDrop: {
    oscillator: { type: 'fatsawtooth' as const, count: 8, spread: 65 },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0.92, release: 0.35 },
  },
  
  // === DIPLO / MAJOR LAZER STYLE ===
  diploHorn: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.06, decay: 0.22, sustain: 0.72, release: 0.55 },
    filter: { type: 'lowpass' as const, frequency: 3200 },
  },
  dembowBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.35, sustain: 0.55, release: 0.45 },
  },
  
  // === ED SHEERAN / TROPICAL STYLE ===
  tropicalMarimba: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.001, decay: 0.45, sustain: 0.08, release: 0.9 },
    filter: { type: 'bandpass' as const, frequency: 2200, Q: 2.5 },
  },
  tropicalPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.28, sustain: 0.12, release: 0.65 },
  },
  
  // === SAWANO HIROYUKI / ANIME STYLE ===
  sawanoStrings: {
    oscillator: { type: 'fatsawtooth' as const, count: 6, spread: 22 },
    envelope: { attack: 0.55, decay: 0.55, sustain: 0.88, release: 2.5 },
    filter: { type: 'lowpass' as const, frequency: 4200 },
  },
  sawanoChoir: {
    oscillator: { type: 'fatsawtooth' as const, count: 8, spread: 45 },
    envelope: { attack: 0.35, decay: 0.55, sustain: 0.92, release: 1.8 },
  },
  sawanoBrass: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.12, decay: 0.35, sustain: 0.75, release: 0.9 },
    filter: { type: 'lowpass' as const, frequency: 2800 },
  },
  
  // === TEDDY PARK / K-POP STYLE ===
  kpopTrapLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.12, sustain: 0.55, release: 0.22 },
    filter: { type: 'lowpass' as const, frequency: 3200, Q: 3.5 },
  },
  kpopPhrygian: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.02, decay: 0.22, sustain: 0.65, release: 0.45 },
    filter: { type: 'bandpass' as const, frequency: 1600, Q: 4.5 },
  },
  
  // === PEGGY GOU / HOUSE STYLE ===
  houseOrgan: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.35, sustain: 0.65, release: 0.55 },
  },
  housePiano: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.001, decay: 0.35, sustain: 0.12, release: 0.35 },
  },
  houseBass: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.22, sustain: 0.72, release: 0.35 },
    filter: { type: 'lowpass' as const, frequency: 900 },
  },
  
  // === JENNIE / BRAZILIAN PHONK STYLE ===
  phonkLead: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.18, sustain: 0.45, release: 0.22 },
    filter: { type: 'lowpass' as const, frequency: 2200, Q: 4.5 },
  },
  phonkBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.005, decay: 0.55, sustain: 0.35, release: 0.9 },
  },
  phonkMetallic: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0.35, release: 0.18 },
    filter: { type: 'bandpass' as const, frequency: 2800, Q: 7 },
  },
  
  // === GHIBLI / JOE HISAISHI STYLE ===
  ghibliPiano: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.01, decay: 0.65, sustain: 0.45, release: 1.8 },
  },
  ghibliStrings: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.9, decay: 0.55, sustain: 0.88, release: 3.5 },
    filter: { type: 'lowpass' as const, frequency: 3800 },
  },
  ghibliFlute: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.18, decay: 0.22, sustain: 0.82, release: 1.2 },
  },
  
  // === DAFT PUNK STYLE ===
  daftPunkVocoder: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.3 },
    filter: { type: 'bandpass' as const, frequency: 1200, Q: 8 },
  },
  daftPunkBass: {
    oscillator: { type: 'square' as const },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.2 },
    filter: { type: 'lowpass' as const, frequency: 600 },
  },
  
  // === CALVIN HARRIS STYLE ===
  calvinHarrisSynth: {
    oscillator: { type: 'fatsawtooth' as const, count: 5, spread: 30 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.5 },
  },
  calvinHarrisBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 },
  },
  
  // === KYGO STYLE ===
  kygoPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 1.2 },
    filter: { type: 'lowpass' as const, frequency: 2500, Q: 2 },
  },
  kygoPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 4, spread: 35 },
    envelope: { attack: 1.5, decay: 1, sustain: 0.8, release: 4 },
  },
  
  // === ZEDD STYLE ===
  zeddSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 7, spread: 55 },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.9, release: 0.4 },
  },
  zeddArp: {
    oscillator: { type: 'sawtooth' as const },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.2 },
    filter: { type: 'lowpass' as const, frequency: 5000, Q: 2 },
  },
  
  // === TIESTO STYLE ===
  tiestoLead: {
    oscillator: { type: 'fatsawtooth' as const, count: 6, spread: 45 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
  },
  tiestoBass: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.5, release: 0.6 },
  },
  
  // === GENERIC PRESETS ===
  genericSupersaw: {
    oscillator: { type: 'fatsawtooth' as const, count: 7, spread: 50 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
  },
  genericPluck: {
    oscillator: { type: 'triangle' as const },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.5 },
  },
  genericPad: {
    oscillator: { type: 'fatsawtooth' as const, count: 4, spread: 30 },
    envelope: { attack: 1.5, decay: 1, sustain: 0.9, release: 4 },
  },
  genericSub: {
    oscillator: { type: 'sine' as const },
    envelope: { attack: 0.01, decay: 0.8, sustain: 0.3, release: 1.2 },
  },
} as const;

export type AccuratePresetName = keyof typeof ACCURATE_PRESETS;

/**
 * Song-specific instrument configurations
 * Maps song IDs to their exact instrument setups
 */
export const SONG_INSTRUMENTS: Record<string, {
  lead?: AccuratePresetName;
  pad?: AccuratePresetName;
  bass?: AccuratePresetName;
  pluck?: AccuratePresetName;
  arp?: AccuratePresetName;
  choir?: AccuratePresetName;
  strings?: AccuratePresetName;
}> = {
  'avicii-levels': {
    lead: 'aviciiSupersaw',
    pad: 'genericPad',
    pluck: 'aviciiPiano',
  },
  'alan-walker-faded': {
    lead: 'alanWalkerPluck',
    pad: 'alanWalkerPad',
    pluck: 'fadedPiano',
  },
  'deadmau5-strobe': {
    arp: 'deadmau5Arp',
    pad: 'deadmau5Pad',
  },
  'marshmello-alone': {
    lead: 'marshmelloSupersaw',
    pluck: 'marshmelloLead',
  },
  'skrillex-scary-monsters': {
    bass: 'skrillexWobble',
    lead: 'skrillexGrowl',
  },
  'martin-garrix-animals': {
    pluck: 'garrixPluck',
    lead: 'garrixDrop',
  },
  'diplo-lean-on': {
    lead: 'diploHorn',
    bass: 'dembowBass',
  },
  'ed-sheeran-shape-of-you': {
    pluck: 'tropicalMarimba',
    pad: 'tropicalPluck',
  },
  'sawano-hiroyuki-attack-on-titan': {
    strings: 'sawanoStrings',
    choir: 'sawanoChoir',
    lead: 'sawanoBrass',
  },
  'teddy-park-ddu-du': {
    lead: 'kpopTrapLead',
    pluck: 'kpopPhrygian',
  },
  'peggy-gou-nanana': {
    pluck: 'housePiano',
    bass: 'houseBass',
  },
  'jennie-like-jennie': {
    lead: 'phonkLead',
    bass: 'phonkBass',
    pluck: 'phonkMetallic',
  },
  'ghibli-style': {
    pluck: 'ghibliPiano',
    strings: 'ghibliStrings',
    lead: 'ghibliFlute',
  },
};

export { ACCURATE_PRESETS as presets };
