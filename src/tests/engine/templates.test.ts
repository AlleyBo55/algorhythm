import { describe, it, expect } from 'vitest';
import { TemplateLibrary, TEMPLATES, Template } from '@/engine/templates';

describe('TemplateLibrary', () => {
  let library: TemplateLibrary;

  beforeEach(() => {
    library = new TemplateLibrary();
  });

  describe('initialization', () => {
    it('should initialize with default templates', () => {
      const all = library.all();
      expect(all.length).toBeGreaterThan(0);
    });

    it('should have valid template structure', () => {
      const all = library.all();
      all.forEach(template => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.artist).toBeDefined();
        expect(template.genre).toBeDefined();
        expect(template.bpm).toBeGreaterThan(0);
        expect(template.key).toBeDefined();
        expect(template.code).toBeDefined();
      });
    });
  });

  describe('get', () => {
    it('should get template by id', () => {
      const template = library.get('avicii-progressive');
      expect(template).toBeDefined();
      expect(template?.artist).toBe('Avicii');
    });

    it('should return undefined for non-existent id', () => {
      const template = library.get('non-existent-id');
      expect(template).toBeUndefined();
    });
  });

  describe('getByGenre', () => {
    it('should filter templates by genre', () => {
      const progressiveHouse = library.getByGenre('Progressive House');
      expect(progressiveHouse.length).toBeGreaterThan(0);
      progressiveHouse.forEach(t => {
        expect(t.genre).toBe('Progressive House');
      });
    });

    it('should return empty array for non-existent genre', () => {
      const result = library.getByGenre('Non-Existent Genre');
      expect(result).toEqual([]);
    });
  });

  describe('getByArtist', () => {
    it('should filter templates by artist', () => {
      const aviciiTemplates = library.getByArtist('Avicii');
      expect(aviciiTemplates.length).toBeGreaterThan(0);
      aviciiTemplates.forEach(t => {
        expect(t.artist).toBe('Avicii');
      });
    });

    it('should return empty array for non-existent artist', () => {
      const result = library.getByArtist('Unknown Artist');
      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('should search by name', () => {
      const results = library.search('progressive');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should search by artist', () => {
      const results = library.search('avicii');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should search by genre', () => {
      const results = library.search('house');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const lower = library.search('avicii');
      const upper = library.search('AVICII');
      expect(lower.length).toBe(upper.length);
    });

    it('should return empty array for no matches', () => {
      const results = library.search('xyznonexistent');
      expect(results).toEqual([]);
    });
  });

  describe('add', () => {
    it('should add new template', () => {
      const newTemplate: Template = {
        id: 'test-template',
        name: 'Test Template',
        artist: 'Test Artist',
        genre: 'Test Genre',
        bpm: 120,
        key: 'Am',
        description: 'Test description',
        code: 'dj.bpm = 120;',
      };

      library.add(newTemplate);
      
      const retrieved = library.get('test-template');
      expect(retrieved).toEqual(newTemplate);
    });

    it('should override existing template with same id', () => {
      const template1: Template = {
        id: 'override-test',
        name: 'Original',
        artist: 'Artist',
        genre: 'Genre',
        bpm: 120,
        key: 'Am',
        description: 'Original',
        code: 'original',
      };

      const template2: Template = {
        ...template1,
        name: 'Updated',
        code: 'updated',
      };

      library.add(template1);
      library.add(template2);
      
      const retrieved = library.get('override-test');
      expect(retrieved?.name).toBe('Updated');
      expect(retrieved?.code).toBe('updated');
    });
  });
});

describe('TEMPLATES constant', () => {
  it('should have at least 5 templates', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(5);
  });

  it('should have unique ids', () => {
    const ids = TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid BPM values', () => {
    TEMPLATES.forEach(template => {
      expect(template.bpm).toBeGreaterThan(60);
      expect(template.bpm).toBeLessThan(200);
    });
  });
});
