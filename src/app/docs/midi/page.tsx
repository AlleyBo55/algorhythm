export default function MIDIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">MIDI Controller Setup</h1>
        <p className="text-xl text-zinc-400">Use hardware DJ controllers with RhythmCode.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <div className="space-y-4">
          <Step num={1} title="Connect Your Controller">
            Plug in your MIDI controller via USB. Modern browsers support Web MIDI API.
          </Step>
          <Step num={2} title="Enable MIDI">
            <Code>{`await dj.midi.initialize();
const devices = dj.midi.getDevices();
console.log(devices);`}</Code>
          </Step>
          <Step num={3} title="Map Controls">
            <Code>{`// Map a knob to deck volume
dj.midi.map('knob', 1, (value) => {
  dj.deck.A.setVolume(value / 127);
});`}</Code>
          </Step>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Supported Controllers</h2>
        <div className="grid gap-4">
          <Controller
            name="Pioneer DDJ-400"
            status="Fully Supported"
            features={['2 Decks', 'Mixer', 'FX', 'Jog Wheels']}
          />
          <Controller
            name="Numark Mixtrack Pro"
            status="Fully Supported"
            features={['2 Decks', 'Mixer', 'Jog Wheels']}
          />
          <Controller
            name="Traktor Kontrol S2"
            status="Supported"
            features={['2 Decks', 'Mixer', 'FX']}
          />
          <Controller
            name="Generic MIDI Controller"
            status="Manual Mapping"
            features={['Custom mapping required']}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Control Mapping</h2>

        <Mapping
          title="Deck Controls"
          description="Map play, cue, sync, and transport controls"
        >
          <Code>{`// Play/Pause button
dj.midi.map('button', 0x01, () => {
  dj.deck.A.playing ? dj.deck.A.pause() : dj.deck.A.play();
});

// Cue button
dj.midi.map('button', 0x02, () => {
  dj.deck.A.seek(0);
});

// Sync button
dj.midi.map('button', 0x03, () => {
  dj.deck.A.sync();
});`}</Code>
        </Mapping>

        <Mapping
          title="Mixer Controls"
          description="Map faders, crossfader, and EQ knobs"
        >
          <Code>{`// Channel fader
dj.midi.map('fader', 0x10, (value) => {
  dj.mixer.setChannelVolume('A', value / 127);
});

// Crossfader
dj.midi.map('fader', 0x11, (value) => {
  const pos = (value / 127) * 2 - 1; // -1 to 1
  dj.mixer.setCrossfader(pos);
});

// EQ knobs
dj.midi.map('knob', 0x20, (value) => {
  const gain = (value / 127) * 24 - 12; // -12 to +12dB
  dj.deck.A.eq.setHigh(gain);
});`}</Code>
        </Mapping>

        <Mapping
          title="Jog Wheels"
          description="Map jog wheels for scratching and nudging"
        >
          <Code>{`// Jog wheel (touch sensitive)
let jogTouched = false;

dj.midi.map('button', 0x30, (value) => {
  jogTouched = value > 0;
  if (jogTouched) {
    dj.deck.A.vinyl.enable();
  } else {
    dj.deck.A.vinyl.disable();
  }
});

dj.midi.map('encoder', 0x31, (delta) => {
  if (jogTouched) {
    // Scratch mode
    dj.deck.A.vinyl.scratch(delta * 0.01, 0.1);
  } else {
    // Pitch bend mode
    dj.deck.A.pitchBend(delta * 0.001);
  }
});`}</Code>
        </Mapping>

        <Mapping
          title="Hot Cues"
          description="Map pads to hot cue points"
        >
          <Code>{`// 8 hot cue pads
for (let i = 0; i < 8; i++) {
  dj.midi.map('pad', 0x40 + i, () => {
    if (dj.deck.A.cue.exists(i + 1)) {
      dj.deck.A.cue.jump(i + 1);
    } else {
      dj.deck.A.cue.set(i + 1, dj.deck.A.position);
    }
  });
}`}</Code>
        </Mapping>

        <Mapping
          title="Loop Controls"
          description="Map loop in/out and loop size controls"
        >
          <Code>{`// Loop in/out
dj.midi.map('button', 0x50, () => {
  dj.deck.A.loop.enable();
});

dj.midi.map('button', 0x51, () => {
  dj.deck.A.loop.disable();
});

// Loop size
dj.midi.map('button', 0x52, () => {
  dj.deck.A.loop.halve();
});

dj.midi.map('button', 0x53, () => {
  dj.deck.A.loop.double();
});`}</Code>
        </Mapping>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Advanced Techniques</h2>

        <Technique
          title="LED Feedback"
          description="Send feedback to controller LEDs"
        >
          <Code>{`// Update play button LED
dj.midi.sendLED(0x01, dj.deck.A.playing ? 127 : 0);

// Sync LED with beat
dj.loop('4n', () => {
  dj.midi.sendLED(0x10, 127);
  setTimeout(() => dj.midi.sendLED(0x10, 0), 50);
});`}</Code>
        </Technique>

        <Technique
          title="Multi-Function Buttons"
          description="Use shift key for secondary functions"
        >
          <Code>{`let shiftPressed = false;

dj.midi.map('button', 0x60, (value) => {
  shiftPressed = value > 0;
});

dj.midi.map('button', 0x01, () => {
  if (shiftPressed) {
    // Shift + Play = Load track
    dj.deck.A.load('/audio/track.mp3');
  } else {
    // Play/Pause
    dj.deck.A.playing ? dj.deck.A.pause() : dj.deck.A.play();
  }
});`}</Code>
        </Technique>

        <Technique
          title="Custom Presets"
          description="Save and load controller mappings"
        >
          <Code>{`// Save mapping
const mapping = dj.midi.exportMapping();
localStorage.setItem('midi-mapping', JSON.stringify(mapping));

// Load mapping
const saved = JSON.parse(localStorage.getItem('midi-mapping'));
dj.midi.importMapping(saved);`}</Code>
        </Technique>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
        <div className="space-y-3">
          <Issue
            problem="Controller not detected"
            solution="Check USB connection and browser permissions. Chrome/Edge have best MIDI support."
          />
          <Issue
            problem="Wrong MIDI messages"
            solution="Use MIDI monitor to identify correct CC numbers: dj.midi.monitor()"
          />
          <Issue
            problem="Latency issues"
            solution="Reduce audio buffer size in settings. Use wired USB, not Bluetooth."
          />
          <Issue
            problem="Jog wheel not smooth"
            solution="Increase encoder resolution in mapping or adjust sensitivity multiplier."
          />
        </div>
      </section>
    </div>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold shrink-0">
        {num}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-2">{title}</h4>
        <div className="text-zinc-300 text-sm">{children}</div>
      </div>
    </div>
  );
}

function Controller({ name, status, features }: { name: string; status: string; features: string[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{name}</h4>
        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{status}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map(f => (
          <span key={f} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">{f}</span>
        ))}
      </div>
    </div>
  );
}

function Mapping({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-zinc-400 mb-3">{description}</p>
      {children}
    </div>
  );
}

function Technique({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-zinc-400 mb-3">{description}</p>
      {children}
    </div>
  );
}

function Issue({ problem, solution }: { problem: string; solution: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="font-semibold text-red-400 mb-1">❌ {problem}</div>
      <div className="text-sm text-zinc-300">✅ {solution}</div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 overflow-x-auto">
      <code className="text-xs text-blue-300">{children}</code>
    </pre>
  );
}
