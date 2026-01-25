import { Template } from '../templates';

export const sawano_attack_on_titan: Template = {
  id: 'sawano_attack_on_titan',
  name: 'Attack on Titan Theme',
  persona: 'Sawano Hiroyuki',
  description: 'Epic orchestral EDM - adds intense strings, dramatic builds, and cinematic power',
  code: `// SAWANO HIROYUKI - Attack on Titan Style
// Transforms tracks + adds epic orchestral flavor
dj.bpm = 140;

const epicChords = [
  ['E3', 'G3', 'B3'],   // Em
  ['C3', 'E3', 'G3'],   // C
  ['D3', 'F#3', 'A3'],  // D
  ['B2', 'D3', 'F#3']   // Bm
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 3;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 5;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.6;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Epic orchestral chords
  if (beat === 0) {
    dj.sample('synth/pad-8', time);
  }
  
  // Dramatic kick pattern
  if (bar >= 4 && [0, 4, 8, 12].includes(beat)) {
    dj.sample('drums/kick-15', time);
    dj.sidechain('8n');
  }
  
  // Intense string ostinato
  if (bar >= 4 && tick % 2 === 0) {
    dj.sample('synth/lead-11', time);
  }
  
  // Brass stabs
  if ([0, 8].includes(beat)) {
    dj.sample('synth/brass-3', time);
  }
  
  // Taiko drums
  if (beat === 0 || beat === 8) {
    dj.sample('drums/tom-1', time);
  }
  
  // Snare rolls
  if (bar >= 4 && beat === 8) {
    dj.sample('drums/snare-10', time);
  }
  
  tick++;
});`
};

export const sawano_aldnoah: Template = {
  id: 'sawano_aldnoah',
  name: 'Aldnoah.Zero Style',
  persona: 'Sawano Hiroyuki',
  description: 'Cinematic dubstep - adds orchestral elements, wobble bass, and epic atmosphere',
  code: `// SAWANO HIROYUKI - Aldnoah.Zero Style
// Transforms tracks + adds cinematic dubstep flavor
dj.bpm = 140;

const bassWobble = ['E1', 'E1', 'D1', 'C1', 'B0', 'A0'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 6;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.6;
    
    dj.deck.A.effects.add('distortion', 'distortion');
    const dist = dj.deck.A.effects.get('distortion');
    if (dist) dist.wet = 0.2;
  }
  
  // Wobble filter automation
  if (bar >= 4) {
    const wobble = 500 + ((tick % 8) * 2000);
    dj.deck.A.filter.cutoff = wobble;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Cinematic intro
  if (bar < 4) {
    if (beat === 0) {
      dj.sample('synth/pad-9', time);
    }
  }
  
  // Dubstep drop
  if (bar >= 4) {
    // Half-time kick/snare
    if (beat === 0) {
      dj.sample('drums/kick-16', time);
      dj.sidechain('8n');
    }
    if (beat === 8) {
      dj.sample('drums/snare-11', time);
    }
    
    // Wobble bass
    if (tick % 2 === 0) {
      dj.sample('bass/sub-6', time);
    }
  }
  
  // Orchestral hits
  if ([0, 8].includes(beat)) {
    dj.sample('synth/pad-10', time);
  }
  
  tick++;
});`
};
