export default function ExamplesPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Examples</h1>
        <p className="text-lg text-zinc-400">
          Ready-to-use code examples for common patterns.
        </p>
      </div>

      {/* Basic Patterns */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Basic Patterns</h2>
        
        <Example
          title="Four on the Floor"
          description="Classic house/techno kick pattern"
          code={`dj.bpm = 126;
let tick = 0;

dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  tick++;
});`}
        />

        <Example
          title="Breakbeat"
          description="Syncopated drum pattern"
          code={`dj.bpm = 140;
let tick = 0;

dj.loop('16n', (time) => {
  const p = tick % 16;
  
  // Kick pattern
  if ([0, 6, 10].includes(p)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 4 and 12
  if ([4, 12].includes(p)) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}
        />
      </section>

      {/* Melodic */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Melodic Patterns</h2>
        
        <Example
          title="Arpeggio"
          description="Rising synth arpeggio"
          code={`dj.bpm = 128;
let tick = 0;
const notes = ['C4', 'E4', 'G4', 'B4'];

dj.loop('16n', (time) => {
  const noteIndex = tick % notes.length;
  dj.synth.triggerAttackRelease(notes[noteIndex], '16n', time);
  tick++;
});`}
        />

        <Example
          title="Chord Progression"
          description="Simple 4-chord progression"
          code={`dj.bpm = 120;
let tick = 0;

const chords = [
  ['C4', 'E4', 'G4'],  // C major
  ['A3', 'C4', 'E4'],  // A minor
  ['F3', 'A3', 'C4'],  // F major
  ['G3', 'B3', 'D4'],  // G major
];

dj.loop('1m', (time) => {
  const chordIndex = tick % chords.length;
  dj.pad.triggerAttackRelease(chords[chordIndex], '1m', time);
  tick++;
});`}
        />
      </section>

      {/* Advanced */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Advanced</h2>
        
        <Example
          title="Build-up with Filter"
          description="8-bar build-up with filter sweep"
          code={`dj.bpm = 128;
let tick = 0;
let filterFreq = 200;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Build-up over 8 bars
  if (bar < 8) {
    filterFreq = 200 + (tick * 50);
    // Apply filter to master or deck
  }
  
  // Snare roll in last 2 bars
  if (bar >= 6) {
    const rollSpeed = bar === 7 ? 2 : 4;
    if (tick % rollSpeed === 0) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
  }
  
  tick++;
});`}
        />
      </section>
    </div>
  );
}

function Example({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-zinc-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}
