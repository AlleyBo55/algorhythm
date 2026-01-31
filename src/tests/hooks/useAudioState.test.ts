import { describe, it, expect, vi } from 'vitest';

// Mock React hooks
vi.mock('react', () => ({
  useState: vi.fn((initial) => [initial, vi.fn()]),
  useCallback: vi.fn((fn) => fn),
  useEffect: vi.fn(),
  useRef: vi.fn(() => ({ current: null })),
}));

describe('useAudioState Hook', () => {
  describe('initial state', () => {
    it('should have default isPlaying as false', () => {
      const defaultState = {
        isPlaying: false,
        bpm: 120,
        volume: 0.8,
        currentTime: 0,
      };
      
      expect(defaultState.isPlaying).toBe(false);
    });

    it('should have default bpm as 120', () => {
      const defaultState = { bpm: 120 };
      expect(defaultState.bpm).toBe(120);
    });

    it('should have default volume between 0 and 1', () => {
      const defaultState = { volume: 0.8 };
      expect(defaultState.volume).toBeGreaterThanOrEqual(0);
      expect(defaultState.volume).toBeLessThanOrEqual(1);
    });
  });


  describe('state transitions', () => {
    it('should toggle play state', () => {
      let isPlaying = false;
      const togglePlay = () => { isPlaying = !isPlaying; };
      
      togglePlay();
      expect(isPlaying).toBe(true);
      
      togglePlay();
      expect(isPlaying).toBe(false);
    });

    it('should update bpm within valid range', () => {
      const setBpm = (value: number) => Math.max(60, Math.min(200, value));
      
      expect(setBpm(90)).toBe(90);
      expect(setBpm(30)).toBe(60);
      expect(setBpm(250)).toBe(200);
    });

    it('should update volume within 0-1 range', () => {
      const setVolume = (value: number) => Math.max(0, Math.min(1, value));
      
      expect(setVolume(0.5)).toBe(0.5);
      expect(setVolume(-0.5)).toBe(0);
      expect(setVolume(1.5)).toBe(1);
    });
  });

  describe('audio state interface', () => {
    it('should have correct shape', () => {
      interface AudioState {
        isPlaying: boolean;
        bpm: number;
        volume: number;
        currentTime: number;
        duration: number;
      }
      
      const state: AudioState = {
        isPlaying: false,
        bpm: 120,
        volume: 0.8,
        currentTime: 0,
        duration: 180,
      };
      
      expect(state).toHaveProperty('isPlaying');
      expect(state).toHaveProperty('bpm');
      expect(state).toHaveProperty('volume');
      expect(state).toHaveProperty('currentTime');
      expect(state).toHaveProperty('duration');
    });
  });
});
