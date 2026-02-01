import * as Tone from 'tone';
import { getInstruments, InstrumentMap } from './instruments';

export interface PresetMap {
    // Ethereal, melodic EDM style
    etherealEDM: () => void;
    // Happy future bass style
    futureBass: () => void;
    // Synthwave/80s retro
    synthwave: () => void;
    // Lo-fi chill
    lofi: () => void;
    // Anime OST - emotional/action soundtrack
    animeOst: () => void;
    // Anime battle/action music
    animeBattle: () => void;
    // Trap - Heavy 808s
    trap: () => void;
    // Eurobeat - High Energy
    eurobeat: () => void;
    // Pop - Radio ready
    pop: () => void;
    // Rock/Punk - Distorted
    rock: () => void;
    // Orchestral - Cinematic
    orchestral: () => void;
    // Producer presets
    steveAoki: () => void;
    diplo: () => void;
    daftPunk: () => void;
    theWeeknd: () => void;
    duaLipa: () => void;
    postMalone: () => void;
    linkinPark: () => void;
    hansZimmer: () => void;
    nujabes: () => void;
    // TV/Film presets
    strangerThings: () => void;
    mandalorian: () => void;
    ghibli: () => void;
    // Funky 80s / Disco
    funky_80s: () => void;
    // Reset
    reset: () => void;
}

