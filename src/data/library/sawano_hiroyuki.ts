import { Template } from '../templates';

export const sawano_attack_on_titan: Template = {
  id: 'sawano_attack_on_titan',
  name: 'Attack on Titan Theme',
  persona: 'Sawano Hiroyuki',
  description: 'Epic orchestral EDM with German vocals and intense strings',
  code: `// SAWANO HIROYUKI - Attack on Titan Style
// Signature: Orchestral + EDM, epic strings, dramatic builds
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
  
  // Epic orchestral chords
  if (beat === 0) {
    const chord = epicChords[bar % 4];
    dj.strings.triggerAttackRelease(chord, '1m', time);
  }
  
  // Dramatic kick pattern
  if (bar >= 4 && [0, 4, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
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
    dj.taiko.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`
};

export const sawano_aldnoah: Template = {
  id: 'sawano_aldnoah',
  name: 'Aldnoah.Zero Style',
  persona: 'Sawano Hiroyuki',
  description: 'Cinematic dubstep with orchestral elements',
  code: `// SAWANO HIROYUKI - Aldnoah.Zero Style
dj.bpm = 140;

const bassWobble = ['E1', 'E1', 'D1', 'C1', 'B0', 'A0'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Cinematic intro
  if (bar < 4) {
    if (beat === 0) {
      dj.pad.triggerAttackRelease(['E3', 'G3', 'B3'], '2m', time);
    }
  }
  
  // Dubstep drop
  if (bar >= 4) {
    // Half-time kick/snare
    if (beat === 0) dj.kick.triggerAttackRelease('C1', '8n', time);
    if (beat === 8) dj.snare.triggerAttackRelease('C1', '8n', time);
    
    // Wobble bass
    if (tick % 2 === 0) {
      const note = bassWobble[(tick / 2) % 6];
      dj.bass.triggerAttackRelease(note, '16n', time);
      dj.effects.filter.frequency.value = 200 + (tick % 8) * 500;
    }
  }
  
  // Orchestral hits
  if ([0, 8].includes(beat)) {
    dj.orchestra.triggerAttackRelease('E2', '4n', time);
  }
  
  tick++;
});`
};
