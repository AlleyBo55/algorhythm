import { describe, it, expect } from 'vitest';
import { PatternParser } from '@/engine/patternParser';

describe('PatternParser', () => {
  describe('parse', () => {
    it('should parse simple space-separated pattern', () => {
      const events = PatternParser.parse('k s k s');
      
      expect(events).toHaveLength(4);
      expect(events[0]).toEqual({ time: 0, value: 'k', duration: 0.25 });
      expect(events[1]).toEqual({ time: 0.25, value: 's', duration: 0.25 });
      expect(events[2]).toEqual({ time: 0.5, value: 'k', duration: 0.25 });
      expect(events[3]).toEqual({ time: 0.75, value: 's', duration: 0.25 });
    });

    it('should handle rests with ~ symbol', () => {
      const events = PatternParser.parse('k ~ s ~');
      
      expect(events).toHaveLength(2);
      expect(events[0].value).toBe('k');
      expect(events[1].value).toBe('s');
    });

    it('should handle rests with - symbol', () => {
      const events = PatternParser.parse('k - s -');
      
      expect(events).toHaveLength(2);
      expect(events[0].value).toBe('k');
      expect(events[1].value).toBe('s');
    });

    it('should parse subdivisions in brackets', () => {
      const events = PatternParser.parse('k [s s] k s');
      
      expect(events).toHaveLength(5);
      // First k at 0
      expect(events[0]).toEqual({ time: 0, value: 'k', duration: 0.25 });
      // Subdivided [s s] - two events in the second slot
      expect(events[1].time).toBeCloseTo(0.25, 5);
      expect(events[1].value).toBe('s');
      expect(events[2].time).toBeCloseTo(0.375, 5);
      expect(events[2].value).toBe('s');
    });

    it('should handle nested subdivisions', () => {
      const events = PatternParser.parse('[k k] [s s]');
      
      expect(events).toHaveLength(4);
      expect(events[0].time).toBeCloseTo(0, 5);
      expect(events[1].time).toBeCloseTo(0.25, 5);
      expect(events[2].time).toBeCloseTo(0.5, 5);
      expect(events[3].time).toBeCloseTo(0.75, 5);
    });

    it('should handle single element pattern', () => {
      const events = PatternParser.parse('k');
      
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({ time: 0, value: 'k', duration: 1 });
    });

    it('should handle empty pattern', () => {
      const events = PatternParser.parse('');
      
      expect(events).toHaveLength(0);
    });

    it('should handle complex drum pattern', () => {
      const events = PatternParser.parse('k ~ s ~ k k s ~');
      
      expect(events).toHaveLength(5);
      expect(events.map(e => e.value)).toEqual(['k', 's', 'k', 'k', 's']);
    });

    it('should calculate correct durations for subdivisions', () => {
      const events = PatternParser.parse('[k k k k]');
      
      expect(events).toHaveLength(4);
      events.forEach(event => {
        expect(event.duration).toBeCloseTo(0.25, 5);
      });
    });

    it('should handle hi-hat pattern with subdivisions', () => {
      const events = PatternParser.parse('[h h] [h h] [h h] [h h]');
      
      expect(events).toHaveLength(8);
      // All should be 'h'
      events.forEach(event => {
        expect(event.value).toBe('h');
      });
    });
  });
});
