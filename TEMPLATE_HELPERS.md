// Helper function to setup decks with BPM and effects for templates
// Add this to the beginning of any template to transform loaded tracks

export function setupDecks(bpm: number, effects?: {
  reverb?: number;
  delay?: number;
  chorus?: number;
  filter?: boolean;
}) {
  // Setup Deck A
  if (dj.deck.A.duration > 0) {
    dj.deck.A.bpm = bpm;
    
    if (effects?.reverb) {
      dj.deck.A.effects.add('reverb', 'reverb');
      const fx = dj.deck.A.effects.get('reverb');
      if (fx) fx.wet = effects.reverb;
    }
    
    if (effects?.delay) {
      dj.deck.A.effects.add('delay', 'delay');
      const fx = dj.deck.A.effects.get('delay');
      if (fx) fx.wet = effects.delay;
    }
    
    if (effects?.chorus) {
      dj.deck.A.effects.add('chorus', 'chorus');
      const fx = dj.deck.A.effects.get('chorus');
      if (fx) fx.wet = effects.chorus;
    }
  }
  
  // Setup Deck B
  if (dj.deck.B.duration > 0) {
    dj.deck.B.bpm = bpm;
    
    if (effects?.reverb) {
      dj.deck.B.effects.add('reverb', 'reverb');
      const fx = dj.deck.B.effects.get('reverb');
      if (fx) fx.wet = effects.reverb;
    }
    
    if (effects?.delay) {
      dj.deck.B.effects.add('delay', 'delay');
      const fx = dj.deck.B.effects.get('delay');
      if (fx) fx.wet = effects.delay;
    }
    
    if (effects?.chorus) {
      dj.deck.B.effects.add('chorus', 'chorus');
      const fx = dj.deck.B.effects.get('chorus');
      if (fx) fx.wet = effects.chorus;
    }
  }
}

// Usage examples:
// setupDecks(128, { reverb: 0.3, delay: 0.2 }); // EDM style
// setupDecks(90, { reverb: 0.4, chorus: 0.3 }); // Emotional style
// setupDecks(140, { reverb: 0.3 }); // Koplo style
