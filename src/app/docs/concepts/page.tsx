export default function ConceptsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Core Concepts</h1>
        <p className="text-xl text-zinc-400">Understand the fundamentals of RhythmCode.</p>
      </div>

      <Concept
        title="Audio Engine Architecture"
        description="RhythmCode uses Tone.js (Web Audio API) for professional-grade audio processing"
      >
        <div className="space-y-3">
          <Feature title="32-bit Float Processing">
            All audio is processed at 32-bit float precision for maximum dynamic range and headroom.
          </Feature>
          <Feature title="48kHz Sample Rate">
            Studio-standard sample rate ensures high-frequency accuracy and low aliasing.
          </Feature>
          <Feature title="<15ms Latency">
            Optimized buffer sizes provide Pioneer CDJ-grade latency for live performance.
          </Feature>
          <Feature title="Real-Time DSP">
            All effects and processing happen in real-time with zero pre-rendering.
          </Feature>
        </div>
      </Concept>

      <Concept
        title="Timing & Synchronization"
        description="Precise timing is critical for professional DJ mixing"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            RhythmCode uses Tone.js Transport for sample-accurate timing. All loops and events are scheduled ahead of time to prevent timing drift.
          </p>
          <Code>{`// Time notation (Tone.js format)
'4n'  // Quarter note (1 beat)
'8n'  // Eighth note (1/2 beat)
'16n' // Sixteenth note (1/4 beat)
'1m'  // One measure (4 beats)
'2t'  // Eighth note triplet

// Schedule events precisely
dj.loop('16n', (time) => {
  // 'time' is the exact moment this should trigger
  dj.kick.triggerAttackRelease('C1', '8n', time);
});`}</Code>
        </div>
      </Concept>

      <Concept
        title="Deck System"
        description="Four independent decks with full DJ functionality"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Each deck (A, B, C, D) is a complete audio player with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4">
            <li>Independent playback control</li>
            <li>3-band EQ (isolator-style)</li>
            <li>8 hot cue points</li>
            <li>Loop controls (set, double, halve)</li>
            <li>Time stretching (change tempo without pitch)</li>
            <li>Key detection for harmonic mixing</li>
            <li>Beat sync and phase alignment</li>
          </ul>
        </div>
      </Concept>

      <Concept
        title="Mixer Architecture"
        description="Professional 4-channel mixer with crossfader"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            The mixer combines all four decks with individual channel controls:
          </p>
          <Code>{`// Signal flow
Deck A → Channel Fader A → EQ A → Crossfader A
Deck B → Channel Fader B → EQ B → Crossfader B
Deck C → Channel Fader C → EQ C → (No crossfader)
Deck D → Channel Fader D → EQ D → (No crossfader)
                                    ↓
                            Master Effects
                                    ↓
                            Master Volume
                                    ↓
                               Output`}</Code>
        </div>
      </Concept>

      <Concept
        title="Effects Chain"
        description="Studio-quality effects processing"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Effects are applied to the master output and can be automated in real-time:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <EffectCard name="Reverb" desc="Space and depth" />
            <EffectCard name="Delay" desc="Rhythmic echo" />
            <EffectCard name="Filter" desc="Frequency shaping" />
            <EffectCard name="Distortion" desc="Harmonic saturation" />
            <EffectCard name="Phaser" desc="Sweeping phase" />
            <EffectCard name="Chorus" desc="Thickening" />
            <EffectCard name="Bitcrusher" desc="Lo-fi degradation" />
            <EffectCard name="Compressor" desc="Dynamic control" />
          </div>
        </div>
      </Concept>

      <Concept
        title="Beat Detection & Analysis"
        description="Automatic track analysis for intelligent mixing"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            When you load a track, RhythmCode automatically analyzes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-4">
            <li><strong>BPM</strong> - Tempo detection using autocorrelation</li>
            <li><strong>Beat Grid</strong> - Precise beat positions for sync</li>
            <li><strong>Musical Key</strong> - Camelot wheel notation (e.g., 5A, 8B)</li>
            <li><strong>Waveform</strong> - Visual representation for navigation</li>
            <li><strong>Energy</strong> - Track intensity over time</li>
          </ul>
        </div>
      </Concept>

      <Concept
        title="Harmonic Mixing"
        description="Mix tracks in compatible musical keys"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            RhythmCode uses the Camelot Wheel system for key compatibility:
          </p>
          <Code>{`// Compatible key combinations
Same number: 5A + 5B (relative major/minor)
Adjacent:    5A + 6A or 4A (±1 semitone)
+7:          5A + 12A (perfect fifth)

// Check compatibility
const keyA = dj.deck.A.key; // '5A'
const keyB = dj.deck.B.key; // '6A'

if (isCompatible(keyA, keyB)) {
  console.log('✅ Keys are compatible');
}`}</Code>
        </div>
      </Concept>

      <Concept
        title="Loop System"
        description="Precise loop control for creative mixing"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Loops are quantized to beat boundaries for perfect timing:
          </p>
          <Code>{`// Set 8-beat loop at 32 seconds
dj.deck.A.loop.set(32, 8);
dj.deck.A.loop.enable();

// Manipulate loop length
dj.deck.A.loop.double(); // 8 → 16 beats
dj.deck.A.loop.halve();  // 16 → 8 beats

// Loop roll (temporary loop)
dj.deck.A.loop.roll(4); // 4-beat roll`}</Code>
        </div>
      </Concept>

      <Concept
        title="Hot Cues"
        description="Instant navigation to key moments"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Each deck has 8 hot cue points for instant jumps:
          </p>
          <Code>{`// Set cue points at key moments
dj.deck.A.cue.set(1, 0);    // Intro
dj.deck.A.cue.set(2, 32);   // First drop
dj.deck.A.cue.set(3, 96);   // Breakdown
dj.deck.A.cue.set(4, 128);  // Second drop

// Jump to cue point
dj.deck.A.cue.jump(2); // Jump to first drop`}</Code>
        </div>
      </Concept>

      <Concept
        title="Vinyl Mode & Scratching"
        description="Turntablism support for scratch DJs"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Enable vinyl mode for realistic turntable behavior:
          </p>
          <Code>{`// Enable vinyl mode
dj.deck.A.vinyl.enable();

// Scratch (speed, duration)
dj.deck.A.vinyl.scratch(0.5, 0.1);  // Forward
dj.deck.A.vinyl.scratch(-0.5, 0.1); // Backward

// Backspin
dj.deck.A.vinyl.backspin(2.0); // 2 second backspin`}</Code>
        </div>
      </Concept>

      <Concept
        title="Recording & Export"
        description="Capture your mixes in high quality"
      >
        <div className="space-y-3">
          <p className="text-zinc-300">
            Record master output and export in multiple formats:
          </p>
          <Code>{`// Start recording
dj.recorder.start();

// ... perform your mix ...

// Stop and export
const blob = await dj.recorder.stop();

// Export as WAV (24-bit) or MP3 (320kbps)
const wav = await dj.recorder.export('wav');
const mp3 = await dj.recorder.export('mp3');

// Download
const url = URL.createObjectURL(mp3);
const a = document.createElement('a');
a.href = url;
a.download = 'my-mix.mp3';
a.click();`}</Code>
        </div>
      </Concept>

      <Concept
        title="Performance Optimization"
        description="Best practices for smooth performance"
      >
        <div className="space-y-3">
          <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
            <li><strong>Use scheduled timing</strong> - Always pass <code>time</code> parameter to trigger methods</li>
            <li><strong>Avoid blocking operations</strong> - Don't use heavy computations in audio callbacks</li>
            <li><strong>Preload tracks</strong> - Load tracks before you need them to avoid stuttering</li>
            <li><strong>Limit effect chains</strong> - Too many effects can cause CPU spikes</li>
            <li><strong>Use appropriate buffer size</strong> - Balance latency vs. stability</li>
          </ul>
        </div>
      </Concept>
    </div>
  );
}

function Concept({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 mb-4">{description}</p>
      {children}
    </div>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-3">
      <h4 className="font-semibold text-blue-400 mb-1">{title}</h4>
      <p className="text-sm text-zinc-300">{children}</p>
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

function EffectCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-zinc-950 border border-zinc-700 rounded p-2">
      <div className="font-semibold text-sm text-purple-400">{name}</div>
      <div className="text-xs text-zinc-400">{desc}</div>
    </div>
  );
}
