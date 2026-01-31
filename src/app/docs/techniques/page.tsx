export default function TechniquesPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">DJ Techniques</h1>
        <p className="text-lg text-zinc-400">
          Master essential DJ techniques through code.
        </p>
      </div>

      {/* Beat Matching */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Beat Matching</h2>
        <p className="text-zinc-400">
          Align the tempo and phase of two tracks for seamless mixing.
        </p>
        
        <CodeBlock>{`// Set both decks to the same BPM
dj.deck.A.bpm = 128;
dj.deck.B.bpm = 128;

// Sync deck B to deck A's phase
dj.deck.B.sync(dj.deck.A);`}</CodeBlock>
      </section>

      {/* Transitions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Transitions</h2>
        <p className="text-zinc-400">
          Smoothly blend between tracks using the crossfader and EQ.
        </p>
        
        <CodeBlock>{`// Gradual crossfade over 8 bars
let progress = 0;

dj.loop('4n', (time) => {
  if (progress < 32) {
    // Move crossfader from A to B
    dj.crossfader.position = -1 + (progress / 32) * 2;
    progress++;
  }
});`}</CodeBlock>

        <h3 className="text-lg font-medium text-white mt-6">EQ Mixing</h3>
        <CodeBlock>{`// Cut bass on incoming track, then swap
dj.deck.B.eq.low = -24;  // Kill bass on B
dj.deck.B.play();

// After 4 bars, swap the bass
setTimeout(() => {
  dj.deck.A.eq.low = -24;  // Kill bass on A
  dj.deck.B.eq.low = 0;    // Bring in bass on B
}, 4 * (60000 / dj.bpm) * 4);`}</CodeBlock>
      </section>

      {/* Build-ups */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Build-ups & Drops</h2>
        <p className="text-zinc-400">
          Create tension and release with filter sweeps and drum patterns.
        </p>
        
        <CodeBlock>{`let tick = 0;
let filterFreq = 200;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Build-up: increase filter over 8 bars
  if (bar < 8) {
    filterFreq = 200 + (bar * 2000);
    dj.deck.A.filter.lowpass = filterFreq;
    
    // Snare roll intensifies
    if (bar >= 6 && tick % 2 === 0) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
  }
  
  // Drop: open filter, full drums
  if (bar === 8 && tick % 16 === 0) {
    dj.deck.A.filter.lowpass = 20000;
  }
  
  tick++;
});`}</CodeBlock>
      </section>

      {/* Hot Cues */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Hot Cues</h2>
        <p className="text-zinc-400">
          Mark and jump to specific points in a track.
        </p>
        
        <CodeBlock>{`// Set hot cues at specific times
dj.deck.A.cue.set(0, 0);      // Intro
dj.deck.A.cue.set(1, 32);     // Verse
dj.deck.A.cue.set(2, 64);     // Chorus
dj.deck.A.cue.set(3, 128);    // Drop

// Jump to a cue point
dj.deck.A.cue.jump(2);  // Jump to chorus`}</CodeBlock>
      </section>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
      <code className="text-sm text-zinc-300 font-mono">{children}</code>
    </pre>
  );
}
