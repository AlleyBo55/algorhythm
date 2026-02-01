'use client';

import { motion } from 'framer-motion';
import { CodeBlock, InlineCode } from '@/components/docs';

export default function ConceptsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Getting Started</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Core Concepts
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Understanding the fundamentals of music programming with Algorhythm.
        </p>
      </motion.div>

      {/* The DJ Object */}
      <Section title="The dj Object">
        <p className="text-sm text-white/50 mb-4">
          The <InlineCode>dj</InlineCode> object is your main interface for creating music. 
          It&apos;s globally available in the code editor and provides access to all instruments, 
          decks, effects, and controls.
        </p>
        <CodeBlock filename="dj-object.ts">{`// The dj object is always available
dj.bpm = 128;           // Set tempo
dj.kick.triggerAttackRelease('C1', '8n', time);  // Play drums
dj.deck.A.play();       // Control decks
dj.effects.reverb.set({ wet: 0.3 });  // Configure effects`}</CodeBlock>
      </Section>

      {/* Time and Scheduling */}
      <Section title="Time & Scheduling">
        <p className="text-sm text-white/50 mb-4">
          Algorhythm uses Tone.js for precise audio scheduling. The <InlineCode>time</InlineCode> parameter 
          in loop callbacks represents the exact moment when the sound should play.
        </p>
        <CodeBlock filename="timing.ts">{`// The time parameter is crucial for tight timing
dj.loop('16n', (time) => {
  // 'time' is the precise moment this tick occurs
  // Always pass it to triggerAttackRelease
  dj.kick.triggerAttackRelease('C1', '8n', time);
  
  // DON'T do this - timing will be loose:
  // dj.kick.triggerAttackRelease('C1', '8n');
});

// Musical time notation
// '1m'  = 1 measure (4 beats at 4/4)
// '2n'  = half note
// '4n'  = quarter note (1 beat)
// '8n'  = eighth note
// '16n' = sixteenth note
// '32n' = thirty-second note`}</CodeBlock>
      </Section>

      {/* Loops and Patterns */}
      <Section title="Loops & Patterns">
        <p className="text-sm text-white/50 mb-4">
          Use <InlineCode>dj.loop()</InlineCode> to create repeating patterns. 
          Track your position with a counter variable to create complex rhythms.
        </p>
        <CodeBlock filename="patterns.ts">{`// Basic loop with counter
let tick = 0;

dj.loop('16n', (time) => {
  // tick increments every 16th note
  // At 128 BPM, that's ~7.8ms per tick
  
  // Every 4 ticks = 1 beat (quarter note)
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Every 8 ticks = half note
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Reset every 64 ticks (4 bars)
  tick = (tick + 1) % 64;
});`}</CodeBlock>

        <div className="mt-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <h4 className="text-sm font-medium text-white/70 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tick Reference (16n loop)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="text-white/40"><span className="text-emerald-400">tick % 4 === 0</span> → every beat</div>
            <div className="text-white/40"><span className="text-emerald-400">tick % 2 === 0</span> → every 8th</div>
            <div className="text-white/40"><span className="text-emerald-400">tick % 8 === 0</span> → every 2 beats</div>
            <div className="text-white/40"><span className="text-emerald-400">tick % 16 === 0</span> → every bar</div>
          </div>
        </div>
      </Section>

      {/* Notes and Chords */}
      <Section title="Notes & Chords">
        <p className="text-sm text-white/50 mb-4">
          Notes are specified using scientific pitch notation: note name + octave number.
          Polyphonic instruments can play chords by passing an array of notes.
        </p>
        <CodeBlock filename="notes.ts">{`// Single notes
dj.piano.triggerAttackRelease('C4', '4n', time);  // Middle C
dj.bass.triggerAttackRelease('E2', '8n', time);   // Low E
dj.lead.triggerAttackRelease('G5', '16n', time);  // High G

// Sharps and flats
dj.piano.triggerAttackRelease('F#4', '4n', time); // F sharp
dj.piano.triggerAttackRelease('Bb3', '4n', time); // B flat

// Chords (array of notes)
dj.pad.triggerAttackRelease(['C4', 'E4', 'G4'], '2n', time);      // C major
dj.pad.triggerAttackRelease(['A3', 'C4', 'E4'], '2n', time);      // A minor
dj.pad.triggerAttackRelease(['F4', 'A4', 'C5', 'E5'], '2n', time); // Fmaj7`}</CodeBlock>

        <div className="mt-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <h4 className="text-sm font-medium text-white/70 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Common Chord Shapes
          </h4>
          <div className="grid gap-2 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <div className="flex justify-between"><span className="text-white/40">C major:</span> <span className="text-emerald-400">[&apos;C4&apos;, &apos;E4&apos;, &apos;G4&apos;]</span></div>
            <div className="flex justify-between"><span className="text-white/40">A minor:</span> <span className="text-emerald-400">[&apos;A3&apos;, &apos;C4&apos;, &apos;E4&apos;]</span></div>
            <div className="flex justify-between"><span className="text-white/40">F major:</span> <span className="text-emerald-400">[&apos;F3&apos;, &apos;A3&apos;, &apos;C4&apos;]</span></div>
            <div className="flex justify-between"><span className="text-white/40">G major:</span> <span className="text-emerald-400">[&apos;G3&apos;, &apos;B3&apos;, &apos;D4&apos;]</span></div>
          </div>
        </div>
      </Section>

      {/* Decks vs Instruments */}
      <Section title="Decks vs Instruments">
        <p className="text-sm text-white/50 mb-4">
          Algorhythm has two ways to make sound: <strong className="text-white/70">Decks</strong> for playing 
          audio files, and <strong className="text-white/70">Instruments</strong> for synthesized sounds.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-sm font-medium text-cyan-400 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Decks (Audio Files)
            </h4>
            <ul className="text-xs text-white/50 space-y-1">
              <li>• Load and play audio files</li>
              <li>• 4 decks: A, B, C, D</li>
              <li>• EQ, filter, effects per deck</li>
              <li>• Loops, hot cues, beat sync</li>
              <li>• Crossfader mixing</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-sm font-medium text-amber-400 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Instruments (Synthesis)
            </h4>
            <ul className="text-xs text-white/50 space-y-1">
              <li>• Generate sounds in real-time</li>
              <li>• 30+ instruments available</li>
              <li>• Trigger notes programmatically</li>
              <li>• Create beats, melodies, chords</li>
              <li>• Global effects processing</li>
            </ul>
          </div>
        </div>

        <CodeBlock filename="decks-vs-instruments.ts">{`// DECKS - Play audio files
await dj.deck.A.load(audioFile);
dj.deck.A.play();
dj.deck.A.eq.low = -6;

// INSTRUMENTS - Synthesize sounds
dj.kick.triggerAttackRelease('C1', '8n', time);
dj.piano.triggerAttackRelease(['C4', 'E4', 'G4'], '4n', time);

// You can use both together!
// Deck plays a track while instruments add live elements`}</CodeBlock>
      </Section>

      {/* BPM and Sync */}
      <Section title="BPM & Sync">
        <p className="text-sm text-white/50 mb-4">
          The global BPM controls the tempo of all loops and can sync loaded tracks.
        </p>
        <CodeBlock filename="bpm-sync.ts">{`// Set global BPM
dj.bpm = 128;

// All loops sync to this tempo
dj.loop('4n', (time) => {
  // This fires every quarter note at 128 BPM
  // = every 468.75ms
});

// Loaded tracks can be synced
dj.deck.A.bpm = 128;  // Match deck to global BPM

// Sync two decks together
dj.sync(dj.deck.A, dj.deck.B);`}</CodeBlock>
      </Section>

      {/* Stopping */}
      <Section title="Stopping Playback">
        <p className="text-sm text-white/50 mb-4">
          Use <InlineCode>dj.stop()</InlineCode> to stop all loops and scheduled events.
        </p>
        <CodeBlock filename="stopping.ts">{`// Stop everything
dj.stop();

// This cancels:
// - All active loops
// - All scheduled events
// - Transport playback

// Decks continue playing unless explicitly stopped
dj.deck.A.stop();
dj.deck.B.stop();`}</CodeBlock>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold text-white border-b border-white/[0.06] pb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
