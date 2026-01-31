// Alan Walker - Faded (Accurate Recreation from Hooktheory)
// Key: D# minor | BPM: 90
// Chords: i - VI - III - VII (D#m - B - F# - C#)

import type { DJTemplate } from '../types';

/**
 * FADED - Exact data from Hooktheory
 * Scale: D# minor (1=D#, 2=E#, 3=F#, 4=G#, 5=A#, 6=B, 7=C#)
 * All sections use same chord progression: 1-6-3-7
 * 
 * DRUM PATTERNS (from production analysis):
 * - Intro: No drums, just piano + pad
 * - Verse: Minimal - soft kick on 1&3, light clap on 2&4
 * - Pre-chorus: Building 4-on-floor, snare roll at end
 * - Chorus/Drop: Full 4-on-floor kick, layered clap+snare on 2&4, straight 8th hats
 * - Supersaw is sidechained to kick (quieter on downbeats)
 */

export function generateFadedCode(): string {
  return `// Alan Walker - Faded (Accurate Recreation)
// D# minor | 90 BPM | Chords: D#m - B - F# - C#
// PRODUCTION NOTES:
// - Intro: Piano arpeggio ONLY, no drums, heavy reverb
// - Verse: Almost no drums, just atmosphere + vocal melody
// - Pre-chorus: Kick starts building, snare roll at end
// - Drop: 4-on-floor, clap+snare on 2&4, 8th hats, PUMPING supersaw

dj.bpm = 90;
dj.effects.reverb.set({ wet: 0.6, decay: 5.0 });
dj.effects.delay.set({ wet: 0.3, feedback: 0.35, delayTime: '8n' });

// === VOLUME MIXER (adjust these to taste!) ===
dj.volume.master = 0.5;       // Master volume (0-1)
dj.volume.fadedPiano = 4;     // Piano (dB)
dj.volume.fadedPluck = 0;     // Pluck synth (dB)
dj.volume.supersaw = 10;      // Supersaw for drops (dB)
dj.volume.pad = 4;            // Atmospheric pad (dB)
dj.volume.sub = 6;            // Sub bass (dB)

// D# minor scale: 1=D#, 2=E#, 3=F#, 4=G#, 5=A#, 6=B, 7=C#
const S = (sd, oct = 0) => {
  const notes = { 1: 'D#', 2: 'E#', 3: 'F#', 4: 'G#', 5: 'A#', 6: 'B', 7: 'C#' };
  return notes[sd] + (4 + oct);
};

// Chords: i-VI-III-VII (D#m-B-F#-C#)
const chords = [
  ['D#3', 'F#3', 'A#3'],  // D#m (i)
  ['B2', 'D#3', 'F#3'],   // B (VI)  
  ['F#3', 'A#3', 'C#4'],  // F# (III)
  ['C#3', 'E#3', 'G#3'],  // C# (VII)
];
const bassNotes = ['D#2', 'B1', 'F#2', 'C#2'];

// INTRO melody (THE ICONIC PIANO ARPEGGIO - 16 beats = 4 bars)
// This is the instantly recognizable opening of Faded
// Pattern: Alternating high-low notes creating the signature "da-da da-da" feel
// Key: D# minor - uses scale degrees 1,3,5,6,7
const introMelody = [
  // Bar 1 (D#m): F#4-A#3, F#4-A#3, F#4-A#3, A#4-A#3
  { sd: 3, oct: 0, beat: 1 },     // F#4
  { sd: 5, oct: -1, beat: 1.5 },  // A#3
  { sd: 3, oct: 0, beat: 2 },     // F#4
  { sd: 5, oct: -1, beat: 2.5 },  // A#3
  { sd: 3, oct: 0, beat: 3 },     // F#4
  { sd: 5, oct: -1, beat: 3.5 },  // A#3
  { sd: 5, oct: 0, beat: 4 },     // A#4 (higher!)
  { sd: 5, oct: -1, beat: 4.5 },  // A#3
  
  // Bar 2 (B): D#5-F#4, D#5-F#4, D#5-F#4, C#5-F#4
  { sd: 1, oct: 1, beat: 5 },     // D#5
  { sd: 3, oct: 0, beat: 5.5 },   // F#4
  { sd: 1, oct: 1, beat: 6 },     // D#5
  { sd: 3, oct: 0, beat: 6.5 },   // F#4
  { sd: 1, oct: 1, beat: 7 },     // D#5
  { sd: 3, oct: 0, beat: 7.5 },   // F#4
  { sd: 7, oct: 0, beat: 8 },     // C#5
  { sd: 3, oct: 0, beat: 8.5 },   // F#4
  
  // Bar 3 (F#): A#4-C#4, A#4-C#4, A#4-C#4, A#4-C#4
  { sd: 5, oct: 0, beat: 9 },     // A#4
  { sd: 7, oct: -1, beat: 9.5 },  // C#4
  { sd: 5, oct: 0, beat: 10 },    // A#4
  { sd: 7, oct: -1, beat: 10.5 }, // C#4
  { sd: 5, oct: 0, beat: 11 },    // A#4
  { sd: 7, oct: -1, beat: 11.5 }, // C#4
  { sd: 5, oct: 0, beat: 12 },    // A#4
  { sd: 7, oct: -1, beat: 12.5 }, // C#4
  
  // Bar 4 (C#): E#4-G#3, E#4-G#3, E#4-G#3, D#4
  { sd: 2, oct: 0, beat: 13 },    // E#4
  { sd: 4, oct: -1, beat: 13.5 }, // G#3
  { sd: 2, oct: 0, beat: 14 },    // E#4
  { sd: 4, oct: -1, beat: 14.5 }, // G#3
  { sd: 2, oct: 0, beat: 15 },    // E#4
  { sd: 4, oct: -1, beat: 15.5 }, // G#3
  { sd: 1, oct: 0, beat: 16 },    // D#4 (resolve to root)
];

// VERSE melody (exact from Hooktheory - 32 beats = 8 bars)
// "You were the shadow to my light" / "Did you feel us"
const verseMelody = [
  // Bar 1-2 (D#m): "You were the shadow to my light"
  { sd: 3, oct: 0, beat: 1.5 }, { sd: 3, oct: 0, beat: 2 },
  { sd: 1, oct: 0, beat: 2.5 }, { sd: 3, oct: 0, beat: 3 },
  { sd: 1, oct: 0, beat: 3.5 }, { sd: 3, oct: 0, beat: 4 },
  { sd: 4, oct: 0, beat: 4.5 }, { sd: 5, oct: 0, beat: 5 },
  { sd: 3, oct: 0, beat: 6 }, { sd: 3, oct: 0, beat: 6.5 },
  { sd: 7, oct: -1, beat: 7 }, { sd: 5, oct: 0, beat: 7.5 },
  // Bar 3-4 (F#-C#): "Another star you fade away"
  { sd: 3, oct: 0, beat: 11.5 }, { sd: 3, oct: 0, beat: 12 },
  { sd: 3, oct: 0, beat: 12.5 }, { sd: 2, oct: 0, beat: 13 },
  { sd: 3, oct: 0, beat: 14.5 }, { sd: 1, oct: 0, beat: 15 },
  { sd: 1, oct: 0, beat: 15.5 }, { sd: 3, oct: 0, beat: 16 },
  // Bar 5-6 (D#m-B): repeat "Did you feel us"
  { sd: 3, oct: 0, beat: 17.5 }, { sd: 3, oct: 0, beat: 18 },
  { sd: 1, oct: 0, beat: 18.5 }, { sd: 3, oct: 0, beat: 19 },
  { sd: 1, oct: 0, beat: 19.5 }, { sd: 3, oct: 0, beat: 20 },
  { sd: 4, oct: 0, beat: 20.5 }, { sd: 5, oct: 0, beat: 21 },
  { sd: 3, oct: 0, beat: 22 }, { sd: 3, oct: 0, beat: 22.5 },
  { sd: 7, oct: 0, beat: 23 }, { sd: 5, oct: 0, beat: 23.5 },
  // Bar 7-8 (F#-C#): ending phrase
  { sd: 3, oct: 0, beat: 27.5 }, { sd: 3, oct: 0, beat: 28 },
  { sd: 4, oct: 0, beat: 28.5 },
];

// PRE-CHORUS melody (exact from Hooktheory)
// "Where are you now?" repeated with building intensity
const preChorusMelody = [
  // "Where are you now?" (first time)
  { sd: 5, oct: 0, beat: 3.5 }, { sd: 5, oct: 0, beat: 4 },
  { sd: 5, oct: 0, beat: 4.5 }, { sd: 5, oct: 0, beat: 5 },
  // "Where are you now?" (second time)
  { sd: 5, oct: 0, beat: 11.5 }, { sd: 5, oct: 0, beat: 12 },
  { sd: 5, oct: 0, beat: 12.5 }, { sd: 5, oct: 0, beat: 13 },
  // "Where are you now?" (third time)
  { sd: 5, oct: 0, beat: 19.5 }, { sd: 5, oct: 0, beat: 20 },
  { sd: 5, oct: 0, beat: 20.5 }, { sd: 5, oct: 0, beat: 21 },
  // "Was it all in my fantasy?"
  { sd: 3, oct: 0, beat: 23.5 }, { sd: 4, oct: 0, beat: 23.75 },
  { sd: 4, oct: 0, beat: 24 }, { sd: 4, oct: 0, beat: 24.5 },
  { sd: 5, oct: 0, beat: 24.75 }, { sd: 4, oct: 0, beat: 25 },
  { sd: 3, oct: 0, beat: 25.5 }, { sd: 3, oct: 0, beat: 26 },
  // "Where are you now?" (fourth time)
  { sd: 5, oct: 0, beat: 27.5 }, { sd: 5, oct: 0, beat: 28 },
  { sd: 5, oct: 0, beat: 28.5 }, { sd: 5, oct: 0, beat: 29 },
  // "Were you only imaginary?"
  { sd: 3, oct: 0, beat: 31.5 }, { sd: 3, oct: 0, beat: 31.75 },
  { sd: 3, oct: 0, beat: 32 }, { sd: 3, oct: 0, beat: 32.5 },
  { sd: 4, oct: 0, beat: 32.75 }, { sd: 2, oct: 0, beat: 33 },
  { sd: 2, oct: 0, beat: 33.5 }, { sd: 2, oct: 0, beat: 34 },
  { sd: 3, oct: 0, beat: 34.5 },
];

// CHORUS melody (exact from Hooktheory - 68 beats = 17 bars)
// "Where are you now? Atlantis, under the sea..."
const chorusMelody = [
  // "Where are you now?"
  { sd: 5, oct: 0, beat: 3.5 }, { sd: 5, oct: 0, beat: 4 },
  { sd: 5, oct: 0, beat: 4.5 }, { sd: 5, oct: 0, beat: 5 },
  // "Atlantis, under the sea"
  { sd: 3, oct: 0, beat: 8.5 }, { sd: 1, oct: 0, beat: 9 },
  { sd: 7, oct: -1, beat: 9.5 },
  { sd: 3, oct: 0, beat: 11.5 }, { sd: 7, oct: 0, beat: 12 },
  { sd: 7, oct: 0, beat: 12.5 }, { sd: 5, oct: 0, beat: 12.75 },
  // "Under the sea"
  { sd: 3, oct: 0, beat: 15.5 }, { sd: 7, oct: 0, beat: 16 },
  { sd: 7, oct: 0, beat: 16.5 }, { sd: 5, oct: 0, beat: 16.75 },
  // "She's the monster running wild inside of me"
  { sd: 4, oct: 0, beat: 18.5 }, { sd: 5, oct: 0, beat: 19.5 },
  { sd: 5, oct: 0, beat: 20 }, { sd: 5, oct: 0, beat: 20.5 },
  { sd: 5, oct: 0, beat: 21 },
  { sd: 3, oct: 0, beat: 23.5 }, { sd: 1, oct: 0, beat: 24 },
  { sd: 1, oct: 0, beat: 24.5 }, { sd: 6, oct: 0, beat: 24.75 },
  // "I'm faded" (first)
  { sd: 7, oct: 0, beat: 28.5 }, { sd: 5, oct: 0, beat: 29 },
  { sd: 7, oct: 0, beat: 29.5 }, { sd: 5, oct: 0, beat: 30 },
  { sd: 7, oct: 0, beat: 30.5 }, { sd: 5, oct: 0, beat: 31 },
  { sd: 7, oct: 0, beat: 31.5 }, { sd: 4, oct: 0, beat: 32 },
  { sd: 4, oct: 0, beat: 32.5 }, { sd: 6, oct: 0, beat: 32.75 },
  // "So lost, I'm faded"
  { sd: 1, oct: 0, beat: 34.5 }, { sd: 6, oct: 0, beat: 35 },
  { sd: 5, oct: 0, beat: 36 },
  // "I'm faded" (second)
  { sd: 1, oct: 0, beat: 42.5 }, { sd: 6, oct: 0, beat: 43 },
  { sd: 5, oct: 0, beat: 44 },
  // "So lost, I'm faded"
  { sd: 3, oct: 0, beat: 48.5 }, { sd: 2, oct: 0, beat: 49 },
  { sd: 7, oct: -1, beat: 50.5 }, { sd: 6, oct: 0, beat: 51 },
  { sd: 5, oct: 0, beat: 52 },
  // "I'm faded" (third)
  { sd: 1, oct: 0, beat: 58.5 }, { sd: 6, oct: 0, beat: 59 },
  { sd: 7, oct: 0, beat: 60 },
  // "So lost, I'm faded" (final)
  { sd: 3, oct: 0, beat: 64.5 }, { sd: 2, oct: 0, beat: 65 },
  { sd: 7, oct: -1, beat: 66.5 }, { sd: 6, oct: 0, beat: 67 },
  { sd: 5, oct: 0, beat: 68 },
];

// INSTRUMENTAL melody (THE ICONIC SYNTH LEAD - 64 beats = 16 bars)
// This is the recognizable "da-da-da-DA-da" synth hook during the drop
// Key: D# minor - follows the chord tones with characteristic jumps
// Pattern: Repeating 8-bar phrase with the signature ascending motif
const instrumentalMelody = [
  // === PHRASE 1 (Bars 1-4): The iconic ascending hook ===
  // Bar 1 (D#m): F#4 - A#4 - D#5 (ascending arpeggio)
  { sd: 3, oct: 0, beat: 1 },     // F#4
  { sd: 3, oct: 0, beat: 1.5 },   // F#4
  { sd: 5, oct: 0, beat: 2 },     // A#4
  { sd: 5, oct: 0, beat: 2.5 },   // A#4
  { sd: 1, oct: 1, beat: 3 },     // D#5 (THE HIGH NOTE!)
  { sd: 1, oct: 1, beat: 3.5 },   // D#5
  { sd: 5, oct: 0, beat: 4 },     // A#4 (drop back down)
  { sd: 3, oct: 0, beat: 4.5 },   // F#4
  
  // Bar 2 (B): D#4 - F#4 - B4
  { sd: 1, oct: 0, beat: 5 },     // D#4
  { sd: 1, oct: 0, beat: 5.5 },   // D#4
  { sd: 3, oct: 0, beat: 6 },     // F#4
  { sd: 3, oct: 0, beat: 6.5 },   // F#4
  { sd: 6, oct: 0, beat: 7 },     // B4
  { sd: 6, oct: 0, beat: 7.5 },   // B4
  { sd: 3, oct: 0, beat: 8 },     // F#4
  { sd: 1, oct: 0, beat: 8.5 },   // D#4
  
  // Bar 3 (F#): A#4 - C#5 - F#5
  { sd: 5, oct: 0, beat: 9 },     // A#4
  { sd: 5, oct: 0, beat: 9.5 },   // A#4
  { sd: 7, oct: 0, beat: 10 },    // C#5
  { sd: 7, oct: 0, beat: 10.5 },  // C#5
  { sd: 3, oct: 1, beat: 11 },    // F#5 (HIGH!)
  { sd: 3, oct: 1, beat: 11.5 },  // F#5
  { sd: 7, oct: 0, beat: 12 },    // C#5
  { sd: 5, oct: 0, beat: 12.5 },  // A#4
  
  // Bar 4 (C#): G#4 - B4 - C#5 (resolution)
  { sd: 4, oct: 0, beat: 13 },    // G#4
  { sd: 4, oct: 0, beat: 13.5 },  // G#4
  { sd: 6, oct: 0, beat: 14 },    // B4
  { sd: 6, oct: 0, beat: 14.5 },  // B4
  { sd: 7, oct: 0, beat: 15 },    // C#5
  { sd: 7, oct: 0, beat: 15.5 },  // C#5
  { sd: 5, oct: 0, beat: 16 },    // A#4
  { sd: 3, oct: 0, beat: 16.5 },  // F#4
  
  // === PHRASE 2 (Bars 5-8): Repeat with slight variation ===
  // Bar 5 (D#m): Same ascending pattern
  { sd: 3, oct: 0, beat: 17 },    // F#4
  { sd: 3, oct: 0, beat: 17.5 },  // F#4
  { sd: 5, oct: 0, beat: 18 },    // A#4
  { sd: 5, oct: 0, beat: 18.5 },  // A#4
  { sd: 1, oct: 1, beat: 19 },    // D#5
  { sd: 1, oct: 1, beat: 19.5 },  // D#5
  { sd: 5, oct: 0, beat: 20 },    // A#4
  { sd: 3, oct: 0, beat: 20.5 },  // F#4
  
  // Bar 6 (B): Variation
  { sd: 1, oct: 0, beat: 21 },    // D#4
  { sd: 3, oct: 0, beat: 21.5 },  // F#4
  { sd: 6, oct: 0, beat: 22 },    // B4
  { sd: 6, oct: 0, beat: 22.5 },  // B4
  { sd: 1, oct: 1, beat: 23 },    // D#5
  { sd: 6, oct: 0, beat: 23.5 },  // B4
  { sd: 3, oct: 0, beat: 24 },    // F#4
  { sd: 1, oct: 0, beat: 24.5 },  // D#4
  
  // Bar 7 (F#): Higher energy
  { sd: 5, oct: 0, beat: 25 },    // A#4
  { sd: 7, oct: 0, beat: 25.5 },  // C#5
  { sd: 3, oct: 1, beat: 26 },    // F#5
  { sd: 3, oct: 1, beat: 26.5 },  // F#5
  { sd: 5, oct: 1, beat: 27 },    // A#5 (PEAK!)
  { sd: 3, oct: 1, beat: 27.5 },  // F#5
  { sd: 7, oct: 0, beat: 28 },    // C#5
  { sd: 5, oct: 0, beat: 28.5 },  // A#4
  
  // Bar 8 (C#): Resolution phrase
  { sd: 4, oct: 0, beat: 29 },    // G#4
  { sd: 2, oct: 0, beat: 29.5 },  // E#4
  { sd: 4, oct: 0, beat: 30 },    // G#4
  { sd: 7, oct: 0, beat: 30.5 },  // C#5
  { sd: 5, oct: 0, beat: 31 },    // A#4
  { sd: 3, oct: 0, beat: 31.5 },  // F#4
  { sd: 1, oct: 0, beat: 32 },    // D#4
  { sd: 1, oct: 0, beat: 32.5 },  // D#4
  
  // === PHRASE 3 (Bars 9-12): Second half - more intense ===
  // Bar 9 (D#m): Octave higher start
  { sd: 3, oct: 0, beat: 33 },    // F#4
  { sd: 5, oct: 0, beat: 33.5 },  // A#4
  { sd: 1, oct: 1, beat: 34 },    // D#5
  { sd: 1, oct: 1, beat: 34.5 },  // D#5
  { sd: 3, oct: 1, beat: 35 },    // F#5
  { sd: 3, oct: 1, beat: 35.5 },  // F#5
  { sd: 1, oct: 1, beat: 36 },    // D#5
  { sd: 5, oct: 0, beat: 36.5 },  // A#4
  
  // Bar 10 (B): Melodic variation
  { sd: 6, oct: 0, beat: 37 },    // B4
  { sd: 6, oct: 0, beat: 37.5 },  // B4
  { sd: 1, oct: 1, beat: 38 },    // D#5
  { sd: 3, oct: 1, beat: 38.5 },  // F#5
  { sd: 1, oct: 1, beat: 39 },    // D#5
  { sd: 6, oct: 0, beat: 39.5 },  // B4
  { sd: 3, oct: 0, beat: 40 },    // F#4
  { sd: 1, oct: 0, beat: 40.5 },  // D#4
  
  // Bar 11 (F#): Climax build
  { sd: 5, oct: 0, beat: 41 },    // A#4
  { sd: 7, oct: 0, beat: 41.5 },  // C#5
  { sd: 3, oct: 1, beat: 42 },    // F#5
  { sd: 5, oct: 1, beat: 42.5 },  // A#5
  { sd: 3, oct: 1, beat: 43 },    // F#5
  { sd: 7, oct: 0, beat: 43.5 },  // C#5
  { sd: 5, oct: 0, beat: 44 },    // A#4
  { sd: 3, oct: 0, beat: 44.5 },  // F#4
  
  // Bar 12 (C#): Tension
  { sd: 7, oct: 0, beat: 45 },    // C#5
  { sd: 7, oct: 0, beat: 45.5 },  // C#5
  { sd: 4, oct: 0, beat: 46 },    // G#4
  { sd: 2, oct: 0, beat: 46.5 },  // E#4
  { sd: 4, oct: 0, beat: 47 },    // G#4
  { sd: 7, oct: 0, beat: 47.5 },  // C#5
  { sd: 5, oct: 0, beat: 48 },    // A#4
  { sd: 3, oct: 0, beat: 48.5 },  // F#4
  
  // === PHRASE 4 (Bars 13-16): Final resolution ===
  // Bar 13 (D#m): Return to main hook
  { sd: 3, oct: 0, beat: 49 },    // F#4
  { sd: 3, oct: 0, beat: 49.5 },  // F#4
  { sd: 5, oct: 0, beat: 50 },    // A#4
  { sd: 5, oct: 0, beat: 50.5 },  // A#4
  { sd: 1, oct: 1, beat: 51 },    // D#5
  { sd: 1, oct: 1, beat: 51.5 },  // D#5
  { sd: 5, oct: 0, beat: 52 },    // A#4
  { sd: 3, oct: 0, beat: 52.5 },  // F#4
  
  // Bar 14 (B): Descending
  { sd: 6, oct: 0, beat: 53 },    // B4
  { sd: 3, oct: 0, beat: 53.5 },  // F#4
  { sd: 1, oct: 0, beat: 54 },    // D#4
  { sd: 6, oct: -1, beat: 54.5 }, // B3
  { sd: 1, oct: 0, beat: 55 },    // D#4
  { sd: 3, oct: 0, beat: 55.5 },  // F#4
  { sd: 6, oct: 0, beat: 56 },    // B4
  { sd: 1, oct: 1, beat: 56.5 },  // D#5
  
  // Bar 15 (F#): Final ascent
  { sd: 5, oct: 0, beat: 57 },    // A#4
  { sd: 7, oct: 0, beat: 57.5 },  // C#5
  { sd: 3, oct: 1, beat: 58 },    // F#5
  { sd: 3, oct: 1, beat: 58.5 },  // F#5
  { sd: 5, oct: 1, beat: 59 },    // A#5
  { sd: 3, oct: 1, beat: 59.5 },  // F#5
  { sd: 7, oct: 0, beat: 60 },    // C#5
  { sd: 5, oct: 0, beat: 60.5 },  // A#4
  
  // Bar 16 (C#): Final resolution to root
  { sd: 7, oct: 0, beat: 61 },    // C#5
  { sd: 5, oct: 0, beat: 61.5 },  // A#4
  { sd: 4, oct: 0, beat: 62 },    // G#4
  { sd: 2, oct: 0, beat: 62.5 },  // E#4
  { sd: 1, oct: 0, beat: 63 },    // D#4
  { sd: 1, oct: 0, beat: 63.5 },  // D#4
  { sd: 1, oct: 0, beat: 64 },    // D#4 (resolve to root)
  { sd: 1, oct: 0, beat: 64.5 },  // D#4
];

let tick = 0;
let section = 'intro';

dj.loop('8n', (time) => {
  const bar = Math.floor(tick / 8) + 1;
  const beatInBar = (tick % 8) / 2 + 1;  // 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5
  const eighthInBar = tick % 8;  // 0-7 for 8th note position
  const chordIndex = Math.floor((tick % 32) / 8);  // chord changes every 4 beats (8 ticks)
  
  // Song structure (matches original)
  // Intro: bars 1-8, Verse: 9-16, Pre-chorus: 17-24, Chorus: 25-40
  // Verse2: 41-48, Pre-chorus2: 49-56, Chorus2: 57-72, Instrumental: 73+
  let sectionStartBar = 1;
  if (bar <= 8) { section = 'intro'; sectionStartBar = 1; }
  else if (bar <= 16) { section = 'verse'; sectionStartBar = 9; }
  else if (bar <= 24) { section = 'prechorus'; sectionStartBar = 17; }
  else if (bar <= 40) { section = 'chorus'; sectionStartBar = 25; }
  else if (bar <= 48) { section = 'verse2'; sectionStartBar = 41; }
  else if (bar <= 56) { section = 'prechorus2'; sectionStartBar = 49; }
  else if (bar <= 72) { section = 'chorus2'; sectionStartBar = 57; }
  else { section = 'instrumental'; sectionStartBar = 73; }

  // Calculate beat within current section (1-indexed)
  const barInSection = bar - sectionStartBar + 1;
  const sectionBeat = (barInSection - 1) * 4 + beatInBar;  // Convert to beat number within section

  const playMelody = (melody, instrument, vol = 0.7) => {
    for (const n of melody) {
      if (Math.abs(sectionBeat - n.beat) < 0.26) {
        instrument.triggerAttackRelease(S(n.sd, n.oct), '8n', time, vol);
      }
    }
  };
  
  // === INTRO: Piano arpeggio ONLY - NO DRUMS ===
  if (section === 'intro') {
    playMelody(introMelody, dj.fadedPiano, 0.8);
    // Soft pad underneath
    if (beatInBar === 1) {
      dj.pad.triggerAttackRelease(chords[chordIndex], '1n', time, 0.12);
    }
  }
  
  // === VERSE: Almost no drums - atmospheric ===
  if (section === 'verse' || section === 'verse2') {
    playMelody(introMelody, dj.fadedPiano, 0.55);
    playMelody(verseMelody, dj.fadedPluck, 0.5);
    if (beatInBar === 1) {
      dj.pad.triggerAttackRelease(chords[chordIndex], '1n', time, 0.2);
      dj.sub.triggerAttackRelease(bassNotes[chordIndex], '1n', time, 0.35);
    }
    // Very minimal drums - just soft kick on 1 only
    if (beatInBar === 1) dj.sample('drums/kick-1', { time, volume: -8 });
  }
  
  // === PRE-CHORUS: Building energy ===
  if (section === 'prechorus' || section === 'prechorus2') {
    playMelody(introMelody, dj.fadedPiano, 0.4);
    playMelody(preChorusMelody, dj.fadedPluck, 0.6);
    if (beatInBar === 1) {
      dj.pad.triggerAttackRelease(chords[chordIndex], '2n', time, 0.3);
      dj.sub.triggerAttackRelease(bassNotes[chordIndex], '2n', time, 0.5);
    }
    // 4-on-floor kick starts here
    if (beatInBar === 1 || beatInBar === 2 || beatInBar === 3 || beatInBar === 4) {
      dj.sample('drums/kick-1', { time, volume: -3 });
    }
    // Clap on 2&4
    if (beatInBar === 2 || beatInBar === 4) {
      dj.sample('drums/clap-1', { time, volume: -5 });
    }
    // Snare roll buildup in last 2 bars of pre-chorus (bars 7-8 of the section)
    if (barInSection >= 7) {
      if (barInSection === 7 && eighthInBar % 4 === 0) dj.sample('drums/snare-1', { time, volume: -6 });
      if (barInSection === 8 && eighthInBar % 2 === 0) dj.sample('drums/snare-1', { time, volume: -3 });
    }
  }

  // === CHORUS/DROP: Full EDM drop with pumping supersaw ===
  if (section === 'chorus' || section === 'chorus2') {
    // Vocal melody on supersaw lead
    playMelody(chorusMelody, dj.fadedPluck, 0.7);
    // Piano continues softly
    playMelody(introMelody, dj.fadedPiano, 0.25);
    
    // === DRUMS: Classic EDM drop pattern ===
    // 4-on-floor kick (punchy, loud)
    if (beatInBar === 1 || beatInBar === 2 || beatInBar === 3 || beatInBar === 4) {
      dj.sample('drums/kick-1', { time, volume: 3 });
    }
    // Clap + snare layered on 2 & 4
    if (beatInBar === 2 || beatInBar === 4) {
      dj.sample('drums/clap-1', { time, volume: 1 });
      dj.sample('drums/snare-1', { time, volume: -1 });
    }
    // Closed hi-hats on every 8th note
    dj.sample('drums/hihat-1', { time, volume: -4 });
    
    // === SUPERSAW: Pumping sidechain effect ===
    // On-beat: quiet (ducked by kick)
    // Off-beat: loud (pumping up)
    const isOnBeat = beatInBar === 1 || beatInBar === 2 || beatInBar === 3 || beatInBar === 4;
    const isOffBeat = beatInBar === 1.5 || beatInBar === 2.5 || beatInBar === 3.5 || beatInBar === 4.5;
    
    if (isOnBeat) {
      // Ducked - quiet on kick
      dj.supersaw.triggerAttackRelease(chords[chordIndex], '8n', time, 0.25);
    }
    if (isOffBeat) {
      // Pumping up - loud between kicks
      dj.supersaw.triggerAttackRelease(chords[chordIndex], '8n', time, 0.85);
    }
    
    // Sub bass
    if (beatInBar === 1) {
      dj.sub.triggerAttackRelease(bassNotes[chordIndex], '2n', time, 0.75);
    }
  }
  
  // === INSTRUMENTAL: Full energy with lead melody ===
  if (section === 'instrumental') {
    playMelody(instrumentalMelody, dj.fadedPluck, 0.8);
    playMelody(introMelody, dj.fadedPiano, 0.3);
    
    // Same drum pattern as chorus
    if (beatInBar === 1 || beatInBar === 2 || beatInBar === 3 || beatInBar === 4) {
      dj.sample('drums/kick-1', { time, volume: 3 });
    }
    if (beatInBar === 2 || beatInBar === 4) {
      dj.sample('drums/clap-1', { time, volume: 1 });
      dj.sample('drums/snare-1', { time, volume: -1 });
    }
    dj.sample('drums/hihat-1', { time, volume: -4 });
    
    // Pumping supersaw
    const isOnBeat = beatInBar === 1 || beatInBar === 2 || beatInBar === 3 || beatInBar === 4;
    const isOffBeat = beatInBar === 1.5 || beatInBar === 2.5 || beatInBar === 3.5 || beatInBar === 4.5;
    if (isOnBeat) dj.supersaw.triggerAttackRelease(chords[chordIndex], '8n', time, 0.25);
    if (isOffBeat) dj.supersaw.triggerAttackRelease(chords[chordIndex], '8n', time, 0.85);
    
    if (beatInBar === 1) {
      dj.sub.triggerAttackRelease(bassNotes[chordIndex], '2n', time, 0.75);
    }
  }
  
  tick++;
});`;
}


