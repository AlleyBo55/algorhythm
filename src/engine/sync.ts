import * as Tone from 'tone';
import { Deck } from './deck';

export interface SyncState {
  isSynced: boolean;
  masterDeck: string | null;
  syncedDecks: Set<string>;
  tempoRange: number; // ±% allowed
}

export class BeatSync {
  private decks: Map<string, Deck> = new Map();
  private masterDeck: Deck | null = null;
  private syncedDecks: Set<Deck> = new Set();
  private _tempoRange: number = 0.08; // ±8%
  private phaseCheckInterval: number | null = null;

  addDeck(id: string, deck: Deck): void {
    this.decks.set(id, deck);
  }

  setMaster(deckId: string): void {
    const deck = this.decks.get(deckId);
    if (!deck) return;
    
    this.masterDeck = deck;
    console.log(`🎯 Sync Master: Deck ${deckId}`);
  }

  sync(deckId: string): void {
    const deck = this.decks.get(deckId);
    if (!deck || !this.masterDeck || deck === this.masterDeck) return;

    // Match BPM
    const targetBPM = this.masterDeck.bpm;
    const currentBPM = deck.bpm;
    const ratio = targetBPM / currentBPM;

    // Check tempo range
    if (Math.abs(ratio - 1) > this.tempoRange) {
      console.warn(`⚠️ BPM difference too large: ${currentBPM} → ${targetBPM}`);
      return;
    }

    deck.player.playbackRate = ratio;
    this.syncedDecks.add(deck);

    // Align phase
    this.alignPhase(deck, this.masterDeck);

    console.log(`✓ Synced Deck ${deckId} to Master (${currentBPM} → ${targetBPM} BPM)`);
  }

  unsync(deckId: string): void {
    const deck = this.decks.get(deckId);
    if (!deck) return;

    deck.player.playbackRate = 1;
    this.syncedDecks.delete(deck);
    console.log(`✗ Unsynced Deck ${deckId}`);
  }

  private alignPhase(deck: Deck, master: Deck): void {
    if (deck.beatGrid.length === 0 || master.beatGrid.length === 0) return;

    const masterTime = master.player.immediate();
    const deckTime = deck.player.immediate();

    // Find nearest beat in master
    const masterBeat = this.findNearestBeat(masterTime, master.beatGrid);
    const deckBeat = this.findNearestBeat(deckTime, deck.beatGrid);

    if (masterBeat === null || deckBeat === null) return;

    // Calculate phase offset
    const masterPhase = (masterTime - masterBeat) / (60 / master.bpm);
    const deckPhase = (deckTime - deckBeat) / (60 / deck.bpm);
    const phaseDiff = masterPhase - deckPhase;

    // Adjust deck position
    if (Math.abs(phaseDiff) > 0.1) {
      const adjustment = phaseDiff * (60 / deck.bpm);
      deck.seek(deckTime + adjustment);
    }
  }

  private findNearestBeat(time: number, beatGrid: number[]): number | null {
    if (beatGrid.length === 0) return null;

    let nearest = beatGrid[0];
    let minDiff = Math.abs(time - nearest);

    for (const beat of beatGrid) {
      const diff = Math.abs(time - beat);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = beat;
      }
    }

    return nearest;
  }

  startPhaseMonitor(): void {
    if (this.phaseCheckInterval) return;

    this.phaseCheckInterval = window.setInterval(() => {
      if (!this.masterDeck) return;

      this.syncedDecks.forEach(deck => {
        this.alignPhase(deck, this.masterDeck!);
      });
    }, 1000); // Check every second
  }

  stopPhaseMonitor(): void {
    if (this.phaseCheckInterval) {
      clearInterval(this.phaseCheckInterval);
      this.phaseCheckInterval = null;
    }
  }

  get tempoRange(): number {
    return this._tempoRange;
  }

  set tempoRange(value: number) {
    this._tempoRange = Math.max(0, Math.min(0.5, value));
  }

  get state(): SyncState {
    return {
      isSynced: this.syncedDecks.size > 0,
      masterDeck: this.masterDeck?.id || null,
      syncedDecks: new Set(Array.from(this.syncedDecks).map(d => d.id)),
      tempoRange: this._tempoRange
    };
  }

  dispose(): void {
    this.stopPhaseMonitor();
    this.syncedDecks.clear();
    this.decks.clear();
  }
}
