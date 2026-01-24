import { Template } from '../templates';

export const alan_walker_faded: Template = {
  id: 'alan_walker_faded',
  name: 'Faded Style',
  persona: 'Alan Walker',
  description: 'Melodic future bass with signature pluck lead and emotional chord progression',
  code: `// ALAN WALKER - Faded Style
// Signature: Pluck lead, emotional chords, clean production
dj.bpm = 90;

const chords = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

const melody = ['C#5', 'B4', 'A4', 'F#4', 'E4', 'F#4', 'A4', 'B4'];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Kick pattern (4-on-floor on drop)
  if (bar >= 8 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Signature pluck melody
  if (tick % 2 === 0) {
    const note = melody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Hi-hat pattern
  if (bar >= 8 && tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Build-up filter sweep (bars 6-8)
  if (bar >= 6 && bar < 8) {
    const progress = (bar - 6) / 2;
    dj.effects.filter.frequency.value = 20000 - (progress * 18000);
  } else {
    dj.effects.filter.frequency.value = 20000;
  }
  
  tick++;
});`
};

export const alan_walker_alone: Template = {
  id: 'alan_walker_alone',
  name: 'Alone Style',
  persona: 'Alan Walker',
  description: 'Uplifting progressive house with vocal chops and signature sound',
  code: `// ALAN WALKER - Alone Style
dj.bpm = 120;

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Drop section (bars 8+)
  if (bar >= 8) {
    // Kick on every beat
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    
    // Signature bass wobble
    if (tick % 8 === 0) {
      dj.bass.triggerAttackRelease('F#1', '4n', time);
    }
    
    // Vocal chops
    if ([0, 6, 12].includes(beat)) {
      dj.sampler.trigger('vocal_chop', time);
    }
  }
  
  // Build-up (bars 6-8)
  if (bar >= 6 && bar < 8) {
    if (tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '16n', time);
    }
  }
  
  tick++;
});`
};
