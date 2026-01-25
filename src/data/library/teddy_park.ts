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
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Trap kick pattern
  if ([0, 6, 12].includes(beat)) {
    dj.sample('drums/kick-13', time);
    dj.sidechain('8n');
  }
  
  // Snare on 2 and 4
  if (beat === 8) {
    dj.sample('drums/snare-8', time);
  }
  
  // Middle Eastern melody
  if (bar >= 4 && tick % 2 === 0) {
    dj.sample('synth/lead-9', time);
  }
  
  // Powerful 808 bass
  if ([0, 8].includes(beat)) {
    dj.sample('bass/808-2', time);
  }
  
  // Hi-hat rolls (signature)
  if (beat >= 14) {
    dj.sample('drums/hihat-13', time);
  }
  
  // Brass stabs
  if ([4, 12].includes(beat)) {
    dj.sample('synth/brass-2', time);
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
  
  // === LAYERED INSTRUMENTS (R2 SAMPLES) ===
  // Build-up (bars 0-4)
  if (bar < 4) {
    if (beat === 0) {
      dj.sample('synth/pad-7', time);
    }
    
    // Rising tension
    if (bar === 3) {
      dj.sample('drums/snare-9', time);
    }
  }
  
  // Drop (bars 4+)
  if (bar >= 4) {
    // Powerful kick
    if ([0, 4, 8, 12].includes(beat)) {
      dj.sample('drums/kick-14', time);
      dj.sidechain('8n');
    }
    
    // Synth lead
    if (tick % 4 === 0) {
      dj.sample('synth/lead-10', time);
    }
    
    // 808 bass
    if ([0, 8].includes(beat)) {
      dj.sample('bass/808-3', time);
    }
    
    // Hi-hats
    if (tick % 2 === 1) {
      dj.sample('drums/hihat-14', time);
    }
  }
  
  tick++;
});`
};
