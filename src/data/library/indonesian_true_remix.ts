import { Template } from '../templates';

export const indonesian_dangdut_true_remix: Template = {
  id: 'indonesian_dangdut_true_remix',
  name: 'Dangdut TRUE REMIX',
  persona: 'Indonesian',
  description: 'Completely transforms ANY song into dangdut - replaces original with dangdut rhythm',
  code: `// DANGDUT TRUE REMIX
// Turns ANY song into 100% dangdut
dj.bpm = 120;

const dangdutChords = [
  ['A3', 'C4', 'E4'],  // Am
  ['F3', 'A3', 'C4'],  // F
  ['C3', 'E3', 'G3'],  // C
  ['G3', 'B3', 'D4']   // G
];

const sulingLine = ['A4', 'C5', 'E5', 'D5', 'C5', 'A4', 'G4', 'A4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === MUTE ORIGINAL TRACKS (keep only vocals) ===
  dj.deck.A.volume = -60; // Almost mute
  dj.deck.A.eq.low = -60;  // Kill bass
  dj.deck.A.eq.mid = -60;  // Kill mids
  dj.deck.A.eq.high = -20; // Keep some vocals
  dj.deck.A.filter.cutoff = 3000; // Only vocals pass
  
  // === DANGDUT INSTRUMENTS (LOUD) ===
  dj.instruments.volume = 1.0; // Max volume
  
  // Tabla pattern - Dha Dhin Dhin Dha
  if ([0, 4, 6, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  if ([2, 10, 14].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Gendang accents
  if ([1, 5, 9, 13].includes(beat)) {
    dj.tom.triggerAttackRelease('C1', '16n', time);
  }
  
  // Keyboard chords (LOUD)
  if (beat === 0) {
    const chord = dangdutChords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '2n', time);
  }
  
  // Suling melody (LOUD)
  if (tick % 2 === 0) {
    const note = sulingLine[(tick / 2) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // Bass line (LOUD)
  if (tick % 4 === 0) {
    const bassNotes = ['A1', 'F1', 'C2', 'G1'];
    dj.bass.triggerAttackRelease(bassNotes[(tick / 4) % 4], '4n', time);
  }
  
  // Tabla fills
  if (bar % 2 === 1 && beat >= 14) {
    dj.clap.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});

// Result: Original track almost silent, dangdut instruments LOUD
// = Sounds like 100% dangdut!`
};

export const indonesian_koplo_true_remix: Template = {
  id: 'indonesian_koplo_true_remix',
  name: 'Koplo TRUE REMIX',
  persona: 'Indonesian',
  description: 'Completely transforms ANY song into koplo - replaces original with koplo rhythm',
  code: `// KOPLO TRUE REMIX
// Turns ANY song into 100% koplo
dj.bpm = 140;

const sulingMelody = ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === MUTE ORIGINAL TRACKS ===
  dj.deck.A.volume = -60;
  dj.deck.A.eq.low = -60;
  dj.deck.A.eq.mid = -60;
  dj.deck.A.eq.high = -20; // Keep vocals
  dj.deck.A.filter.cutoff = 3000;
  
  // === KOPLO INSTRUMENTS (LOUD) ===
  dj.instruments.volume = 1.0;
  
  // Kendang pattern - Dung Tak
  if ([0, 3, 6, 9, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '16n', time);
  }
  if ([2, 5, 8, 11, 14].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '32n', time);
  }
  
  // Tabla rapid hits
  if (tick % 2 === 1) {
    dj.tom.triggerAttackRelease('C1', '32n', time);
  }
  
  // Suling melody (LOUD)
  if (tick % 4 === 0) {
    const note = sulingMelody[(tick / 4) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // Gendang fills
  if (bar % 4 === 3 && beat >= 12) {
    dj.tom.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});

// Result: Original track almost silent, koplo instruments LOUD
// = Sounds like 100% koplo!`
};
