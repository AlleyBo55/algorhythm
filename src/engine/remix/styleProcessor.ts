import * as Tone from 'tone';
import { Deck } from '../core/deck';

export interface StyleProfile {
  bpm: number;
  eq: { high: number; mid: number; low: number };
  filter: { cutoff: number; resonance: number };
  effects: Map<string, { type: string; wet: number }>;
  colorFX: number;
  volume: number;
}

export class StyleProcessor {
  private static instance: StyleProcessor;
  private currentStyle: StyleProfile | null = null;
  private activeDecks: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): StyleProcessor {
    if (!StyleProcessor.instance) {
      StyleProcessor.instance = new StyleProcessor();
    }
    return StyleProcessor.instance;
  }

  public captureStyle(deck: Deck): StyleProfile {
    return {
      bpm: deck.bpm,
      eq: {
        high: deck.eq.high.gain.value,
        mid: deck.eq.mid.gain.value,
        low: deck.eq.low.gain.value
      },
      filter: {
        cutoff: deck.filter.frequency.value as number,
        resonance: deck.filter.Q.value
      },
      effects: new Map(
        Array.from(deck.effects['effects'].entries()).map(([name, fx]) => [
          name,
          { type: fx.type, wet: fx.wet }
        ])
      ),
      colorFX: deck.colorFX.value,
      volume: deck.volume.volume.value
    };
  }

  public applyStyle(deck: Deck, style: StyleProfile, smooth: boolean = true): void {
    const rampTime = smooth ? 0.5 : 0;

    // BPM sync
    if (deck.player.buffer.loaded) {
      const ratio = style.bpm / deck.bpm;
      deck.player.playbackRate = ratio;
    }

    // EQ
    deck.eq.high.gain.rampTo(style.eq.high, rampTime);
    deck.eq.mid.gain.rampTo(style.eq.mid, rampTime);
    deck.eq.low.gain.rampTo(style.eq.low, rampTime);

    // Filter
    deck.filter.frequency.rampTo(style.filter.cutoff, rampTime);
    deck.filter.Q.rampTo(style.filter.resonance, rampTime);

    // Effects
    style.effects.forEach((config, name) => {
      let fx = deck.effects.get(name);
      if (!fx) {
        fx = deck.effects.add(name, config.type as any);
      }
      fx.wet = config.wet;
    });

    // ColorFX
    deck.colorFX.value = style.colorFX;

    // Volume
    deck.volume.volume.rampTo(style.volume, rampTime);
  }

  public setCurrentStyle(style: StyleProfile): void {
    this.currentStyle = style;
  }

  public getCurrentStyle(): StyleProfile | null {
    return this.currentStyle;
  }

  public registerActiveDeck(deckId: string): void {
    this.activeDecks.add(deckId);
  }

  public unregisterActiveDeck(deckId: string): void {
    this.activeDecks.delete(deckId);
  }

  public getActiveDecks(): Set<string> {
    return this.activeDecks;
  }

  public syncAllActiveDecks(decks: Map<string, Deck>): void {
    if (!this.currentStyle) return;

    this.activeDecks.forEach(deckId => {
      const deck = decks.get(deckId);
      if (deck && deck.player.buffer.loaded) {
        this.applyStyle(deck, this.currentStyle!);
      }
    });
  }
}

export const styleProcessor = StyleProcessor.getInstance();
