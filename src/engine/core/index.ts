// Core Audio Engine
// Fundamental audio classes: Deck, DeckBus, MasterBus, Mixer, MixingConsole

export { Deck } from './deck';
export type { HotCue, DeckState } from './deck';

export { DeckBus } from './deckBus';

export { MasterBus, masterBus } from './masterBus';

export { Mixer, mixer } from './mixer';
export type { CrossfaderCurve } from './mixer';

export { MixingConsole, ChannelStrip, AuxBus, mixingConsole } from './mixingConsole';
