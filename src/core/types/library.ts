// Library Domain Types

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  bpm: number;
  key?: string;
  genre?: string;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  patterns: TemplatePattern[];
}

export interface TemplatePattern {
  name: string;
  bars: number;
  instruments: string[];
}
