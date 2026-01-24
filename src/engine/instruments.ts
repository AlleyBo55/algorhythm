import * as Tone from 'tone';

export interface InstrumentMap {
    // Drums
    // Drums (Real Samples)
    kick: Tone.Sampler;
    snare: Tone.Sampler;
    hihat: Tone.Sampler;
    clap: Tone.Sampler; // Or Sampler if we found a good one, keeping interface consistent
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

    // 2. SIDECHAIN BUS: Simulates pumping effect
    // Instruments connected here go through a gain stage we can duck
    sidechainBus = new Tone.Gain(1).connect(masterGain);

    // 3. AUX EFFECTS
    reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.2
    }).connect(masterGain);

    longReverb = new Tone.Reverb({
        decay: 4,
        wet: 0.3
    }).connect(masterGain);

    delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.3,
        wet: 0.2
    }).connect(masterGain);

    chorus = new Tone.Chorus({
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        wet: 0.2
    }).connect(masterGain);
    chorus.start();

    effectsInitialized = true;
}

export class DefaultInstruments {
    public instruments: InstrumentMap;

    constructor() {
        initEffects();

        this.instruments = {
            // === HIGH FIDELITY DRUMS (Real Samples) ===
            kick: new Tone.Sampler({
                urls: {
                    C1: "kick.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: 0
            }).connect(masterGain),

            snare: new Tone.Sampler({
                urls: {
                    C1: "snare.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: 0
            }).connect(reverb),

            hihat: new Tone.Sampler({
                urls: {
                    C1: "hihat.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: -4
            }).connect(masterGain),

            clap: new Tone.Sampler({
                urls: {
                    C1: "snare.mp3" // Fallback to snare rimshot-ish sound or use a separate clap sample if available.
                    // Actually Tone.js doesn't have a great clap in acoustic kit. Let's use the snare for now or a different source.
                    // Let's stick to the NoiseSynth for Clap as it's often synthetic in Pop anyway.
                    // Wait, the plan said "Drum Kits".
                    // I'll keep Clap synthetic for now as it's often better for Pop/Trap.
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: 0
            }).connect(reverb),

            // Reverting Clap to Synthetic because acoustic kits don't usually have "Claps" 
            // and Trap/Pop claps are synthetic.
            // But let's upgrade the synth clap to be punchier.

            tom: new Tone.Sampler({
                urls: {
                    C1: "tom1.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: 0
            }).connect(reverb),

            // === BASS (Fender Jazz) ===
            bass: new Tone.Sampler({
                urls: {
                    "A#2": "As2.wav",
                    "A#3": "As3.wav",
                    "A#4": "As4.wav",
                    "A#5": "As5.wav",
                    "C#2": "Cs2.wav",
                    "C#3": "Cs3.wav",
                    "C#4": "Cs4.wav",
                    "C#5": "Cs5.wav",
                    "E2": "E2.wav",
                    "E3": "E3.wav",
                    "E4": "E4.wav",
                    "E5": "E5.wav",
                    "G2": "G2.wav",
                    "G3": "G3.wav",
                    "G4": "G4.wav",
                    "G5": "G5.wav"
                },
                baseUrl: "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/bass-electric/",
                volume: 0
            }).connect(masterGain),

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
                volume: -6
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

            // === PLUCK (Acoustic Guitar) ===
            pluck: new Tone.Sampler({
                urls: {
                    "A2": "A2.wav",
                    "A3": "A3.wav",
                    "A4": "A4.wav",
                    "B2": "B2.wav",
                    "B3": "B3.wav",
                    "B4": "B4.wav",
                    "C3": "C3.wav",
                    "C4": "C4.wav",
                    "C5": "C5.wav",
                    "D2": "D2.wav",
                    "D3": "D3.wav",
                    "D4": "D4.wav",
                    "E2": "E2.wav",
                    "E3": "E3.wav",
                    "E4": "E4.wav",
                    "G2": "G2.wav",
                    "G3": "G3.wav",
                    "G4": "G4.wav"
                },
                baseUrl: "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/guitar-acoustic/",
                volume: -3
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

            // === STRINGS (Cello Section) ===
            strings: new Tone.Sampler({
                urls: {
                    "A2": "A2.wav",
                    "A3": "A3.wav",
                    "A4": "A4.wav",
                    "A5": "A5.wav",
                    "C2": "C2.wav",
                    "C3": "C3.wav",
                    "C4": "C4.wav",
                    "C5": "C5.wav",
                    "E2": "E2.wav",
                    "E3": "E3.wav",
                    "E4": "E4.wav",
                    "E5": "E5.wav",
                    "G2": "G2.wav",
                    "G3": "G3.wav",
                    "G4": "G4.wav",
                    "G5": "G5.wav"
                },
                baseUrl: "https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/samples/cello/",
                volume: -4
            }).connect(chorus).connect(longReverb),

            // === HIGH FIDELITY GRAND PIANO (Salamander) ===
            piano: new Tone.Sampler({
                urls: {
                    "A0": "A0.mp3",
                    "C1": "C1.mp3",
                    "D#1": "Ds1.mp3",
                    "F#1": "Fs1.mp3",
                    "A1": "A1.mp3",
                    "C2": "C2.mp3",
                    "D#2": "Ds2.mp3",
                    "F#2": "Fs2.mp3",
                    "A2": "A2.mp3",
                    "C3": "C3.mp3",
                    "D#3": "Ds3.mp3",
                    "F#3": "Fs3.mp3",
                    "A3": "A3.mp3",
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    "A4": "A4.mp3",
                    "C5": "C5.mp3",
                    "D#5": "Ds5.mp3",
                    "F#5": "Fs5.mp3",
                    "A5": "A5.mp3",
                    "C6": "C6.mp3",
                    "D#6": "Ds6.mp3",
                    "F#6": "Fs6.mp3",
                    "A6": "A6.mp3",
                    "C7": "C7.mp3",
                    "D#7": "Ds7.mp3",
                    "F#7": "Fs7.mp3",
                    "A7": "A7.mp3",
                    "C8": "C8.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
                volume: -2
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
            }).connect(masterGain),

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
                    "C1": "hihat.mp3" // Fallback: real crash not found in this pack
                },
                baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/",
                volume: -6
            }).connect(masterGain),

            bass808: new Tone.MembraneSynth({
                pitchDecay: 0.1,
                octaves: 4,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.8, sustain: 0.01, release: 1.2 },
                volume: 6
            }).connect(masterGain),

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

export const getEffects = () => {
    if (!effectsInitialized) {
        initEffects();
    }
    return {
        reverb: reverb,
        delay: delay,
        chorus: chorus,
        filter: masterEQ // Mapping EQ to 'filter' for basic usage, though it's EQ
    };
};
