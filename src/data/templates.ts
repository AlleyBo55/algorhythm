/**
 * Template Library - Simplified
 * Only Alan Walker - Faded template
 */

import { fadedTemplate, generateFadedCode } from './library/songs/alan_walker_faded';

export interface Template {
  id: string;
  name: string;
  persona: string;
  description: string;
  code: string;
}

// Single template - Alan Walker Faded
export const FADED_TEMPLATE: Template = {
  id: 'alan-walker-faded',
  name: 'Faded',
  persona: 'Alan Walker',
  description: 'Progressive House at 90 BPM in F# minor',
  code: generateFadedCode(),
};

// Export as array for compatibility
export const TEMPLATES: Template[] = [FADED_TEMPLATE];

// Helper functions
export function getTemplates(): Template[] {
  return TEMPLATES;
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByPersona(persona: string): Template[] {
  return TEMPLATES.filter(t => t.persona === persona);
}

// Re-export the raw template data
export { fadedTemplate };
