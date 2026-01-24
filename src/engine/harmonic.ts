export type MusicalKey = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
  | 'Cm' | 'C#m' | 'Dm' | 'D#m' | 'Em' | 'Fm' | 'F#m' | 'Gm' | 'G#m' | 'Am' | 'A#m' | 'Bm';

export type CamelotKey = 
  | '1A' | '2A' | '3A' | '4A' | '5A' | '6A' | '7A' | '8A' | '9A' | '10A' | '11A' | '12A'
  | '1B' | '2B' | '3B' | '4B' | '5B' | '6B' | '7B' | '8B' | '9B' | '10B' | '11B' | '12B';

export interface HarmonicMatch {
  compatible: boolean;
  relationship: 'perfect' | 'energy-boost' | 'energy-drop' | 'relative' | 'incompatible';
  camelotDistance: number;
}

export class HarmonicMixing {
  private static readonly CAMELOT_WHEEL: Record<MusicalKey, CamelotKey> = {
    'C': '8B', 'G': '9B', 'D': '10B', 'A': '11B', 'E': '12B', 'B': '1B',
    'F#': '2B', 'C#': '3B', 'G#': '4B', 'D#': '5B', 'A#': '6B', 'F': '7B',
    'Am': '8A', 'Em': '9A', 'Bm': '10A', 'F#m': '11A', 'C#m': '12A', 'G#m': '1A',
    'D#m': '2A', 'A#m': '3A', 'Fm': '4A', 'Cm': '5A', 'Gm': '6A', 'Dm': '7A'
  };

  static toCamelot(key: MusicalKey): CamelotKey {
    return this.CAMELOT_WHEEL[key];
  }

  static fromCamelot(camelot: CamelotKey): MusicalKey {
    return Object.entries(this.CAMELOT_WHEEL).find(([_, c]) => c === camelot)?.[0] as MusicalKey;
  }

  static analyze(key1: MusicalKey, key2: MusicalKey): HarmonicMatch {
    const c1 = this.toCamelot(key1);
    const c2 = this.toCamelot(key2);

    const num1 = parseInt(c1);
    const num2 = parseInt(c2);
    const mode1 = c1.slice(-1);
    const mode2 = c2.slice(-1);

    // Perfect match (same key)
    if (c1 === c2) {
      return { compatible: true, relationship: 'perfect', camelotDistance: 0 };
    }

    // Relative major/minor (same number, different mode)
    if (num1 === num2 && mode1 !== mode2) {
      return { compatible: true, relationship: 'relative', camelotDistance: 0 };
    }

    // Adjacent keys (±1 semitone)
    const distance = Math.min(
      Math.abs(num1 - num2),
      12 - Math.abs(num1 - num2)
    );

    if (distance === 1 && mode1 === mode2) {
      const isBoost = (num2 - num1 + 12) % 12 === 1;
      return {
        compatible: true,
        relationship: isBoost ? 'energy-boost' : 'energy-drop',
        camelotDistance: 1
      };
    }

    // Incompatible
    return { compatible: false, relationship: 'incompatible', camelotDistance: distance };
  }

  static getCompatibleKeys(key: MusicalKey): MusicalKey[] {
    const camelot = this.toCamelot(key);
    const num = parseInt(camelot);
    const mode = camelot.slice(-1);

    const compatible: CamelotKey[] = [
      camelot, // Same key
      `${num}${mode === 'A' ? 'B' : 'A'}` as CamelotKey, // Relative
      `${num === 12 ? 1 : num + 1}${mode}` as CamelotKey, // +1
      `${num === 1 ? 12 : num - 1}${mode}` as CamelotKey, // -1
    ];

    return compatible.map(c => this.fromCamelot(c)).filter(Boolean) as MusicalKey[];
  }

  static suggestTransition(from: MusicalKey, to: MusicalKey): string {
    const match = this.analyze(from, to);

    switch (match.relationship) {
      case 'perfect':
        return 'Perfect match - mix freely';
      case 'relative':
        return 'Relative key - smooth transition';
      case 'energy-boost':
        return 'Energy boost - great for build-ups';
      case 'energy-drop':
        return 'Energy drop - good for breakdowns';
      default:
        return `Incompatible (${match.camelotDistance} steps) - use EQ/filter`;
    }
  }

  static calculatePitchShift(from: MusicalKey, to: MusicalKey): number {
    const keys: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    const fromRoot = from.replace('m', '') as MusicalKey;
    const toRoot = to.replace('m', '') as MusicalKey;
    
    const idx1 = keys.indexOf(fromRoot);
    const idx2 = keys.indexOf(toRoot);
    
    if (idx1 === -1 || idx2 === -1) return 0;
    
    let semitones = idx2 - idx1;
    if (semitones > 6) semitones -= 12;
    if (semitones < -6) semitones += 12;
    
    return semitones;
  }
}
