import { Template } from '../templates';

export const marshmello_alone: Template = {
  id: 'marshmello_alone',
  name: 'Alone',
  persona: 'Marshmello',
  description: 'Bouncy future bass - adds vocal chops, supersaw, and happy energy',
  code: `// MARSHMELLO - Alone
// Transforms tracks + adds signature bouncy flavor
dj.bpm = 140;

const bassline = ['E2', 'E2', 'C#2', 'A1', 'B1', 'B1', 'G#1', 'E1'];
const vocalPattern = ['E5', 'D5', 'C5', 'B4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 2;
  dj.deck.A.filter.cutoff = 20000;
  
  // Add bright reverb
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.25;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Bouncy kick pattern
  if (tick % 8 === 0 || tick % 8 === 6) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Snare on 2 and 4
  if (beat === 8) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Bouncy bassline
  if (bar >= 8 && tick % 2 === 0) {
    const note = bassline[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '16n', time);
  }
  
  // Vocal chops (signature)
  if ([0, 4, 8, 12].includes(beat)) {
    const note = vocalPattern[beat / 4];
    dj.pluck.triggerAttackRelease(note, '32n', time);
  }
  
  // Supersaw chords
  if (bar >= 8 && beat === 0) {
    dj.synth.triggerAttackRelease(['E4', 'G#4', 'B4'], '2n', time);
  }
  
  // Hi-hat rolls
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Claps for energy
  if (bar >= 8 && [8, 24].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};

export const marshmello_happier: Template = {
  id: 'marshmello_happier',
  name: 'Happier',
  persona: 'Marshmello',
  description: 'Emotional future bass - adds guitar-like synths and warm atmosphere',
  code: `// MARSHMELLO - Happier Style
// Transforms tracks + adds emotional flavor
dj.bpm = 100;

const chords = [
  ['C4', 'E4', 'G4'],   // C
  ['G3', 'B3', 'D4'],   // G
  ['A3', 'C4', 'E4'],   // Am
  ['F3', 'A3', 'C4']    // F
];

const guitarMelody = ['E4', 'G4', 'A4', 'C5', 'B4', 'A4', 'G4', 'E4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 0;
  dj.deck.A.filter.cutoff = 20000;
  
  // Warm reverb + delay
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.35;
    
    dj.deck.A.effects.add('delay', 'delay');
    const del = dj.deck.A.effects.get('delay');
    if (del) del.wet = 0.15;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Emotional chord progression
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Kick pattern (drop)
  if (bar >= 8 && [0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Guitar-like plucks
  if (bar >= 8 && tick % 4 === 2) {
    const note = guitarMelody[(tick / 4) % 8];
    dj.pluck.triggerAttackRelease(note, '16n', time);
  }
  
  // Bass foundation
  if (bar >= 8 && tick % 8 === 0) {
    const bassNotes = ['C2', 'G1', 'A1', 'F1'];
    dj.bass.triggerAttackRelease(bassNotes[bar % 4], '4n', time);
  }
  
  // Soft hi-hats
  if (bar >= 8 && tick % 4 === 2) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};
