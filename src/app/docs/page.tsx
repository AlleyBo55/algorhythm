import { Code2, Zap, Music4, Sparkles } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Getting Started with RhythmCode</h1>
        <p className="text-xl text-zinc-400">
          The world's first code-based professional DJ platform. Mix like a pro, code like an artist.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FeatureCard
          icon={<Code2 className="w-6 h-6" />}
          title="Code-First"
          description="Control every aspect of your mix with JavaScript/TypeScript"
        />
        <FeatureCard
          icon={<Music4 className="w-6 h-6" />}
          title="Professional Audio"
          description="32-bit float, 48kHz processing. Studio-grade quality."
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Real-Time"
          description="<15ms latency. Perform live with confidence."
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Creative FX"
          description="Studio-quality effects and filters at your fingertips"
        />
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        
        <div className="space-y-4">
          <Step number={1} title="Initialize the System">
            <p>Click the <code>INITIALIZE_SYSTEM</code> button or run:</p>
            <CodeBlock>{`await dj.engine.initialize();`}</CodeBlock>
          </Step>

          <Step number={2} title="Load a Track">
            <p>Load audio into any deck (A, B, C, or D):</p>
            <CodeBlock>{`await dj.deck.A.load('path/to/track.mp3');`}</CodeBlock>
          </Step>

          <Step number={3} title="Write Your First Loop">
            <p>Create a simple 4-beat pattern:</p>
            <CodeBlock>{`let tick = 0;

dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat on offbeats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '16n', time);
  }
  
  tick++;
});`}</CodeBlock>
          </Step>

          <Step number={4} title="Run and Mix">
            <p>Press <kbd>Shift+Enter</kbd> or click <code>RUN_EXEC</code> to start your code.</p>
          </Step>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Core Concepts</h2>
        
        <div className="space-y-4">
          <Concept title="The DJ Object">
            <p>
              The global <code>dj</code> object is your main interface. It provides access to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li><code>dj.deck.A/B/C/D</code> - Four professional decks</li>
              <li><code>dj.mixer</code> - 4-channel mixer with EQ and crossfader</li>
              <li><code>dj.effects</code> - Studio-quality FX chain</li>
              <li><code>dj.bpm</code> - Global tempo control</li>
            </ul>
          </Concept>

          <Concept title="Timing & Loops">
            <p>
              Use <code>dj.loop()</code> for precise timing. Supports Tone.js notation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li><code>'4n'</code> - Quarter note (1 beat)</li>
              <li><code>'8n'</code> - Eighth note (1/2 beat)</li>
              <li><code>'16n'</code> - Sixteenth note (1/4 beat)</li>
              <li><code>'1m'</code> - One measure (4 beats)</li>
            </ul>
          </Concept>

          <Concept title="Audio Quality">
            <p>RhythmCode uses professional-grade audio processing:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li>32-bit float precision</li>
              <li>48kHz sample rate</li>
              <li>{'<'}15ms latency (Pioneer CDJ grade)</li>
              <li>Studio-quality DSP algorithms</li>
            </ul>
          </Concept>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <div className="grid gap-4">
          <NextStepCard
            title="Explore API Reference"
            description="Learn all available methods and properties"
            href="/docs/api"
          />
          <NextStepCard
            title="DJ Techniques"
            description="Master professional mixing techniques"
            href="/docs/techniques"
          />
          <NextStepCard
            title="Browse Examples"
            description="40+ templates from Avicii to Daft Punk"
            href="/docs/examples"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="text-blue-400 mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-zinc-300 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
      <code className="text-sm text-blue-300">{children}</code>
    </pre>
  );
}

function Concept({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="text-sm text-zinc-300 space-y-2">{children}</div>
    </div>
  );
}

function NextStepCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="block bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-blue-600 transition-colors"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </a>
  );
}
