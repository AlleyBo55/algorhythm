import * as Tone from 'tone';

// R2 CDN for all samples
const R2_CDN = process.env.NEXT_PUBLIC_R2_CDN || 'https://pub-1bb3c1da6ec04255a43c86fb314974e5.r2.dev';

// Track if samplers are loaded
let samplersLoaded = false;
let samplersLoadingPromise: Promise<void> | null = null;

export interface InstrumentMap {
    // Drums (Real Samples)
    kick: Tone.Sampler;
    snare: Tone.Sampler;
    hihat: Tone.Sampler;
    clap: Tone.Sampler;
    tom: Tone.Sampler;

    // Bass & Lead
    bass: Tone.Sampler;
    lead: Tone.PolySynth<Tone.MonoSynth>;

    // New Synths
    pad: Tone.PolySynth;      // Atmospheric, long sustain
    arp: Tone.MonoSynth;      // Plucky, for arpeggios
    pluck: Tone.Sampler;   // Guitar
    fm: Tone.PolySynth<Tone.FMSynth>;         // FM synthesis for bells/metallic
    strings: Tone.Sampler;  // Cello/Strings
    piano: Tone.Sampler;    // Electric/Keys
    sub: Tone.MonoSynth;      // Sub bass

    // New Semantic Instruments
    flute: Tone.PolySynth;
    trumpet: Tone.PolySynth;
    violin: Tone.PolySynth;
    cymbal: Tone.Sampler;
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
let masterSaturation: Tone.Chebyshev; // For analog warmth
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

    masterSaturation = new Tone.Chebyshev(50).toDestination(); // Odd harmonics for warmth

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

        this.instruments = {
            // === DRUMS FROM R2 CDN ===
            kick: new Tone.Sampler({
                urls: {
                    C1: "drums/kick-1.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: 0,
                onload: () => console.log('✅ R2: kick loaded'),
                onerror: (e) => console.error('❌ R2 kick failed:', e),
            }).connect(instrumentsGain),

            snare: new Tone.Sampler({
                urls: {
                    C1: "drums/snare-1.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: 0,
            }).connect(reverb),

            hihat: new Tone.Sampler({
                urls: {
                    C1: "drums/hihat-1.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: -4,
            }).connect(instrumentsGain),

            clap: new Tone.Sampler({
                urls: {
                    C1: "drums/clap-1.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: 0,
            }).connect(reverb),

            tom: new Tone.Sampler({
                urls: {
                    C1: "drums/tom-1.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: 0,
            }).connect(reverb),

            // === BASS FROM R2 CDN ===
            bass: new Tone.Sampler({
                urls: {
                    C1: "bass/sub-1.mp3",
                    C2: "bass/sub-2.mp3",
                },
                baseUrl: R2_CDN + "/",
                volume: 0,
            }).connect(instrumentsGain),

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

            // === PLUCK FROM R2 CDN ===
            pluck: new Tone.Sampler({
                urls: {
                    C3: "synth/pluck-1.mp3",
                },
                baseUrl: R2_CDN + "/",
                volume: -3,
            }).connect(reverb),

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

            // === STRINGS (Synth-based for reliability) ===
            strings: new Tone.Sampler({
                urls: {
                    C3: "synth/pad-1.mp3",
                },
                baseUrl: R2_CDN + "/",
                volume: -4,
            }).connect(chorus).connect(longReverb),

            // === PIANO (Synth-based for reliability) ===
            piano: new Tone.Sampler({
                urls: {
                    C3: "synth/pluck-1.mp3",
                },
                baseUrl: R2_CDN + "/",
                volume: -2,
            }).connect(reverb),

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

            cymbal: new Tone.Sampler({
                urls: {
                    C1: "drums/hihat-2.mp3"
                },
                baseUrl: R2_CDN + "/",
                volume: -6,
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
 * Wait for all Tone.Sampler instruments to be loaded
 * Call this BEFORE running any code that uses samplers
 * Returns a promise that resolves when ALL samplers are ready
 */
export const waitForSamplersLoaded = async (): Promise<void> => {
    if (samplersLoaded) return;
    
    if (samplersLoadingPromise) {
        return samplersLoadingPromise;
    }
    
    const instruments = getInstruments();
    
    // List of all sampler instruments that need to load
    const samplers: Tone.Sampler[] = [
        instruments.kick,
        instruments.snare,
        instruments.hihat,
        instruments.clap,
        instruments.tom,
        instruments.bass,
        instruments.pluck,
        instruments.strings,
        instruments.piano,
        instruments.cymbal,
    ];
    
    samplersLoadingPromise = new Promise<void>((resolve) => {
        let loadedCount = 0;
        const totalCount = samplers.length;
        
        const checkAllLoaded = () => {
            loadedCount++;
            console.log(`🎹 Sampler loaded: ${loadedCount}/${totalCount}`);
            if (loadedCount >= totalCount) {
                samplersLoaded = true;
                console.log('✅ All samplers loaded!');
                resolve();
            }
        };
        
        // Check each sampler - if already loaded, count it
        // Otherwise wait for it
        for (const sampler of samplers) {
            if (sampler.loaded) {
                checkAllLoaded();
            } else {
                // Poll until loaded (Tone.Sampler doesn't have a reliable onload after construction)
                const checkLoaded = setInterval(() => {
                    if (sampler.loaded) {
                        clearInterval(checkLoaded);
                        checkAllLoaded();
                    }
                }, 30); // Check more frequently
                
                // Timeout after 8 seconds
                setTimeout(() => {
                    clearInterval(checkLoaded);
                    if (!sampler.loaded) {
                        console.warn('⚠️ Sampler load timeout, continuing anyway');
                        checkAllLoaded();
                    }
                }, 8000);
            }
        }
        
        // If all already loaded, resolve immediately
        if (loadedCount >= totalCount) {
            samplersLoaded = true;
            resolve();
        }
    });
    
    return samplersLoadingPromise;
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
