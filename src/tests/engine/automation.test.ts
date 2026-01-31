import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AutomationRecorder } from '@/engine/automation';

// Mock Tone.js
vi.mock('tone', () => ({
  now: vi.fn(() => 0),
  getTransport: vi.fn(() => ({
    schedule: vi.fn(),
  })),
}));

describe('AutomationRecorder', () => {
  let recorder: AutomationRecorder;

  beforeEach(() => {
    recorder = new AutomationRecorder();
  });

  describe('recording', () => {
    it('should start recording', () => {
      recorder.startRecording();
      // Recording should be active (internal state)
      expect(() => recorder.record('volume', 0.5)).not.toThrow();
    });

    it('should stop recording and create clips', () => {
      recorder.startRecording();
      recorder.record('volume', 0.5);
      recorder.record('volume', 0.7);
      recorder.stopRecording();
      
      const clip = recorder.getClip('volume');
      expect(clip).toBeDefined();
    });

    it('should not record when not in recording mode', () => {
      recorder.record('volume', 0.5);
      const clip = recorder.getClip('volume');
      expect(clip).toBeUndefined();
    });

    it('should record multiple parameters', () => {
      recorder.startRecording();
      recorder.record('volume', 0.5);
      recorder.record('filter', 1000);
      recorder.record('pan', -0.5);
      recorder.stopRecording();
      
      expect(recorder.getClip('volume')).toBeDefined();
      expect(recorder.getClip('filter')).toBeDefined();
      expect(recorder.getClip('pan')).toBeDefined();
    });
  });

  describe('clip management', () => {
    it('should delete clips', () => {
      recorder.startRecording();
      recorder.record('volume', 0.5);
      recorder.stopRecording();
      
      const clip = recorder.getClip('volume');
      expect(clip).toBeDefined();
      
      recorder.deleteClip('volume');
      expect(recorder.getClip('volume')).toBeUndefined();
    });

    it('should clear all clips', () => {
      recorder.startRecording();
      recorder.record('volume', 0.5);
      recorder.record('filter', 1000);
      recorder.stopRecording();
      
      recorder.clear();
      
      expect(recorder.getClip('volume')).toBeUndefined();
      expect(recorder.getClip('filter')).toBeUndefined();
    });
  });

  describe('export/import', () => {
    it('should export clips to JSON', () => {
      recorder.startRecording();
      recorder.record('volume', 0.5);
      recorder.stopRecording();
      
      const exported = recorder.export();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it('should import clips from JSON', () => {
      const clipData = JSON.stringify([{
        id: 'test_clip',
        parameter: 'volume',
        points: [{ time: 0, value: 0.5 }],
        duration: 1,
      }]);
      
      recorder.import(clipData);
      
      const clip = recorder.getClip('test_clip');
      expect(clip).toBeDefined();
      expect(clip?.parameter).toBe('volume');
    });
  });
});
