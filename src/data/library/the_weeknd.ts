import { Template } from '../templates';

export const weeknd_blinding_lights: Template = {
  id: 'weeknd_blinding_lights',
  name: 'Blinding Lights',
  persona: 'The Weeknd',
  description: 'Synthwave - adds 80s nostalgia, driving bassline, and retro atmosphere',
  code: `// THE WEEKND - Blinding Lights
// Transforms tracks + adds 80s synthwave flavor
dj.bpm = 171;

const synthMelody = ['F#4', 'E4', 'D4', 'C#4', 'B3', 'C#4', 'D4', 'E4'];
const bassline = ['B1', 'B1', 'A1', 'A1', 'G1', 'G1', 'F#1', 'E1'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 2;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 2;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.3;
    
    dj.deck.A.effects.add('chorus', 'chorus');
    const cho = dj.deck.A.effects.get('chorus');
    if (cho) cho.wet = 0.25;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // 80s drum machine kick
  if ([0, 4, 8, 12].includes(beat)) {
    dj.sample('drums/kick-9', time);
    dj.sidechain('8n');
  }
  
  // Snare on 2 and 4
  if ([8].includes(beat)) {
    dj.sample('drums/snare-5', time);
  }
  
  // Iconic synth melody
  if (tick % 2 === 0) {
    dj.sample('synth/lead-7', time);
  }
  
  // Driving bassline
  if (tick % 2 === 0) {
    dj.sample('bass/synth-3', time);
  }
  
  // 80s hi-hats
  if (tick % 2 === 1) {
    dj.sample('drums/hihat-9', time);
  }
  
  // Synth pad
  if (beat === 0) {
    dj.sample('synth/pad-4', time);
  }
  
  tick++;
});`
};

export const weeknd_starboy: Template = {
  id: 'weeknd_starboy',
  name: 'Starboy',
  persona: 'The Weeknd',
  description: 'Dark R&B - adds Daft Punk production, trap influences, and moody atmosphere',
  code: `// THE WEEKND - Starboy (prod. Daft Punk)
// Transforms tracks + adds dark R&B flavor
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
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = -3;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 6;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.4;
    
    dj.deck.A.effects.add('distortion', 'distortion');
    const dist = dj.deck.A.effects.get('distortion');
    if (dist) dist.wet = 0.1;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Trap-influenced kick
  if ([0, 6, 12].includes(beat)) {
    dj.sample('drums/kick-10', time);
    dj.sidechain('8n');
  }
  
  // Dark synth chords
  if (beat === 0) {
    dj.sample('synth/pad-5', time);
  }
  
  // 808 bass hits
  if ([0, 8].includes(beat)) {
    dj.sample('bass/808-1', time);
  }
  
  // Hi-hat rolls
  if (beat >= 12) {
    dj.sample('drums/hihat-10', time);
  }
  
  // Snare on 2
  if (beat === 8) {
    dj.sample('drums/snare-6', time);
  }
  
  tick++;
});`
};
