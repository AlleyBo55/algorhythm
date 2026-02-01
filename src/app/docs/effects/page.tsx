'use client';

import { motion } from 'framer-motion';
import { CodeBlock } from '@/components/docs';

const EFFECT_TYPES = [
  { 
    name: 'reverb', 
    desc: 'Add space and depth with room simulation',
    params: ['decay: 0.1-10s', 'wet: 0-1']
  },
  { 
    name: 'delay', 
    desc: 'Create echo and rhythmic repeats',
    params: ['delayTime: 0-1s or notation', 'feedback: 0-1', 'wet: 0-1']
  },
  { 
    name: 'filter', 
    desc: 'Shape frequency content with lowpass/highpass/bandpass',
    params: ['frequency: 20-20000Hz', 'type: lowpass|highpass|bandpass', 'Q: 0.1-20']
  },
  { 
    name: 'distortion', 
    desc: 'Add grit, harmonics, and saturation',
    params: ['distortion: 0-1', 'wet: 0-1']
  },
  { 
    name: 'chorus', 
    desc: 'Thicken and widen with modulated delays',
    params: ['frequency: 0.1-10Hz', 'depth: 0-1', 'wet: 0-1']
  },
  { 
    name: 'phaser', 
    desc: 'Sweeping phase modulation effect',
    params: ['frequency: 0.1-10Hz', 'octaves: 1-6', 'wet: 0-1']
  },
  { 
    name: 'bitcrusher', 
    desc: 'Lo-fi bit reduction for retro/glitch sounds',
    params: ['bits: 1-16']
  },
  { 
    name: 'autofilter', 
    desc: 'Rhythmic filter modulation synced to tempo',
    params: ['frequency: notation', 'depth: 0-1', 'wet: 0-1']
  },
];