export const fadedTemplate: DJTemplate = {
  id: 'alan-walker-faded',
  name: 'Faded',
  artist: 'Alan Walker',
  genre: 'Melodic EDM',
  bpm: 90,
  key: 'D# minor',
  energy: 0.8,
  danceability: 0.8,
  valence: 0.4,
  trueRemix: {
    enabled: true,
    intensity: 0,
    style: 'melodic-progressive',
    transitions: [
      { type: 'filter-sweep', duration: 8, energy: 0.85 },
      { type: 'reverb-build', duration: 4, energy: 0.95 },
      { type: 'drop', duration: 1, energy: 1.0 },
    ],
    progression: { introLength: 4, buildLength: 8, dropBar: 20 },
  },
  instruments: [
    { name: 'kick', type: 'kick', sound: 'punchy', pattern: 'four-on-floor', volume: 0.9, frequencyProfile: { bass: true, mid: false, high: false } },
    { name: 'clap', type: 'clap', sound: 'layered', pattern: 'backbeat', volume: 0.8, frequencyProfile: { bass: false, mid: true, high: true } },
    { name: 'snare', type: 'snare', sound: 'tight', pattern: 'backbeat-layer', volume: 0.7, frequencyProfile: { bass: false, mid: true, high: true } },
    { name: 'hihat', type: 'hihat', sound: 'crisp', pattern: 'straight-8ths', volume: 0.5, frequencyProfile: { bass: false, mid: false, high: true } },
    { name: 'piano', type: 'piano', sound: 'reverb-arp', pattern: 'hooktheory-intro', volume: 0.7, frequencyProfile: { bass: false, mid: true, high: true } },
    { name: 'pluck', type: 'pluck', sound: 'atmospheric', pattern: 'hooktheory-verse', volume: 0.6, frequencyProfile: { bass: false, mid: true, high: true } },
    { name: 'supersaw', type: 'lead', sound: 'wide-bright', pattern: 'hooktheory-chorus', volume: 0.85, frequencyProfile: { bass: false, mid: true, high: true } },
    { name: 'sub', type: 'bass', sound: 'sub', pattern: 'root-notes', volume: 0.8, frequencyProfile: { bass: true, mid: false, high: false } },
    { name: 'pad', type: 'pad', sound: 'atmospheric', pattern: 'sustained', volume: 0.3, frequencyProfile: { bass: false, mid: true, high: false } },
  ],
  effects: {
    reverb: { type: 'hall', size: 4.0, decay: 4.5, mix: 0.5 },
    delay: { time: '1/8', feedback: 0.4, mix: 0.35 },
  },
  mix: {
    masterVolume: 0.9,
    compression: { threshold: -10, ratio: 4, attack: 0.005, release: 0.1 },
  },
};
