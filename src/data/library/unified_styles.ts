import { Template } from '../templates';

export const unified_style_demo: Template = {
  id: 'unified_style_demo',
  name: 'Unified Style Demo',
  persona: 'System',
  description: 'All loaded tracks transform together - one unified sound across all decks',
  code: `// UNIFIED STYLE - All Decks Transform Together
// Load tracks on A, B, C, D then run this
// Every deck will sync to the same style/flavor

dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // === UNIFIED STYLE CONTROL ===
  // Changes to deck A automatically apply to ALL active decks
  
  // Progressive filter sweep (8-bar cycle)
  const filterValue = 500 + (bar % 8) * 2000;
  dj.deck.A.filter.cutoff = filterValue;
  
  // EQ modulation (half-bar cycle)
  const bassBoost = beat < 8 ? 6 : 0;
  const highCut = beat >= 8 ? -12 : 0;
  dj.deck.A.eq.low = bassBoost;
  dj.deck.A.eq.high = highCut;
  
  // Rhythmic colorFX
  if (beat % 4 === 0) {
    dj.deck.A.colorFX.value = 0.7;
  } else if (beat % 4 === 2) {
    dj.deck.A.colorFX.value = 0;
  }
  
  // === LAYERED INSTRUMENTS ===
  // Add programmatic elements on top
  
  // Kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat groove
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Melodic layer every 4 bars
  if (bar % 4 === 0 && beat === 0) {
    const notes = ['C4', 'E4', 'G4', 'B4'];
    dj.synth.triggerAttackRelease(notes, '2n', time);
  }
  
  tick++;
});

// Result: All tracks on A, B, C, D will:
// - Match 128 BPM
// - Follow filter sweep
// - Apply same EQ changes
// - Use same colorFX timing
// - Blend with instruments
// = ONE UNIFIED SOUND`
};

export const progressive_house_unified: Template = {
  id: 'progressive_house_unified',
  name: 'Progressive House (Unified)',
  persona: 'System',
  description: 'Avicii-style progressive house that transforms all loaded tracks',
  code: `// PROGRESSIVE HOUSE - Unified Style
// All loaded tracks become progressive house

dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Build-up section (bars 0-7)
  if (bar < 8) {
    // Gradual filter opening
    dj.deck.A.filter.cutoff = 500 + (bar * 2500);
    dj.deck.A.eq.high = -12 + (bar * 1.5);
    
    // Snare roll
    if (bar >= 6 && tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '16n', time);
    }
  }
  
  // Drop section (bars 8+)
  if (bar >= 8) {
    // Full frequency range
    dj.deck.A.filter.cutoff = 20000;
    dj.deck.A.eq.high = 0;
    dj.deck.A.eq.low = 3;
    
    // 4-on-floor kick
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    
    // Progressive bassline
    if (tick % 8 === 0) {
      const bassNotes = ['C2', 'D2', 'E2', 'G2'];
      dj.bass.triggerAttackRelease(bassNotes[bar % 4], '4n', time);
    }
    
    // Uplifting lead
    if (beat === 0) {
      const melody = ['C5', 'E5', 'G5', 'A5'];
      dj.lead.triggerAttackRelease(melody[bar % 4], '2n', time);
    }
  }
  
  tick++;
});`
};

export const trap_unified: Template = {
  id: 'trap_unified',
  name: 'Trap (Unified)',
  persona: 'System',
  description: 'Modern trap style that transforms all loaded tracks',
  code: `// TRAP - Unified Style
// All loaded tracks become trap bangers

dj.bpm = 140;
let tick = 0;

dj.loop('32n', (time) => {
  const bar = Math.floor(tick / 32);
  const step = tick % 32;
  
  // Heavy bass EQ
  dj.deck.A.eq.low = 6;
  dj.deck.A.eq.mid = -3;
  
  // Trap hi-hat rolls
  if (step % 2 === 0) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  // Kick pattern
  if ([0, 8, 16, 22].includes(step)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if ([8, 24].includes(step)) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // 808 bass slides
  if (step === 0) {
    dj.bass808.triggerAttackRelease('C1', '2n', time);
  }
  
  // Filter automation
  if (bar % 4 >= 2) {
    dj.deck.A.filter.cutoff = 1000 + (step * 100);
  }
  
  tick++;
});`
};
