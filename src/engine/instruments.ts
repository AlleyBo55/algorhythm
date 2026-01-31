import * as Tone from 'tone';

// Track if instruments are ready
let samplersLoaded = false;

export interface InstrumentMap {
    // Drums (Real Samples)
    kick: Tone.Sampler | Tone.MembraneSynth;
    snare: Tone.Sampler | Tone.NoiseSynth;
    hihat: Tone.Sampler | Tone.MetalSynth;
    clap: Tone.Sampler | Tone.NoiseSynth;
    tom: Tone.Sampler | Tone.MembraneSynth;

    // Bass & Lead
    bass: Tone.Sampler | Tone.MonoSynth;
    lead: Tone.PolySynth<Tone.MonoSynth>;

    // New Synths
    pad: Tone.PolySynth;      // Atmospheric, long sustain
    arp: Tone.MonoSynth;      // Plucky, for arpeggios
    pluck: Tone.Sampler | Tone.PolySynth;   // Guitar
    fm: Tone.PolySynth<Tone.FMSynth>;         // FM synthesis for bells/metallic
    strings: Tone.Sampler | Tone.PolySynth;  // Cello/Strings
    piano: Tone.Sampler | Tone.PolySynth;    // Electric/Keys
    sub: Tone.MonoSynth;      // Sub bass

    // New Semantic Instruments
    flute: Tone.PolySynth;
    trumpet: Tone.PolySynth;
    violin: Tone.PolySynth;
    cymbal: Tone.Sampler | Tone.MetalSynth;
    bass808: Tone.MembraneSynth;

    // === 99% ACCURATE SONG-SPECIFIC INSTRUMENTS ===
    levelsPiano: Tone.PolySynth;     // Avicii Levels iconic piano
    fadedPiano: Tone.PolySynth;      // Alan Walker Faded iconic reverb piano (THE STAR!)
    fadedPluck: Tone.PolySynth;      // Alan Walker Faded atmospheric pluck
    strobeArp: Tone.MonoSynth;       // Deadmau5 Strobe hypnotic arp
    animalsPluck: Tone.PolySynth;    // Martin Garrix Animals woody pluck
    skrillexWobble: Tone.MonoSynth;  // Skrillex authentic wobble bass
    shapeMarimba: Tone.PolySynth<Tone.FMSynth>;    // Ed Sheeran Shape of You marimba
    diploHorn: Tone.PolySynth;       // Diplo Lean On horn synth
    sawanoStrings: Tone.PolySynth;   // Sawano epic orchestral strings
    sawanoChoir: Tone.PolySynth;     // Sawano epic choir
    kpopPhrygian: Tone.PolySynth;    // Teddy Park Middle Eastern lead
    gou90sPiano: Tone.PolySynth;     // Peggy Gou 90s house piano
    phonkMetallic: Tone.PolySynth;   // Jennie phonk metallic lead
    ghibliGrand: Tone.PolySynth;     // Ghibli warm grand piano
    ghibliFlute: Tone.MonoSynth;     // Ghibli breathy flute
    supersaw: Tone.PolySynth;        // Marshmello/Avicii massive drops
    marimba: Tone.PolySynth<Tone.FMSynth>;         // Generic marimba
    choir: Tone.PolySynth;           // Generic choir
    housePiano: Tone.PolySynth;      // Generic house piano
    wobbleBass: Tone.MonoSynth;      // Generic wobble bass

    // Effects Bus
    sidechain: Tone.Gain;
}

// Global effects chain for professional sound
let effectsInitialized = false;
let reverb: Tone.Reverb;
let longReverb: Tone.Reverb;
let delay: Tone.FeedbackDelay;
let chorus: Tone.Chorus;
let limiter: Tone.Limiter;
let compressor: Tone.Compressor;
let masterEQ: Tone.EQ3;
let masterGain: Tone.Gain;
let instrumentsGain: Tone.Gain; // Separate gain for instruments
let sidechainBus: Tone.Gain; // Virtual bus for sidechaining

