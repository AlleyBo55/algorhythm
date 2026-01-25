import { Template } from '../templates';

export const avicii_levels_remix: Template = {
  id: 'avicii_levels_remix',
  name: 'Levels Remix (Effects Heavy)',
  persona: 'Avicii',
  description: 'Progressive house with heavy reverb, delay, and filter sweeps',
  code: `// AVICII - Levels Style Remix
// Heavy effects: Reverb, Delay, Filter automation
dj.bpm = 126;

// Add effects to Deck A (your loaded track)
dj.deck.A.effects.add('reverb', 'reverb');
dj.deck.A.effects.add('delay', 'delay');
dj.deck.A.effects.add('filter', 'filter');

const chords = [
  ['E3', 'G#3', 'B3'],  // Em
  ['C3', 'E3', 'G3'],   // C
  ['G3', 'B3', 'D4'],   // G
  ['D3', 'F#3', 'A3']   // D
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Piano chords
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '2n', time);
  }
  
  // EFFECT AUTOMATION
  // Reverb build (bars 0-4)
  if (bar < 4) {
    const reverbFx = dj.deck.A.effects.get('reverb');
    if (reverbFx) reverbFx.wet = bar / 4;
  }
  
  // Delay echo (every 4 bars)
  if (tick % 64 === 0) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0.7;
  }
  if (tick % 64 === 32) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0;
  }
  
  // Filter sweep (bars 6-8)
  if (bar >= 6 && bar < 8) {
    const progress = (tick % 32) / 32;
    dj.deck.A.filter.lowpass = 500 + (progress * 19500);
  } else {
    dj.deck.A.filter.lowpass = 20000;
  }
  
  // Color FX on drop (bars 8+)
  if (bar >= 8) {
    dj.deck.A.colorFX.value = Math.sin(tick * 0.1) * 0.3 + 0.3;
  }
  
  tick++;
});`
};

export const skrillex_dubstep_remix: Template = {
  id: 'skrillex_dubstep_remix',
  name: 'Dubstep Remix (Wobble Bass)',
  persona: 'Skrillex',
  description: 'Heavy dubstep with filter wobbles, distortion, and bitcrusher',
  code: `// SKRILLEX - Dubstep Remix
// Effects: Filter wobble, Distortion, Bitcrusher
dj.bpm = 140;

// Add effects to Deck A
dj.deck.A.effects.add('filter', 'filter');
dj.deck.A.effects.add('distortion', 'distortion');
dj.deck.A.effects.add('bitcrusher', 'bitcrusher');

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Dubstep kick/snare pattern
  if (tick % 16 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  if (tick % 16 === 8) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Wobble bass
  if (bar >= 8 && tick % 2 === 0) {
    const note = ['E1', 'E1', 'G1', 'E1'][Math.floor(tick / 2) % 4];
    dj.bass.triggerAttackRelease(note, '16n', time);
  }
  
  // WOBBLE EFFECT - Filter automation
  const wobbleSpeed = 8; // 8th notes
  const wobblePhase = (tick % wobbleSpeed) / wobbleSpeed;
  const filterFx = dj.deck.A.effects.get('filter');
  if (filterFx && bar >= 8) {
    // Wobble between 200Hz and 2000Hz
    dj.deck.A.filter.lowpass = 200 + (Math.sin(wobblePhase * Math.PI * 2) * 900 + 900);
    filterFx.wet = 0.8;
  }
  
  // Distortion on drop
  const distFx = dj.deck.A.effects.get('distortion');
  if (distFx && bar >= 8) {
    distFx.wet = 0.4;
  }
  
  // Bitcrusher for lo-fi sections
  const bitFx = dj.deck.A.effects.get('bitcrusher');
  if (bitFx && bar >= 4 && bar < 8) {
    bitFx.wet = 0.6;
  } else if (bitFx) {
    bitFx.wet = 0;
  }
  
  tick++;
});`
};

export const daft_punk_filter_house: Template = {
  id: 'daft_punk_filter_house',
  name: 'Filter House (Daft Punk)',
  persona: 'Daft Punk',
  description: 'French house with classic filter sweeps and phaser',
  code: `// DAFT PUNK - Filter House
// Classic filter sweeps + Phaser
dj.bpm = 123;

// Add effects
dj.deck.A.effects.add('filter', 'filter');
dj.deck.A.effects.add('phaser', 'phaser');

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // 4-on-floor kick
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Disco bassline
  const bassNotes = ['E2', 'E2', 'G2', 'A2', 'E2', 'E2', 'D2', 'C2'];
  if (tick % 2 === 0) {
    const note = bassNotes[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '8n', time);
  }
  
  // CLASSIC FILTER SWEEP (every 8 bars)
  const sweepBar = bar % 8;
  if (sweepBar < 4) {
    // Open filter gradually
    const progress = sweepBar / 4;
    dj.deck.A.filter.lowpass = 200 + (progress * 19800);
    const filterFx = dj.deck.A.effects.get('filter');
    if (filterFx) filterFx.wet = 0.9;
  } else {
    // Keep filter open
    dj.deck.A.filter.lowpass = 20000;
  }
  
  // Phaser on hi-hats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  const phaserFx = dj.deck.A.effects.get('phaser');
  if (phaserFx && bar >= 4) {
    phaserFx.wet = 0.5;
  }
  
  tick++;
});`
};

