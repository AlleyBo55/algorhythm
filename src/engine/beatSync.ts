import * as Tone from 'tone';
import { Deck } from './deck';

export class BeatSyncEngine {
  private static instance: BeatSyncEngine;
  private masterDeck: Deck | null = null;
  private beatPhase: number = 0;
  private lastBeatTime: number = 0;

  private constructor() {}

  public static getInstance(): BeatSyncEngine {
    if (!BeatSyncEngine.instance) {
      BeatSyncEngine.instance = new BeatSyncEngine();
    }
    return BeatSyncEngine.instance;
  }

  public setMasterDeck(deck: Deck): void {
    this.masterDeck = deck;
  }

  public getBeatPhase(): number {
    if (!this.masterDeck || !this.masterDeck.player.buffer.loaded) {
      return 0;
    }

    const currentTime = this.masterDeck.state.currentTime;
    const bpm = this.masterDeck.bpm;
    const beatLength = 60 / bpm;
    
    // Calculate which beat we're on
    const beatNumber = Math.floor(currentTime / beatLength);
    const beatPhase = (currentTime % beatLength) / beatLength;
    
    return beatPhase;
  }

  public getQuantizedTime(subdivision: string = '16n'): number {
    const now = Tone.now();
    const subdivisionSeconds = Tone.Time(subdivision).toSeconds();
    return Math.ceil(now / subdivisionSeconds) * subdivisionSeconds;
  }

  public isOnBeat(tolerance: number = 0.05): boolean {
    const phase = this.getBeatPhase();
    return phase < tolerance || phase > (1 - tolerance);
  }
}

export const beatSyncEngine = BeatSyncEngine.getInstance();
