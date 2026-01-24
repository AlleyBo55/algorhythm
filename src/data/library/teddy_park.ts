import { Template } from '../templates';

export const teddy_park_ddu_du: Template = {
  id: 'teddy_park_ddu_du',
  name: 'DDU-DU DDU-DU',
  persona: 'Teddy Park',
  description: 'K-pop trap with Middle Eastern influences and powerful drops',
  code: `// TEDDY PARK - DDU-DU DDU-DU (BLACKPINK)
// Signature: K-pop trap, Middle Eastern scales, powerful 808s
dj.bpm = 145;

const orientalScale = ['D4', 'Eb4', 'F#4', 'G4', 'A4', 'Bb4', 'C#5', 'D5'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Trap kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if (beat === 8) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Middle Eastern melody
  if (bar >= 4 && tick % 2 === 0) {
    const note = orientalScale[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Powerful 808 bass
  if ([0, 8].includes(beat)) {
    dj.bass.triggerAttackRelease('D1', '4n', time);
  }
  
  // Hi-hat rolls (signature)
  if (beat >= 14) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  // Brass stabs
  if ([4, 12].includes(beat)) {
    dj.brass.triggerAttackRelease('D3', '8n', time);
  }
  
  tick++;
});`
};

export const teddy_park_kill_this_love: Template = {
  id: 'teddy_park_kill_this_love',
  name: 'Kill This Love',
  persona: 'Teddy Park',
  description: 'EDM-pop hybrid with dramatic builds and explosive drops',
  code: `// TEDDY PARK - Kill This Love (BLACKPINK)
dj.bpm = 132;

const chords = [
  ['Bb3', 'D4', 'F4'],  // Bb
  ['Gm3', 'Bb3', 'D4'], // Gm
  ['Eb3', 'G3', 'Bb3'], // Eb
  ['F3', 'A3', 'C4']    // F
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Build-up (bars 0-4)
  if (bar < 4) {
    if (beat === 0) {
      const chord = chords[bar % 4];
      dj.strings.triggerAttackRelease(chord, '1m', time);
    }
    
    // Rising tension
    if (bar === 3) {
      dj.snare.triggerAttackRelease('C1', '16n', time);
    }
  }
  
  // Drop (bars 4+)
  if (bar >= 4) {
    // Powerful kick
    if ([0, 4, 8, 12].includes(beat)) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    
    // Synth lead
    if (tick % 4 === 0) {
      dj.synth.triggerAttackRelease('Bb4', '8n', time);
    }
    
    // 808 bass
    if ([0, 8].includes(beat)) {
      dj.bass.triggerAttackRelease('Bb1', '4n', time);
    }
  }
  
  tick++;
});`
};