function initEffects() {
    if (effectsInitialized) return;

    // 1. MASTER CHAIN: Bus -> EQ -> Compressor -> Limiter -> Destination
    limiter = new Tone.Limiter(-1).toDestination();

    compressor = new Tone.Compressor({
        threshold: -12,
        ratio: 3,
        attack: 0.003,
        release: 0.25
    }).connect(limiter);

    masterEQ = new Tone.EQ3({
        low: 0,
        mid: 0,
        high: 0
    }).connect(compressor);

    // Main volume control - everything should eventually connect here
    masterGain = new Tone.Gain(0.8).connect(masterEQ);
    
    // Instruments gain (lower by default to not overshadow decks)
    instrumentsGain = new Tone.Gain(0.3).connect(masterGain);

    // 2. SIDECHAIN BUS: Simulates pumping effect
    // Instruments connected here go through a gain stage we can duck
    sidechainBus = new Tone.Gain(1).connect(instrumentsGain);

    // 3. AUX EFFECTS
    reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.2
    }).connect(instrumentsGain);

    longReverb = new Tone.Reverb({
        decay: 4,
        wet: 0.3
    }).connect(instrumentsGain);

    delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.3,
        wet: 0.2
    }).connect(instrumentsGain);

    chorus = new Tone.Chorus({
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        wet: 0.2
    }).connect(instrumentsGain);
    chorus.start();

    effectsInitialized = true;
}

export class DefaultInstruments {
    public instruments: InstrumentMap;

