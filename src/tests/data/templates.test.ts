import { describe, it, expect } from 'vitest';
import {
  FADED_TEMPLATE,
  TEMPLATES,
  getTemplates,
  getTemplateById,
  getTemplatesByPersona,
  fadedTemplate,
  type Template,
} from '@/data/templates';

describe('Templates', () => {
  describe('FADED_TEMPLATE', () => {
    it('should have correct id', () => {
      expect(FADED_TEMPLATE.id).toBe('alan-walker-faded');
    });

    it('should have correct name', () => {
      expect(FADED_TEMPLATE.name).toBe('Faded');
    });

    it('should have correct persona', () => {
      expect(FADED_TEMPLATE.persona).toBe('Alan Walker');
    });

    it('should have description', () => {
      expect(FADED_TEMPLATE.description).toBeTruthy();
      expect(FADED_TEMPLATE.description).toContain('90 BPM');
    });

    it('should have code', () => {
      expect(typeof FADED_TEMPLATE.code).toBe('string');
      expect(FADED_TEMPLATE.code.length).toBeGreaterThan(0);
    });
  });

  describe('TEMPLATES array', () => {
    it('should be an array', () => {
      expect(Array.isArray(TEMPLATES)).toBe(true);
    });

    it('should contain at least one template', () => {
      expect(TEMPLATES.length).toBeGreaterThanOrEqual(1);
    });

    it('should contain FADED_TEMPLATE', () => {
      expect(TEMPLATES).toContain(FADED_TEMPLATE);
    });

    it('each template should have required properties', () => {
      for (const template of TEMPLATES) {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('persona');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('code');
      }
    });
  });

  describe('getTemplates', () => {
    it('should return all templates', () => {
      const templates = getTemplates();
      expect(templates).toEqual(TEMPLATES);
    });

    it('should return an array', () => {
      const templates = getTemplates();
      expect(Array.isArray(templates)).toBe(true);
    });
  });

  describe('getTemplateById', () => {
    it('should find template by id', () => {
      const template = getTemplateById('alan-walker-faded');
      expect(template).toBeDefined();
      expect(template?.name).toBe('Faded');
    });

    it('should return undefined for non-existent id', () => {
      const template = getTemplateById('non-existent-id');
      expect(template).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const template = getTemplateById('ALAN-WALKER-FADED');
      expect(template).toBeUndefined();
    });
  });

  describe('getTemplatesByPersona', () => {
    it('should find templates by persona', () => {
      const templates = getTemplatesByPersona('Alan Walker');
      expect(templates.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array for non-existent persona', () => {
      const templates = getTemplatesByPersona('Non Existent Artist');
      expect(templates).toEqual([]);
    });

    it('should be case-sensitive', () => {
      const templates = getTemplatesByPersona('alan walker');
      expect(templates).toEqual([]);
    });

    it('all returned templates should have matching persona', () => {
      const templates = getTemplatesByPersona('Alan Walker');
      for (const template of templates) {
        expect(template.persona).toBe('Alan Walker');
      }
    });
  });

  describe('fadedTemplate re-export', () => {
    it('should be exported', () => {
      expect(fadedTemplate).toBeDefined();
    });

    it('should have name property', () => {
      expect(fadedTemplate).toHaveProperty('name');
    });
  });

  describe('Template type', () => {
    it('should match expected structure', () => {
      const template: Template = {
        id: 'test-id',
        name: 'Test',
        persona: 'Test Artist',
        description: 'Test description',
        code: 'test code',
      };
      
      expect(template.id).toBe('test-id');
      expect(template.name).toBe('Test');
      expect(template.persona).toBe('Test Artist');
      expect(template.description).toBe('Test description');
      expect(template.code).toBe('test code');
    });
  });
});
