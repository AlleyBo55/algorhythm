import { Template } from '../templates';

export const black_eyed_peas_boom_boom_pow: Template = {
  id: 'black_eyed_peas_boom_boom_pow',
  name: 'Boom Boom Pow',
  persona: 'Black Eyed Peas',
  description: 'Futuristic electro-hop with robotic vocals',
  code: `// BLACK EYED PEAS - Boom Boom Pow
// Signature: Futuristic electro, robotic vocals, heavy bass
dj.bpm = 130;

// Transform loaded tracks
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 128;
  dj.deck.A.effects.add('reverb', 'reverb');
  const fx = dj.deck.A.effects.get('reverb');
  if (fx) fx.wet = 0.25;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 128;
  dj.deck.B.effects.add('reverb', 'reverb');
  const fx = dj.deck.B.effects.get('reverb');
  if (fx) fx.wet = 0.25;
}

const roboticMelody = ['E4', 'E4', 'D4', 'C4', 'B3', 'C4', 'D4', 'E4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Heavy kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Robotic synth melody
  if (tick % 2 === 0) {
    const note = roboticMelody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Snare on 2 and 4
  if ([8].includes(beat)) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Sub bass
  if ([0, 8].includes(beat)) {
    dj.bass.triggerAttackRelease('E1', '4n', time);
  }
  
  tick++;
});`
};

export const black_eyed_peas_i_gotta_feeling: Template = {
  id: 'black_eyed_peas_i_gotta_feeling',
  name: 'I Gotta Feeling',
  persona: 'Black Eyed Peas',
  description: 'Party anthem with uplifting house vibes',
  code: `// BLACK EYED PEAS - I Gotta Feeling
dj.bpm = 128;

// Transform loaded tracks
if (dj.deck.A.duration > 0) {
  dj.deck.A.bpm = 128;
  dj.deck.A.effects.add('reverb', 'reverb');
  const fx = dj.deck.A.effects.get('reverb');
  if (fx) fx.wet = 0.25;
}
if (dj.deck.B.duration > 0) {
  dj.deck.B.bpm = 128;
  dj.deck.B.effects.add('reverb', 'reverb');
  const fx = dj.deck.B.effects.get('reverb');
  if (fx) fx.wet = 0.25;
}

const partyChords = [
  ['G3', 'B3', 'D4'],   // G
  ['Em3', 'G3', 'B3'],  // Em
  ['C3', 'E3', 'G3'],   // C
  ['D3', 'F#3', 'A3']   // D
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // 4-on-floor house kick
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Uplifting chord progression
  if (beat === 0) {
    const chord = partyChords[bar % 4];
    dj.synth.triggerAttackRelease(chord, '1m', time);
  }
  
  // Claps on 2 and 4
  if ([8].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  // Hi-hats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Bass groove
  if (tick % 4 === 0) {
    dj.bass.triggerAttackRelease('G1', '8n', time);
  }
  
  tick++;
});`
};
