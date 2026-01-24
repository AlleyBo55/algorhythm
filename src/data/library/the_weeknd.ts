import { Template } from '../templates';

export const weeknd_blinding_lights: Template = {
  id: 'weeknd_blinding_lights',
  name: 'Blinding Lights',
  persona: 'The Weeknd',
  description: 'Synthwave with 80s nostalgia and driving bassline',
  code: `// THE WEEKND - Blinding Lights
// Signature: 80s synthwave, nostalgic synths, driving bass
dj.bpm = 171;

const synthMelody = ['F#4', 'E4', 'D4', 'C#4', 'B3', 'C#4', 'D4', 'E4'];
const bassline = ['B1', 'B1', 'A1', 'A1', 'G1', 'G1', 'F#1', 'E1'];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // 80s drum machine kick
  if ([0, 4, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if ([8].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Iconic synth melody
  if (tick % 2 === 0) {
    const note = synthMelody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '8n', time);
  }
  
  // Driving bassline
  if (tick % 2 === 0) {
    const note = bassline[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '8n', time);
  }
  
  // 80s hi-hats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Synth pad
  if (beat === 0) {
    dj.pad.triggerAttackRelease(['B3', 'D4', 'F#4'], '1m', time);
  }
  
  tick++;
});`
};

export const weeknd_starboy: Template = {
  id: 'weeknd_starboy',
  name: 'Starboy',
  persona: 'The Weeknd',
  description: 'Dark R&B with Daft Punk production',
  code: `// THE WEEKND - Starboy (prod. Daft Punk)
dj.bpm = 106;

const darkChords = [
  ['F3', 'Ab3', 'C4'],  // Fm
  ['Db3', 'F3', 'Ab3'], // Db
  ['Eb3', 'G3', 'Bb3'], // Eb
  ['C3', 'Eb3', 'G3']   // Cm
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Trap-influenced kick
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Dark synth chords
  if (beat === 0) {
    const chord = darkChords[bar % 4];
    dj.synth.triggerAttackRelease(chord, '1m', time);
  }
  
  // 808 bass hits
  if ([0, 8].includes(beat)) {
    dj.bass.triggerAttackRelease('F1', '4n', time);
  }
  
  // Hi-hat rolls
  if (beat >= 12) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};
