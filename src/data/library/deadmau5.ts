import { Template } from '../templates';

export const deadmau5_strobe: Template = {
  id: 'deadmau5_strobe',
  name: 'Strobe',
  persona: 'Deadmau5',
  description: 'Progressive house masterpiece - adds 10-minute build, arps, and emotional depth',
  code: `// DEADMAU5 - Strobe
// Transforms tracks + adds progressive build flavor
dj.bpm = 128;

const progression = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

const arpNotes = ['F#4', 'A4', 'C#5', 'E5', 'C#5', 'A4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  const section = Math.floor(bar / 16);
  
  // === UNIFIED STYLE + FLAVOR ===
  // Gradual filter opening (long build)
  const filterFreq = 200 + (bar * 100);
  dj.deck.A.filter.cutoff = Math.min(filterFreq, 20000);
  dj.deck.A.eq.high = Math.min(-12 + (bar * 0.5), 0);
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 0;
  
  // Deep reverb
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('reverb', 'reverb');
    const rev = dj.deck.A.effects.get('reverb');
    if (rev) rev.wet = 0.5;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Minimal kick (only after long build)
  if (section >= 2 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = progression[bar % 4];
    dj.pad.triggerAttackRelease(chord, '2m', time);
  }
  
  // Signature arp (builds slowly)
  if (section >= 1 && tick % 2 === 0) {
    const note = arpNotes[(tick / 2) % 6];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  // Bass enters late
  if (section >= 2 && tick % 8 === 0) {
    const bassNotes = ['F#1', 'D1', 'A1', 'E1'];
    dj.bass.triggerAttackRelease(bassNotes[bar % 4], '4n', time);
  }
  
  // Minimal hi-hats
  if (section >= 2 && tick % 4 === 2) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`
};

export const deadmau5_ghosts: Template = {
  id: 'deadmau5_ghosts',
  name: 'Ghosts n Stuff',
  persona: 'Deadmau5',
  description: 'Electro house - adds aggressive synths, driving bass, and raw energy',
  code: `// DEADMAU5 - Ghosts n Stuff
// Transforms tracks + adds aggressive electro flavor
dj.bpm = 128;

const bassline = ['C2', 'C2', 'Bb1', 'Bb1', 'Ab1', 'Ab1', 'G1', 'F1'];
const synthStabs = ['C4', 'Eb4', 'G4', 'Bb4'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE + FLAVOR ===
  dj.deck.A.eq.high = 0;
  dj.deck.A.eq.mid = 0;
  dj.deck.A.eq.low = 4;
  dj.deck.A.filter.cutoff = 20000;
  
  // Add distortion for aggression
  if (bar === 0 && beat === 0) {
    dj.deck.A.effects.add('distortion', 'distortion');
    const dist = dj.deck.A.effects.get('distortion');
    if (dist) dist.wet = 0.15;
  }
  
  // === LAYERED INSTRUMENTS ===
  // 4-on-floor kick
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
    dj.sidechain('8n');
  }
  
  // Aggressive bassline
  if (tick % 2 === 0) {
    const note = bassline[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '8n', time);
  }
  
  // Synth stabs (signature)
  if ([0, 8].includes(beat)) {
    const chord = [synthStabs[0], synthStabs[1], synthStabs[2]];
    dj.synth.triggerAttackRelease(chord, '16n', time);
  }
  
  // Lead melody
  if (bar >= 8 && tick % 4 === 0) {
    const leadNotes = ['C5', 'Eb5', 'G5', 'Bb5'];
    dj.lead.triggerAttackRelease(leadNotes[(tick / 4) % 4], '16n', time);
  }
  
  // Hi-hat pattern
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Clap on 2 and 4
  if ([8, 24].includes(beat)) {
    dj.clap.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`
};
