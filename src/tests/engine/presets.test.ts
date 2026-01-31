import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Tone.js
vi.mock('tone', () => ({
  default: {},
  Synth: vi.fn(() => ({ set: vi.fn() })),
  PolySynth: vi.fn(() => ({ set: vi.fn() })),
  MembraneSynth: vi.fn(() => ({ set: vi.fn() })),
  MetalSynth: vi.fn(() => ({ set: vi.fn() })),
  NoiseSynth: vi.fn(() => ({ set: vi.fn() })),
  FMSynth: vi.fn(() => ({ set: vi.fn() })),
  AMSynth: vi.fn(() => ({ set: vi.fn() })),
  PluckSynth: vi.fn(() => ({ set: vi.fn() })),
  Sampler: vi.fn(() => ({ set: vi.fn() })),
}));

// Mock InstrumentMap
const createMockInstruments = () => ({
  lead: { set: vi.fn() },
  pad: { set: vi.fn() },
  bass: { set: vi.fn() },
  arp: { set: vi.fn() },
  piano: { set: vi.fn() },
  kick: { set: vi.fn() },
  snare: { set: vi.fn() },
  hihat: { set: vi.fn() },
  strings: { set: vi.fn() },
  pluck: { set: vi.fn() },
  tom: { set: vi.fn() },
  fm: { set: vi.fn() },
  bass808: { set: vi.fn() },
  sub: { set: vi.fn() },
  violin: { set: vi.fn() },
  trumpet: { set: vi.fn() },
  cymbal: { set: vi.fn() },
  flute: { set: vi.fn() },
});

describe('Presets', () => {
  let mockInstruments: ReturnType<typeof createMockInstruments>;
  let presets: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockInstruments = createMockInstruments();
    
    // Dynamic import to get createPresets
    const { createPresets } = await import('@/engine/presets');
    presets = createPresets(mockInstruments as any);
  });

  describe('createPresets', () => {
    it('should return an object with all preset functions', () => {
      expect(presets).toBeDefined();
      expect(typeof presets.alanWalker).toBe('function');
      expect(typeof presets.marshmello).toBe('function');
      expect(typeof presets.synthwave).toBe('function');
      expect(typeof presets.reset).toBe('function');
    });

    it('should have all expected preset keys', () => {
      const expectedPresets = [
        'alanWalker', 'marshmello', 'steveAoki', 'diplo', 'synthwave',
        'strangerThings', 'mandalorian', 'lofi', 'animeOst', 'animeBattle',
        'daftPunk', 'hansZimmer', 'ghibli', 'trap', 'eurobeat',
        'pop', 'rock', 'orchestral', 'theWeeknd', 'duaLipa',
        'nujabes', 'postMalone', 'linkinPark', 'funky_80s', 'reset'
      ];
      
      for (const preset of expectedPresets) {
        expect(presets[preset]).toBeDefined();
      }
    });
  });

  describe('alanWalker preset', () => {
    it('should configure pad with ethereal settings', () => {
      presets.alanWalker();
      
      expect(mockInstruments.pad.set).toHaveBeenCalled();
      const padCall = mockInstruments.pad.set.mock.calls[0][0];
      expect(padCall.envelope.attack).toBeGreaterThan(1);
      expect(padCall.envelope.release).toBeGreaterThan(3);
    });

    it('should configure lead with fatsawtooth', () => {
      presets.alanWalker();
      
      expect(mockInstruments.lead.set).toHaveBeenCalled();
    });
  });

  describe('marshmello preset', () => {
    it('should configure lead with wide supersaw', () => {
      presets.marshmello();
      
      expect(mockInstruments.lead.set).toHaveBeenCalled();
      const leadCall = mockInstruments.lead.set.mock.calls[0][0];
      expect(leadCall.oscillator.spread).toBeGreaterThanOrEqual(70);
    });

    it('should boost kick volume for punchy sound', () => {
      presets.marshmello();
      
      expect(mockInstruments.kick.set).toHaveBeenCalled();
      const kickCall = mockInstruments.kick.set.mock.calls[0][0];
      expect(kickCall.volume).toBeGreaterThan(0);
    });
  });

  describe('trap preset', () => {
    it('should configure bass808 with heavy settings', () => {
      presets.trap();
      
      expect(mockInstruments.bass808.set).toHaveBeenCalled();
      const bassCall = mockInstruments.bass808.set.mock.calls[0][0];
      expect(bassCall.volume).toBeGreaterThan(5);
    });

    it('should mute standard bass instruments', () => {
      presets.trap();
      
      expect(mockInstruments.sub.set).toHaveBeenCalledWith({ volume: -100 });
      expect(mockInstruments.bass.set).toHaveBeenCalledWith({ volume: -100 });
    });
  });

  describe('eurobeat preset', () => {
    it('should configure lead with intense supersaw', () => {
      presets.eurobeat();
      
      expect(mockInstruments.lead.set).toHaveBeenCalled();
      const leadCall = mockInstruments.lead.set.mock.calls[0][0];
      expect(leadCall.oscillator.count).toBeGreaterThanOrEqual(8);
      expect(leadCall.oscillator.spread).toBeGreaterThanOrEqual(80);
    });
  });

  describe('orchestral preset', () => {
    it('should configure orchestral instruments', () => {
      presets.orchestral();
      
      expect(mockInstruments.violin.set).toHaveBeenCalled();
      expect(mockInstruments.trumpet.set).toHaveBeenCalled();
      expect(mockInstruments.strings.set).toHaveBeenCalled();
    });

    it('should silence generic lead', () => {
      presets.orchestral();
      
      expect(mockInstruments.lead.set).toHaveBeenCalledWith({ volume: -100 });
    });
  });

  describe('reset preset', () => {
    it('should reset lead to default settings', () => {
      presets.reset();
      
      expect(mockInstruments.lead.set).toHaveBeenCalled();
      const leadCall = mockInstruments.lead.set.mock.calls[0][0];
      expect(leadCall.volume).toBe(0);
    });

    it('should reset pad to default settings', () => {
      presets.reset();
      
      expect(mockInstruments.pad.set).toHaveBeenCalled();
    });
  });
});
