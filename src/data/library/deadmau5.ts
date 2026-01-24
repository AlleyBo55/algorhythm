import { Template } from '../templates';

export const deadmau5_strobe: Template = {
  id: 'deadmau5_strobe',
  name: 'Strobe',
  persona: 'Deadmau5',
  description: 'Progressive house masterpiece with 10-minute build',
  code: `// DEADMAU5 - Strobe
// Signature: Long builds, minimal percussion, emotional progression
dj.bpm = 128;

const progression = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  const section = Math.floor(bar / 16); // Long sections
  
  // Minimal kick (only after long build)
  if (section >= 2 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = progression[bar % 4];
    dj.pad.triggerAttackRelease(chord, '2m', time);
  }
  
  // Signature arp (builds slowly)
  if (section >= 1 && tick % 2 === 0) {
    const notes = ['F#4', 'A4', 'C#5', 'E5'];
    const note = notes[(tick / 2) % 4];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Gradual filter opening
  const filterFreq = 200 + (bar * 100);
  dj.effects.filter.frequency.value = Math.min(filterFreq, 20000);
  
  tick++;
});`
};

export const deadmau5_ghosts: Template = {
  id: 'deadmau5_ghosts',
  name: 'Ghosts n Stuff',
  persona: 'Deadmau5',
  description: 'Electro house with aggressive synths and driving bass',
  code: `// DEADMAU5 - Ghosts n Stuff
dj.bpm = 128;

const bassline = ['C2', 'C2', 'Bb1', 'Bb1', 'Ab1', 'Ab1', 'G1', 'F1'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // 4-on-floor kick
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Aggressive bassline
  if (tick % 2 === 0) {
    const note = bassline[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '8n', time);
  }
  
  // Synth stabs
  if ([0, 8].includes(beat)) {
    dj.synth.triggerAttackRelease(['C4', 'Eb4', 'G4'], '16n', time);
  }
  
  // Hi-hat pattern
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};
