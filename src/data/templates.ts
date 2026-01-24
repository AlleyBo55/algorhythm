import * as Library from './library';

export interface Template {
  id: string;
  name: string;
  persona: string;
  description: string;
  code: string;
}

// Aggregating all templates from the library folder
export const TEMPLATES: Template[] = Object.values(Library);

// Helper to get templates by persona
export function getTemplatesByPersona(persona: string): Template[] {
  return TEMPLATES.filter(t => t.persona === persona);
}
