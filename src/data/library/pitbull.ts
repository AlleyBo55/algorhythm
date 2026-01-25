import { Template } from '../templates';

export const pitbull_timber: Template = {
  id: 'pitbull_timber',
  name: 'Timber',
  persona: 'Pitbull',
  description: 'Country-EDM fusion - adds banjo riffs, big room drops, and party energy',
  code: `// PITBULL - Timber (feat. Ke$ha)
// Transforms tracks + adds country-EDM flavor
dj.bpm = 130;

const banjoRiff = ['E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4', 'D4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 3;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 4;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.2;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Big room kick
  if (bar >= 8 && [0, 4, 8, 12].includes(beat)) {
    dj.sample('drums/kick-11', time);
    dj.sidechain('8n');
  }
  
  // Banjo riff (using pluck)
  if (tick % 2 === 0) {
    dj.sample('synth/pluck-4', time);
  }
  
  // Claps on 2 and 4
  if ([8].includes(beat)) {
    dj.sample('drums/clap-4', time);
  }
  
  // Build-up snare roll
  if (bar === 7) {
    dj.sample('drums/snare-7', time);
  }
  
  // Hi-hats
  if (tick % 2 === 1) {
    dj.sample('drums/hihat-11', time);
  }
  
  // Bass drops
  if (bar >= 8 && [0, 8].includes(beat)) {
    dj.sample('bass/sub-4', time);
  }
  
  tick++;
});`
};

export const pitbull_international_love: Template = {
  id: 'pitbull_international_love',
  name: 'International Love',
  persona: 'Pitbull',
  description: 'Pop-house - adds Latin piano, uplifting energy, and club vibes',
  code: `// PITBULL - International Love
// Transforms tracks + adds pop-house flavor
dj.bpm = 128;

const latinChords = [
  ['C4', 'E4', 'G4'],   // C
  ['A3', 'C4', 'E4'],   // Am
  ['F3', 'A3', 'C4'],   // F
  ['G3', 'B3', 'D4']    // G
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 2;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 3;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.25;
  }
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // 4-on-floor kick
  if (tick % 4 === 0) {
    dj.sample('drums/kick-12', time);
    dj.sidechain('8n');
  }
  
  // Latin piano chords
  if (beat === 0) {
    dj.sample('synth/pad-6', time);
  }
  
  // Synth lead
  if (bar >= 8 && tick % 4 === 0) {
    dj.sample('synth/lead-8', time);
  }
  
  // Claps on 2 and 4
  if ([8].includes(beat)) {
    dj.sample('drums/clap-5', time);
  }
  
  // Hi-hats
  if (tick % 2 === 1) {
    dj.sample('drums/hihat-12', time);
  }
  
  // Bass foundation
  if (tick % 8 === 0) {
    dj.sample('bass/sub-5', time);
  }
  
  tick++;
});`
};
