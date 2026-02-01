'use client';

import { motion } from 'framer-motion';
import { CodeBlock } from '@/components/docs';

const DRUM_INSTRUMENTS = [
  { name: 'kick', desc: 'Punchy kick drum with adjustable pitch decay' },
  { name: 'snare', desc: 'Crisp snare with noise synthesis' },
  { name: 'hihat', desc: 'Metallic hi-hat with short decay' },
  { name: 'clap', desc: 'Layered clap with reverb' },
  { name: 'tom', desc: 'Melodic tom with pitch envelope' },
  { name: 'cymbal', desc: 'Crash cymbal with long decay' },
  { name: 'bass808', desc: 'Classic 808 bass drum with long sustain' },
];

const SYNTH_INSTRUMENTS = [
  { name: 'bass', desc: 'Sawtooth bass with filter envelope' },
  { name: 'sub', desc: 'Pure sine sub bass for low end' },
  { name: 'lead', desc: 'Fat sawtooth lead with delay and reverb' },
  { name: 'pad', desc: 'Atmospheric pad with long attack and chorus' },
  { name: 'arp', desc: 'PWM arp synth for arpeggios' },
  { name: 'pluck', desc: 'Plucky triangle synth' },
  { name: 'fm', desc: 'FM synthesis for bells and metallic sounds' },
];

const ACOUSTIC_INSTRUMENTS = [
  { name: 'piano', desc: 'Electric piano with triangle oscillator' },
  { name: 'strings', desc: 'Lush string ensemble with chorus' },
  { name: 'flute', desc: 'Soft sine flute with reverb' },
  { name: 'trumpet', desc: 'Brass-like triangle synth' },
  { name: 'violin', desc: 'Sawtooth violin with long release' },
  { name: 'marimba', desc: 'FM marimba with woody tone' },
  { name: 'choir', desc: 'Layered choir voices' },
];

const SONG_INSTRUMENTS = [
  { name: 'fadedPiano', desc: 'Alan Walker "Faded" - warm triangle piano with heavy reverb', song: 'Faded' },
  { name: 'fadedPluck', desc: 'Alan Walker "Faded" - bright supersaw lead for the drop', song: 'Faded' },
  { name: 'levelsPiano', desc: 'Avicii "Levels" - bright percussive piano riff', song: 'Levels' },
  { name: 'supersaw', desc: 'Massive 7-voice detuned saw for EDM drops', song: 'Various' },
  { name: 'strobeArp', desc: 'Deadmau5 "Strobe" - hypnotic filtered arp', song: 'Strobe' },
  { name: 'animalsPluck', desc: 'Martin Garrix "Animals" - woody percussive pluck', song: 'Animals' },
  { name: 'skrillexWobble', desc: 'Skrillex-style FM wobble bass', song: 'Dubstep' },
  { name: 'shapeMarimba', desc: 'Ed Sheeran "Shape of You" - tropical marimba', song: 'Shape of You' },
  { name: 'diploHorn', desc: 'Major Lazer "Lean On" - brass horn synth', song: 'Lean On' },
  { name: 'sawanoStrings', desc: 'Hiroyuki Sawano - epic orchestral strings', song: 'Attack on Titan' },
  { name: 'sawanoChoir', desc: 'Hiroyuki Sawano - epic layered choir', song: 'Attack on Titan' },
  { name: 'gou90sPiano', desc: 'Peggy Gou - 90s house piano stabs', song: 'It Makes You Forget' },
  { name: 'housePiano', desc: 'Classic house piano chords', song: 'House' },
  { name: 'wobbleBass', desc: 'Generic dubstep wobble bass', song: 'Dubstep' },
  { name: 'ghibliGrand', desc: 'Studio Ghibli - warm expressive grand piano', song: 'Ghibli Films' },
  { name: 'ghibliFlute', desc: 'Studio Ghibli - breathy woodwind flute', song: 'Ghibli Films' },
];

export default function InstrumentsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>API Reference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Instruments
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          30+ instruments from basic drums to song-specific synths. All instruments use Tone.js 
          and support <code className="text-emerald-400">triggerAttackRelease()</code>.
        </p>
      </motion.div>

      {/* Usage */}
      <Section title="Basic Usage">
        <p className="text-sm text-white/50 mb-4">
          All instruments follow the same pattern for triggering notes:
        </p>
        <CodeBlock filename="instrument-usage.ts">{`// Trigger a note
dj.kick.triggerAttackRelease('C1', '8n', time);

// Parameters:
// - note: pitch (e.g., 'C4', 'A3', 'F#2')
// - duration: how long to hold ('4n', '8n', '16n', etc.)
// - time: when to play (from loop callback)

// For drums, pitch is usually 'C1' or 'C2'
dj.snare.triggerAttackRelease('C1', '8n', time);

// For melodic instruments, use actual notes
dj.piano.triggerAttackRelease('E4', '4n', time);

// Play chords (polyphonic instruments)
dj.pad.triggerAttackRelease(['C4', 'E4', 'G4'], '2n', time);`}</CodeBlock>
      </Section>

      {/* Drums */}
      <Section title="Drums">
        <InstrumentGrid instruments={DRUM_INSTRUMENTS} />
        <CodeBlock filename="drums-example.ts">{`// Classic 4-on-the-floor pattern
let tick = 0;
dj.loop('16n', (time) => {
  // Kick on beats 1, 2, 3, 4
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  // Snare on beats 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  // Hi-hat on every 8th note
  if (tick % 2 === 0) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Synths */}
      <Section title="Synthesizers">
        <InstrumentGrid instruments={SYNTH_INSTRUMENTS} />
        <CodeBlock filename="synth-example.ts">{`// Bass line
const bassNotes = ['E2', 'E2', 'G2', 'A2'];
let bassIndex = 0;

dj.loop('8n', (time) => {
  dj.bass.triggerAttackRelease(bassNotes[bassIndex], '8n', time);
  bassIndex = (bassIndex + 1) % bassNotes.length;
});

// Pad chords
dj.loop('1m', (time) => {
  dj.pad.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '1m', time);
});`}</CodeBlock>
      </Section>

      {/* Acoustic */}
      <Section title="Acoustic Instruments">
        <InstrumentGrid instruments={ACOUSTIC_INSTRUMENTS} />
        <CodeBlock filename="acoustic-example.ts">{`// Piano melody
