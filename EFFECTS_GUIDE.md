# 🎵 Template & Effects Guide

## 📚 Accessing All Templates

### In the UI
Click **"Browse All"** in the template selector at the bottom of the code editor to see all 26+ templates grouped by artist.

### Programmatically

```typescript
import { TEMPLATES, getTemplatesByPersona } from '@/data/templates';

// Get all templates
console.log(TEMPLATES); // Array of 26+ templates

// Get templates by artist
const alanWalkerTemplates = getTemplatesByPersona('Alan Walker');
const skrillexTemplates = getTemplatesByPersona('Skrillex');
```

## 🎛️ Effect-Heavy Remix Templates

### New Templates with Advanced Effects

1. **Avicii - Levels Remix** 
   - Effects: Reverb, Delay, Filter automation
   - BPM: 126
   - Style: Progressive house with heavy effects

2. **Skrillex - Dubstep Remix**
   - Effects: Filter wobble, Distortion, Bitcrusher
   - BPM: 140
   - Style: Heavy dubstep with wobble bass

3. **Daft Punk - Filter House**
   - Effects: Classic filter sweeps, Phaser
   - BPM: 123
   - Style: French house with iconic filter

4. **Porter Robinson - Emotional Remix**
   - Effects: Heavy reverb, Chorus, Delay
   - BPM: 128
   - Style: Dreamy future bass atmosphere

5. **Flume - Experimental Remix**
   - Effects: Autofilter, Bitcrusher, Delay
   - BPM: 140
   - Style: Glitchy experimental future bass

6. **Martin Garrix - Big Room Remix**
   - Effects: Massive reverb, Filter builds
   - BPM: 128
   - Style: Festival big room house

## 🎨 Effect Types Reference

### Available Effects

```typescript
// Add effects to any deck
dj.deck.A.effects.add('name', 'type');

// Effect types:
'reverb'      // Space and depth
'delay'       // Echo/repeat
'filter'      // Resonant filter
'distortion'  // Overdrive/saturation
'phaser'      // Sweeping phase effect
'chorus'      // Stereo width/thickness
'bitcrusher'  // Lo-fi/digital distortion
'autofilter'  // Rhythmic filter modulation
```

### Control Effects

```typescript
// Get effect and control wet/dry
const fx = dj.deck.A.effects.get('reverb');
fx.wet = 0.5;      // 0.0 = dry, 1.0 = fully wet
fx.bypass = true;  // Mute effect

// Remove effect
dj.deck.A.effects.remove('reverb');

// Clear all effects
dj.deck.A.effects.clear();
```

### Color FX (One-Knob Effect)

```typescript
// Simple one-knob creative effect
dj.deck.A.colorFX.value = 0.7; // 0.0 to 1.0

// Animate Color FX
dj.loop('16n', (time) => {
  dj.deck.A.colorFX.value = Math.sin(time) * 0.5 + 0.5;
});
```

## 🎯 Complete Effect Examples

### Example 1: Build-Up with Filter Sweep

```typescript
dj.bpm = 128;
dj.deck.A.effects.add('filter', 'filter');
dj.deck.A.effects.add('reverb', 'reverb');

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Build-up (bars 6-8)
  if (bar >= 6 && bar < 8) {
    const progress = (tick % 32) / 32;
    
    // Close filter
    dj.deck.A.filter.lowpass = 20000 - (progress * 19000);
    
    // Increase reverb
    const reverbFx = dj.deck.A.effects.get('reverb');
    if (reverbFx) reverbFx.wet = progress * 0.9;
  }
  
  // Drop (bar 8)
  if (bar === 8 && tick % 16 === 0) {
    dj.deck.A.filter.lowpass = 20000;
    const reverbFx = dj.deck.A.effects.get('reverb');
    if (reverbFx) reverbFx.wet = 0.2;
  }
  
  tick++;
});
```

### Example 2: Dubstep Wobble Bass

```typescript
dj.bpm = 140;
dj.deck.A.effects.add('filter', 'filter');

let tick = 0;

dj.loop('16n', (time) => {
  // Wobble speed (8th notes)
  const wobblePhase = (tick % 8) / 8;
  
  // Wobble filter between 200Hz and 2000Hz
  dj.deck.A.filter.lowpass = 200 + (Math.sin(wobblePhase * Math.PI * 2) * 900 + 900);
  
  const filterFx = dj.deck.A.effects.get('filter');
  if (filterFx) filterFx.wet = 0.8;
  
  tick++;
});
```

### Example 3: Delay Echo Throw

```typescript
dj.deck.A.effects.add('delay', 'delay');

let tick = 0;

dj.loop('16n', (time) => {
  // Delay throw every 4 bars
  if (tick % 64 === 56) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0.9;
  }
  
  // Clear delay
  if (tick % 64 === 0) {
    const delayFx = dj.deck.A.effects.get('delay');
    if (delayFx) delayFx.wet = 0;
  }
  
  tick++;
});
```

### Example 4: Atmospheric Pad with Multiple Effects

```typescript
dj.deck.A.effects.add('reverb', 'reverb');
dj.deck.A.effects.add('chorus', 'chorus');
dj.deck.A.effects.add('delay', 'delay');

// Set all effects for dreamy atmosphere
const reverbFx = dj.deck.A.effects.get('reverb');
if (reverbFx) reverbFx.wet = 0.6;

const chorusFx = dj.deck.A.effects.get('chorus');
if (chorusFx) chorusFx.wet = 0.4;

const delayFx = dj.deck.A.effects.get('delay');
if (delayFx) delayFx.wet = 0.3;

// Also use Color FX
dj.deck.A.colorFX.value = 0.3;
```

## 🎼 All Available Templates

### Original Artist Templates (20)
- Alan Walker (2): Faded, Alone
- Marshmello (2): Alone, Happier
- Deadmau5 (2): Strobe, Ghosts n Stuff
- Diplo (2): Lean On, Where Are Ü Now
- Sawano Hiroyuki (2): Attack on Titan, Aldnoah.Zero
- The Weeknd (2): Blinding Lights, Starboy
- Teddy Park (2): DDU-DU DDU-DU, Kill This Love
- Pitbull (2): Timber, International Love
- Far East Movement (2): Like a G6, Rocketeer
- Black Eyed Peas (2): Boom Boom Pow, I Gotta Feeling

### Effect-Heavy Remixes (6)
- Avicii: Levels Remix
- Skrillex: Dubstep Remix
- Daft Punk: Filter House
- Porter Robinson: Emotional Remix
- Flume: Experimental Remix
- Martin Garrix: Big Room Remix

**Total: 26+ professional templates!**

## 💡 Pro Tips

1. **Combine Templates**: Load one template, then add effects from another
2. **Layer Decks**: Use different templates on Deck A and B
3. **Automate Effects**: Use `dj.loop()` to animate effect parameters
4. **Study the Code**: Each template has comments explaining techniques
5. **Customize**: Modify BPM, chords, and effects to make it your own

## 🚀 Quick Start

```typescript
// 1. Load a track into Deck A
// 2. Click "Browse All" in template selector
// 3. Choose "Avicii - Levels Remix"
// 4. Press Shift+Enter to run
// 5. Hear your track with professional effects!
```

---

**All templates are production-ready and demonstrate real-world DJ/producer techniques!** 🎛️✨
