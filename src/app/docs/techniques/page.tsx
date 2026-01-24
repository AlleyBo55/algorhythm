export default function TechniquesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">DJ Techniques</h1>
        <p className="text-xl text-zinc-400">Master professional mixing techniques with code.</p>
      </div>

      <Technique
        title="Beatmatching"
        difficulty="Beginner"
        description="Sync two tracks to the same tempo and phase"
      >
        <Code>{`// Manual beatmatching
dj.deck.A.setBPM(128);
dj.deck.B.setBPM(128);

// Or use auto-sync
dj.deck.B.sync();`}</Code>
      </Technique>

      <Technique
        title="EQ Mixing"
        difficulty="Beginner"
        description="Blend tracks using frequency isolation"
      >
        <Code>{`// Classic bass swap
dj.deck.A.eq.setLow(-Infinity); // Kill A bass
dj.deck.B.eq.setLow(0);          // B bass full

// Gradually swap over 8 bars
let bar = 0;
dj.loop('1m', () => {
  const progress = bar / 8;
  dj.deck.A.eq.setLow(-Infinity * progress);
  dj.deck.B.eq.setLow(0);
  bar++;
});`}</Code>
      </Technique>

      <Technique
        title="Crossfader Transition"
        difficulty="Beginner"
        description="Smooth transition between decks"
      >
        <Code>{`// 16-beat crossfade from A to B
let beat = 0;
dj.loop('4n', () => {
  const progress = beat / 16;
  dj.mixer.setCrossfader(-1 + (progress * 2));
  beat++;
  if (beat > 16) beat = 16;
});`}</Code>
      </Technique>

      <Technique
        title="Filter Sweep"
        difficulty="Intermediate"
        description="Create tension with filter automation"
      >
        <Code>{`// Low-pass filter sweep over 32 beats
let tick = 0;
dj.loop('4n', () => {
  const freq = 20000 - (tick / 32) * 19500;
  dj.deck.A.filter.frequency.value = freq;
  tick++;
});`}</Code>
      </Technique>

      <Technique
        title="Echo Out"
        difficulty="Intermediate"
        description="Classic delay-based outro"
      >
        <Code>{`// Gradually increase delay feedback
dj.effects.delay.set({
  wet: 0.5,
  delayTime: '8n',
  feedback: 0.3
});

let bar = 0;
dj.loop('1m', () => {
  const feedback = 0.3 + (bar / 8) * 0.6;
  dj.effects.delay.feedback.value = feedback;
  
  // Fade out volume
  const vol = 1 - (bar / 8);
  dj.deck.A.setVolume(vol);
  bar++;
});`}</Code>
      </Technique>

      <Technique
        title="Loop Roll"
        difficulty="Intermediate"
        description="Create rhythmic tension with shrinking loops"
      >
        <Code>{`// Start with 8-beat loop, halve every 2 bars
dj.deck.A.loop.set(32, 8);
dj.deck.A.loop.enable();

let bar = 0;
dj.loop('1m', () => {
  if (bar % 2 === 0 && bar > 0) {
    dj.deck.A.loop.halve();
  }
  bar++;
});`}</Code>
      </Technique>

      <Technique
        title="Harmonic Mixing"
        difficulty="Advanced"
        description="Mix tracks in compatible keys"
      >
        <Code>{`// Check key compatibility
const keyA = dj.deck.A.key; // e.g., '5A'
const keyB = dj.deck.B.key; // e.g., '6A'

// Compatible if:
// - Same number (5A + 5B)
// - Adjacent numbers (5A + 6A or 4A)
// - +7 semitones (5A + 12A)

if (isCompatible(keyA, keyB)) {
  dj.deck.B.play();
}`}</Code>
      </Technique>

      <Technique
        title="Build-Up & Drop"
        difficulty="Advanced"
        description="Create energy with filter + reverb"
      >
        <Code>{`// 16-beat build-up
let beat = 0;
dj.loop('4n', () => {
  const progress = beat / 16;
  
  // Filter sweep
  dj.deck.A.filter.frequency.value = 20000 - (progress * 19000);
  
  // Increase reverb
  dj.effects.reverb.wet.value = progress * 0.8;
  
  // Drop on beat 16
  if (beat === 16) {
    dj.deck.A.filter.frequency.value = 20000;
    dj.effects.reverb.wet.value = 0;
    dj.deck.B.play(); // Drop new track
  }
  
  beat++;
});`}</Code>
      </Technique>

      <Technique
        title="Scratch Pattern"
        difficulty="Advanced"
        description="Programmatic scratching"
      >
        <Code>{`// Baby scratch pattern
dj.deck.A.vinyl.enable();

let tick = 0;
dj.loop('16n', () => {
  if (tick % 4 === 0) {
    dj.deck.A.vinyl.scratch(0.5, 0.1); // Forward
  } else if (tick % 4 === 2) {
    dj.deck.A.vinyl.scratch(-0.5, 0.1); // Backward
  }
  tick++;
});`}</Code>
      </Technique>

      <Technique
        title="Acapella Layering"
        difficulty="Advanced"
        description="Layer vocals over instrumental"
      >
        <Code>{`// Load acapella on deck C
await dj.deck.C.load('/vocals/acapella.mp3');

// Kill all but highs (isolate vocals)
dj.deck.C.eq.setLow(-Infinity);
dj.deck.C.eq.setMid(-12);
dj.deck.C.eq.setHigh(0);

// Sync to instrumental
dj.deck.C.sync();
dj.deck.C.play();`}</Code>
      </Technique>

      <section>
        <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
        <div className="space-y-3">
          <Tip title="Use Cue Points">
            Set hot cues at key moments (drops, vocals, breaks) for instant access during performance.
          </Tip>
          <Tip title="Monitor Your Mix">
            Always check the waveform and spectrum analyzer to avoid clipping and frequency clashes.
          </Tip>
          <Tip title="Practice Timing">
            Most transitions work best on phrase boundaries (every 8, 16, or 32 beats).
          </Tip>
          <Tip title="Less is More">
            Don't overuse effects. Subtle changes often have more impact than extreme processing.
          </Tip>
        </div>
      </section>
    </div>
  );
}

function Technique({ title, difficulty, description, children }: {
  title: string;
  difficulty: string;
  description: string;
  children: React.ReactNode;
}) {
  const color = difficulty === 'Beginner' ? 'green' : difficulty === 'Intermediate' ? 'yellow' : 'red';
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-500/20 text-${color}-400`}>
          {difficulty}
        </span>
      </div>
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

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h4 className="font-semibold mb-1 text-blue-400">{title}</h4>
      <p className="text-sm text-zinc-300">{children}</p>
    </div>
  );
}
