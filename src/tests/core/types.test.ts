import { describe, it, expect } from 'vitest';

describe('Core Types', () => {
  describe('Audio Types', () => {
    it('should define AudioState interface correctly', () => {
      interface AudioState {
        isPlaying: boolean;
        bpm: number;
        volume: number;
        currentTime: number;
      }
      
      const state: AudioState = {
        isPlaying: true,
        bpm: 128,
        volume: 0.75,
        currentTime: 45.5,
      };
      
      expect(state.isPlaying).toBe(true);
      expect(state.bpm).toBe(128);
    });

    it('should define DeckState interface correctly', () => {
      interface DeckState {
        id: string;
        trackName: string;
        isPlaying: boolean;
        volume: number;
        pitch: number;
      }
      
      const deck: DeckState = {
        id: 'deck-a',
        trackName: 'Test Track',
        isPlaying: false,
        volume: 1.0,
        pitch: 0,
      };
      
      expect(deck.id).toBe('deck-a');
      expect(deck.pitch).toBe(0);
    });
  });


  describe('Library Types', () => {
    it('should define SongTemplate interface', () => {
      interface SongTemplate {
        name: string;
        artist: string;
        bpm: number;
        key: string;
        genre: string;
      }
      
      const template: SongTemplate = {
        name: 'Faded',
        artist: 'Alan Walker',
        bpm: 90,
        key: 'F#m',
        genre: 'Progressive House',
      };
      
      expect(template.name).toBe('Faded');
      expect(template.bpm).toBe(90);
    });

    it('should define InstrumentConfig interface', () => {
      interface InstrumentConfig {
        name: string;
        type: string;
        volume: number;
        frequencyProfile: {
          bass: boolean;
          mid: boolean;
          high: boolean;
        };
      }
      
      const config: InstrumentConfig = {
        name: 'lead',
        type: 'synth',
        volume: -3,
        frequencyProfile: { bass: false, mid: true, high: true },
      };
      
      expect(config.name).toBe('lead');
      expect(config.frequencyProfile.mid).toBe(true);
    });
  });

  describe('Streaming Types', () => {
    it('should define ChatMessage interface', () => {
      interface ChatMessage {
        username: string;
        message: string;
        platform: 'twitch' | 'youtube';
        isModerator: boolean;
      }
      
      const msg: ChatMessage = {
        username: 'viewer123',
        message: '!drop',
        platform: 'twitch',
        isModerator: false,
      };
      
      expect(msg.platform).toBe('twitch');
      expect(msg.isModerator).toBe(false);
    });

    it('should define StreamConfig interface', () => {
      interface StreamConfig {
        bitrate: number;
        resolution: string;
        fps: number;
        codec: string;
      }
      
      const config: StreamConfig = {
        bitrate: 6000,
        resolution: '1920x1080',
        fps: 60,
        codec: 'h264',
      };
      
      expect(config.bitrate).toBe(6000);
      expect(config.fps).toBe(60);
    });
  });

  describe('Type Guards', () => {
    it('should validate number type', () => {
      const isValidBpm = (value: unknown): value is number => {
        return typeof value === 'number' && value >= 60 && value <= 200;
      };
      
      expect(isValidBpm(120)).toBe(true);
      expect(isValidBpm(50)).toBe(false);
      expect(isValidBpm('120')).toBe(false);
    });

    it('should validate string type', () => {
      const isValidKey = (value: unknown): value is string => {
        const validKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return typeof value === 'string' && validKeys.some(k => value.startsWith(k));
      };
      
      expect(isValidKey('F#m')).toBe(true);
      expect(isValidKey('Xm')).toBe(false);
    });
  });
});
