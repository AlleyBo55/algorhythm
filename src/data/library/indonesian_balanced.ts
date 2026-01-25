import { Template } from '../templates';

export const indonesian_dangdut_balanced: Template = {
  id: 'indonesian_dangdut_balanced',
  name: 'Dangdut (Balanced Mix)',
  persona: 'Indonesian',
  description: 'Transforms tracks into dangdut with perfect blend - balanced volumes and beat-synced',
  code: `// DANGDUT BALANCED MIX
// Perfect blend of original track + dangdut elements
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
  
  // === DECK VOLUME CONTROL ===
  dj.deck.A.volume = -3;  // Slightly lower (70% volume)
  dj.deck.A.eq.low = -2;  // Reduce bass slightly
  dj.deck.A.eq.mid = 0;   // Keep mids
  dj.deck.A.eq.high = 0;  // Keep highs
  dj.deck.A.filter.cutoff = 20000;
  
  // Add dangdut atmosphere
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.25;
  }
  
  // === INSTRUMENTS VOLUME (Balanced) ===
  dj.instruments.volume = 0.4; // 40% - subtle layer
  
  // === DANGDUT RHYTHM (Beat-synced) ===
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
  
  // Keyboard chords (subtle)
  if (beat === 0) {
    const chord = dangdutChords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '2n', time);
  }
  
  // Suling melody (subtle)
  if (tick % 2 === 0) {
    const note = sulingLine[(tick / 2) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // Bass line (subtle)
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

// Result: 
// - Original track: 70% volume (vocals/melody CLEAR)
// - Dangdut instruments: 40% volume (tabla, suling blend in)
// = Original track dominant with dangdut flavor!`
};

export const indonesian_koplo_balanced: Template = {
  id: 'indonesian_koplo_balanced',
  name: 'Koplo (Balanced Mix)',
  persona: 'Indonesian',
  description: 'Transforms tracks into koplo with perfect blend - balanced volumes and beat-synced',
  code: `// KOPLO BALANCED MIX
// Perfect blend of original track + koplo elements
dj.bpm = 140;

const sulingMelody = ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === DECK VOLUME CONTROL ===
  dj.deck.A.volume = -3;  // Slightly lower (70% volume)
  dj.deck.A.eq.low = -2;  // Reduce bass slightly
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.high = 0;
  dj.deck.A.filter.cutoff = 20000;
  
  // Add koplo atmosphere
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.3;
  }
  
  // === INSTRUMENTS VOLUME (Balanced) ===
  dj.instruments.volume = 0.4; // 40% - subtle layer
  
  // === KOPLO RHYTHM (Beat-synced) ===
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
  
  // Suling melody (subtle)
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

// Result:
// - Original track: 70% volume (CLEAR and dominant)
// - Koplo instruments: 40% volume (blend in)
// = Original track dominant with koplo flavor!`
};
