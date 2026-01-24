import { Template } from '../templates';

export const alan_walker_faded: Template = {
  id: 'alan_walker_faded',
  name: 'Faded Style',
  persona: 'Alan Walker',
  description: 'Melodic future bass - adds signature reverb, delay, and emotional atmosphere',
  code: `// ALAN WALKER - Faded Style
// Transforms tracks + adds signature flavor
dj.bpm = 90;

const chords = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

const melody = ['C#5', 'B4', 'A4', 'F#4', 'E4', 'F#4', 'A4', 'B4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  // Emotional reverb on all tracks
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 0;
  dj.deck.A.filter.cutoff = 20000;
  
  // Add reverb effect
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.4;
    
    dj.deck.A.effects.add('delay', 'delay');
    const del = dj.deck.A.effects.get('delay');
    if (del) del.wet = 0.2;
  }
  
  // Build-up filter sweep (bars 6-8)
  if (bar >= 6 && bar < 8) {
    const progress = (bar - 6) / 2;
    dj.deck.A.filter.cutoff = 500 + (progress * 19500);
    dj.deck.A.colorFX.value = progress * 0.5;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Kick pattern (drop) with sidechain
  if (bar >= 8 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Signature pluck melody
  if (tick % 2 === 0) {
    const note = melody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Hi-hat pattern
  if (bar >= 8 && tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Clap on 2 and 4
  if (bar >= 8 && [8, 24].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};

export const alan_walker_alone: Template = {
  id: 'alan_walker_alone',
  name: 'Alone Style',
  persona: 'Alan Walker',
  description: 'Uplifting progressive house - adds vocal chops, bass wobble, and energy',
  code: `// ALAN WALKER - Alone Style
// Transforms tracks + adds signature flavor
dj.bpm = 120;

const vocalChops = ['C5', 'D5', 'E5', 'G5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 2;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 3;
  dj.deck.A.filter.cutoff = 20000;
  
  // Add chorus for width
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('chorus', 'chorus');
    const cho = dj.deck.A.effects.get('chorus');
    if (cho) cho.wet = 0.3;
  }
  
  // === LAYERED INSTRUMENTS ===
  if (bar >= 8) {
    // Kick with sidechain
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
      dj.sidechain('8n');
    }
    
    // Signature bass wobble
    if (tick % 8 === 0) {
      dj.bass.triggerAttackRelease('F#1', '4n', time);
    }
    
    // Vocal chops
    if ([0, 6, 12].includes(beat)) {
      const note = vocalChops[beat / 6];
      dj.pluck.triggerAttackRelease(note, '16n', time);
    }
    
    // Supersaw lead
    if (beat === 0) {
      dj.synth.triggerAttackRelease(['F#4', 'A4', 'C#5'], '2n', time);
    }
  }
  
  // Build-up (bars 6-8)
  if (bar >= 6 && bar < 8) {
    // Snare roll
    if (tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '16n', time);
    }
    // Filter sweep
    dj.deck.A.filter.cutoff = 500 + ((bar - 6) * 10000);
  }
  
  // Hi-hats throughout
  if (bar >= 8 && tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};
