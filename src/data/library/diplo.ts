import { Template } from '../templates';

export const diplo_lean_on: Template = {
  id: 'diplo_lean_on',
  name: 'Lean On',
  persona: 'Diplo',
  description: 'Moombahton with Indian influences and horn stabs',
  code: `// DIPLO - Lean On (Major Lazer)
// Signature: Moombahton rhythm, world music influences, horn stabs
dj.bpm = 98;

const melody = ['E4', 'D4', 'C4', 'B3', 'A3', 'B3', 'C4', 'D4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Moombahton kick pattern
  if ([0, 8].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
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
  
  // Horn stabs
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
  description: 'Future bass with vocal chops and emotional drops',
  code: `// DIPLO - Where Are Ü Now (with Skrillex & Bieber)
dj.bpm = 128;

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Vocal chops (signature sound)
  if (bar >= 8 && [0, 4, 8, 12].includes(beat)) {
    dj.sampler.trigger('vocal_chop', time);
    dj.effects.pitchShift.pitch = Math.random() * 12 - 6;
  }
  
  // Synth stabs
  if ([2, 10].includes(beat)) {
    dj.synth.triggerAttackRelease(['G3', 'B3', 'D4'], '16n', time);
  }
  
  // Build-up snare roll
  if (bar === 7) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};
