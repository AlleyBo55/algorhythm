import { Template } from '../templates';

export const indonesian_dangdut_realistic: Template = {
  id: 'indonesian_dangdut_realistic',
  name: 'Dangdut Remix (Realistic)',
  persona: 'Indonesian',
  description: 'Best possible dangdut transformation - mutes original drums, adds dangdut rhythm',
  code: `// DANGDUT REMIX - Most Realistic Approach
// Limitations: Cannot separate stems in browser
// Solution: Mute original bass/drums, add dangdut elements

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
  
  // === MUTE ORIGINAL DRUMS/BASS ===
  dj.deck.A.volume = -6;      // Lower overall
  dj.deck.A.eq.low = -20;     // KILL bass (make room for dangdut bass)
  dj.deck.A.eq.mid = 0;       // Keep mids (vocals/melody)
  dj.deck.A.eq.high = 3;      // Boost highs (vocals clarity)
  dj.deck.A.filter.highpass = 200; // Remove low frequencies
  
  // === BOOST DANGDUT INSTRUMENTS ===
  dj.instruments.volume = 0.8; // 80% - LOUD
  
  // === DANGDUT TABLA RHYTHM (Dha Dhin Dhin Dha) ===
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
  
  // === DANGDUT KEYBOARD (LOUD) ===
  if (beat === 0) {
    const chord = dangdutChords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '2n', time);
  }
  
  // === SULING MELODY (LOUD) ===
  if (tick % 2 === 0) {
    const note = sulingLine[(tick / 2) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // === DANGDUT BASS (LOUD) ===
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

// RESULT:
// ✅ Original vocals/melody: Audible (high-passed)
// ✅ Original drums/bass: MUTED (-20dB EQ)
// ✅ Dangdut rhythm: LOUD (tabla, gendang)
// ✅ Dangdut instruments: LOUD (suling, keyboard, bass)
// = Sounds MORE like dangdut!

// LIMITATION:
// Cannot fully separate stems in browser
// For TRUE dangdut conversion, use:
// 1. Spleeter/Demucs (Python) to separate stems
// 2. Replace drums with dangdut rhythm
// 3. Re-mix in DAW`
};

export const indonesian_koplo_realistic: Template = {
  id: 'indonesian_koplo_realistic',
  name: 'Koplo Remix (Realistic)',
  persona: 'Indonesian',
  description: 'Best possible koplo transformation - mutes original drums, adds koplo rhythm',
  code: `// KOPLO REMIX - Most Realistic Approach
dj.bpm = 140;

const sulingMelody = ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === MUTE ORIGINAL DRUMS/BASS ===
  dj.deck.A.volume = -6;
  dj.deck.A.eq.low = -20;     // KILL bass
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.high = 3;      // Boost vocals
  dj.deck.A.filter.highpass = 200;
  
  // === BOOST KOPLO INSTRUMENTS ===
  dj.instruments.volume = 0.8; // 80% - LOUD
  
  // === KOPLO KENDANG RHYTHM (Dung Tak) ===
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
  
  // === SULING MELODY (LOUD) ===
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

// RESULT:
// ✅ Original vocals: Audible
// ✅ Original drums/bass: MUTED
// ✅ Koplo rhythm: LOUD (kendang, tabla)
// ✅ Suling melody: LOUD
// = Sounds MORE like koplo!`
};
