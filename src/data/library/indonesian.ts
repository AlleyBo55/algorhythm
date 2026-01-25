import { Template } from '../templates';

export const indonesian_koplo: Template = {
  id: 'indonesian_koplo',
  name: 'Koplo Beat',
  persona: 'Indonesian',
  description: 'Fast-paced koplo rhythm that transforms any track into koplo style',
  code: `// INDONESIAN KOPLO BEAT
// Signature: Fast kendang, tabla, and energetic rhythm
dj.bpm = 140; // Fast koplo tempo

// Match deck tracks to koplo tempo
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 140;
  // Add reverb for traditional Indonesian sound
  dj.deck.A.effects.add('reverb', 'reverb');
  const reverbFx = dj.deck.A.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.3;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 140;
  dj.deck.B.effects.add('reverb', 'reverb');
  const reverbFx = dj.deck.B.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.3;
}

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kendang pattern (main drum)
  // Dung (low) and Tak (high) pattern
  if ([0, 3, 6, 9, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '16n', time); // Dung
  }
  if ([2, 5, 8, 11, 14].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '32n', time); // Tak
  }
  
  // Tabla/Ketipung rapid hits
  if (tick % 2 === 1) {
    dj.tom.triggerAttackRelease('C1', '32n', time);
  }
  
  // Suling (flute) melody - pentatonic scale
  const sulingMelody = ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5'];
  if (tick % 4 === 0) {
    const note = sulingMelody[(tick / 4) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // Gendang fills (every 4 bars)
  if (bar % 4 === 3 && beat >= 12) {
    dj.tom.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});

// Lower instruments volume so koplo rhythm is prominent
dj.instruments.volume = 0.4;`
};

export const indonesian_dangdut: Template = {
  id: 'indonesian_dangdut',
  name: 'Dangdut Groove',
  persona: 'Indonesian',
  description: 'Classic dangdut rhythm with tabla and gendang patterns',
  code: `// INDONESIAN DANGDUT
// Signature: Tabla, gendang, and Middle Eastern influences
dj.bpm = 120; // Classic dangdut tempo

// Match deck tracks to dangdut tempo
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 120;
  // Add reverb and chorus for dangdut atmosphere
  dj.deck.A.effects.add('reverb', 'reverb');
  dj.deck.A.effects.add('chorus', 'chorus');
  const reverbFx = dj.deck.A.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.25;
  const chorusFx = dj.deck.A.effects.get('chorus');
  if (chorusFx) chorusFx.wet = 0.2;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 120;
  dj.deck.B.effects.add('reverb', 'reverb');
  dj.deck.B.effects.add('chorus', 'chorus');
  const reverbFx = dj.deck.B.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.25;
  const chorusFx = dj.deck.B.effects.get('chorus');
  if (chorusFx) chorusFx.wet = 0.2;
}

const dangdutChords = [
  ['Am3', 'C4', 'E4'],  // Am
  ['F3', 'A3', 'C4'],   // F
  ['C3', 'E3', 'G3'],   // C
  ['G3', 'B3', 'D4']    // G
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Tabla pattern - signature dangdut rhythm
  // Dha Dhin Dhin Dha pattern
  if ([0, 4, 6, 8, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time); // Dha
  }
  if ([2, 10, 14].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time); // Dhin
  }
  
  // Gendang (hand drum) accents
  if ([1, 5, 9, 13].includes(beat)) {
    dj.tom.triggerAttackRelease('C1', '16n', time);
  }
  
  // Keyboard/Organ chords (essential dangdut sound)
  if (beat === 0) {
    const chord = dangdutChords[bar % 4];
    dj.piano.triggerAttackRelease(chord, '2n', time);
  }
  
  // Suling melody (bamboo flute)
  const sulingLine = ['A4', 'C5', 'E5', 'D5', 'C5', 'A4', 'G4', 'A4'];
  if (tick % 2 === 0) {
    const note = sulingLine[(tick / 2) % 8];
    dj.flute.triggerAttackRelease(note, '8n', time);
  }
  
  // Bass line (walking bass)
  if (tick % 4 === 0) {
    const bassNotes = ['A1', 'F1', 'C2', 'G1'];
    const note = bassNotes[Math.floor(tick / 4) % 4];
    dj.bass.triggerAttackRelease(note, '4n', time);
  }
  
  // Tabla fills (every 2 bars)
  if (bar % 2 === 1 && beat >= 14) {
    dj.clap.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});

// Balance instruments with dangdut rhythm
dj.instruments.volume = 0.35;`
};

export const indonesian_koplo_remix: Template = {
  id: 'indonesian_koplo_remix',
  name: 'Koplo Remix (EDM Fusion)',
  persona: 'Indonesian',
  description: 'Modern koplo mixed with EDM drops and electronic elements',
  code: `// KOPLO EDM REMIX
// Fusion of traditional koplo with modern EDM
dj.bpm = 145;

// Match deck tracks to koplo EDM tempo
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 145;
  // Add delay for EDM vibe
  dj.deck.A.effects.add('delay', 'delay');
  dj.deck.A.effects.add('reverb', 'reverb');
  const delayFx = dj.deck.A.effects.get('delay');
  if (delayFx) delayFx.wet = 0.2;
  const reverbFx = dj.deck.A.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.3;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 145;
  dj.deck.B.effects.add('delay', 'delay');
  dj.deck.B.effects.add('reverb', 'reverb');
  const delayFx = dj.deck.B.effects.get('delay');
  if (delayFx) delayFx.wet = 0.2;
  const reverbFx = dj.deck.B.effects.get('reverb');
  if (reverbFx) reverbFx.wet = 0.3;
}

const koploMelody = ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'C5'];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Traditional koplo kendang (bars 0-7)
  if (bar < 8) {
    // Kendang pattern
    if ([0, 3, 6, 9, 12].includes(beat)) {
      dj.kick.triggerAttackRelease('C1', '16n', time);
    }
    if ([2, 5, 8, 11, 14].includes(beat)) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
    
    // Suling melody
    if (tick % 2 === 0) {
      const note = koploMelody[(tick / 2) % 8];
      dj.flute.triggerAttackRelease(note, '8n', time);
    }
  }
  
  // EDM DROP (bars 8+)
  if (bar >= 8) {
    // Four-on-floor EDM kick
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    
    // Keep koplo snare pattern
    if ([2, 5, 8, 11, 14].includes(beat)) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
    
    // EDM synth lead with koplo melody
    if (tick % 2 === 0) {
      const note = koploMelody[(tick / 2) % 8];
      dj.lead.triggerAttackRelease(note, '8n', time);
    }
    
    // Bass drop
    if (tick % 8 === 0) {
      dj.bass.triggerAttackRelease('C2', '4n', time);
    }
  }
  
  // Hi-hats throughout
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Build-up (bar 7)
  if (bar === 7 && beat >= 12) {
    dj.tom.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});

dj.instruments.volume = 0.4;`
};
