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
  
  // === LAYERED INSTRUMENTS ===
  // Epic orchestral chords
  if (beat === 0) {
    const chord = epicChords[bar % 4];
    dj.strings.triggerAttackRelease(chord, '1m', time);
  }
  
  // Dramatic kick pattern
  if (bar >= 4 && [0, 4, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Intense string ostinato
  if (bar >= 4 && tick % 2 === 0) {
    dj.strings.triggerAttackRelease('E5', '32n', time);
  }
  
  // Brass stabs
  if ([0, 8].includes(beat)) {
    dj.brass.triggerAttackRelease(['E3', 'G3', 'B3'], '4n', time);
  }
  
  // Taiko drums
  if (beat === 0 || beat === 8) {
    dj.tom.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare rolls
  if (bar >= 4 && beat === 8) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
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
  
  // === LAYERED INSTRUMENTS ===
  // Cinematic intro
  if (bar < 4) {
    if (beat === 0) {
      dj.pad.triggerAttackRelease(['E3', 'G3', 'B3'], '2m', time);
    }
  }
  
  // Dubstep drop
  if (bar >= 4) {
    // Half-time kick/snare
    if (beat === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
      dj.sidechain('8n');
    }
    if (beat === 8) {
      dj.snare.triggerAttackRelease('C1', '8n', time);
    }
    
    // Wobble bass
    if (tick % 2 === 0) {
      const note = bassWobble[(tick / 2) % 6];
      dj.bass.triggerAttackRelease(note, '16n', time);
    }
  }
  
  // Orchestral hits
  if ([0, 8].includes(beat)) {
    dj.strings.triggerAttackRelease('E2', '4n', time);
  }
  
  tick++;
});`
};
