'use client';

import { motion } from 'framer-motion';
import { CodeBlock } from '@/components/docs';

export default function TechniquesPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          DJ Techniques
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Professional DJ techniques implemented in code. From basic mixing to advanced performance tricks.
        </p>
      </motion.div>

      {/* Beatmatching */}
      <Section title="Beatmatching">
        <p className="text-sm text-white/50 mb-4">
          Sync the tempo of two tracks for seamless mixing:
        </p>
        <CodeBlock filename="beatmatching.ts">{`// Manual beatmatching
// Match Deck B's BPM to Deck A
dj.deck.B.bpm = dj.deck.A.bpm;

// Or use the sync helper
dj.sync(dj.deck.A, dj.deck.B);

// Fine-tune with pitch adjustment
// Deck BPM can be adjusted independently
dj.deck.B.bpm = dj.deck.A.bpm * 1.02;  // +2% faster`}</CodeBlock>
      </Section>

      {/* Crossfading */}
      <Section title="Crossfading">
        <p className="text-sm text-white/50 mb-4">
          Smoothly transition between two tracks using the crossfader:
        </p>
        <CodeBlock filename="crossfading.ts">{`// Crossfader position: -1 (A) to 1 (B)
dj.crossfader.position = -1;  // Full Deck A
dj.crossfader.position = 0;   // Both decks equal
dj.crossfader.position = 1;   // Full Deck B

// Crossfader curves
dj.crossfader.curve = 'linear';   // Smooth fade
dj.crossfader.curve = 'power';    // DJ-style curve
dj.crossfader.curve = 'constant'; // Constant power (no dip)

// Automated crossfade over 16 beats
let fadePosition = -1;
dj.loop('4n', (time) => {
  fadePosition = Math.min(1, fadePosition + 0.125);
  dj.crossfader.position = fadePosition;
});`}</CodeBlock>
      </Section>

      {/* EQ Mixing */}
      <Section title="EQ Mixing">
        <p className="text-sm text-white/50 mb-4">
          Use EQ to blend tracks by swapping frequency bands:
        </p>
        <CodeBlock filename="eq-mixing.ts">{`// Bass swap technique
// Kill bass on incoming track, then swap

// Start: Deck A has full bass, Deck B bass killed
dj.deck.A.eq.low = 0;
dj.deck.B.eq.low = -24;  // Kill bass

// Gradually swap bass
dj.deck.A.eq.low = -6;
dj.deck.B.eq.low = -6;

// Complete swap
dj.deck.A.eq.low = -24;
dj.deck.B.eq.low = 0;

// High-frequency blend
// Cut highs on outgoing track to avoid clashing
dj.deck.A.eq.high = -12;
dj.deck.B.eq.high = 0;`}</CodeBlock>
      </Section>

      {/* Filter Sweeps */}
      <Section title="Filter Sweeps">
        <p className="text-sm text-white/50 mb-4">
          Create tension and release with filter automation:
        </p>
        <CodeBlock filename="filter-sweeps.ts">{`// Lowpass sweep (build tension)
let filterFreq = 20000;
const filterSweep = dj.loop('16n', (time) => {
  filterFreq = Math.max(200, filterFreq - 200);
  dj.deck.A.filter.lowpass = filterFreq;
});

// Highpass sweep (build energy)
let hpFreq = 20;
dj.loop('16n', (time) => {
  hpFreq = Math.min(2000, hpFreq + 50);
  dj.deck.A.filter.highpass = hpFreq;
});

// Quick filter cut for drops
// Before drop: heavy filter
dj.deck.A.filter.lowpass = 400;

// On drop: open filter instantly
dj.deck.A.filter.lowpass = 20000;`}</CodeBlock>
      </Section>

      {/* Looping */}
      <Section title="Looping Techniques">
        <p className="text-sm text-white/50 mb-4">
          Use loops to extend sections, create builds, or hold a groove:
        </p>
        <CodeBlock filename="looping.ts">{`// Auto-loop (beats)
dj.deck.A.loop.auto(4);   // 4-beat loop
dj.deck.A.loop.auto(8);   // 8-beat loop
dj.deck.A.loop.auto(16);  // 16-beat loop (4 bars)

// Manual loop points
dj.deck.A.loop.set(30.5, 38.5);  // 8-second loop
dj.deck.A.loop.enable();

// Loop manipulation
dj.deck.A.loop.halve();   // Cut loop in half
dj.deck.A.loop.double();  // Double loop length
dj.deck.A.loop.shift(1);  // Move loop forward 1 beat

// Exit loop
dj.deck.A.loop.disable();

// Loop roll effect (quick loops)
// 1/4 beat loop for stutter effect
dj.deck.A.loop.auto(0.25);`}</CodeBlock>
      </Section>

      {/* Hot Cues */}
      <Section title="Hot Cues">
        <p className="text-sm text-white/50 mb-4">
          Set markers for instant jumps to key moments in a track:
        </p>
        <CodeBlock filename="hot-cues.ts">{`// Set hot cues at important points
dj.deck.A.hotcue[1].set(0, 'Intro');
dj.deck.A.hotcue[2].set(32, 'Verse');
dj.deck.A.hotcue[3].set(64, 'Chorus');
dj.deck.A.hotcue[4].set(96, 'Drop');
dj.deck.A.hotcue[5].set(128, 'Breakdown');
dj.deck.A.hotcue[6].set(160, 'Build');
dj.deck.A.hotcue[7].set(192, 'Drop 2');
dj.deck.A.hotcue[8].set(224, 'Outro');

// Jump to hot cue
dj.deck.A.hotcue[4].trigger();  // Jump to drop

// Clear a hot cue
dj.deck.A.hotcue[1].clear();`}</CodeBlock>
      </Section>

      {/* Sidechain Pumping */}
      <Section title="Sidechain Pumping">
        <p className="text-sm text-white/50 mb-4">
          Create the classic EDM pumping effect:
        </p>
        <CodeBlock filename="sidechain.ts">{`// Simple sidechain on every beat
dj.sidechain('4n');

// Manual sidechain with more control
let tick = 0;
dj.loop('16n', (time) => {
  // Duck volume on kick hits
  if (tick % 4 === 0) {
    dj.volume.master = 0.3;  // Duck
  }
  if (tick % 4 === 2) {
    dj.volume.master = 0.8;  // Release
  }
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Build-ups */}
      <Section title="Build-ups & Drops">
        <p className="text-sm text-white/50 mb-4">
          Create tension before a drop with multiple techniques combined:
        </p>
        <CodeBlock filename="buildups.ts">{`dj.bpm = 128;

let tick = 0;
let buildPhase = 0;  // 0 = normal, 1 = build, 2 = drop

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Build phase (bars 12-15)
  if (bar >= 12 && bar < 16) {
    buildPhase = 1;
    
    // Rising hi-hat pattern
    if (tick % 2 === 0) {
      dj.hihat.triggerAttackRelease('C1', '32n', time);
    }
    
    // Snare roll intensifies
    if (bar === 15 && tick % 16 >= 8) {
      dj.snare.triggerAttackRelease('C1', '32n', time);
    }
    
    // Filter sweep up
    const progress = (tick - 192) / 64;
    dj.deck.A.filter.highpass = 20 + progress * 2000;
  }
  
  // Drop (bar 16+)
  if (bar >= 16 && buildPhase === 1) {
    buildPhase = 2;
    // Reset filter
    dj.deck.A.filter.highpass = 20;
    dj.deck.A.filter.lowpass = 20000;
  }
  
  // Normal kick pattern
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}</CodeBlock>
      </Section>

      {/* Transitions */}
      <Section title="Transition Techniques">
        <p className="text-sm text-white/50 mb-4">
          Smooth transitions between tracks:
        </p>
        <CodeBlock filename="transitions.ts">{`// 1. Echo out transition
// Add delay to outgoing track, then fade
dj.deck.A.effects.add('echoOut', 'delay');
const echo = dj.deck.A.effects.get('echoOut');
if (echo) {
  echo.wet = 0.5;
  // Increase feedback for trails
}

// Fade out Deck A while Deck B comes in
let fadeProgress = 0;
dj.loop('4n', (time) => {
  fadeProgress += 0.0625;  // 16 beats to complete
  dj.deck.A.volume = -fadeProgress * 24;  // Fade to -24dB
  dj.deck.B.volume = -24 + fadeProgress * 24;  // Fade in
});

// 2. Cut transition
// Instant switch on the beat
dj.crossfader.position = -1;  // Deck A
// On the drop:
dj.crossfader.position = 1;   // Instant to Deck B

// 3. Spinback
// Simulate vinyl spinback effect
// (Deck playback rate manipulation)
dj.deck.A.bpm = dj.deck.A.bpm * 0.5;  // Slow down`}</CodeBlock>
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
