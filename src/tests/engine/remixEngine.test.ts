import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Tone.js
vi.mock('tone', () => ({
  default: {
    now: vi.fn(() => 0),
    gainToDb: vi.fn((gain: number) => 20 * Math.log10(gain)),
    Time: vi.fn(() => ({ toSeconds: () => 0.125 })),
  },
  Analyser: vi.fn(() => ({
    getValue: vi.fn(() => new Float32Array(2048)),
    dispose: vi.fn(),
  })),
  Compressor: vi.fn(() => ({
    threshold: { value: -24 },
    dispose: vi.fn(),
  })),
  Signal: vi.fn(() => ({
    connect: vi.fn(),
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    dispose: vi.fn(),
  })),
  now: vi.fn(() => 0),
  gainToDb: vi.fn((gain: number) => 20 * Math.log10(gain)),
  Time: vi.fn(() => ({ toSeconds: () => 0.125 })),
}));

import { RemixEngine, InstrumentTracker } from '@/engine/remix/remixEngine';
import type { InstrumentConfig } from '@/data/library/types';

// Mock Deck
const createMockDeck = () => ({
  player: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    chain: vi.fn(),
  },
  eq: {
    low: { gain: { rampTo: vi.fn() } },
    mid: { gain: { rampTo: vi.fn() } },
    high: { gain: { rampTo: vi.fn() } },
  },
  volume: {
    volume: {
      value: 0,
      rampTo: vi.fn(),
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
  },
  filter: {
    frequency: {
      rampTo: vi.fn(),
      setValueAtTime: vi.fn(),
    },
  },
});

describe('RemixEngine', () => {
  let remixEngine: RemixEngine;
  let mockDeck: ReturnType<typeof createMockDeck>;

  beforeEach(() => {
    vi.clearAllMocks();
    remixEngine = new RemixEngine();
    mockDeck = createMockDeck();
  });

  afterEach(() => {
    remixEngine.dispose();
  });

  describe('analyzeTrack', () => {
    it('should return frequency profile with bass, mid, high', () => {
      const profile = remixEngine.analyzeTrack(mockDeck as any);
      
      expect(profile).toHaveProperty('bass');
      expect(profile).toHaveProperty('mid');
      expect(profile).toHaveProperty('high');
    });

    it('should connect deck player to analyser', () => {
      remixEngine.analyzeTrack(mockDeck as any);
      
      expect(mockDeck.player.connect).toHaveBeenCalled();
    });
  });

  describe('carveEQ', () => {
    it('should cut bass when bass instruments are active', () => {
      const activeInstruments = new Set(['bass', 'kick']);
      
      remixEngine.carveEQ(mockDeck as any, activeInstruments);
      
      expect(mockDeck.eq.low.gain.rampTo).toHaveBeenCalledWith(-12, 0.05);
    });

    it('should cut mids when lead instruments are active', () => {
      const activeInstruments = new Set(['lead', 'synth']);
      
      remixEngine.carveEQ(mockDeck as any, activeInstruments);
      
      expect(mockDeck.eq.mid.gain.rampTo).toHaveBeenCalledWith(-6, 0.05);
    });

    it('should cut highs when hihat/cymbal are active', () => {
      const activeInstruments = new Set(['hihat', 'cymbal']);
      
      remixEngine.carveEQ(mockDeck as any, activeInstruments);
      
      expect(mockDeck.eq.high.gain.rampTo).toHaveBeenCalledWith(-6, 0.05);
    });

    it('should not cut frequencies when no instruments active', () => {
      const activeInstruments = new Set<string>();
      
      remixEngine.carveEQ(mockDeck as any, activeInstruments);
      
      expect(mockDeck.eq.low.gain.rampTo).toHaveBeenCalledWith(0, 0.05);
      expect(mockDeck.eq.mid.gain.rampTo).toHaveBeenCalledWith(0, 0.05);
      expect(mockDeck.eq.high.gain.rampTo).toHaveBeenCalledWith(0, 0.05);
    });
  });

  describe('calculateIntensity', () => {
    const config = {
      introLength: 8,
      buildLength: 16,
      dropBar: 24,
    };

    it('should return 0 during intro', () => {
      expect(remixEngine.calculateIntensity(0, config)).toBe(0);
      expect(remixEngine.calculateIntensity(4, config)).toBe(0);
      expect(remixEngine.calculateIntensity(7, config)).toBe(0);
    });

    it('should gradually increase during build', () => {
      const intensity12 = remixEngine.calculateIntensity(12, config);
      const intensity16 = remixEngine.calculateIntensity(16, config);
      const intensity20 = remixEngine.calculateIntensity(20, config);
      
      expect(intensity12).toBeGreaterThan(0);
      expect(intensity16).toBeGreaterThan(intensity12);
      expect(intensity20).toBeGreaterThan(intensity16);
    });

    it('should cap at 0.7 during build', () => {
      const intensity = remixEngine.calculateIntensity(23, config);
      expect(intensity).toBeLessThanOrEqual(0.7);
    });

    it('should return 1.0 at drop', () => {
      expect(remixEngine.calculateIntensity(24, config)).toBe(1.0);
      expect(remixEngine.calculateIntensity(32, config)).toBe(1.0);
    });
  });

  describe('shouldPlaySample', () => {
    it('should allow bass sample when bass energy is low', () => {
      const profile = { bass: 0.1, mid: 0.5, high: 0.5 };
      expect(remixEngine.shouldPlaySample(profile, 'bass')).toBe(true);
    });

    it('should block bass sample when bass energy is high', () => {
      const profile = { bass: 0.8, mid: 0.5, high: 0.5 };
      expect(remixEngine.shouldPlaySample(profile, 'bass')).toBe(false);
    });

    it('should allow lead sample when mid energy is low', () => {
      const profile = { bass: 0.5, mid: 0.1, high: 0.5 };
      expect(remixEngine.shouldPlaySample(profile, 'lead')).toBe(true);
    });

    it('should allow hihat sample when high energy is low', () => {
      const profile = { bass: 0.5, mid: 0.5, high: 0.1 };
      expect(remixEngine.shouldPlaySample(profile, 'hihat')).toBe(true);
    });

    it('should always allow unknown sample types', () => {
      const profile = { bass: 0.9, mid: 0.9, high: 0.9 };
      expect(remixEngine.shouldPlaySample(profile, 'unknown')).toBe(true);
    });
  });

  describe('dispose', () => {
    it('should clean up resources', () => {
      // Initialize by calling a method
      remixEngine.analyzeTrack(mockDeck as any);
      
      // Should not throw
      expect(() => remixEngine.dispose()).not.toThrow();
    });

    it('should be safe to call multiple times', () => {
      remixEngine.dispose();
      expect(() => remixEngine.dispose()).not.toThrow();
    });
  });
});

