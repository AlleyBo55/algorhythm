export interface Template {
  id: string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  code: string;
  description: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'avicii-progressive',
    name: 'Progressive House',
    artist: 'Avicii',
    genre: 'Progressive House',
    bpm: 128,
    key: 'Am',
    description: 'Epic build-ups with piano melodies',
    code: `dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Build-up filter sweep
  if (bar >= 8 && bar < 16) {
    dj.deck.A.filter.cutoff = 500 + (bar - 8) * 2000;
  }
  
  // Drop
  if (bar === 16) {
    dj.deck.A.filter.cutoff = 20000;
    dj.deck.A.volume = 0;
  }
  
  tick++;
});`
  },
  {
    id: 'marshmello-future',
    name: 'Future Bass',
    artist: 'Marshmello',
    genre: 'Future Bass',
    bpm: 140,
    key: 'F#m',
    description: 'Wobbly bass with vocal chops',
    code: `dj.bpm = 140;
let tick = 0;

dj.loop('16n', (time) => {
  // Wobble bass
  const wobble = Math.sin(tick * 0.5) * 500 + 1000;
  dj.deck.A.filter.cutoff = wobble;
  
  // Snare on 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C2', '8n', time);
  }
  
  tick++;
});`
  },
  {
    id: 'daft-punk-french',
    name: 'French House',
    artist: 'Daft Punk',
    genre: 'French House',
    bpm: 124,
    key: 'Em',
    description: 'Filtered disco loops',
    code: `dj.bpm = 124;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Filter automation
  const filterFreq = 500 + Math.sin(bar * 0.5) * 3000;
  dj.deck.A.filter.cutoff = filterFreq;
  
  // Sidechain compression
  if (tick % 4 === 0) {
    dj.deck.A.volume = -20;
  } else {
    dj.deck.A.volume = 0;
  }
  
  tick++;
});`
  },
  {
    id: 'deadmau5-progressive',
    name: 'Progressive Electro',
    artist: 'Deadmau5',
    genre: 'Progressive House',
    bpm: 128,
    key: 'Cm',
    description: 'Long evolving synths',
    code: `dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Evolving filter
  dj.deck.A.filter.cutoff = 1000 + (bar % 32) * 500;
  
  // Reverb build
  dj.deck.A.effects.get('reverb').wet = (bar % 16) / 16;
  
  tick++;
});`
  },
  {
    id: 'alan-walker-melodic',
    name: 'Melodic House',
    artist: 'Alan Walker',
    genre: 'Melodic House',
    bpm: 126,
    key: 'Dm',
    description: 'Emotional melodies with vocals',
    code: `dj.bpm = 126;
let tick = 0;

dj.loop('8n', (time) => {
  // Arpeggio pattern
  const notes = ['D3', 'F3', 'A3', 'C4'];
  const note = notes[tick % 4];
  
  dj.synth.triggerAttackRelease(note, '8n', time);
  
  tick++;
});`
  }
];

export class TemplateLibrary {
  private templates: Map<string, Template> = new Map();

  constructor() {
    TEMPLATES.forEach(t => this.templates.set(t.id, t));
  }

  get(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getByGenre(genre: string): Template[] {
    return Array.from(this.templates.values())
      .filter(t => t.genre === genre);
  }

  getByArtist(artist: string): Template[] {
    return Array.from(this.templates.values())
      .filter(t => t.artist === artist);
  }

  search(query: string): Template[] {
    const q = query.toLowerCase();
    return Array.from(this.templates.values())
      .filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      );
  }

  all(): Template[] {
    return Array.from(this.templates.values());
  }

  add(template: Template): void {
    this.templates.set(template.id, template);
  }
}
