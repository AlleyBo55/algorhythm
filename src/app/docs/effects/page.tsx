export default function EffectsPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Effects Guide</h1>
        <p className="text-lg text-zinc-400">
          Add depth and character to your sound with built-in effects.
        </p>
      </div>

      {/* Available Effects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Available Effects</h2>
        
        <div className="grid gap-4">
          <EffectCard
            name="Reverb"
            description="Add space and depth to your sound"
            params={['wet: 0-1', 'decay: 0.1-10s', 'preDelay: 0-0.1s']}
          />
          <EffectCard
            name="Delay"
            description="Create echo and rhythmic repeats"
            params={['wet: 0-1', 'delayTime: 0-1s', 'feedback: 0-1']}
          />
          <EffectCard
            name="Filter"
            description="Shape the frequency content"
            params={['frequency: 20-20000Hz', 'type: lowpass/highpass/bandpass', 'Q: 0.1-20']}
          />
          <EffectCard
            name="Distortion"
            description="Add grit and harmonics"
            params={['wet: 0-1', 'distortion: 0-1']}
          />
          <EffectCard
            name="Chorus"
            description="Thicken and widen the sound"
            params={['wet: 0-1', 'frequency: 0.1-10Hz', 'depth: 0-1']}
          />
          <EffectCard
            name="Phaser"
            description="Sweeping phase modulation"
            params={['wet: 0-1', 'frequency: 0.1-10Hz', 'depth: 0-1']}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Usage</h2>
        
        <CodeBlock>{`// Add reverb to Deck A
dj.deck.A.effects.add('reverb', 'reverb');

// Configure the effect
const reverb = dj.deck.A.effects.get('reverb');
if (reverb) {
  reverb.wet = 0.3;
  reverb.decay = 2.5;
}

// Remove effect
dj.deck.A.effects.remove('reverb');`}</CodeBlock>
      </section>

      {/* Effect Chains */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Effect Chains</h2>
        <p className="text-zinc-400">
          Chain multiple effects together for complex sound design.
        </p>
        
        <CodeBlock>{`// Create an effect chain
dj.deck.A.effects.add('filter', 'filter');
dj.deck.A.effects.add('delay', 'delay');
dj.deck.A.effects.add('reverb', 'reverb');

// Effects are processed in order:
// Audio → Filter → Delay → Reverb → Output`}</CodeBlock>
      </section>
    </div>
  );
}

function EffectCard({
  name,
  description,
  params,
}: {
  name: string;
  description: string;
  params: string[];
}) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <h3 className="font-medium text-white mb-1">{name}</h3>
      <p className="text-sm text-zinc-500 mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {params.map(param => (
          <span key={param} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 font-mono">
            {param}
          </span>
        ))}
      </div>
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
