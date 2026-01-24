export default function EffectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Effects Guide</h1>
        <p className="text-xl text-zinc-400">Studio-quality effects for creative mixing.</p>
      </div>

      <Effect
        name="Reverb"
        description="Add space and depth to your mix"
        params={['wet: 0-1', 'decay: 0.1-10s', 'preDelay: 0-0.1s']}
      >
        <Code>{`// Subtle room reverb
dj.effects.reverb.set({
  wet: 0.2,
  decay: 1.5,
  preDelay: 0.01
});

// Large hall
dj.effects.reverb.set({
  wet: 0.5,
  decay: 4.0,
  preDelay: 0.05
});`}</Code>
      </Effect>

      <Effect
        name="Delay"
        description="Rhythmic echo effect"
        params={['wet: 0-1', 'delayTime: time notation', 'feedback: 0-0.95']}
      >
        <Code>{`// 1/8 note delay
dj.effects.delay.set({
  wet: 0.4,
  delayTime: '8n',
  feedback: 0.5
});

// Ping-pong delay
dj.effects.delay.set({
  wet: 0.6,
  delayTime: '16n',
  feedback: 0.7
});`}</Code>
      </Effect>

      <Effect
        name="Filter"
        description="Shape frequency content"
        params={['type: lowpass/highpass/bandpass', 'frequency: 20-20000Hz', 'Q: 0.1-20']}
      >
        <Code>{`// Low-pass filter (remove highs)
dj.effects.filter.set({
  type: 'lowpass',
  frequency: 1000,
  Q: 1
});

// High-pass filter (remove lows)
dj.effects.filter.set({
  type: 'highpass',
  frequency: 500,
  Q: 1
});`}</Code>
      </Effect>

      <Effect
        name="Distortion"
        description="Add harmonic saturation"
        params={['wet: 0-1', 'distortion: 0-1', 'oversample: none/2x/4x']}
      >
        <Code>{`// Subtle warmth
dj.effects.distortion.set({
  wet: 0.3,
  distortion: 0.2,
  oversample: '2x'
});

// Heavy distortion
dj.effects.distortion.set({
  wet: 0.8,
  distortion: 0.9,
  oversample: '4x'
});`}</Code>
      </Effect>

      <Effect
        name="Phaser"
        description="Sweeping phase effect"
        params={['wet: 0-1', 'frequency: 0.1-10Hz', 'octaves: 1-8', 'baseFrequency: 200-2000Hz']}
      >
        <Code>{`// Classic phaser
dj.effects.phaser.set({
  wet: 0.5,
  frequency: 0.5,
  octaves: 3,
  baseFrequency: 350
});`}</Code>
      </Effect>

      <Effect
        name="Chorus"
        description="Thicken and widen sound"
        params={['wet: 0-1', 'frequency: 0.5-10Hz', 'delayTime: 2-20ms', 'depth: 0-1']}
      >
        <Code>{`// Subtle chorus
dj.effects.chorus.set({
  wet: 0.4,
  frequency: 1.5,
  delayTime: 3.5,
  depth: 0.7
});`}</Code>
      </Effect>

      <Effect
        name="Bitcrusher"
        description="Lo-fi digital degradation"
        params={['wet: 0-1', 'bits: 1-16']}
      >
        <Code>{`// 8-bit sound
dj.effects.bitcrusher.set({
  wet: 0.8,
  bits: 8
});`}</Code>
      </Effect>

      <section>
        <h2 className="text-2xl font-bold mb-4">Effect Chains</h2>
        <p className="text-zinc-300 mb-4">Combine multiple effects for unique sounds.</p>

        <Chain
          title="Dub Echo"
          description="Classic dub reggae delay effect"
        >
          <Code>{`// Filter + Delay + Reverb
dj.effects.filter.set({ type: 'lowpass', frequency: 2000 });
dj.effects.delay.set({ wet: 0.6, delayTime: '8n', feedback: 0.7 });
dj.effects.reverb.set({ wet: 0.3, decay: 3.0 });`}</Code>
        </Chain>

        <Chain
          title="Telephone Effect"
          description="Narrow bandwidth for radio/phone sound"
        >
          <Code>{`// Bandpass + Distortion
dj.effects.filter.set({ type: 'bandpass', frequency: 1000, Q: 5 });
dj.effects.distortion.set({ wet: 0.4, distortion: 0.3 });`}</Code>
        </Chain>

        <Chain
          title="Space Pad"
          description="Ambient, atmospheric sound"
        >
          <Code>{`// Reverb + Chorus + Delay
dj.effects.reverb.set({ wet: 0.6, decay: 5.0 });
dj.effects.chorus.set({ wet: 0.5, frequency: 0.3 });
dj.effects.delay.set({ wet: 0.3, delayTime: '4n', feedback: 0.4 });`}</Code>
        </Chain>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Automation Techniques</h2>

        <Automation
          title="Filter Sweep"
          description="Gradually change filter frequency"
        >
          <Code>{`let tick = 0;
dj.loop('16n', () => {
  const freq = 200 + Math.sin(tick * 0.1) * 1800;
  dj.effects.filter.frequency.value = freq;
  tick++;
});`}</Code>
        </Automation>

        <Automation
          title="Delay Throw"
          description="Momentary delay burst"
        >
          <Code>{`// Trigger on specific beat
let beat = 0;
dj.loop('4n', () => {
  if (beat % 16 === 15) {
    dj.effects.delay.wet.value = 0.8;
    dj.effects.delay.feedback.value = 0.9;
  } else {
    dj.effects.delay.wet.value = 0;
  }
  beat++;
});`}</Code>
        </Automation>

        <Automation
          title="Reverb Build"
          description="Increase reverb for tension"
        >
          <Code>{`let bar = 0;
dj.loop('1m', () => {
  const wet = (bar / 8) * 0.8;
  dj.effects.reverb.wet.value = wet;
  bar++;
});`}</Code>
        </Automation>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
        <div className="space-y-3">
          <Tip>Use effects sparingly - less is more in professional mixes</Tip>
          <Tip>Automate effect parameters for dynamic, evolving sounds</Tip>
          <Tip>Match delay times to song tempo for rhythmic coherence</Tip>
          <Tip>Use high-pass filters to prevent bass buildup in reverb/delay</Tip>
          <Tip>Bypass effects during drops for maximum impact</Tip>
        </div>
      </section>
    </div>
  );
}

function Effect({ name, description, params, children }: {
  name: string;
  description: string;
  params: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-zinc-400 text-sm mb-3">{description}</p>
      <div className="mb-4">
        <div className="text-xs font-semibold text-zinc-500 mb-2">PARAMETERS</div>
        <div className="flex flex-wrap gap-2">
          {params.map(param => (
            <code key={param} className="px-2 py-1 bg-zinc-950 rounded text-xs text-blue-400">
              {param}
            </code>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

function Chain({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-zinc-400 mb-3">{description}</p>
      {children}
    </div>
  );
}

function Automation({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-zinc-400 mb-3">{description}</p>
      {children}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 overflow-x-auto">
      <code className="text-sm text-blue-300">{children}</code>
    </pre>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-lg p-3">
      <span className="text-blue-400 text-xl">💡</span>
      <p className="text-sm text-zinc-300">{children}</p>
    </div>
  );
}