const melody = ['E5', 'D5', 'C5', 'D5', 'E5', 'E5', 'E5'];
let noteIndex = 0;

dj.loop('4n', (time) => {
  dj.piano.triggerAttackRelease(melody[noteIndex], '4n', time);
  noteIndex = (noteIndex + 1) % melody.length;
});`}</CodeBlock>
      </Section>

      {/* Song-Specific */}
      <Section title="Song-Specific Instruments">
        <p className="text-sm text-white/50 mb-4">
          These instruments are tuned to recreate specific iconic sounds from famous tracks.
        </p>
        <SongInstrumentGrid instruments={SONG_INSTRUMENTS} />
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-white/70 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Alan Walker - Faded Example
          </h3>
          <CodeBlock filename="faded-example.ts">{`dj.bpm = 90;

// The iconic Faded piano intro
const fadedChords = [
  ['F4', 'A4', 'C5'],      // F major
  ['G4', 'B4', 'D5'],      // G major  
  ['A4', 'C5', 'E5'],      // A minor
  ['F4', 'A4', 'C5'],      // F major
];

let chordIndex = 0;
dj.loop('2n', (time) => {
  dj.fadedPiano.triggerAttackRelease(
    fadedChords[chordIndex], 
    '2n', 
    time
  );
  chordIndex = (chordIndex + 1) % fadedChords.length;
});

// The drop lead
dj.loop('8n', (time) => {
  dj.fadedPluck.triggerAttackRelease('A4', '16n', time);
});`}</CodeBlock>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-white/70 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Avicii - Levels Example
          </h3>
          <CodeBlock filename="levels-example.ts">{`dj.bpm = 126;

// The Levels piano riff
const levelsPattern = [
  { note: 'E5', time: 0 },
  { note: 'E5', time: 0.5 },
  { note: 'E5', time: 1 },
  { note: 'D5', time: 1.5 },
  { note: 'E5', time: 2 },
  { note: 'D5', time: 2.5 },
  { note: 'C5', time: 3 },
];

let beat = 0;
dj.loop('8n', (time) => {
  const note = levelsPattern.find(n => n.time === beat % 4);
  if (note) {
    dj.levelsPiano.triggerAttackRelease(note.note, '8n', time);
  }
  beat += 0.5;
});`}</CodeBlock>
        </div>
      </Section>

      {/* Volume Control */}
      <Section title="Volume Control">
        <p className="text-sm text-white/50 mb-4">
          Control individual instrument volumes using <code className="text-emerald-400">dj.volume</code>:
        </p>
        <CodeBlock filename="volume-control.ts">{`// Master volume (0 to 1)
dj.volume.master = 0.8;

// Individual instruments (dB)
dj.volume.kick = 0;        // Unity gain
dj.volume.snare = -3;      // Slightly quieter
dj.volume.hihat = -6;      // Background level
dj.volume.supersaw = 6;    // Boosted for drops
dj.volume.fadedPiano = 2;  // Slightly boosted

// All song-specific instruments have volume control
dj.volume.levelsPiano = 0;
dj.volume.fadedPluck = 3;
dj.volume.wobbleBass = -2;`}</CodeBlock>
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

function InstrumentGrid({ instruments }: { instruments: { name: string; desc: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2 mb-4">
      {instruments.map((inst) => (
        <div 
          key={inst.name}
          className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
        >
          <code className="text-emerald-400 text-sm block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            dj.{inst.name}
          </code>
          <p className="text-xs text-white/40">{inst.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SongInstrumentGrid({ instruments }: { instruments: { name: string; desc: string; song: string }[] }) {
  return (
    <div className="grid gap-2">
      {instruments.map((inst) => (
        <div 
          key={inst.name}
          className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <code className="text-emerald-400 text-sm shrink-0 w-40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            dj.{inst.name}
          </code>
          <p className="text-xs text-white/40 flex-1">{inst.desc}</p>
          <span className="text-[10px] text-amber-400/60 bg-amber-400/10 px-2 py-0.5 rounded shrink-0">
            {inst.song}
          </span>
        </div>
      ))}
    </div>
  );
}
