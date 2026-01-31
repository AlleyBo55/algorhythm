export default function ConceptsPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Core Concepts</h1>
        <p className="text-lg text-zinc-400">
          Understanding the fundamentals of live coding with Algorhythm.
        </p>
      </div>

      {/* Audio Engine */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Audio Engine</h2>
        <p className="text-zinc-400">
          Algorhythm uses Tone.js under the hood, providing professional-grade audio synthesis 
          and processing in the browser. The engine handles timing, scheduling, and audio routing.
        </p>
        
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-medium text-white mb-2">Key Features</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-[#1db954]">•</span>
              Sample-accurate timing for tight rhythms
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1db954]">•</span>
              Low-latency audio processing
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1db954]">•</span>
              Built-in instruments and effects
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1db954]">•</span>
              Real-time parameter control
            </li>
          </ul>
        </div>
      </section>

      {/* Time & Scheduling */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Time & Scheduling</h2>
        <p className="text-zinc-400">
          All audio events are scheduled using the <code className="text-[#1db954]">time</code> parameter. 
          This ensures precise timing regardless of JavaScript execution delays.
        </p>
        
        <CodeBlock>{`// The time parameter is crucial for accurate timing
dj.loop('16n', (time) => {
  // Use 'time' for scheduling, not Date.now()
  dj.kick.triggerAttackRelease('C1', '8n', time);
  
  // Schedule slightly in the future
  dj.snare.triggerAttackRelease('C1', '8n', time + 0.5);
});`}</CodeBlock>
      </section>

      {/* Pattern Building */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Pattern Building</h2>
        <p className="text-zinc-400">
          Use a tick counter to create rhythmic patterns. Each tick represents one subdivision 
          of your loop interval.
        </p>
        
        <CodeBlock>{`let tick = 0;

dj.loop('16n', (time) => {
  const beat = tick % 4;      // 0-3 within each beat
  const bar = Math.floor(tick / 16);  // Current bar number
  
  // Kick on beats 1 and 3
  if (tick % 8 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on beats 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </section>

      {/* Signal Flow */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Signal Flow</h2>
        <p className="text-zinc-400">
          Understanding how audio flows through the system helps you create better mixes.
        </p>
        
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-sm">
          <div className="space-y-2 text-zinc-400">
            <p>Instruments → Deck EQ → Deck Effects → Deck Volume</p>
            <p className="pl-4">↓</p>
            <p>Crossfader → Master Effects → Master Volume → Output</p>
          </div>
        </div>
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
