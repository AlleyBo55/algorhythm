export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Examples & Templates</h1>
        <p className="text-xl text-zinc-400">40+ production-ready templates from world-class artists.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Progressive House</h2>
        <div className="grid gap-4">
          <Template
            title="Avicii - Levels Style"
            bpm={128}
            key="7A"
            description="Uplifting progressive house with piano stabs and vocal chops"
            code={`dj.bpm = 128;
let bar = 0;

dj.loop('1m', (time) => {
  // Kick on every beat
  if (bar % 1 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Piano stabs every 4 bars
  if (bar % 4 === 0) {
    dj.synth.triggerAttackRelease(['C4', 'E4', 'G4'], '2n', time);
  }
  
  bar++;
});`}
          />
          <Template
            title="Swedish House Mafia - Don't You Worry Child"
            bpm={128}
            key="5A"
            description="Emotional progressive with saw leads and big drops"
            code={`dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Build-up filter sweep
  if (bar >= 12 && bar < 16) {
    const progress = (bar - 12) / 4;
    dj.deck.A.filter.frequency.value = 20000 - (progress * 19000);
  }
  
  // Drop on bar 16
  if (bar === 16) {
    dj.deck.A.filter.frequency.value = 20000;
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Future Bass</h2>
        <div className="grid gap-4">
          <Template
            title="Marshmello - Alone Style"
            bpm={140}
            key="8A"
            description="Bouncy future bass with vocal chops and supersaws"
            code={`dj.bpm = 140;
let tick = 0;

dj.loop('16n', (time) => {
  // Kick and snare pattern
  if (tick % 8 === 0) dj.kick.triggerAttackRelease('C1', '8n', time);
  if (tick % 8 === 4) dj.snare.triggerAttackRelease('C1', '16n', time);
  
  // Hi-hat rolls
  if (tick % 2 === 1) dj.hihat.triggerAttackRelease('C1', '32n', time);
  
  tick++;
});`}
          />
          <Template
            title="Flume - Say It Style"
            bpm={150}
            key="6A"
            description="Experimental future bass with glitchy percussion"
            code={`dj.bpm = 150;
let tick = 0;

dj.loop('16n', (time) => {
  // Syncopated kick pattern
  if ([0, 6, 12].includes(tick % 16)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Glitchy hi-hats
  if (Math.random() > 0.7) {
    dj.hihat.triggerAttackRelease('C1', '64n', time);
  }
  
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">French House</h2>
        <div className="grid gap-4">
          <Template
            title="Daft Punk - One More Time"
            bpm={123}
            key="9A"
            description="Classic French house with filtered disco samples"
            code={`dj.bpm = 123;
let bar = 0;

dj.loop('1m', (time) => {
  // Four-on-the-floor
  for (let i = 0; i < 4; i++) {
    dj.kick.triggerAttackRelease('C1', '8n', time + i * 0.5);
  }
  
  // Filter automation
  const freq = 500 + (bar % 8) * 1000;
  dj.deck.A.filter.frequency.value = freq;
  
  bar++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Techno</h2>
        <div className="grid gap-4">
          <Template
            title="Detroit Techno"
            bpm={130}
            key="12A"
            description="Hypnotic techno with driving bassline"
            code={`dj.bpm = 130;
let tick = 0;

dj.loop('16n', (time) => {
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat pattern
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  // Bassline
  if (tick % 16 === 0) {
    dj.bass.triggerAttackRelease('A1', '4n', time);
  }
  
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Drum & Bass</h2>
        <div className="grid gap-4">
          <Template
            title="Liquid DnB"
            bpm={174}
            key="5A"
            description="Smooth liquid drum & bass with atmospheric pads"
            code={`dj.bpm = 174;
let tick = 0;

dj.loop('16n', (time) => {
  // DnB drum pattern
  if (tick % 8 === 0) dj.kick.triggerAttackRelease('C1', '16n', time);
  if (tick % 8 === 4) dj.snare.triggerAttackRelease('C1', '16n', time);
  
  // Fast hi-hats
  if (tick % 2 === 0) dj.hihat.triggerAttackRelease('C1', '32n', time);
  
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Hip-Hop</h2>
        <div className="grid gap-4">
          <Template
            title="Trap Beat"
            bpm={140}
            key="3A"
            description="Modern trap with 808s and hi-hat rolls"
            code={`dj.bpm = 140;
let tick = 0;

dj.loop('16n', (time) => {
  // 808 kick pattern
  if ([0, 6, 12].includes(tick % 16)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if (tick % 16 === 8) {
    dj.snare.triggerAttackRelease('C1', '16n', time);
  }
  
  // Hi-hat rolls
  if (tick % 4 === 3) {
    for (let i = 0; i < 4; i++) {
      dj.hihat.triggerAttackRelease('C1', '64n', time + i * 0.05);
    }
  }
  
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Transition Templates</h2>
        <div className="grid gap-4">
          <Template
            title="EQ Swap Transition"
            bpm={128}
            key="Any"
            description="Smooth transition using EQ isolation"
            code={`// 16-beat transition from A to B
let beat = 0;

dj.loop('4n', () => {
  const progress = beat / 16;
  
  // Fade out A bass, fade in B bass
  dj.deck.A.eq.setLow(-Infinity * progress);
  dj.deck.B.eq.setLow(0);
  
  // Crossfade
  dj.mixer.setCrossfader(-1 + (progress * 2));
  
  beat++;
});`}
          />
          <Template
            title="Echo Out Transition"
            bpm={128}
            key="Any"
            description="Delay-based outro effect"
            code={`// Echo out deck A over 8 bars
let bar = 0;

dj.loop('1m', () => {
  const progress = bar / 8;
  
  // Increase delay feedback
  dj.effects.delay.feedback.value = 0.3 + (progress * 0.6);
  dj.effects.delay.wet.value = 0.5;
  
  // Fade out volume
  dj.deck.A.setVolume(1 - progress);
  
  bar++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Load Templates</h2>
        <p className="text-zinc-300 mb-4">
          All templates are available in the code editor. Click "Templates" button to browse and load.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <Code>{`// Load template programmatically
import { templates } from '@/data/templates';

const aviciiLevels = templates.find(t => t.id === 'avicii_levels');
dj.loadTemplate(aviciiLevels.code);`}</Code>
        </div>
      </section>
    </div>
  );
}

function Template({ title, bpm, key: musicalKey, description, code }: {
  title: string;
  bpm: number;
  key: string;
  description: string;
  code: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{bpm} BPM</span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{musicalKey}</span>
        </div>
      </div>
      <Code>{code}</Code>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 overflow-x-auto mt-3">
      <code className="text-xs text-blue-300">{children}</code>
    </pre>
  );
}
