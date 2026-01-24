import { Template } from '../templates';

export const far_east_movement_like_a_g6: Template = {
  id: 'far_east_movement_like_a_g6',
  name: 'Like a G6',
  persona: 'Far East Movement',
  description: 'Electro-pop with auto-tune vocals and club energy',
  code: `// FAR EAST MOVEMENT - Like a G6
// Signature: Electro-pop, auto-tune, club anthem
dj.bpm = 125;

const synthLine = ['Bb4', 'C5', 'D5', 'F5', 'D5', 'C5', 'Bb4', 'A4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Club kick pattern
  if ([0, 4, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Synth melody
  if (tick % 2 === 0) {
    const note = synthLine[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Claps on 2 and 4
  if ([8].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  // Hi-hats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Bass hits
  if ([0, 8].includes(beat)) {
    dj.bass.triggerAttackRelease('Bb1', '4n', time);
  }
  
  // Auto-tune effect
  dj.effects.pitchShift.wet.value = 0.3;
  
  tick++;
});`
};

export const far_east_movement_rocketeer: Template = {
  id: 'far_east_movement_rocketeer',
  name: 'Rocketeer',
  persona: 'Far East Movement',
  description: 'Emotional electro-pop with soaring synths',
  code: `// FAR EAST MOVEMENT - Rocketeer
dj.bpm = 128;

const emotionalChords = [
  ['F3', 'A3', 'C4'],   // F
  ['C3', 'E3', 'G3'],   // C
  ['G3', 'B3', 'D4'],   // G
  ['Am3', 'C4', 'E4']   // Am
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = emotionalChords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Soaring lead
  if (bar >= 8 && tick % 4 === 0) {
    dj.synth.triggerAttackRelease('C5', '8n', time);
  }
  
  // Snare
  if ([8].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};
