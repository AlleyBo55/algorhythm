export default function APIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-zinc-400">Complete reference for all Algorhythm APIs.</p>
      </div>

      <APISection title="dj.engine">
        <Method name="initialize()" returns="Promise<void>" desc="Initialize audio engine">
          <Code>{`await dj.engine.initialize();`}</Code>
        </Method>
        <Method name="start()" returns="void" desc="Start playback">
          <Code>{`dj.engine.start();`}</Code>
        </Method>
        <Method name="stop()" returns="void" desc="Stop playback">
          <Code>{`dj.engine.stop();`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.deck (A/B/C/D)">
        <Method name="load(url)" returns="Promise<void>" desc="Load audio file">
          <Code>{`await dj.deck.A.load('/audio/track.mp3');`}</Code>
        </Method>
        <Method name="play()" returns="void" desc="Start playing">
          <Code>{`dj.deck.A.play();`}</Code>
        </Method>
        <Method name="pause()" returns="void" desc="Pause playback">
          <Code>{`dj.deck.A.pause();`}</Code>
        </Method>
        <Method name="seek(position)" returns="void" desc="Jump to position (seconds)">
          <Code>{`dj.deck.A.seek(30);`}</Code>
        </Method>
        <Method name="setVolume(level)" returns="void" desc="Set volume 0-1">
          <Code>{`dj.deck.A.setVolume(0.8);`}</Code>
        </Method>
        <Method name="setBPM(bpm)" returns="void" desc="Set tempo">
          <Code>{`dj.deck.A.setBPM(128);`}</Code>
        </Method>
        <Method name="sync()" returns="void" desc="Sync to master">
          <Code>{`dj.deck.B.sync();`}</Code>
        </Method>
        <Prop name="bpm" type="number" desc="Current BPM (read-only)" />
        <Prop name="key" type="string" desc="Musical key (e.g., '5A')" />
        <Prop name="position" type="number" desc="Current position (seconds)" />
        <Prop name="duration" type="number" desc="Track duration (seconds)" />
      </APISection>

      <APISection title="dj.deck.eq">
        <Method name="setHigh(gain)" returns="void" desc="Adjust highs (-∞ to +12dB)">
          <Code>{`dj.deck.A.eq.setHigh(-12); // Kill highs`}</Code>
        </Method>
        <Method name="setMid(gain)" returns="void" desc="Adjust mids">
          <Code>{`dj.deck.A.eq.setMid(0);`}</Code>
        </Method>
        <Method name="setLow(gain)" returns="void" desc="Adjust lows">
          <Code>{`dj.deck.A.eq.setLow(6); // Boost bass`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.deck.loop">
        <Method name="set(start, length)" returns="void" desc="Create loop">
          <Code>{`dj.deck.A.loop.set(16, 8); // 8-beat loop at 16s`}</Code>
        </Method>
        <Method name="enable()" returns="void" desc="Enable loop">
          <Code>{`dj.deck.A.loop.enable();`}</Code>
        </Method>
        <Method name="disable()" returns="void" desc="Disable loop">
          <Code>{`dj.deck.A.loop.disable();`}</Code>
        </Method>
        <Method name="double()" returns="void" desc="Double loop length">
          <Code>{`dj.deck.A.loop.double();`}</Code>
        </Method>
        <Method name="halve()" returns="void" desc="Halve loop length">
          <Code>{`dj.deck.A.loop.halve();`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.deck.cue">
        <Method name="set(index, position)" returns="void" desc="Set hot cue (1-8)">
          <Code>{`dj.deck.A.cue.set(1, 32);`}</Code>
        </Method>
        <Method name="jump(index)" returns="void" desc="Jump to cue">
          <Code>{`dj.deck.A.cue.jump(1);`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.mixer">
        <Method name="setCrossfader(pos)" returns="void" desc="Set crossfader (-1 to 1)">
          <Code>{`dj.mixer.setCrossfader(0); // Center`}</Code>
        </Method>
        <Method name="setChannelVolume(ch, level)" returns="void" desc="Set channel fader">
          <Code>{`dj.mixer.setChannelVolume('A', 0.8);`}</Code>
        </Method>
        <Method name="setMasterVolume(level)" returns="void" desc="Set master volume">
          <Code>{`dj.mixer.setMasterVolume(0.9);`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.effects">
        <Method name="reverb.set(params)" returns="void" desc="Configure reverb">
          <Code>{`dj.effects.reverb.set({ wet: 0.3, decay: 2.5 });`}</Code>
        </Method>
        <Method name="delay.set(params)" returns="void" desc="Configure delay">
          <Code>{`dj.effects.delay.set({ wet: 0.5, delayTime: '8n', feedback: 0.6 });`}</Code>
        </Method>
        <Method name="filter.set(params)" returns="void" desc="Configure filter">
          <Code>{`dj.effects.filter.set({ type: 'lowpass', frequency: 1000 });`}</Code>
        </Method>
      </APISection>

      <APISection title="dj.loop()">
        <Method name="loop(interval, callback)" returns="void" desc="Create timed loop">
          <Code>{`dj.loop('16n', (time) => {
  dj.kick.triggerAttackRelease('C1', '8n', time);
});`}</Code>
        </Method>
      </APISection>

      <APISection title="Instruments">
        <div className="grid gap-3">
          <Inst name="dj.kick" desc="808 kick drum" />
          <Inst name="dj.snare" desc="Snare drum" />
          <Inst name="dj.hihat" desc="Hi-hat" />
          <Inst name="dj.synth" desc="Polyphonic synth" />
          <Inst name="dj.bass" desc="Bass synth" />
        </div>
      </APISection>
    </div>
  );
}

function APISection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-blue-400">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Method({ name, returns, desc, children }: { name: string; returns: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="font-mono text-sm mb-2">
        <span className="text-purple-400">{name}</span>
        <span className="text-zinc-500"> → {returns}</span>
      </div>
      <p className="text-zinc-300 text-sm mb-2">{desc}</p>
      {children}
    </div>
  );
}

function Prop({ name, type, desc }: { name: string; type: string; desc: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="font-mono text-sm mb-2">
        <span className="text-green-400">{name}</span>
        <span className="text-zinc-500">: {type}</span>
      </div>
      <p className="text-zinc-300 text-sm">{desc}</p>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-700 rounded p-3 overflow-x-auto">
      <code className="text-xs text-blue-300">{children}</code>
    </pre>
  );
}

function Inst({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
      <code className="text-purple-400">{name}</code>
      <span className="text-sm text-zinc-400">{desc}</span>
    </div>
  );
}
