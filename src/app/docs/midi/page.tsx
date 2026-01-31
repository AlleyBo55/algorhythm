export default function MIDIPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">MIDI Setup</h1>
        <p className="text-lg text-zinc-400">
          Connect hardware controllers for hands-on control.
        </p>
      </div>

      {/* Getting Started */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Getting Started</h2>
        <p className="text-zinc-400">
          Algorhythm supports Web MIDI API for connecting hardware controllers directly in the browser.
        </p>
        
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-400">
            Note: Web MIDI requires HTTPS and a compatible browser (Chrome, Edge, Opera).
          </p>
        </div>
      </section>

      {/* Connecting */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Connecting a Controller</h2>
        
        <CodeBlock>{`// Request MIDI access
const midi = await navigator.requestMIDIAccess();

// List available devices
midi.inputs.forEach((input) => {
  console.log(input.name);
});

// Listen for MIDI messages
midi.inputs.forEach((input) => {
  input.onmidimessage = (msg) => {
    const [status, note, velocity] = msg.data;
    console.log({ status, note, velocity });
  };
});`}</CodeBlock>
      </section>

      {/* Mapping */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">MIDI Mapping</h2>
        <p className="text-zinc-400">
          Map MIDI controls to Algorhythm parameters.
        </p>
        
        <CodeBlock>{`// Example: Map a fader to crossfader
function handleMIDI(msg) {
  const [status, cc, value] = msg.data;
  
  // CC messages are 176-191 (channels 1-16)
  if (status >= 176 && status <= 191) {
    // CC 1 = Crossfader
    if (cc === 1) {
      // Convert 0-127 to -1 to 1
      dj.crossfader.position = (value / 127) * 2 - 1;
    }
    
    // CC 2 = Master Volume
    if (cc === 2) {
      // Convert 0-127 to -60 to 12 dB
      dj.master.volume = (value / 127) * 72 - 60;
    }
  }
}`}</CodeBlock>
      </section>

      {/* Common Controllers */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Supported Controllers</h2>
        <p className="text-zinc-400">
          Any class-compliant MIDI controller should work. Popular options include:
        </p>
        
        <div className="grid gap-3">
          <ControllerCard name="Novation Launchpad" type="Grid Controller" />
          <ControllerCard name="Akai APC40" type="DJ Controller" />
          <ControllerCard name="Native Instruments Traktor" type="DJ Controller" />
          <ControllerCard name="Arturia KeyStep" type="Keyboard" />
          <ControllerCard name="Korg nanoKONTROL" type="Fader Controller" />
        </div>
      </section>
    </div>
  );
}

function ControllerCard({ name, type }: { name: string; type: string }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
      <span className="font-medium text-white">{name}</span>
      <span className="text-sm text-zinc-500">{type}</span>
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
