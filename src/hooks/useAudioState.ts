// Optimized Audio State Management
// Phase 3: Zustand-based state with selective subscriptions

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface DeckState {
  id: string;
  trackName: string;
  isPlaying: boolean;
  position: number;
  bpm: number;
  key: string;
  volume: number;
  eq: { low: number; mid: number; high: number };
  filter: number;
}

export interface MixerState {
  crossfader: number;
  masterVolume: number;
  curve: 'linear' | 'power' | 'constant';
}

export interface EffectsState {
  reverb: number;
  delay: number;
  filter: number;
}

interface AudioState {
  decks: Map<string, DeckState>;
  mixer: MixerState;
  effects: EffectsState;
  isInitialized: boolean;
  
  // Actions
  updateDeck: (id: string, updates: Partial<DeckState>) => void;
  updateMixer: (updates: Partial<MixerState>) => void;
  updateEffects: (updates: Partial<EffectsState>) => void;
  setInitialized: (value: boolean) => void;
  resetDeck: (id: string) => void;
}

const createInitialDeckState = (id: string): DeckState => ({
  id,
  trackName: 'No Track Loaded',
  isPlaying: false,
  position: 0,
  bpm: 120,
  key: 'C',
  volume: 0,
  eq: { low: 0, mid: 0, high: 0 },
  filter: 20000,
});

const initialMixerState: MixerState = {
  crossfader: 0,
  masterVolume: 0,
  curve: 'linear',
};

const initialEffectsState: EffectsState = {
  reverb: 0,
  delay: 0,
  filter: 20000,
};

export const useAudioStore = create<AudioState>()(
  subscribeWithSelector((set) => ({
    decks: new Map([
      ['A', createInitialDeckState('A')],
      ['B', createInitialDeckState('B')],
      ['C', createInitialDeckState('C')],
      ['D', createInitialDeckState('D')],
    ]),
    mixer: initialMixerState,
    effects: initialEffectsState,
    isInitialized: false,
    
    updateDeck: (id, updates) =>
      set((state) => {
        const current = state.decks.get(id);
        if (!current) return state;
        
        const newDecks = new Map(state.decks);
        newDecks.set(id, { ...current, ...updates });
        return { decks: newDecks };
      }),
    
    updateMixer: (updates) =>
      set((state) => ({
        mixer: { ...state.mixer, ...updates }
      })),
    
    updateEffects: (updates) =>
      set((state) => ({
        effects: { ...state.effects, ...updates }
      })),
    
    setInitialized: (value) => set({ isInitialized: value }),
    
    resetDeck: (id) =>
      set((state) => {
        const newDecks = new Map(state.decks);
        newDecks.set(id, createInitialDeckState(id));
        return { decks: newDecks };
      }),
  }))
);

// Selective subscription hooks for performance
export function useDeckState(deckId: string): DeckState | undefined {
  return useAudioStore((state) => state.decks.get(deckId));
}

export function useMixerState(): MixerState {
  return useAudioStore((state) => state.mixer);
}

export function useEffectsState(): EffectsState {
  return useAudioStore((state) => state.effects);
}

export function useIsInitialized(): boolean {
  return useAudioStore((state) => state.isInitialized);
}

// Derived state hooks
export function useIsAnyDeckPlaying(): boolean {
  return useAudioStore((state) => {
    for (const deck of state.decks.values()) {
      if (deck.isPlaying) return true;
    }
    return false;
  });
}

export function useActiveDeckCount(): number {
  return useAudioStore((state) => {
    let count = 0;
    for (const deck of state.decks.values()) {
      if (deck.trackName !== 'No Track Loaded') count++;
    }
    return count;
  });
}
