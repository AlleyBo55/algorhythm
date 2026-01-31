# Clean Architecture

This codebase follows Clean Architecture principles with clear separation of concerns.

## Directory Structure

```
src/
├── core/                 # Domain layer (innermost)
│   └── types/           # Domain entities & interfaces
│       ├── audio.ts     # Audio domain types
│       ├── streaming.ts # Streaming domain types
│       └── library.ts   # Library domain types
│
├── engine/              # Core audio engine implementation
│   ├── core/           # Fundamental audio classes
│   │   ├── deck.ts     # Deck player
│   │   ├── deckBus.ts  # Deck signal bus
│   │   ├── masterBus.ts # Master output bus
│   │   ├── mixer.ts    # Crossfader & mixing
│   │   └── mixingConsole.ts # Channel strips
│   │
│   ├── timing/         # Sync & quantization
│   │   ├── beatSync.ts # Beat synchronization
│   │   ├── sync.ts     # Deck sync
│   │   ├── quantize.ts # Beat quantization
│   │   ├── timestretch.ts # Time stretching
│   │   └── slip.ts     # Slip mode
│   │
│   ├── instruments/    # Synths & samplers
│   │   ├── instruments.ts # Default instruments
│   │   ├── accurateInstruments.ts # Song-specific presets
│   │   └── r2Instruments.ts # R2 CDN instruments
│   │
│   ├── remix/          # Remix & production
│   │   ├── remixEngine.ts # Remix automation
│   │   ├── styleProcessor.ts # Style capture
│   │   ├── soundDesign.ts # Sound design presets
│   │   └── harmonic.ts # Harmonic mixing
│   │
│   ├── control/        # User input
│   │   ├── vinyl.ts    # Vinyl mode & scratching
│   │   └── midi.ts     # MIDI controller
│   │
│   ├── analysis/       # Audio analysis
│   │   ├── analyzer.ts # BPM/key detection
│   │   ├── spectrum.ts # Spectrum analyzer
│   │   └── performance.ts # Performance metrics
│   │
│   ├── playback/       # Sample playback
│   │   ├── samplePlayer.ts # Sample player
│   │   ├── sampleCache.ts # IndexedDB cache
│   │   ├── sampler.ts  # Sample pads
│   │   └── samples.ts  # Sample manager
│   │
│   ├── dsp/            # DSP effects
│   │   ├── delay.ts    # Stereo delay
│   │   ├── reverb.ts   # Reverb
│   │   ├── studioReverb.ts # Studio reverb
│   │   ├── parametricEQ.ts # Parametric EQ
│   │   └── dynamics.ts # Compressor/limiter
│   │
│   ├── streaming/      # Streaming integration
│   │   ├── services/   # Core services
│   │   ├── chat/       # Chat integration
│   │   ├── storage/    # Persistence
│   │   └── infrastructure/ # Network & caching
│   │
│   └── [other files]   # Effects, runner, audio, etc.
│
├── features/            # Feature modules (re-exports)
│   ├── audio/          # Audio engine feature
│   │   ├── index.ts    # Re-exports from engine
│   │   └── dsp/        # DSP re-exports
│   │
│   ├── streaming/      # Streaming feature
│   │   ├── services/   # Service re-exports
│   │   ├── chat/       # Chat re-exports
│   │   ├── storage/    # Storage re-exports
│   │   └── infrastructure/ # Infrastructure re-exports
│   │
│   └── library/        # Template library feature
│
├── components/         # React components
│   ├── layout/        # Layout components (Studio, DJWorkstation)
│   ├── deck/          # Deck components
│   ├── mixer/         # Mixer components
│   ├── visualizers/   # Visualizer components
│   ├── editor/        # Code editor components
│   ├── ai/            # AI assistant components
│   ├── dashboard/     # Dashboard components
│   ├── streaming/     # Streaming dashboard
│   ├── ui/            # UI primitives (Button, Card, Slider)
│   └── Effects/       # 3D visualizers
│
├── hooks/              # React hooks
│   ├── useAudioState.ts
│   ├── useDJ.ts
│   ├── useKeyboardShortcuts.ts
│   └── useStreamingState.ts
│
├── shared/             # Cross-cutting concerns
│   ├── hooks/         # Shared hooks
│   └── utils/         # Shared utilities
│
├── presentation/       # UI layer (outermost)
│   └── components/    # Component re-exports
│
├── data/               # Data layer
│   ├── templates.ts   # Template definitions
│   ├── presets.ts     # Producer presets
│   └── library/       # Template library
│
├── lib/                # Utilities
│   ├── logger.ts
│   ├── monitoring.ts
│   ├── cdn.ts
│   └── performanceMonitor.ts
│
└── app/               # Next.js App Router
    ├── api/          # API routes
    ├── stream/       # Stream page
    └── docs/         # Documentation pages
```

## Dependency Rules

1. **Core** has no dependencies on other layers
2. **Engine** contains implementation, organized by domain
3. **Features** re-export from engine/data layers
4. **Components** organized by feature domain
5. **App** (Next.js) uses all layers

## Import Patterns

```typescript
// ✅ Preferred - Import from feature modules (clean API)
import { Deck, mixer, beatSyncEngine } from '@/features/audio';
import { audioRouter, themeManager } from '@/features/streaming';

// ✅ Acceptable - Import from engine subdirectories
import { Deck } from '@/engine/core/deck';
import { BeatSyncEngine } from '@/engine/timing/beatSync';

// ✅ Component imports
import { Studio, DJWorkstation } from '@/components/layout';
import { Deck, WaveformDisplay } from '@/components/deck';

// ❌ Avoid - Direct imports from old flat structure
import { Deck } from '@/engine/deck';  // Use @/engine/core/deck
```

## Key Principles

- **Single Responsibility**: Each file/module does one thing
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Interface Segregation**: Small, focused interfaces
- **Open/Closed**: Open for extension, closed for modification
