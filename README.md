# 🎧 Algorhythm

> **"This is not just a DJ app. This is a new instrument. Where code meets creativity. Where algorithms meet artistry. Where anyone can create radio-ready music with the power of programming."**

## The World's First Code-Based Professional DJ Platform

Algorhythm combines the power of professional DJ software (Pioneer CDJ, Serato) with the flexibility of studio DAWs (Ableton, FL Studio) - all controlled through code. Create, remix, and perform like never before.

### ✨ Features

- 🎛️ **4-Deck Professional Mixer** - Mix multiple tracks simultaneously
- 🎵 **Auto BPM & Beat Detection** - Intelligent track analysis
- 📊 **Professional Waveform Display** - Visual feedback with beat grids
- 🎯 **8 Hot Cues per Deck** - Quick navigation and performance
- 🎚️ **3-Band EQ (Isolator)** - Kill/boost frequencies like DJM mixers
- ↔️ **Crossfader with Curves** - Smooth transitions or sharp cuts
- 🔁 **Advanced Loop Controls** - Double, halve, shift loops on the fly
- ⏱️ **Time Stretching** - Change tempo without changing pitch
- 🎹 **Key Detection** - Harmonic mixing made easy
- 🔄 **Beat Sync** - Auto-match BPM and phase
- 📈 **Real-Time Spectrum Analyzer** - Visual frequency display
- 🎙️ **Mix Recording & Export** - Radio-ready WAV/MP3 output
- 🎮 **MIDI Controller Support** - Use your hardware DJ controller
- 💿 **Vinyl Mode & Scratching** - Turntablism support
- 🎨 **Color FX** - One-knob creative effects
- 📝 **Live Code Editing** - Change parameters while playing
- ☁️ **Cloud Save & Share** - Collaborate and share your mixes

### 🎯 Quality Standards

- **Audio Processing**: 32-bit float, 48kHz (Ableton/FL Studio grade)
- **Latency**: <15ms (Pioneer CDJ grade)
- **Effects**: Studio-quality DSP algorithms
- **Export**: WAV 24-bit, MP3 320kbps (Radio-ready)

## 🚀 Getting Started

### Installation

```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start DJing with code.

### First Mix

1. Click "INITIALIZE_SYSTEM" to start the audio engine
2. Load a track into Deck A
3. Write your first code:

```typescript
dj.bpm = 128;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Play kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Sweep filter over 8 bars
  dj.deck.A.filter.cutoff = 500 + (bar % 8) * 1000;
  
  tick++;
});
```

4. Press `SHIFT+ENTER` or click "RUN_EXEC"
5. 🎉 You're DJing with code!

## 🧪 Testing

We use Vitest for unit and integration testing.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/tests/engine/patternParser.test.ts
```

### Test Structure

```
src/tests/
├── engine/           # Audio engine tests
│   ├── patternParser.test.ts
│   ├── automation.test.ts
│   ├── templates.test.ts
│   ├── presets.test.ts
│   └── remixEngine.test.ts
├── data/             # Data layer tests
│   ├── library.test.ts
│   └── templates.test.ts
├── features/         # Feature module tests
│   └── streaming/
│       ├── chat.test.ts
│       └── storage.test.ts
└── utils/            # Utility tests
    └── helpers.test.ts
```

## 📚 Documentation

**[View Full Documentation →](/docs)**

Complete documentation available at `/docs`:

- **[Getting Started](/docs)** - Quick start guide
- **[Core Concepts](/docs/concepts)** - Architecture & fundamentals
- **[API Reference](/docs/api)** - Complete API documentation
- **[DJ Techniques](/docs/techniques)** - Professional mixing techniques
- **[Effects Guide](/docs/effects)** - Studio-quality effects
- **[MIDI Setup](/docs/midi)** - Hardware controller integration
- **[Examples](/docs/examples)** - 40+ production templates

## 🎓 Learn by Example

Check out the built-in templates:
- Avicii-style progressive house
- Marshmello future bass
- Daft Punk French house
- Synthwave retro vibes
- And 40+ more!

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Audio Engine**: Tone.js (Web Audio API)
- **Code Editor**: Monaco Editor
- **Waveforms**: WaveSurfer.js
- **Analysis**: Essentia.js, Web Audio Beat Detector
- **Time Stretching**: SoundTouch.js
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/           # Reusable UI primitives
│   ├── deck/         # Deck-related components
│   ├── mixer/        # Mixer components
│   ├── streaming/    # Streaming dashboard
│   └── Effects/      # Visual effects
├── engine/           # Audio engine (core)
│   ├── core/         # Deck, Mixer, MasterBus
│   ├── timing/       # BeatSync, Quantize, TimeStretch
│   ├── instruments/  # Synths and samplers
│   ├── remix/        # RemixEngine, StyleProcessor
│   ├── control/      # MIDI, Vinyl
│   ├── analysis/     # Spectrum, Performance
│   ├── playback/     # Sample playback
│   ├── dsp/          # Effects (Delay, Reverb, EQ)
│   └── streaming/    # Live streaming support
├── features/         # Feature modules
│   ├── audio/        # Audio feature exports
│   ├── library/      # Template library
│   └── streaming/    # Streaming integration
├── data/             # Static data and templates
│   └── library/      # Song templates
├── hooks/            # React hooks
├── lib/              # Utilities
└── tests/            # Test files
```

## 🎯 Use Cases

- **Live Performance**: Code your DJ set in real-time
- **Music Production**: Create unique remixes and edits
- **Education**: Learn music theory through code
- **Creative Coding**: Algorithmic music composition
- **Collaboration**: Share and remix code with others

## 🌟 Why Algorhythm?

### Traditional DJ Software
- ❌ Limited to hardware controls
- ❌ Manual, repetitive tasks
- ❌ Hard to create complex patterns
- ❌ Difficult to share techniques

### Algorhythm
- ✅ Infinite creative possibilities with code
- ✅ Automate complex transitions
- ✅ Mathematical precision (perfect curves, timing)
- ✅ Share code snippets and techniques
- ✅ Works in browser (no installation)
- ✅ Hardware MIDI support (best of both worlds)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🙏 Acknowledgments

- Inspired by world-class DJs: Avicii, Alan Walker, Marshmello, Deadmau5
- Built with love for the DJ and creative coding community
- Powered by open-source audio technology

---

**Ready to revolutionize DJing?** Start coding your next hit! 🎵🚀