export const porter_robinson_emotional: Template = {
  id: 'porter_robinson_emotional',
  name: 'Emotional Remix (Porter Robinson)',
  persona: 'Porter Robinson',
  description: 'Emotional future bass with heavy reverb and chorus',
  code: `// PORTER ROBINSON - Emotional Style
// Heavy reverb, chorus, and delay for dreamy atmosphere
dj.bpm = 128;

// Add atmospheric effects
dj.deck.A.effects.add('reverb', 'reverb');
dj.deck.A.effects.add('chorus', 'chorus');
dj.deck.A.effects.add('delay', 'delay');

const chords = [
  ['C4', 'E4', 'G4', 'B4'],   // Cmaj7
  ['A3', 'C4', 'E4', 'G4'],   // Am7
  ['F3', 'A3', 'C4', 'E4'],   // Fmaj7
  ['G3', 'B3', 'D4', 'F4']    // G7
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if (bar >= 8 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Emotional chords with heavy reverb
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Pluck melody
  const melody = ['E5', 'D5', 'C5', 'B4', 'C5', 'D5', 'E5', 'G5'];
  if (tick % 2 === 0) {
    const note = melody[(tick / 2) % 8];
    dj.pluck.triggerAttackRelease(note, '8n', time);
  }
  
  // ATMOSPHERIC EFFECTS
  // Heavy reverb always on
  const reverbFx = dj.deck.A.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.6;
  
  // Chorus for width
  const chorusFx = dj.deck.A.effects.get('chorus');
  if (chorusFx) chorusFx.wet = 0.4;
  
  // Delay on melody hits
  if (tick % 8 === 0) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0.5;
  }
  
  // Color FX for dreamy atmosphere
  dj.deck.A.colorFX.value = 0.3 + (Math.sin(tick * 0.05) * 0.2);
  
  tick++;
});`
};

export const flume_experimental: Template = {
  id: 'flume_experimental',
  name: 'Experimental Remix (Flume)',
  persona: 'Flume',
  description: 'Experimental future bass with autofilter and creative effects',
  code: `// FLUME - Experimental Style
// Autofilter, creative effects, glitchy elements
dj.bpm = 140;

// Add experimental effects
dj.deck.A.effects.add('autofilter', 'autofilter');
dj.deck.A.effects.add('bitcrusher', 'bitcrusher');
dj.deck.A.effects.add('delay', 'delay');

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Syncopated kick
  if ([0, 6, 10, 14].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Glitchy snare
  if (beat === 8 || (bar >= 8 && beat === 12)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Bass wobble
  if (bar >= 8 && tick % 4 === 0) {
    const notes = ['F#1', 'A1', 'C2', 'E2'];
    const note = notes[Math.floor(tick / 4) % 4];
    dj.bass.triggerAttackRelease(note, '8n', time);
  }
  
  // AUTOFILTER - Rhythmic filter modulation
  const autoFx = dj.deck.A.effects.get('autofilter');
  if (autoFx && bar >= 4) {
    autoFx.wet = 0.7;
  }
  
  // Glitchy bitcrusher (random)
  const bitFx = dj.deck.A.effects.get('bitcrusher');
  if (bitFx && Math.random() > 0.9) {
    bitFx.wet = 0.8;
  } else if (bitFx) {
    bitFx.wet = 0;
  }
  
  // Delay throws
  if (tick % 32 === 24) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0.9;
  }
  if (tick % 32 === 0) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0;
  }
  
  tick++;
});`
};

export const martin_garrix_bigroom: Template = {
  id: 'martin_garrix_bigroom',
  name: 'Big Room Remix (Martin Garrix)',
  persona: 'Martin Garrix',
  description: 'Big room house with massive reverb and filter builds',
  code: `// MARTIN GARRIX - Big Room Style
// Massive reverb, filter builds, huge drops
dj.bpm = 128;

// Add big room effects
dj.deck.A.effects.add('reverb', 'reverb');
dj.deck.A.effects.add('filter', 'filter');

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Big room kick
  if (bar >= 8 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Lead synth
  if (bar >= 8 && tick % 8 === 0) {
    const notes = ['C4', 'E4', 'G4', 'C5'];
    const note = notes[Math.floor(tick / 8) % 4];
    dj.lead.triggerAttackRelease(note, '4n', time);
  }
  
  // BUILD-UP (bars 6-8)
  if (bar >= 6 && bar < 8) {
    // Snare roll
    if (tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '16n', time);
    }
    
    // Filter close
    const progress = (tick % 32) / 32;
    dj.deck.A.filter.lowpass = 20000 - (progress * 19000);
    
    // Reverb build
    const reverbFx = dj.deck.A.effects.get('reverb');
    if (reverbFx) reverbFx.wet = progress * 0.9;
  }
  
  // DROP (bar 8)
  if (bar === 8 && beat === 0) {
    // Open filter
    dj.deck.A.filter.lowpass = 20000;
    
    // Clear reverb
    const reverbFx = dj.deck.A.effects.get('reverb');
    if (reverbFx) reverbFx.wet = 0.2;
  }
  
  // Color FX on drop
  if (bar >= 8) {
    dj.deck.A.colorFX.value = 0.2;
  }
  
  tick++;
});`
};
