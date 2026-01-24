import { Template } from '../templates';

export const diplo_lean_on: Template = {
  id: 'diplo_lean_on',
  name: 'Lean On',
  persona: 'Diplo',
  description: 'Moombahton - adds Indian influences, horn stabs, and world music flavor',
  code: `// DIPLO - Lean On (Major Lazer)
// Transforms tracks + adds moombahton flavor
dj.bpm = 98;

const melody = ['E4', 'D4', 'C4', 'B3', 'A3', 'B3', 'C4', 'D4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 3;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.3;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Moombahton kick pattern
  if ([0, 8].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Snare on 2 and 4
  if ([8].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Indian-influenced melody
  if (tick % 2 === 0) {
    const note = melody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Horn stabs (signature)
  if ([0, 6, 12].includes(beat)) {
    dj.brass.triggerAttackRelease('E3', '8n', time);
  }
  
  // Dembow rhythm hi-hats
  if ([2, 5, 10, 13].includes(beat)) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};

export const diplo_where_are_u_now: Template = {
  id: 'diplo_where_are_u_now',
  name: 'Where Are Ü Now',
  persona: 'Diplo',
  description: 'Future bass - adds vocal chops, emotional drops, and Skrillex-style energy',
  code: `// DIPLO - Where Are Ü Now (with Skrillex & Bieber)
// Transforms tracks + adds future bass flavor
dj.bpm = 128;

const vocalChops = ['G4', 'A4', 'B4', 'D5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 2;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.35;
    
    dj.deck.A.effects.add('delay', 'delay');
    const del = dj.deck.A.effects.get('delay');
    if (del) del.wet = 0.25;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Vocal chops (signature sound)
  if (bar >= 8 && [0, 4, 8, 12].includes(beat)) {
    const note = vocalChops[beat / 4];
    dj.pluck.triggerAttackRelease(note, '32n', time);
  }
  
  // Synth stabs
  if ([2, 10].includes(beat)) {
    dj.synth.triggerAttackRelease(['G3', 'B3', 'D4'], '16n', time);
  }
  
  // Build-up snare roll
  if (bar === 7) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Hi-hats
  if (bar >= 8 && tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};