describe('InstrumentTracker', () => {
  let tracker: InstrumentTracker;

  beforeEach(() => {
    vi.useFakeTimers();
    tracker = new InstrumentTracker();
  });

  afterEach(() => {
    tracker.clear();
    vi.useRealTimers();
  });

  const createMockInstrument = (name: string): InstrumentConfig => ({
    name,
    type: 'synth',
    frequencyProfile: { bass: false, mid: true, high: false },
    volume: 0,
  });

  it('should track played instruments', () => {
    const instrument = createMockInstrument('lead');
    tracker.play(instrument, 1000);
    
    const active = tracker.getActive();
    expect(active.size).toBe(1);
  });

  it('should auto-remove instruments after duration', () => {
    const instrument = createMockInstrument('lead');
    tracker.play(instrument, 500);
    
    expect(tracker.getActive().size).toBe(1);
    
    vi.advanceTimersByTime(600);
    
    expect(tracker.getActive().size).toBe(0);
  });

  it('should track multiple instruments', () => {
    tracker.play(createMockInstrument('lead'), 1000);
    tracker.play(createMockInstrument('bass'), 1000);
    tracker.play(createMockInstrument('pad'), 1000);
    
    expect(tracker.getActive().size).toBe(3);
  });

  it('should clear all instruments', () => {
    tracker.play(createMockInstrument('lead'), 1000);
    tracker.play(createMockInstrument('bass'), 1000);
    
    tracker.clear();
    
    expect(tracker.getActive().size).toBe(0);
  });

  it('should reset timeout when same instrument played again', () => {
    const instrument = createMockInstrument('lead');
    
    tracker.play(instrument, 500);
    vi.advanceTimersByTime(400);
    
    // Play again before timeout
    tracker.play(instrument, 500);
    vi.advanceTimersByTime(400);
    
    // Should still be active (reset the timer)
    expect(tracker.getActive().size).toBe(1);
  });
});