export default function EffectsPage() {
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
          Effects
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Add depth, character, and movement to your sound with built-in effects. 
          Apply effects to individual decks or use global effects for instruments.
        </p>
      </motion.div>

      {/* Available Effects */}
      <Section title="Available Effects">
        <div className="grid gap-3">
          {EFFECT_TYPES.map((effect) => (
            <div 
              key={effect.name}
              className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <code className="text-emerald-400 text-sm shrink-0 w-24" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {effect.name}
                </code>
                <div className="flex-1">
                  <p className="text-sm text-white/60 mb-2">{effect.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {effect.params.map((param) => (
                      <span 
                        key={param}
                        className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-[10px] text-white/40"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Deck Effects */}
      <Section title="Deck Effects">
        <p className="text-sm text-white/50 mb-4">
          Add effects to individual decks for per-track processing:
        </p>
        <CodeBlock filename="deck-effects.ts">{`// Add effects to a deck
dj.deck.A.effects.add('myReverb', 'reverb');
dj.deck.A.effects.add('myDelay', 'delay');

// Configure effect parameters
const reverb = dj.deck.A.effects.get('myReverb');
if (reverb) {
  reverb.wet = 0.3;  // 30% wet signal
}

const delay = dj.deck.A.effects.get('myDelay');
if (delay) {
  delay.wet = 0.2;
}

// Bypass an effect temporarily
reverb.bypass = true;   // Disable
reverb.bypass = false;  // Re-enable

// Remove a specific effect
dj.deck.A.effects.remove('myReverb');

// Clear all effects from deck
dj.deck.A.effects.clear();`}</CodeBlock>
      </Section>

      {/* Effect Chains */}
      <Section title="Effect Chains">
        <p className="text-sm text-white/50 mb-4">
          Chain multiple effects together. Effects are processed in the order they&apos;re added:
        </p>
        <CodeBlock filename="effect-chain.ts">{`// Build an effect chain
dj.deck.A.effects.add('filter', 'filter');
dj.deck.A.effects.add('delay', 'delay');
dj.deck.A.effects.add('reverb', 'reverb');

// Signal flow:
// Audio → Filter → Delay → Reverb → Output

// Configure the chain
const filter = dj.deck.A.effects.get('filter');
const delay = dj.deck.A.effects.get('delay');
const reverb = dj.deck.A.effects.get('reverb');

if (filter) filter.wet = 1.0;  // Full filter
if (delay) delay.wet = 0.3;
if (reverb) reverb.wet = 0.2;`}</CodeBlock>
      </Section>

      {/* Global Effects */}
      <Section title="Global Effects">
        <p className="text-sm text-white/50 mb-4">
          Global effects apply to all instruments (kick, snare, synths, etc.):
        </p>
        <CodeBlock filename="global-effects.ts">{`// Configure global reverb
dj.effects.reverb.set({
  decay: 2.5,
  wet: 0.3
});

// Configure global delay
dj.effects.delay.set({
  delayTime: '8n',  // Synced to tempo
  feedback: 0.4,
  wet: 0.2
});

// Configure global chorus
dj.effects.chorus.set({
  frequency: 1.5,
  depth: 0.7,
  wet: 0.3
});`}</CodeBlock>
      </Section>

      {/* Color FX */}
      <Section title="Color FX">
        <p className="text-sm text-white/50 mb-4">
          Color FX is a one-knob creative effect that combines filter, reverb, delay, and distortion:
        </p>
        <CodeBlock filename="color-fx.ts">{`// Color FX value: 0 to 1
// 0 = Clean signal
// 1 = Maximum effect (filter sweep + reverb + delay + distortion)

dj.deck.A.colorFX.value = 0;    // Clean
dj.deck.A.colorFX.value = 0.3;  // Subtle warmth
dj.deck.A.colorFX.value = 0.7;  // Heavy processing
dj.deck.A.colorFX.value = 1.0;  // Maximum effect

// Automate Color FX in a loop
let fxValue = 0;
dj.loop('16n', (time) => {
  // Sweep from 0 to 1 over time
  fxValue = (fxValue + 0.01) % 1;
  dj.deck.A.colorFX.value = fxValue;
});`}</CodeBlock>
      </Section>

      {/* Filter Techniques */}
      <Section title="Filter Techniques">
        <p className="text-sm text-white/50 mb-4">
          Common DJ filter techniques for transitions and builds:
        </p>
        <CodeBlock filename="filter-techniques.ts">{`// Lowpass filter sweep (cut highs)
// Great for breakdowns and transitions
dj.deck.A.filter.lowpass = 20000;  // Start open
dj.deck.A.filter.lowpass = 5000;   // Mid sweep
dj.deck.A.filter.lowpass = 500;    // Heavy filter

// Highpass filter sweep (cut lows)
// Great for builds and risers
dj.deck.A.filter.highpass = 20;    // Start open
dj.deck.A.filter.highpass = 500;   // Building
dj.deck.A.filter.highpass = 2000;  // Peak tension

// Filter resonance for emphasis
dj.deck.A.filter.resonance = 1;    // Subtle
dj.deck.A.filter.resonance = 4;    // Pronounced
dj.deck.A.filter.resonance = 8;    // Aggressive

// Automated filter sweep
let filterFreq = 20000;
dj.loop('16n', (time) => {
  filterFreq = Math.max(200, filterFreq - 100);
  dj.deck.A.filter.lowpass = filterFreq;
});`}</CodeBlock>
      </Section>

      {/* Creative Examples */}
      <Section title="Creative Examples">
        <CodeBlock filename="dub-delay.ts">{`// Dub-style delay throws
// Momentarily increase delay feedback for echo trails

let delayThrow = false;

dj.deck.A.effects.add('dubDelay', 'delay');
const dubDelay = dj.deck.A.effects.get('dubDelay');

if (dubDelay) {
  dubDelay.wet = 0.4;
  // Normal feedback
  // dubDelay.feedback = 0.3;
}

// Trigger delay throw on specific beats
let beat = 0;
dj.loop('4n', (time) => {
  if (beat % 16 === 15) {
    // Throw on beat 16 of every 4 bars
    delayThrow = true;
    // High feedback for trails
  }
  
  if (delayThrow && beat % 16 === 0) {
    delayThrow = false;
    // Return to normal
  }
  
  beat++;
});`}</CodeBlock>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold text-white border-b border-white/[0.06] pb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
