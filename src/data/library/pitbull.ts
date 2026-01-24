import { Template } from '../templates';

export const pitbull_timber: Template = {
  id: 'pitbull_timber',
  name: 'Timber',
  persona: 'Pitbull',
  description: 'Country-EDM fusion with banjo and big room drops',
  code: `// PITBULL - Timber (feat. Ke$ha)
// Signature: Country + EDM, banjo, party anthem
dj.bpm = 130;

const banjoRiff = ['E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4', 'D4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Big room kick
  if (bar >= 8 && [0, 4, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Banjo riff
  if (tick % 2 === 0) {
    const note = banjoRiff[(tick / 2) % 8];
    dj.banjo.triggerAttackRelease(note, '16n', time);
  }
  
  // Claps on 2 and 4
  if ([8].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  // Build-up snare roll
  if (bar === 7) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Hi-hats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};

export const pitbull_international_love: Template = {
  id: 'pitbull_international_love',
  name: 'International Love',
  persona: 'Pitbull',
  description: 'Pop-house with Latin influences',
  code: `// PITBULL - International Love
dj.bpm = 128;

const latinChords = [
  ['C4', 'E4', 'G4'],   // C
  ['Am3', 'C4', 'E4'],  // Am
  ['F3', 'A3', 'C4'],   // F
  ['G3', 'B3', 'D4']    // G
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // 4-on-floor
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Latin piano chords
  if (beat === 0) {
    const chord = latinChords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '1m', time);
  }
  
  // Synth lead
  if (bar >= 8 && tick % 4 === 0) {
    dj.synth.triggerAttackRelease('E5', '8n', time);
  }
  
  // Claps
  if ([8].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};
