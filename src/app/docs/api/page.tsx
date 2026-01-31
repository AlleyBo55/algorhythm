export default function APIPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">API Reference</h1>
        <p className="text-lg text-zinc-400">
          Complete reference for the Algorhythm DJ API.
        </p>
      </div>

      {/* Global */}
      <Section title="Global">
        <APIItem
          name="dj.bpm"
          type="number"
          description="Set or get the global tempo in beats per minute."
          example="dj.bpm = 128;"
        />
        <APIItem
          name="dj.stop()"
          type="function"
          description="Stop all playback and loops."
          example="dj.stop();"
        />
      </Section>

      {/* Loops */}
      <Section title="Loops">
        <APIItem
          name="dj.loop(interval, callback)"
          type="function"
          description="Create a timed loop that fires at the specified interval."
          example={`dj.loop('16n', (time) => {
  // Your code here
});`}
        />
      </Section>

      {/* Instruments */}
      <Section title="Instruments">
        <APIItem
          name="dj.kick"
          type="Sampler"
          description="Kick drum sampler."
          example="dj.kick.triggerAttackRelease('C1', '8n', time);"
        />
        <APIItem
          name="dj.snare"
          type="Sampler"
          description="Snare drum sampler."
          example="dj.snare.triggerAttackRelease('C1', '8n', time);"
        />
        <APIItem
          name="dj.hihat"
          type="Sampler"
          description="Hi-hat sampler."
          example="dj.hihat.triggerAttackRelease('C1', '32n', time);"
        />
        <APIItem
          name="dj.synth"
          type="Synth"
          description="Polyphonic synthesizer."
          example="dj.synth.triggerAttackRelease('C4', '4n', time);"
        />
        <APIItem
          name="dj.bass"
          type="Synth"
          description="Bass synthesizer."
          example="dj.bass.triggerAttackRelease('E2', '8n', time);"
        />
      </Section>

      {/* Decks */}
      <Section title="Decks">
        <APIItem
          name="dj.deck.A / B / C / D"
          type="Deck"
          description="Access individual decks for track playback."
          example={`await dj.deck.A.load(file);
dj.deck.A.play();
dj.deck.A.pause();
dj.deck.A.stop();`}
        />
        <APIItem
          name="deck.volume"
          type="number"
          description="Set deck volume in dB (-60 to 12)."
          example="dj.deck.A.volume = -6;"
        />
        <APIItem
          name="deck.eq"
          type="object"
          description="3-band EQ control."
          example={`dj.deck.A.eq.high = 3;  // +3dB
dj.deck.A.eq.mid = 0;   // 0dB
dj.deck.A.eq.low = -6;  // -6dB`}
        />
      </Section>

      {/* Mixer */}
      <Section title="Mixer">
        <APIItem
          name="dj.crossfader.position"
          type="number"
          description="Crossfader position (-1 to 1). -1 = Deck A, 1 = Deck B."
          example="dj.crossfader.position = 0; // Center"
        />
        <APIItem
          name="dj.master.volume"
          type="number"
          description="Master output volume in dB."
          example="dj.master.volume = 0;"
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function APIItem({
  name,
  type,
  description,
  example,
}: {
  name: string;
  type: string;
  description: string;
  example: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
      <div className="flex items-center gap-3">
        <code className="text-[#1db954] font-mono font-medium">{name}</code>
        <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">{type}</span>
      </div>
      <p className="text-sm text-zinc-400">{description}</p>
      <pre className="p-3 bg-zinc-950 rounded-lg overflow-x-auto">
        <code className="text-xs text-zinc-300 font-mono">{example}</code>
      </pre>
    </div>
  );
}
