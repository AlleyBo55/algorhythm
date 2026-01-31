/**
 * Template Library Index
 * Clean export of templates and types
 */

// Types
export * from './types';

// Templates
export { fadedTemplate, generateFadedCode } from './songs/alan_walker_faded';
export { 
  fadedStyle, 
  aloneStyle, 
  darksideStyle, 
  onMyWayStyle, 
  spectreStyle,
  alanWalkerTemplates 
} from './alan_walker';

// Helper functions
export function getAllGenres(): string[] {
  return ['Progressive House', 'Melodic EDM', 'Future Bass'];
}

export function getAllArtists(): string[] {
  return ['Alan Walker'];
}
