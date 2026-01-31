import { describe, it, expect } from 'vitest';
import {
  getAllGenres,
  getAllArtists,
  fadedTemplate,
  generateFadedCode,
  fadedStyle,
  aloneStyle,
  darksideStyle,
  onMyWayStyle,
  spectreStyle,
  alanWalkerTemplates,
} from '@/data/library';

describe('Library Index', () => {
  describe('getAllGenres', () => {
    it('should return array of genres', () => {
      const genres = getAllGenres();
      
      expect(Array.isArray(genres)).toBe(true);
      expect(genres.length).toBeGreaterThan(0);
    });

    it('should include Progressive House', () => {
      const genres = getAllGenres();
      expect(genres).toContain('Progressive House');
    });

    it('should include Melodic EDM', () => {
      const genres = getAllGenres();
      expect(genres).toContain('Melodic EDM');
    });
  });

  describe('getAllArtists', () => {
    it('should return array of artists', () => {
      const artists = getAllArtists();
      
      expect(Array.isArray(artists)).toBe(true);
      expect(artists.length).toBeGreaterThan(0);
    });

    it('should include Alan Walker', () => {
      const artists = getAllArtists();
      expect(artists).toContain('Alan Walker');
    });
  });

  describe('fadedTemplate', () => {
    it('should have required properties', () => {
      expect(fadedTemplate).toHaveProperty('name');
      expect(fadedTemplate).toHaveProperty('artist');
      expect(fadedTemplate).toHaveProperty('bpm');
      expect(fadedTemplate).toHaveProperty('key');
    });

    it('should have correct metadata', () => {
      expect(fadedTemplate.name).toBe('Faded');
      expect(fadedTemplate.artist).toBe('Alan Walker');
      expect(fadedTemplate.bpm).toBe(90);
    });

    it('should have instruments defined', () => {
      expect(fadedTemplate).toHaveProperty('instruments');
      expect(Array.isArray(fadedTemplate.instruments)).toBe(true);
      expect(fadedTemplate.instruments.length).toBeGreaterThan(0);
    });
  });

  describe('generateFadedCode', () => {
    it('should return a string', () => {
      const code = generateFadedCode();
      expect(typeof code).toBe('string');
    });

    it('should contain BPM setting', () => {
      const code = generateFadedCode();
      expect(code).toContain('bpm');
    });

    it('should contain pattern definitions', () => {
      const code = generateFadedCode();
      expect(code.length).toBeGreaterThan(100);
    });
  });

  describe('Alan Walker Styles', () => {
    it('fadedStyle should have correct properties', () => {
      expect(fadedStyle).toHaveProperty('name');
      expect(fadedStyle.name).toContain('Faded');
      expect(fadedStyle).toHaveProperty('bpm', 90);
      expect(fadedStyle).toHaveProperty('key');
    });

    it('aloneStyle should have correct properties', () => {
      expect(aloneStyle).toHaveProperty('name');
      expect(aloneStyle.name).toContain('Alone');
      expect(aloneStyle).toHaveProperty('bpm');
    });

    it('darksideStyle should have correct properties', () => {
      expect(darksideStyle).toHaveProperty('name');
      expect(darksideStyle.name).toContain('Darkside');
      expect(darksideStyle).toHaveProperty('bpm');
    });

    it('onMyWayStyle should have correct properties', () => {
      expect(onMyWayStyle).toHaveProperty('name');
      expect(onMyWayStyle.name).toContain('On My Way');
      expect(onMyWayStyle).toHaveProperty('bpm');
    });

    it('spectreStyle should have correct properties', () => {
      expect(spectreStyle).toHaveProperty('name');
      expect(spectreStyle.name).toContain('Spectre');
      expect(spectreStyle).toHaveProperty('bpm');
    });
  });

  describe('alanWalkerTemplates', () => {
    it('should be an array', () => {
      expect(Array.isArray(alanWalkerTemplates)).toBe(true);
    });

    it('should contain multiple templates', () => {
      expect(alanWalkerTemplates.length).toBeGreaterThanOrEqual(1);
    });

    it('each template should have required properties', () => {
      for (const template of alanWalkerTemplates) {
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('bpm');
        expect(template).toHaveProperty('key');
      }
    });
  });
});