export function createPresets(inst: InstrumentMap): PresetMap {
    return {
        etherealEDM: () => {
            // Ethereal, atmospheric melodic style
            inst.pad.set({
                oscillator: { type: 'fatsawtooth', count: 3, spread: 30 } as any,
                envelope: { attack: 1.5, decay: 0.5, sustain: 1, release: 4 },
                volume: -6
            });
            inst.lead.set({
                oscillator: { type: 'fatsawtooth', count: 4, spread: 25 } as any,
                envelope: { attack: 0.05, decay: 0.3, sustain: 0.5, release: 1.2 },
                volume: -2
            });
            inst.arp.set({
                oscillator: { type: 'pwm', modulationFrequency: 0.4 } as any,
                envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
                volume: -4
            });
            inst.piano.set({
                volume: -2,
            });
        },

        futureBass: () => {
            // Happy, bouncy future bass style
            // 1. LEAD: Huge, wide Supersaw
            inst.lead.set({
                oscillator: { type: 'fatsawtooth', count: 7, spread: 70 }, // Increased spread
                envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.2 },
                volume: 2 // Boost volume
            });

            // 2. BASS: Layers with the lead
            inst.bass.set({
                volume: 5
            });

            // 3. PAD: Background ambiance
            inst.pad.set({
                oscillator: { type: 'fatsawtooth', count: 2, spread: 30 },
                envelope: { attack: 0.2, decay: 0.3, sustain: 0.7, release: 1 },
                volume: -6
            });

            // 4. KICK: Punchy and loud
            inst.kick.set({
                volume: 8,
            });

            // 5. SIDECHAIN EFFECT (Duck volume on beats)
            // Note: The AI will need to trigger this manually using volume automation or a specialized effect
            // For now, we set the envelopes to be snappy to allow manual ducking to work better.
        },

        steveAoki: () => {
            // Aggressive electro house
            inst.bass.set({
                volume: 6
            });
            inst.lead.set({
                oscillator: { type: 'fatsquare', count: 3, spread: 30 },
                envelope: { attack: 0.01, decay: 0.15, sustain: 0.5, release: 0.3 },
                volume: 0
            });
            inst.kick.set({
                volume: 8
            });
        },

        diplo: () => {
            // Trap/moombahton with 808s
            inst.bass.set({
                volume: 6
            });
            inst.hihat.set({
                volume: -2
            });
            inst.snare.set({
                volume: 4
            });
        },

        synthwave: () => {
            // 80s retro synthwave - Stranger Things vibe
            inst.arp.set({
                oscillator: { type: 'pwm', modulationFrequency: 0.2 } as any,
                envelope: { attack: 0.005, decay: 0.12, sustain: 0.2, release: 0.4 },
                filterEnvelope: { baseFrequency: 450, octaves: 2.5, decay: 0.2 },
                volume: -3
            });
            inst.bass.set({
                volume: 4
            });
            inst.pad.set({
                oscillator: { type: 'fatsawtooth', count: 5, spread: 40 } as any,
                envelope: { attack: 1.2, decay: 0.5, sustain: 0.7, release: 3.5 },
                volume: -8
            });
            inst.lead.set({
                oscillator: { type: 'fatsawtooth', count: 3, spread: 30 } as any,
                envelope: { attack: 0.08, decay: 0.35, sustain: 0.6, release: 1.2 },
                volume: -2
            });
        },

        strangerThings: () => {
            // Dark, pulsing, ominous arpeggios
            inst.arp.set({
                oscillator: { type: 'pulse', width: 0.25 },
                envelope: { attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.2 },
                filterEnvelope: { baseFrequency: 300, octaves: 3, decay: 0.15 },
                volume: -2
            });
            inst.pad.set({
                oscillator: { type: 'triangle' },
                envelope: { attack: 2, decay: 1, sustain: 0.7, release: 5 },
                volume: -10
            });
            inst.bass.set({
                volume: 2
            });
        },

        mandalorian: () => {
            // Cinematic, sparse, western with ethnic feel
            inst.strings.set({
                volume: -6
            });
            inst.pluck.set({
                volume: -2
            });
            inst.pad.set({
                oscillator: { type: 'triangle' },
                envelope: { attack: 1.5, decay: 0.5, sustain: 0.6, release: 4 },
                volume: -10
            });
            inst.tom.set({
                volume: 0
            });
        },

        lofi: () => {
            // Warm, dusty, jazzy
            inst.lead.set({
                oscillator: { type: 'sine' } as any,
                envelope: { attack: 0.08, decay: 0.45, sustain: 0.5, release: 1.2 },
                volume: -3
            });
            inst.bass.set({
                volume: 2
            });
            inst.kick.set({
                volume: 4,
            });
            inst.hihat.set({
                volume: -10
            });
        },

        animeOst: () => {
            // Emotional anime OST - piano-like leads, lush strings
            inst.lead.set({
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.02, decay: 0.5, sustain: 0.4, release: 1.5 },
                volume: -3
            });
            inst.pad.set({
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 1.2, decay: 0.5, sustain: 0.7, release: 3 },
                volume: -8
            });
            inst.strings.set({
                volume: -5
            });
            inst.pluck.set({
                volume: -4
            });
            inst.bass.set({
                volume: 1
            });
        },

        animeBattle: () => {
            // Intense anime battle music - fast, energetic
            inst.lead.set({
                oscillator: { type: 'fatsawtooth', count: 4, spread: 30 },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.5 },
                volume: -2
            });
            inst.bass.set({
                volume: 4
            });
            inst.strings.set({
                volume: -4
            });
            inst.kick.set({
                volume: 6
            });
            inst.hihat.set({
                volume: -3
            });
        },

        daftPunk: () => {
            // French Touch / Disco House
            inst.bass.set({
                volume: 4
            });
            inst.lead.set({
                oscillator: { type: 'fatsquare', count: 3, spread: 20 },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1 },
                volume: -3
            });
            inst.kick.set({
                volume: 8,
            });
        },

        hansZimmer: () => {
            // Epic Cinematic / Interstellar
            inst.strings.set({
                volume: -4
            });
            inst.pad.set({
                oscillator: { type: 'pwm', modulationFrequency: 0.2 },
                envelope: { attack: 4, decay: 2, sustain: 1, release: 6 },
                volume: -8
            });
            inst.arp.set({
                oscillator: { type: 'sine' },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 },
                volume: -5
            });
        },

        ghibli: () => {
            // Nostalgic Piano / Orchestral
            inst.piano.set({
                volume: -2
            });
            inst.strings.set({
                volume: -8
            });
            inst.fm.set({
                harmonicity: 1.5,
                modulationIndex: 5,
                volume: -10
            });
        },

        trap: () => {
            // Trap - Heavy 808 with saturation
            inst.bass808.set({
                pitchDecay: 0.15,
                octaves: 5,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.8, sustain: 0.01, release: 2.5 },
                volume: 8
            });
            // Mute standard sub/bass to prefer bass808
            inst.sub.set({ volume: -100 });
            inst.bass.set({ volume: -100 });
            inst.hihat.set({
                volume: -3
            });
            inst.snare.set({
                volume: 6
            });
        },

        eurobeat: () => {
            // Intense Super Saw + Fast Bass - INITIAL D STYLE
            inst.lead.set({
                oscillator: {
                    type: 'fatsawtooth',
                    count: 8,
                    spread: 80
                } as any,
                envelope: { attack: 0.001, decay: 0.1, sustain: 1, release: 0.1 },
                volume: 1
            });
            inst.bass.set({
                volume: 6
            });
            inst.pad.set({
                oscillator: { type: 'fatsawtooth', count: 3, spread: 20 } as any,
                volume: -8
            });
        },

        pop: () => {
            // Clean, polished, radio ready
            inst.piano.set({
                volume: -2
            });
            inst.bass.set({
                volume: 3
            });
            inst.pad.set({
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.5, decay: 0.5, sustain: 0.5, release: 2 },
                volume: -10
            });
        },

        rock: () => {
            // Punk / Metal / Emo - Distorted
            inst.lead.set({
                oscillator: { type: 'fatsquare', count: 4 }, // Guitar-ish
                envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.1 },
                volume: 0
            });
            inst.bass.set({
                volume: 4
            });
            // Distorted effect simulated by high volume + limiter
            inst.kick.set({
                volume: 8,
            });
            inst.snare.set({
                volume: 6,
            });
        },

        orchestral: () => {
            // Pure Orchestral
            inst.violin.set({
                volume: -4
            });
            inst.trumpet.set({
                volume: -3
            });
            inst.strings.set({
                volume: -6
            });
            inst.cymbal.set({ volume: -6 });

            // Re-route generic instruments to silence or helper roles
            inst.lead.set({ volume: -100 });
        },

        theWeeknd: () => {
            // Dark, Retro Synth-Pop (Blinding Lights style)
            inst.lead.set({
                oscillator: {
                    type: 'fatsquare',
                    count: 4,
                    spread: 25
                } as any,
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.4 },
                volume: 0
            });
            inst.bass.set({
                volume: 4
            });
            inst.pad.set({
                oscillator: { type: 'pwm', modulationFrequency: 0.4 } as any,
                envelope: { attack: 0.8, decay: 0.6, sustain: 0.8, release: 3 },
                volume: -6
            });
        },

        duaLipa: () => {
            // Nu-Disco / Future Nostalgia
            inst.bass.set({
                volume: 5
            });
            inst.strings.set({
                volume: -3
            });
            inst.piano.set({
                volume: -2
            });
            inst.kick.set({
                volume: 8, // Tight pop kick
            });
        },

        nujabes: () => {
            // Lofi / Jazz Hop / Samurai Champloo
            inst.piano.set({
                volume: -1
            });
            inst.flute.set({
                volume: -2
            });
            inst.piano.set({
                volume: -1
            });
            // Use flute for melody instead of generic lead
            inst.lead.set({ volume: -100 });
            inst.snare.set({
                volume: 3 // Dry, tight snare
            });
            inst.kick.set({
                volume: 5, // Softer kick
            });
        },

        postMalone: () => {
            // Cloud Rap / Trap / Acoustic Blend
            inst.pluck.set({
                // Acoustic Guitar (Nylon/Steel hybrid)
                volume: -1
            });
            inst.sub.set({
                oscillator: { type: 'sine' },
                envelope: { attack: 0.02, decay: 0.3, sustain: 0.8, release: 1.2 },
                volume: 6
            });
            inst.pad.set({
                oscillator: { type: 'triangle' },
                envelope: { attack: 1.5, decay: 1, sustain: 0.5, release: 4 },
                volume: -12, // Very subtle atmosphere
            });
            inst.lead.set({
                // Vocal Chop / Whistle simulation
                oscillator: { type: 'sine' },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.5 },
                volume: -3
            });
            // Trap Hi-hats (Sharp)
            inst.hihat.set({
                volume: -2
            });
        },

        linkinPark: () => {
            // Hybrid Theory / Meteora Style
            (inst.lead as any).set({
                // Electric Guitar (High Gain) simulation
                oscillator: {
                    type: 'fatsawtooth',
                    count: 8,
                    spread: 45
                } as any,
                envelope: { attack: 0.01, decay: 0.2, sustain: 1, release: 0.05 },
                // Cabinet simulation via Lowpass resonance
                filter: { type: 'lowpass', rolloff: -24, Q: 3.5 },
                filterEnvelope: { baseFrequency: 1500, octaves: 1.5, attack: 0.01, decay: 0.1, sustain: 1 },
                volume: 2 // Driven even harder
            });
            inst.bass.set({
                // Fender Jazz Bass - Clean but driving
                volume: 4
            });
            inst.piano.set({
                // Essential High Piano
                volume: 5
            });
            inst.pluck.set({
                // Clean Verse Guitar
                volume: -2
            });
            inst.strings.set({
                // Chorus background layer
                volume: -6
            });
            inst.snare.set({
                volume: 8 // PUNCHY
            });
            inst.kick.set({
                volume: 8
            });
        },

        funky_80s: () => {
            // Disco / Bee Gees Style
            inst.bass.set({
                // Clean Fender Jazz Bass
                volume: 4
            });
            inst.pluck.set({
                // Muted Funk Guitar
                volume: -2
            });
            inst.strings.set({
                // Disco Stabs
                volume: -4
            });
            inst.kick.set({
                volume: 6 // Four on the floor
            });
            inst.hihat.set({
                volume: -4 // Tight hats
            });
        },

        reset: () => {
            // Reset all instruments to high-quality defaults
            inst.lead.set({
                oscillator: { type: 'fatsawtooth', count: 5, spread: 40 } as any,
                envelope: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.8 },
                filter: { frequency: 8000, Q: 2 } as any,
                volume: 0
            });
            inst.pad.set({
                oscillator: { type: 'fatsawtooth', count: 3, spread: 30 } as any,
                envelope: { attack: 1.2, decay: 0.8, sustain: 0.9, release: 4 },
                volume: -6
            });
            inst.bass.set({
                volume: 0
            });
            inst.piano.set({
                volume: -2
            });
            console.log('Instruments reset to high-quality defaults');
        }
    };
}
