import { Template } from '../templates';

export const teddy_park_ddu_du: Template = {
  id: 'teddy_park_ddu_du',
  name: 'DDU-DU DDU-DU',
  persona: 'Teddy Park',
  description: 'K-pop trap - adds Middle Eastern influences, powerful 808s, and BLACKPINK energy',
  code: `// TEDDY PARK - DDU-DU DDU-DU (BLACKPINK)
// Transforms tracks + adds K-pop trap flavor
dj.bpm = 145;

const orientalScale = ['D4', 'Eb4', 'F#4', 'G4', 'A4', 'Bb4', 'C#5', 'D5'];
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
    if (rev) rev.wet = 0.2;
    
    dj.deck.A.effects.add('distortion', 'distortion');
    const dist = dj.deck.A.effects.get('distortion');
    if (dist) dist.wet = 0.15;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Trap kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
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
    dj.bass808.triggerAttackRelease('D1', '4n', time);
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
  description: 'EDM-pop hybrid - adds dramatic builds, explosive drops, and BLACKPINK power',
  code: `// TEDDY PARK - Kill This Love (BLACKPINK)
// Transforms tracks + adds EDM-pop flavor
dj.bpm = 132;

const chords = [
  ['Bb3', 'D4', 'F4'],  // Bb
  ['G3', 'Bb3', 'D4'],  // Gm
  ['Eb3', 'G3', 'Bb3'], // Eb
  ['F3', 'A3', 'C4']    // F
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 2;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 4;
  dj.deck.A.filter.cutoff = 20000;
  
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.3;
  }
  
  // Build-up filter sweep
  if (bar >= 2 && bar < 4) {
    dj.deck.A.filter.cutoff = 500 + ((bar - 2) * 10000);
  }
  
  // === LAYERED INSTRUMENTS ===
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
      dj.sidechain('8n');
    }
    
    // Synth lead
    if (tick % 4 === 0) {
      dj.synth.triggerAttackRelease('Bb4', '8n', time);
    }
    
    // 808 bass
    if ([0, 8].includes(beat)) {
      dj.bass808.triggerAttackRelease('Bb1', '4n', time);
    }
    
    // Hi-hats
    if (tick % 2 === 1) {
      dj.hihat.triggerAttackRelease('C1', '32n', time);
    }
  }
  
  tick++;
});`
};
