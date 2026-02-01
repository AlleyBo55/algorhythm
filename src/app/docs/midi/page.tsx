'use client';

import { motion } from 'framer-motion';
import { CodeBlock, InlineCode } from '@/components/docs';

export default function MIDIPage() {
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
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Advanced</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          MIDI Setup
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Connect MIDI controllers to Algorhythm for hands-on control of your music.
        </p>
      </motion.div>

      {/* Requirements */}
      <Section title="Requirements">
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <ul className="text-sm text-white/60 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>A Web MIDI compatible browser (Chrome, Edge, Opera)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>A MIDI controller connected via USB</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>MIDI access permission granted to the browser</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-white/40 mt-2">
          Note: Safari and Firefox have limited Web MIDI support.
        </p>
      </Section>

      {/* Accessing MIDI */}
      <Section title="Accessing MIDI">
        <p className="text-sm text-white/50 mb-4">
          The <InlineCode>dj.midi</InlineCode> object provides access to MIDI functionality:
        </p>
        <CodeBlock filename="midi-access.ts">{`// The MIDI controller is available via dj.midi
// It automatically connects to available MIDI devices

// Check if MIDI is available
if (dj.midi) {
  console.log('MIDI controller ready');
}

// MIDI events are handled through the controller
// You can map controls to DJ functions`}</CodeBlock>
      </Section>

      {/* Common Controllers */}
      <Section title="Supported Controllers">
        <p className="text-sm text-white/50 mb-4">
          Algorhythm works with any class-compliant MIDI controller. Popular options include:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <ControllerCard 
            name="Pioneer DDJ Series"
            type="DJ Controller"
            features={['Jog wheels', 'Faders', 'Pads', 'EQ knobs']}
          />
          <ControllerCard 
            name="Native Instruments"
            type="DJ/Production"
            features={['Traktor controllers', 'Maschine', 'Komplete Kontrol']}
          />
          <ControllerCard 
            name="Novation Launchpad"
            type="Pad Controller"
            features={['64 pads', 'RGB feedback', 'Session mode']}
          />
          <ControllerCard 
            name="Akai MPD/APC"
            type="Pad/Fader"
            features={['MPC pads', 'Faders', 'Knobs']}
          />
          <ControllerCard 
            name="Arturia"
            type="Keyboard/Controller"
            features={['KeyLab', 'BeatStep', 'MiniLab']}
          />
          <ControllerCard 
            name="Generic MIDI"
            type="Any Controller"
            features={['Any class-compliant device', 'Custom mapping']}
          />
        </div>
      </Section>

      {/* MIDI Mapping */}
      <Section title="MIDI Mapping Concepts">
        <p className="text-sm text-white/50 mb-4">
          MIDI messages consist of three parts:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-xs font-medium text-cyan-400 mb-1">Channel</h4>
            <p className="text-xs text-white/40">1-16, identifies the device/track</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-xs font-medium text-amber-400 mb-1">Control/Note</h4>
            <p className="text-xs text-white/40">0-127, which button/knob/key</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-xs font-medium text-emerald-400 mb-1">Value</h4>
            <p className="text-xs text-white/40">0-127, the position/velocity</p>
          </div>
        </div>
        <CodeBlock filename="midi-messages.ts">{`// MIDI message types:

// Note On - when a key/pad is pressed
// Channel 1, Note 60 (Middle C), Velocity 100
// [144, 60, 100]

// Note Off - when a key/pad is released
// Channel 1, Note 60, Velocity 0
// [128, 60, 0]

// Control Change (CC) - knobs, faders, buttons
// Channel 1, CC 1 (Mod Wheel), Value 64
// [176, 1, 64]

// Common CC numbers:
// 1  = Mod Wheel
// 7  = Volume
// 10 = Pan
// 64 = Sustain Pedal`}</CodeBlock>
      </Section>

      {/* Example Mappings */}
      <Section title="Example Mappings">
        <p className="text-sm text-white/50 mb-4">
          Here are conceptual examples of how MIDI could control Algorhythm:
        </p>
        <CodeBlock filename="midi-mapping-examples.ts">{`// Conceptual MIDI mapping examples
// (Actual implementation depends on your controller)

// Map a fader to crossfader
// CC 0 (value 0-127) → crossfader (-1 to 1)
function handleCrossfader(value: number) {
  dj.crossfader.position = (value / 127) * 2 - 1;
}

// Map knobs to EQ
// CC 1-3 → EQ high/mid/low
function handleEQ(cc: number, value: number) {
  const db = (value / 127) * 24 - 12;  // -12 to +12 dB
  if (cc === 1) dj.deck.A.eq.high = db;
  if (cc === 2) dj.deck.A.eq.mid = db;
  if (cc === 3) dj.deck.A.eq.low = db;
}

// Map pads to hot cues
// Notes 36-43 → Hot cues 1-8
function handleHotCue(note: number, velocity: number) {
  const cueIndex = note - 35;  // 1-8
  if (velocity > 0) {
    dj.deck.A.hotcue[cueIndex].trigger();
  }
}

// Map a button to play/pause
function handlePlayPause(velocity: number) {
  if (velocity > 0) {
    if (dj.deck.A.isPlaying) {
      dj.deck.A.pause();
    } else {
      dj.deck.A.play();
    }
  }
}`}</CodeBlock>
      </Section>

      {/* Troubleshooting */}
      <Section title="Troubleshooting">
        <div className="space-y-3">
          <TroubleshootItem 
            problem="MIDI device not detected"
            solutions={[
              'Ensure the device is connected before loading the page',
              'Check that no other application is using the MIDI device',
              'Try a different USB port',
              'Refresh the page after connecting'
            ]}
          />
          <TroubleshootItem 
            problem="Browser asks for MIDI permission"
            solutions={[
              'Click "Allow" when prompted',
              'Check browser settings if you accidentally denied',
              'Some browsers require HTTPS for MIDI access'
            ]}
          />
          <TroubleshootItem 
            problem="Controls not responding"
            solutions={[
              'Check the MIDI channel matches your mapping',
              'Verify CC numbers in your controller\'s documentation',
              'Use a MIDI monitor tool to debug messages'
            ]}
          />
        </div>
      </Section>

      {/* Resources */}
      <Section title="Resources">
        <div className="grid sm:grid-cols-2 gap-3">
          <a 
            href="https://www.midi.org/specifications"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
          >
            <h4 className="text-sm font-medium text-white/80 group-hover:text-white mb-1">MIDI Specification</h4>
            <p className="text-xs text-white/40">Official MIDI protocol documentation</p>
          </a>
          <a 
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
          >
            <h4 className="text-sm font-medium text-white/80 group-hover:text-white mb-1">Web MIDI API</h4>
            <p className="text-xs text-white/40">MDN documentation for browser MIDI</p>
          </a>
        </div>
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

function ControllerCard({ name, type, features }: { name: string; type: string; features: string[] }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <h4 className="text-sm font-medium text-white/80 mb-0.5">{name}</h4>
      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{type}</p>
      <ul className="text-xs text-white/40 space-y-0.5">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}

function TroubleshootItem({ problem, solutions }: { problem: string; solutions: string[] }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <h4 className="text-sm font-medium text-rose-400 mb-2">{problem}</h4>
      <ul className="text-xs text-white/50 space-y-1">
        {solutions.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
