export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Documentation</h1>
        <p className="text-lg text-zinc-400">
          Learn how to create music with code using Algorhythm.
        </p>
      </div>

      {/* Quick Start */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
        
        <div className="space-y-4">
          <Step number={1} title="Initialize">
            Click "Start Session" on the welcome screen to initialize the audio engine.
          </Step>
          
          <Step number={2} title="Write Code">
            Use the code editor to write your music. The API is designed to be intuitive.
          </Step>
          
          <Step number={3} title="Run">
            Press <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> to execute your code and hear the result.
          </Step>
        </div>
      </section>

      {/* Basic Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Basic Example</h2>
        
        <CodeBlock>{`// Set tempo
dj.bpm = 128;

// Create a counter
let tick = 0;

// Start a loop
dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat on offbeats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </section>

      {/* Core Concepts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Core Concepts</h2>
        
        <div className="grid gap-4">
          <Concept title="BPM" description="Set the tempo with dj.bpm = 128" />
          <Concept title="Loops" description="Create timed loops with dj.loop('16n', callback)" />
          <Concept title="Instruments" description="Trigger sounds with dj.kick, dj.snare, dj.hihat, etc." />
          <Concept title="Time" description="Use the time parameter for precise scheduling" />
        </div>
      </section>

      {/* Time Notation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Time Notation</h2>
        
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Notation</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr><td className="px-4 py-3 font-mono text-[#1db954]">'1m'</td><td className="px-4 py-3 text-zinc-300">1 measure (4 beats)</td></tr>
              <tr><td className="px-4 py-3 font-mono text-[#1db954]">'4n'</td><td className="px-4 py-3 text-zinc-300">Quarter note (1 beat)</td></tr>
              <tr><td className="px-4 py-3 font-mono text-[#1db954]">'8n'</td><td className="px-4 py-3 text-zinc-300">Eighth note (half beat)</td></tr>
              <tr><td className="px-4 py-3 font-mono text-[#1db954]">'16n'</td><td className="px-4 py-3 text-zinc-300">Sixteenth note</td></tr>
              <tr><td className="px-4 py-3 font-mono text-[#1db954]">'32n'</td><td className="px-4 py-3 text-zinc-300">Thirty-second note</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[#1db954]/20 text-[#1db954] flex items-center justify-center text-sm font-bold shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400">{children}</p>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-300">
      {children}
    </kbd>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
      <code className="text-sm text-zinc-300 font-mono">{children}</code>
    </pre>
  );
}

function Concept({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
}
