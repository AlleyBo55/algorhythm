'use client';

import { motion } from 'framer-motion';
import { CodeBlock, InlineCode } from '@/components/docs';

export default function APIPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>API Reference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          DJ API
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Complete reference for the <InlineCode>dj</InlineCode> object - your main interface for creating music.
        </p>
      </motion.div>

      {/* Global Controls */}
      <Section title="Global Controls">
        <APIItem
          name="dj.bpm"
          type="number"
          description="Get or set the global tempo in beats per minute. All loops and decks sync to this value."
        >
          <CodeBlock>{`// Set tempo
dj.bpm = 128;

// Get current tempo
console.log(dj.bpm); // 128`}</CodeBlock>
        </APIItem>

        <APIItem
          name="dj.loop(interval, callback)"
          type="function"
          description="Create a repeating loop at the specified musical interval. The callback receives a time parameter for precise scheduling."
        >
          <CodeBlock>{`// 16th note loop (common for drums)
dj.loop('16n', (time) => {
  dj.kick.triggerAttackRelease('C1', '8n', time);
});

// Quarter note loop
dj.loop('4n', (time) => {
  dj.snare.triggerAttackRelease('C1', '8n', time);
});`}</CodeBlock>
        </APIItem>

        <APIItem
          name="dj.stop()"
          type="function"
          description="Stop all playback, loops, and scheduled events."
        >
          <CodeBlock>{`// Stop everything
dj.stop();`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Volume Control */}
      <Section title="Volume Control">
        <APIItem
          name="dj.volume"
          type="object"
          description="Control master and individual instrument volumes. Master is 0-1, instruments are in dB."
        >
          <CodeBlock>{`// Master volume (0 to 1)
dj.volume.master = 0.8;

// Individual instrument volumes (dB)
dj.volume.kick = 0;      // 0dB (unity)
dj.volume.snare = -3;    // -3dB
dj.volume.supersaw = 6;  // +6dB boost

// Song-specific instruments
dj.volume.fadedPiano = 2;
dj.volume.levelsPiano = -2;`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Decks */}
      <Section title="Decks">
        <p className="text-sm text-white/50 mb-4">
          Four virtual decks (A, B, C, D) for loading and playing audio files with full DJ controls.
        </p>

        <APIItem
          name="dj.deck.A / B / C / D"
          type="Deck"
          description="Access individual decks for track playback and manipulation."
        >
          <CodeBlock>{`// Load and play a track
await dj.deck.A.load(audioFile);
dj.deck.A.play();

// Playback controls
dj.deck.A.pause();
dj.deck.A.stop();
dj.deck.A.seek(30); // Seek to 30 seconds`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.volume"
          type="number"
          description="Deck volume in decibels (-60 to +12 dB)."
        >
          <CodeBlock>{`dj.deck.A.volume = -6;  // -6dB
dj.deck.B.volume = 0;   // Unity gain`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.eq"
          type="object"
          description="3-band EQ with high, mid, and low controls in dB."
        >
          <CodeBlock>{`// Boost highs, cut lows
dj.deck.A.eq.high = 3;   // +3dB
dj.deck.A.eq.mid = 0;    // 0dB
dj.deck.A.eq.low = -6;   // -6dB (kill bass)`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.filter"
          type="object"
          description="Lowpass and highpass filter controls."
        >
          <CodeBlock>{`// Lowpass filter (cut highs)
dj.deck.A.filter.lowpass = 2000;  // Hz

// Highpass filter (cut lows)
dj.deck.A.filter.highpass = 500;  // Hz

// Filter resonance
dj.deck.A.filter.resonance = 2;`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.loop"
          type="object"
          description="Loop controls for creating and manipulating loops."
        >
          <CodeBlock>{`// Set loop points (in seconds)
dj.deck.A.loop.set(10, 18);  // 8-second loop

// Enable/disable loop
dj.deck.A.loop.enable();
dj.deck.A.loop.disable();

// Auto-loop (beats)
dj.deck.A.loop.auto(4);  // 4-beat loop

// Modify loop
dj.deck.A.loop.double();  // Double length
dj.deck.A.loop.halve();   // Halve length
dj.deck.A.loop.shift(1);  // Shift forward 1 beat`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.hotcue"
          type="object"
          description="Hot cue points for instant jumps to saved positions."
        >
          <CodeBlock>{`// Set hot cue at current position
dj.deck.A.hotcue[1].set(dj.deck.A.currentTime, 'Drop');

// Trigger hot cue
dj.deck.A.hotcue[1].trigger();

// Clear hot cue
dj.deck.A.hotcue[1].clear();`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.effects"
          type="object"
          description="Per-deck effects chain."
        >
          <CodeBlock>{`// Add effect
dj.deck.A.effects.add('myReverb', 'reverb');

// Configure effect
const fx = dj.deck.A.effects.get('myReverb');
if (fx) {
  fx.wet = 0.3;
}

// Remove effect
dj.deck.A.effects.remove('myReverb');

// Clear all effects
dj.deck.A.effects.clear();`}</CodeBlock>
        </APIItem>

        <APIItem
          name="deck.state"
          type="object"
          description="Read-only deck state information."
        >
          <CodeBlock>{`// Check playback state
dj.deck.A.isPlaying;    // boolean
dj.deck.A.currentTime;  // seconds
dj.deck.A.duration;     // total length

// Track info
dj.deck.A.bpm;          // detected BPM
dj.deck.A.key;          // detected key
dj.deck.A.beatGrid;     // beat positions`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Mixer */}
      <Section title="Mixer">
        <APIItem
          name="dj.crossfader"
          type="object"
          description="Crossfader control between Deck A and Deck B."
        >
          <CodeBlock>{`// Position: -1 (A) to 1 (B)
dj.crossfader.position = 0;    // Center
dj.crossfader.position = -1;   // Full Deck A
dj.crossfader.position = 1;    // Full Deck B

// Curve type
dj.crossfader.curve = 'linear';   // Linear fade
dj.crossfader.curve = 'power';    // Power curve
dj.crossfader.curve = 'constant'; // Constant power`}</CodeBlock>
        </APIItem>

        <APIItem
          name="dj.master"
          type="object"
          description="Master output controls."
        >
          <CodeBlock>{`// Master volume (dB)
dj.master.volume = 0;

// Limiter
dj.master.limiter.enable();
dj.master.limiter.disable();`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Sound Design */}
      <Section title="Sound Design">
        <APIItem
          name="dj.sound(preset)"
          type="function"
          description="Create a custom synth with a specific sound preset. Returns a Tone.js PolySynth."
        >
          <CodeBlock>{`// Use a preset
const lead = dj.sound('fadedPluck');
lead.triggerAttackRelease('C4', '8n', time);

// Available presets
const presets = dj.soundPresets;
// fadedPluck, fadedPiano, levelsPiano, supersaw, etc.

// Custom config
const bass = dj.sound({
  oscillator: { type: 'sine' },
  envelope: { 
    attack: 0.01, 
    decay: 0.5, 
    sustain: 0.3, 
    release: 0.8 
  }
});`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Effects */}
      <Section title="Global Effects">
        <APIItem
          name="dj.effects"
          type="object"
          description="Global effects that apply to all instruments."
        >
          <CodeBlock>{`// Reverb
dj.effects.reverb.set({ 
  decay: 2.5, 
  wet: 0.3 
});

// Delay
dj.effects.delay.set({ 
  delayTime: '8n', 
  feedback: 0.4, 
  wet: 0.2 
});

// Chorus
dj.effects.chorus.set({ 
  frequency: 1.5, 
  depth: 0.7, 
  wet: 0.3 
});`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Recording */}
      <Section title="Recording">
        <APIItem
          name="dj.record"
          type="object"
          description="Record your session to audio."
        >
          <CodeBlock>{`// Start recording
dj.record.start();

// Stop and get blob
const blob = dj.record.stop();

// Download
dj.record.download(blob, 'my-track.wav');

// Check if recording
dj.record.recording; // boolean`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Sync */}
      <Section title="Sync & Utilities">
        <APIItem
          name="dj.sync(deckA, deckB)"
          type="function"
          description="Sync the BPM of two decks."
        >
          <CodeBlock>{`// Sync Deck B to Deck A's BPM
dj.sync(dj.deck.A, dj.deck.B);`}</CodeBlock>
        </APIItem>

        <APIItem
          name="dj.sidechain(interval)"
          type="function"
          description="Apply sidechain compression effect at the specified interval."
        >
          <CodeBlock>{`// Sidechain pump on every beat
dj.sidechain('4n');`}</CodeBlock>
        </APIItem>
      </Section>

      {/* Presets */}
      <Section title="Presets">
        <APIItem
          name="dj.preset"
          type="object"
          description="Apply pre-configured sound presets."
        >
          <CodeBlock>{`// Apply genre presets
dj.preset.alanWalker();
dj.preset.marshmello();
dj.preset.synthwave();
dj.preset.trap();
dj.preset.lofi();

// Reset to defaults
dj.preset.reset();`}</CodeBlock>
        </APIItem>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold text-white border-b border-white/[0.06] pb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}

function APIItem({
  name,
  type,
  description,
  children,
}: {
  name: string;
  type: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-emerald-400 font-medium text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {name}
        </code>
        <span className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded text-[10px] text-white/40 uppercase tracking-wider">
          {type}
        </span>
      </div>
      <p className="text-sm text-white/50">{description}</p>
      {children}
    </div>
  );
}
