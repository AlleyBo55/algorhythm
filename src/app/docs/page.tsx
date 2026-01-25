'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Zap, Music, Code, Layers } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-zinc-400">
            Complete guide to DJing with code
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <QuickLink icon={Zap} title="Quick Start" href="#quick-start" />
          <QuickLink icon={Music} title="Templates" href="#templates" />
          <QuickLink icon={Code} title="API Reference" href="#api" />
        </div>

        {/* Content */}
        <div className="space-y-16">
          <Section id="quick-start" icon={Zap} title="Quick Start">
            <p className="text-zinc-300 mb-4">
              Get started with Algorhythm in 3 simple steps:
            </p>
            <ol className="space-y-4 text-zinc-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <strong className="text-white">Initialize System</strong> - Click "Initialize System" on the welcome screen
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <strong className="text-white">Load Tracks</strong> - Click "Load Track" on Deck A and B to load your audio files
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <strong className="text-white">Run Code</strong> - Write your code and press <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">Shift+Enter</kbd>
                </div>
              </li>
            </ol>

            <CodeBlock code={`dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  tick++;
});`} />
          </Section>

          <Section id="templates" icon={Music} title="Templates & Effects">
            <p className="text-zinc-300 mb-6">
              Access 26+ professional templates from world-class artists. Click <strong className="text-primary">"Browse All"</strong> in the template selector to see all templates grouped by artist.
            </p>

            <h3 className="text-xl font-bold text-white mb-4">Available Artists</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {['Alan Walker', 'Marshmello', 'Deadmau5', 'Avicii', 'Skrillex', 'Daft Punk', 'Porter Robinson', 'Flume', 'Martin Garrix', 'The Weeknd'].map(artist => (
                <div key={artist} className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-300">
                  {artist}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Effect Types</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'reverb', desc: 'Space and depth' },
                { name: 'delay', desc: 'Echo/repeat' },
                { name: 'filter', desc: 'Resonant filter' },
                { name: 'distortion', desc: 'Overdrive' },
                { name: 'phaser', desc: 'Sweeping phase' },
                { name: 'chorus', desc: 'Stereo width' },
                { name: 'bitcrusher', desc: 'Lo-fi' },
                { name: 'autofilter', desc: 'Rhythmic filter' },
              ].map(fx => (
                <div key={fx.name} className="p-3 bg-zinc-800/30 border border-zinc-700/50 rounded-lg">
                  <code className="text-primary text-sm">{fx.name}</code>
                  <p className="text-xs text-zinc-400 mt-1">{fx.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Apply Effects to Decks</h3>
            <CodeBlock code={`// Add effects to Deck A
dj.deck.A.effects.add('reverb', 'reverb');
dj.deck.A.effects.add('delay', 'delay');

// Control effect wet/dry
const fx = dj.deck.A.effects.get('reverb');
if (fx) fx.wet = 0.5; // 0.0 = dry, 1.0 = wet

// Color FX (one-knob effect)
dj.deck.A.colorFX.value = 0.7;`} />
          </Section>

          <Section id="api" icon={Code} title="API Reference">
            <h3 className="text-xl font-bold text-white mb-4">Deck Controls</h3>
            <CodeBlock code={`// Playback
dj.deck.A.play();   // Start/resume
dj.deck.A.pause();  // Pause (keeps position)
dj.deck.A.stop();   // Stop (reset to start)

// Volume & EQ
dj.deck.A.volume = -6;  // dB
dj.deck.A.eq.high = 3;  // +3dB
dj.deck.A.eq.mid = 0;   // 0dB
dj.deck.A.eq.low = -6;  // -6dB

// Filter
dj.deck.A.filter.lowpass = 1000;  // Hz
dj.deck.A.filter.highpass = 200;  // Hz`} />

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Instruments</h3>
            <CodeBlock code={`// Control instruments volume
dj.instruments.volume = 0.3; // 30% (default)

// Drums
dj.kick.triggerAttackRelease('C1', '8n', time);
dj.snare.triggerAttackRelease('C1', '8n', time);
dj.hihat.triggerAttackRelease('C1', '32n', time);

// Synths
dj.synth.triggerAttackRelease('C4', '4n', time);
dj.bass.triggerAttackRelease('E2', '8n', time);
dj.pad.triggerAttackRelease(['C4', 'E4', 'G4'], '1m', time);`} />

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Loops & Timing</h3>
            <CodeBlock code={`// Set BPM
dj.bpm = 128;

// Create loop
dj.loop('16n', (time) => {
  // Your code here
  // Runs every 16th note
});

// Stop all
dj.stop();`} />
          </Section>

          <Section id="controls" icon={Layers} title="Transport Controls">
            <p className="text-zinc-300 mb-4">
              Each deck has 3 transport buttons:
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-2xl">▶️</span>
                <div>
                  <strong className="text-white">Play</strong> - Start or resume from current position
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">⏸️</span>
                <div>
                  <strong className="text-white">Pause</strong> - Pause at current position (maintains position for resume)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">⏹️</span>
                <div>
                  <strong className="text-white">Stop</strong> - Stop and reset to beginning
                </div>
              </li>
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          <p>Built with ❤️ for the DJ and creative coding community</p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, title, href }: { icon: any; title: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-primary/50 transition-all group"
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium text-white">{title}</span>
    </a>
  );
}

function Section({ id, icon: Icon, title, children }: { id: string; icon: any; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      <div className="pl-14">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 p-4 bg-black/50 border border-zinc-800 rounded-lg overflow-x-auto">
      <code className="text-sm text-zinc-300">{code}</code>
    </pre>
  );
}
