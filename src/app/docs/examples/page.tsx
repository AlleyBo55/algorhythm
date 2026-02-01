'use client';

import { motion } from 'framer-motion';
import { CodeBlock } from '@/components/docs';

export default function ExamplesPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Examples
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Ready-to-use code examples. Copy, paste, and modify to create your own tracks.
        </p>
      </motion.div>

      {/* Basic Beat */}
      <Section title="Basic 4-on-the-Floor Beat" tag="Beginner">
        <p className="text-sm text-white/50 mb-4">
          The foundation of house, techno, and EDM - kick on every beat:
        </p>
        <CodeBlock filename="four-on-floor.ts">{`dj.bpm = 128;

let tick = 0;

dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Closed hi-hat on every 8th
  if (tick % 2 === 0) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Open hi-hat on offbeats
  if (tick % 4 === 2) {
    dj.hihat.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Trap Beat */}
      <Section title="Trap Beat" tag="Intermediate">
        <p className="text-sm text-white/50 mb-4">
          Rolling hi-hats and 808 bass characteristic of trap music:
        </p>
        <CodeBlock filename="trap-beat.ts">{`dj.bpm = 140;

let tick = 0;

dj.loop('32n', (time) => {
  const beat = Math.floor(tick / 8);
  const subBeat = tick % 8;
  
  // 808 kick pattern
  if (tick % 32 === 0 || tick % 32 === 12) {
    dj.bass808.triggerAttackRelease('C1', '4n', time);
  }
  
  // Snare on 2 and 4
  if (tick % 16 === 8) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Rolling hi-hats
  if (subBeat === 0 || subBeat === 2 || subBeat === 4 || subBeat === 6) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  // Hi-hat triplet rolls every 2 bars
  if (beat % 8 === 7) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Alan Walker Style */}
      <Section title="Alan Walker - Faded Style" tag="Advanced">
        <p className="text-sm text-white/50 mb-4">
          Recreate the iconic Faded sound with the song-specific instruments:
        </p>
        <CodeBlock filename="faded-style.ts">{`dj.bpm = 90;

// Faded chord progression: F - G - Am - F
const chords = [
  ['F4', 'A4', 'C5'],   // F major
  ['G4', 'B4', 'D5'],   // G major
  ['A4', 'C5', 'E5'],   // A minor
  ['F4', 'A4', 'C5'],   // F major
];

let tick = 0;
let chordIndex = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = Math.floor(tick / 4) % 4;
  
  // Piano chords every half note
  if (tick % 8 === 0) {
    dj.fadedPiano.triggerAttackRelease(
      chords[chordIndex], 
      '2n', 
      time
    );
    chordIndex = (chordIndex + 1) % chords.length;
  }
  
  // Drums come in after 4 bars
  if (bar >= 4) {
    // Kick
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    // Snare
    if (tick % 8 === 4) {
      dj.snare.triggerAttackRelease('C1', '8n', time);
    }
  }
  
  // Drop section with supersaw (after 8 bars)
  if (bar >= 8 && tick % 4 === 0) {
    const dropNote = ['A4', 'G4', 'F4', 'G4'][beat];
    dj.supersaw.triggerAttackRelease(dropNote, '8n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Avicii Levels Style */}
      <Section title="Avicii - Levels Style" tag="Advanced">
        <p className="text-sm text-white/50 mb-4">
          The iconic piano riff that defined a generation:
        </p>
        <CodeBlock filename="levels-style.ts">{`dj.bpm = 126;

// The Levels piano pattern
const pattern = [
  { tick: 0, note: 'E5' },
  { tick: 2, note: 'E5' },
  { tick: 4, note: 'E5' },
  { tick: 6, note: 'D5' },
  { tick: 8, note: 'E5' },
  { tick: 10, note: 'D5' },
  { tick: 12, note: 'C5' },
];

let tick = 0;

dj.loop('16n', (time) => {
  const patternTick = tick % 16;
  
  // Piano riff
  const note = pattern.find(p => p.tick === patternTick);
  if (note) {
    dj.levelsPiano.triggerAttackRelease(note.note, '16n', time);
  }
  
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Clap on 2 and 4
  if (tick % 8 === 4) {
    dj.clap.triggerAttackRelease('C1', '8n', time);
  }
  
  // Bass follows root notes
  if (tick % 16 === 0) {
    dj.bass.triggerAttackRelease('A1', '4n', time);
  }
  if (tick % 16 === 8) {
    dj.bass.triggerAttackRelease('F1', '4n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Lo-Fi Beat */}
      <Section title="Lo-Fi Hip Hop Beat" tag="Intermediate">
        <p className="text-sm text-white/50 mb-4">
          Chill, jazzy lo-fi vibes with swing and vinyl crackle feel:
        </p>
        <CodeBlock filename="lofi-beat.ts">{`dj.bpm = 85;

// Jazz chord progression
const chords = [
  ['D4', 'F#4', 'A4', 'C5'],  // Dmaj7
  ['G4', 'B4', 'D5', 'F5'],   // Gmaj7
  ['E4', 'G4', 'B4', 'D5'],   // Em7
  ['A4', 'C#5', 'E5', 'G5'],  // A7
];

let tick = 0;
let chordIndex = 0;

dj.loop('16n', (time) => {
  // Swing feel - delay offbeats slightly
  const swing = (tick % 2 === 1) ? 0.02 : 0;
  const swungTime = time + swing;
  
  // Dusty kick pattern
  if (tick % 8 === 0 || tick % 8 === 5) {
    dj.kick.triggerAttackRelease('C1', '8n', swungTime);
  }
  
  // Snare with ghost notes
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', swungTime);
  }
  if (tick % 8 === 6) {
    // Ghost snare (quieter)
    dj.volume.snare = -12;
    dj.snare.triggerAttackRelease('C1', '16n', swungTime);
    dj.volume.snare = 0;
  }
  
  // Hi-hat pattern
  if (tick % 2 === 0) {
    dj.hihat.triggerAttackRelease('C1', '32n', swungTime);
  }
  
  // Piano chords every 2 bars
  if (tick % 32 === 0) {
    dj.piano.triggerAttackRelease(chords[chordIndex], '1m', time);
    chordIndex = (chordIndex + 1) % chords.length;
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Dubstep Drop */}
      <Section title="Dubstep Drop" tag="Advanced">
        <p className="text-sm text-white/50 mb-4">
          Heavy wobble bass and aggressive drums:
        </p>
        <CodeBlock filename="dubstep-drop.ts">{`dj.bpm = 140;

let tick = 0;
let wobbleRate = 0;

dj.loop('32n', (time) => {
  const bar = Math.floor(tick / 32);
  
  // Kick pattern - half-time feel
  if (tick % 16 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 3
  if (tick % 16 === 8) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Wobble bass - changes rate for variation
  if (tick % 4 === 0) {
    // Alternate between different wobble rhythms
    const wobbleNotes = ['E1', 'E1', 'G1', 'A1'];
    const noteIndex = Math.floor(tick / 4) % 4;
    dj.wobbleBass.triggerAttackRelease(
      wobbleNotes[noteIndex], 
      '8n', 
      time
    );
  }
  
  // Aggressive hi-hats
  if (tick % 2 === 0) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  // Snare fills every 4 bars
  if (bar % 4 === 3 && tick % 32 >= 24) {
    if (tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Melodic Pattern */}
      <Section title="Melodic Arpeggio" tag="Intermediate">
        <p className="text-sm text-white/50 mb-4">
          Create flowing arpeggios over chord progressions:
        </p>
        <CodeBlock filename="arpeggio.ts">{`dj.bpm = 120;

// Chord progression
const progression = [
  ['C4', 'E4', 'G4'],   // C major
  ['A3', 'C4', 'E4'],   // A minor
  ['F3', 'A3', 'C4'],   // F major
  ['G3', 'B3', 'D4'],   // G major
];

let tick = 0;
let chordIndex = 0;
let arpIndex = 0;

dj.loop('16n', (time) => {
  // Change chord every bar
  if (tick % 16 === 0) {
    chordIndex = Math.floor(tick / 16) % progression.length;
    arpIndex = 0;
  }
  
  const currentChord = progression[chordIndex];
  
  // Arpeggio pattern: up then down
  const arpPattern = [0, 1, 2, 1];  // Indices into chord
  const noteIndex = arpPattern[arpIndex % 4];
  
  // Play arp note
  dj.arp.triggerAttackRelease(currentChord[noteIndex], '16n', time);
  arpIndex++;
  
  // Pad holds the full chord
  if (tick % 16 === 0) {
    dj.pad.triggerAttackRelease(currentChord, '1m', time);
  }
  
  // Simple drums
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Full Track Structure */}
      <Section title="Full Track Structure" tag="Advanced">
        <p className="text-sm text-white/50 mb-4">
          A complete track with intro, build, drop, and breakdown:
        </p>
        <CodeBlock filename="full-track.ts">{`dj.bpm = 128;

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const section = Math.floor(bar / 8);  // 8-bar sections
  
  // Section 0-1: Intro (bars 0-15)
  // Just hi-hats and pad
  if (section < 2) {
    if (tick % 2 === 0) {
      dj.hihat.triggerAttackRelease('C1', '32n', time);
    }
    if (tick % 32 === 0) {
      dj.pad.triggerAttackRelease(['C4', 'E4', 'G4'], '2m', time);
    }
  }
  
  // Section 2-3: Build (bars 16-31)
  // Add kick, rising energy
  if (section >= 2 && section < 4) {
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
    }
    if (tick % 2 === 0) {
      dj.hihat.triggerAttackRelease('C1', '32n', time);
    }
    // Snare roll in last 2 bars
    if (bar === 30 || bar === 31) {
      if (tick % 2 === 0) {
        dj.snare.triggerAttackRelease('C1', '16n', time);
      }
    }
  }
  
  // Section 4-5: Drop (bars 32-47)
  // Full energy
  if (section >= 4 && section < 6) {
    if (tick % 4 === 0) {
      dj.kick.triggerAttackRelease('C1', '8n', time);
      dj.supersaw.triggerAttackRelease('C4', '8n', time);
    }
    if (tick % 8 === 4) {
      dj.snare.triggerAttackRelease('C1', '8n', time);
    }
    if (tick % 2 === 0) {
      dj.hihat.triggerAttackRelease('C1', '32n', time);
    }
  }
  
  // Section 6-7: Breakdown (bars 48-63)
  // Strip back, just pad and piano
  if (section >= 6) {
    if (tick % 32 === 0) {
      dj.pad.triggerAttackRelease(['A3', 'C4', 'E4'], '2m', time);
    }
    if (tick % 8 === 0) {
      dj.piano.triggerAttackRelease('E5', '8n', time);
    }
  }
  
  tick++;
});`}</CodeBlock>
      </Section>
    </div>
  );
}

function Section({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) {
  const tagColors: Record<string, string> = {
    'Beginner': 'text-emerald-400 bg-emerald-400/10',
    'Intermediate': 'text-amber-400 bg-amber-400/10',
    'Advanced': 'text-rose-400 bg-rose-400/10',
  };

  return (
    <motion.section 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-2">
        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h2>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tagColors[tag]}`}>
          {tag}
        </span>
      </div>
      {children}
    </motion.section>
  );
}