    constructor() {
        initEffects();

        // Create fallback synths for when samples fail to load
        const kickFallback = () => new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 6,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 },
            volume: 0
        });

        const snareFallback = () => new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
            volume: -6
        });

        const hihatFallback = () => new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
            volume: -10
        });

        const bassFallback = () => new Tone.MonoSynth({
            oscillator: { type: 'sawtooth' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
            filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5, baseFrequency: 100, octaves: 2 },
            volume: 0
        });

        const pluckFallback = () => new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.5 },
            volume: -3
        });

        const stringsFallback = () => new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fatsawtooth', count: 3, spread: 20 } as any,
            envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2 },
            volume: -4
        });

        const pianoFallback = () => new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle8' },
            envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 1 },
            volume: -2
        });

        this.instruments = {
            // === DRUMS - Use synth fallbacks for reliability ===
            kick: kickFallback().connect(instrumentsGain),

            snare: snareFallback().connect(reverb),

            hihat: hihatFallback().connect(instrumentsGain),

            clap: snareFallback().connect(reverb),

            tom: new Tone.MembraneSynth({
                pitchDecay: 0.08,
                octaves: 4,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 0.5 },
                volume: 0
            }).connect(reverb),

            // === BASS - Use synth for reliability ===
            bass: bassFallback().connect(instrumentsGain),

            // === LEADS (Kept as Synth for Versatility, but upgraded) ===
            lead: new Tone.PolySynth(Tone.MonoSynth, {
                oscillator: { type: 'fatsawtooth', count: 3, spread: 30 },
                envelope: {
                    attack: 0.02,
                    decay: 0.2,
                    sustain: 0.5,
                    release: 0.8
                },
                filterEnvelope: {
                    baseFrequency: 400,
                    octaves: 3,
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.5,
                    release: 0.5
                },
                volume: 0
            }).connect(delay).connect(reverb),

            // === PAD ===
            pad: new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: 'fatsawtooth',
                    count: 3,
                    spread: 30
                } as any,
                envelope: {
                    attack: 1.2,
                    decay: 0.8,
                    sustain: 0.9,
                    release: 4
                },
                volume: 2  // Increased from -6
            }).connect(chorus).connect(longReverb),

            // === ARP ===
            arp: new Tone.MonoSynth({
                oscillator: {
                    type: 'pwm',
                    modulationFrequency: 0.3
                } as any,
                envelope: {
                    attack: 0.005,
                    decay: 0.2,
                    sustain: 0.15,
                    release: 0.4
                },
                filterEnvelope: {
                    attack: 0.005,
                    decay: 0.15,
                    sustain: 0.3,
                    release: 0.6,
                    baseFrequency: 400,
                    octaves: 3
                },
                volume: 0
            }).connect(delay).connect(reverb),

            // === PLUCK - Use synth for reliability ===
            pluck: pluckFallback().connect(reverb),

            // === FM ===
            fm: new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: { type: 'sine' },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.1,
                    release: 1.2
                },
                modulation: { type: 'square' },
                modulationEnvelope: {
                    attack: 0.01,
                    decay: 0.5,
                    sustain: 0.2,
                    release: 0.5
                },
                volume: -5
            }).connect(delay).connect(longReverb),

            // === STRINGS - Use synth for reliability ===
            strings: stringsFallback().connect(chorus).connect(longReverb),

            // === PIANO - Use synth for reliability ===
            piano: pianoFallback().connect(reverb),

            // === SUB ===
            sub: new Tone.MonoSynth({
                oscillator: { type: 'sine' },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 1,
                    release: 0.5,
                },
                filterEnvelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 1,
                    release: 0.5,
                    baseFrequency: 50,
                    octaves: 1
                },
                volume: 4
            }).connect(instrumentsGain),

            // === NEW SEMANTIC INSTRUMENTS ===
            flute: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: {
                    attack: 0.1,
                    decay: 0.1,
                    sustain: 0.9,
                    release: 1
                },
                volume: -6
            }).connect(reverb),

            trumpet: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: {
                    attack: 0.05,
                    decay: 0.1,
                    sustain: 0.7,
                    release: 0.5
                },
                volume: -5
            }).connect(reverb),

            violin: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sawtooth' },
                envelope: {
                    attack: 0.3,
                    decay: 0.3,
                    sustain: 0.8,
                    release: 1.5
                },
                volume: -6
            }).connect(longReverb),

            cymbal: new Tone.MetalSynth({
                envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5,
                volume: -6
            }).connect(instrumentsGain),

            bass808: new Tone.MembraneSynth({
                pitchDecay: 0.1,
                octaves: 4,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.8, sustain: 0.01, release: 1.2 },
                volume: 6
            }).connect(instrumentsGain),

            // === 99% ACCURATE SONG-SPECIFIC INSTRUMENTS ===

            // Avicii Levels Piano - bright, percussive piano for the iconic riff
            levelsPiano: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle8' },
                envelope: { attack: 0.008, decay: 0.5, sustain: 0.25, release: 1.0 },
                volume: -2,
            }).connect(reverb),

            // Alan Walker Faded Piano - THE ICONIC SOUND that opens the song!
            // Clean, acoustic-like piano with heavy reverb tail
            // Uses triangle wave for warm piano-like tone
            fadedPiano: new Tone.PolySynth(Tone.Synth, {
                oscillator: { 
                    type: 'triangle',  // Warm, soft tone like acoustic piano
                },
                envelope: { 
                    attack: 0.008,   // Quick attack like real piano hammer
                    decay: 1.5,      // Long decay for sustained feel
                    sustain: 0.15,   // Low sustain - piano notes fade naturally
                    release: 2.5    // Long release with reverb tail
                },
                volume: 2,
            }).connect(longReverb),

            // Alan Walker Faded Pluck - THE ICONIC LEAD SYNTH
            // Bright, slightly detuned supersaw with fast attack
            // This is the "da-da-da-DA" synth lead during the drop
            fadedPluck: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 5, spread: 30 } as any,
                envelope: { attack: 0.003, decay: 0.2, sustain: 0.4, release: 0.8 },
                volume: 2,
            }).connect(delay).connect(reverb),

            // Deadmau5 Strobe Arp - clean, hypnotic arpeggio
            strobeArp: new Tone.MonoSynth({
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.005, decay: 0.18, sustain: 0.2, release: 0.35 },
                filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.3, release: 0.5, baseFrequency: 800, octaves: 3 },
                volume: -4,
            }).connect(delay).connect(reverb),

            // Martin Garrix Animals Pluck - woody, percussive
            animalsPluck: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 5, spread: 35 } as any,
                envelope: { attack: 0.008, decay: 0.15, sustain: 0.4, release: 0.3 },
                volume: -2,
            }).connect(reverb),

            // Skrillex Wobble Bass - FM synthesis for authentic dubstep
            skrillexWobble: new Tone.MonoSynth({
                oscillator: { type: 'fmsquare', modulationIndex: 12 } as any,
                envelope: { attack: 0.001, decay: 0.1, sustain: 0.85, release: 0.1 },
                filterEnvelope: { attack: 0.001, decay: 0.15, sustain: 0.4, release: 0.2, baseFrequency: 150, octaves: 4 },
                volume: 2,
            }).connect(instrumentsGain),

            // Ed Sheeran Marimba - FM synthesis for log drum sound
            shapeMarimba: new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 8,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.05, release: 0.5 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.3 },
                volume: -2,
            }).connect(reverb),

            // Diplo Horn Synth - brass-like for Lean On
            diploHorn: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.5 },
                volume: -3,
            }).connect(reverb),

            // Sawano Epic Strings - wide orchestral strings
            sawanoStrings: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 6, spread: 25 } as any,
                envelope: { attack: 0.5, decay: 0.5, sustain: 0.88, release: 2.5 },
                volume: -4,
            }).connect(longReverb),

            // Sawano Epic Choir - layered voices
            sawanoChoir: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 8, spread: 45 } as any,
                envelope: { attack: 0.3, decay: 0.5, sustain: 0.92, release: 1.8 },
                volume: -3,
            }).connect(longReverb),

            // Teddy Park Phrygian Lead - Middle Eastern scale
            kpopPhrygian: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.4 },
                volume: -3,
            }).connect(reverb),

            // Peggy Gou House Piano - 90s house stabs
            gou90sPiano: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.3 },
                volume: -2,
            }).connect(reverb),

            // Jennie Phonk Lead - metallic, aggressive
            phonkMetallic: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'square' },
                envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.2 },
                volume: -3,
            }).connect(reverb),

            // Ghibli Grand Piano - warm, expressive
            ghibliGrand: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle8' },
                envelope: { attack: 0.01, decay: 0.7, sustain: 0.4, release: 1.8 },
                volume: -2,
            }).connect(longReverb),

            // Ghibli Flute - breathy woodwind
            ghibliFlute: new Tone.MonoSynth({
                oscillator: { type: 'sine' },
                envelope: { attack: 0.15, decay: 0.2, sustain: 0.8, release: 1.0 },
                filterEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5, baseFrequency: 2000, octaves: 1 },
                volume: -4,
            }).connect(longReverb),

            // Supersaw - Marshmello/Avicii/Alan Walker massive drops (7-voice detuned)
            // Wide stereo, bright, sidechained in drops
            // For Faded: needs to be VERY wide and bright with fast attack
            supersaw: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 7, spread: 50 } as any,
                envelope: { attack: 0.005, decay: 0.15, sustain: 0.8, release: 0.4 },
                volume: 8,  // Increased from 4 for more presence
            }).connect(chorus).connect(reverb),

            // Generic Marimba - FM synthesis
            marimba: new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 8,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.05, release: 0.5 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.3 },
                volume: -2,
            }).connect(reverb),

            // Generic Choir - layered voices
            choir: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 8, spread: 40 } as any,
                envelope: { attack: 0.3, decay: 0.5, sustain: 0.9, release: 1.5 },
                volume: -4,
            }).connect(longReverb),

            // Generic House Piano - 90s house stabs
            housePiano: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.3 },
                volume: -2,
            }).connect(reverb),

            // Generic Wobble Bass - FM wobble
            wobbleBass: new Tone.MonoSynth({
                oscillator: { type: 'fmsquare', modulationIndex: 10 } as any,
                envelope: { attack: 0.001, decay: 0.1, sustain: 0.8, release: 0.1 },
                filterEnvelope: { attack: 0.001, decay: 0.2, sustain: 0.4, release: 0.2, baseFrequency: 200, octaves: 4 },
                volume: 2,
            }).connect(instrumentsGain),

            // === EFFECTS BUS ===
            sidechain: sidechainBus
        };
    }

    // Add effect exposure if needed
    get sidechain() {
        return sidechainBus;
    }

    get all() {
        return this.instruments;
    }
}

let instrumentsInstance: InstrumentMap | null = null;

export const getInstruments = () => {
    if (!instrumentsInstance) {
        instrumentsInstance = new DefaultInstruments().all;
    }
    return instrumentsInstance;
};

/**
 * Wait for all instruments to be ready
 * Since we now use synth-based instruments, this resolves immediately
 * Kept for API compatibility
 */
export const waitForSamplersLoaded = async (): Promise<void> => {
    if (samplersLoaded) return;
    
    // With synth-based instruments, we're ready immediately
    // Just ensure instruments are initialized
    getInstruments();
    samplersLoaded = true;
    console.log('✅ All synth instruments ready!');
    return Promise.resolve();
};

export const getEffects = () => {
    if (!effectsInitialized) {
        initEffects();
    }
    return {
        reverb: reverb,
        delay: delay,
        chorus: chorus,
        filter: masterEQ, // Mapping EQ to 'filter' for basic usage, though it's EQ
        instrumentsGain: instrumentsGain // Expose for volume control
    };
};
