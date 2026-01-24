import * as Tone from 'tone';
import { getInstruments } from './instruments';
import { Deck } from './deck';
import { mixer } from './mixer';
import { audioAnalyzer } from './analyzer';

export class AudioEngine {
    private static instance: AudioEngine;
    private initialized: boolean = false;
    public decks!: Map<string, Deck>;

    private constructor() {
        // Don't create decks yet
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public async init() {
        if (this.initialized) return;

        await Tone.start();
        console.log('🎧 Audio Engine: Initialized');
        console.log('📊 Sample Rate:', Tone.getContext().sampleRate, 'Hz');
        console.log('🎚️ Decks: 4 (A, B, C, D)');

        // Initialize mixer first
        mixer.init();
        
        // Create decks after Tone.start()
        this.decks = new Map();
        this.decks.set('A', new Deck('A'));
        this.decks.set('B', new Deck('B'));
        this.decks.set('C', new Deck('C'));
        this.decks.set('D', new Deck('D'));

        // Preload instruments
        getInstruments();

        // Wait for all samples to load
        await Tone.loaded();
        console.log('✅ Samples: Loaded');

        // Set default BPM
        Tone.Transport.bpm.value = 120;
        
        // Connect decks to mixer
        this.connectDecksToMixer();
        
        this.initialized = true;
        console.log('🚀 Algorhythm: Ready');
        
        return this.initialized;
    }

    private connectDecksToMixer(): void {
        const deckA = this.decks.get('A')!;
        const deckB = this.decks.get('B')!;
        const deckC = this.decks.get('C')!;
        const deckD = this.decks.get('D')!;
        
        // Connect A and B to crossfader
        deckA.filter.connect(mixer.crossfade.a);
        deckB.filter.connect(mixer.crossfade.b);
        
        // C and D go directly to master
        deckC.filter.connect(mixer.master);
        deckD.filter.connect(mixer.master);
    }

    public start() {
        if (!this.initialized) return;
        Tone.Transport.start();
    }

    public stop() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    public setBpm(bpm: number) {
        Tone.Transport.bpm.rampTo(bpm, 0.1);
    }

    public getDeck(id: string): Deck | undefined {
        return this.decks.get(id);
    }

    public async loadTrack(deckId: string, file: File): Promise<void> {
        const deck = this.decks.get(deckId);
        if (!deck) throw new Error(`Deck ${deckId} not found`);

        // Load audio
        await deck.load(file);
        
        // Analyze audio
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
        const analysis = await audioAnalyzer.analyze(audioBuffer);
        
        // Set deck properties
        deck.bpm = analysis.bpm;
        deck.key = analysis.key;
        deck.beatGrid = analysis.beats;
        
        console.log(`✅ Deck ${deckId}: Loaded`);
        console.log(`   BPM: ${analysis.bpm}`);
        console.log(`   Key: ${analysis.key}`);
        console.log(`   Beats: ${analysis.beats.length}`);
    }

    public get context() {
        return Tone.getContext();
    }

    public get isInitialized(): boolean {
        return this.initialized;
    }
}

export const audioEngine = AudioEngine.getInstance();
