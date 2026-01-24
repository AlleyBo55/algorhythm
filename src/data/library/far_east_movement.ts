import { Template } from '../templates';

export const far_east_movement_like_a_g6: Template = {
  id: 'far_east_movement_like_a_g6',
  name: 'Like a G6',
  persona: 'Far East Movement',
  description: 'Electro-pop club anthem with signature synth hook',
  code: `// FAR EAST MOVEMENT - Like a G6
// Electro-pop club anthem
dj.bpm = 125;

// Transform loaded tracks
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 125;
  dj.deck.A.effects.add('reverb', 'reverb');
  const fx = dj.deck.A.effects.get('reverb');
  if (fx) fx.wet = 0.2;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 125;
  dj.deck.B.effects.add('reverb', 'reverb');
  const fx = dj.deck.B.effects.get('reverb');
  if (fx) fx.wet = 0.2;
}

// Iconic synth hook melody
const hookMelody = ['Bb4', 'C5', 'D5', 'F5', 'D5', 'C5', 'Bb4', 'G4'];
const bassline = ['Bb1', 'Bb1', 'G1', 'F1'];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Four-on-floor club kick
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Iconic synth hook (plays throughout)
  if (tick % 2 === 0) {
    const note = hookMelody[(tick / 2) % 8];
    dj.lead.triggerAttackRelease(note, '8n', time);
  }
  
  // Pumping bassline
  if (bar >= 4 && tick % 8 === 0) {
    const note = bassline[Math.floor(tick / 8) % 4];
    dj.bass.triggerAttackRelease(note, '4n', time);
  }
  
  // Clap on 2 and 4
  if (beat === 8) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  // Open hi-hat pattern
  if (tick % 4 === 2) {
    dj.hihat.triggerAttackRelease('C1', '16n', time);
  }
  
  // Build-up snare roll (bar 7)
  if (bar === 7 && tick % 2 === 0) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};

export const far_east_movement_rocketeer: Template = {
  id: 'far_east_movement_rocketeer',
  name: 'Rocketeer',
  persona: 'Far East Movement',
  description: 'Emotional electro-pop with soaring synths',
  code: `// FAR EAST MOVEMENT - Rocketeer
dj.bpm = 128;

// Transform loaded tracks
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 125;
  dj.deck.A.effects.add('reverb', 'reverb');
  const fx = dj.deck.A.effects.get('reverb');
  if (fx) fx.wet = 0.2;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 125;
  dj.deck.B.effects.add('reverb', 'reverb');
  const fx = dj.deck.B.effects.get('reverb');
  if (fx) fx.wet = 0.2;
}

const emotionalChords = [
  ['F3', 'A3', 'C4'],   // F
  ['C3', 'E3', 'G3'],   // C
  ['G3', 'B3', 'D4'],   // G
  ['Am3', 'C4', 'E4']   // Am
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = emotionalChords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Soaring lead
  if (bar >= 8 && tick % 4 === 0) {
    dj.synth.triggerAttackRelease('C5', '8n', time);
  }
  
  // Snare
  if ([8].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};
