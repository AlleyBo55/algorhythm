import { Template } from '../templates';

export const marshmello_alone: Template = {
  id: 'marshmello_alone',
  name: 'Alone',
  persona: 'Marshmello',
  description: 'Bouncy future bass with vocal chops and supersaw drops',
  code: `// MARSHMELLO - Alone
// Signature: Bouncy bass, vocal chops, happy vibes
dj.bpm = 140;

const bassline = ['E2', 'E2', 'C#2', 'A1', 'B1', 'B1', 'G#1', 'E1'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if (tick % 8 === 0 || tick % 8 === 6) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
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
  
  // Vocal chops
  if ([0, 4, 8, 12].includes(beat)) {
    dj.sampler.trigger('vocal', time);
  }
  
  // Hi-hat rolls
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};

export const marshmello_happier: Template = {
  id: 'marshmello_happier',
  name: 'Happier',
  persona: 'Marshmello',
  description: 'Emotional future bass with guitar-like synths',
  code: `// MARSHMELLO - Happier Style
dj.bpm = 100;

const chords = [
  ['C4', 'E4', 'G4'],   // C
  ['G3', 'B3', 'D4'],   // G
  ['A3', 'C4', 'E4'],   // Am
  ['F3', 'A3', 'C4']    // F
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.synth.triggerAttackRelease(chord, '1m', time);
  }
  
  // Kick pattern (drop)
  if (bar >= 8 && [0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Guitar-like plucks
  if (bar >= 8 && tick % 4 === 2) {
    dj.pluck.triggerAttackRelease('E4', '16n', time);
  }
  
  tick++;
});`
};
