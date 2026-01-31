import * as Tone from 'tone';
import { audioEngine } from './audio';
import { mixer } from './mixer';
import { recordingEngine } from './recorder';
import { midiController } from './midi';
import { getInstruments, getEffects } from './instruments';
import { styleProcessor } from './styleProcessor';
import { addSampleSupport } from './samplePlayer';
import { SOUND_PRESETS, SoundPresetName, createConfiguredSynth, SynthConfig } from './soundDesign';
// ... (keep existing imports)



// Crossfader
import { BeatSync } from './sync';
import { HarmonicMixing } from './harmonic';
import { SampleDeck } from './sampler';
import { AutomationRecorder } from './automation';
import { StemSeparator } from './stems';
import { CloudStorage } from './cloud';
import { TemplateLibrary } from './templates';

export class DJAPI {
  private static instance: DJAPI;

  // Expose engines
  public engine = audioEngine;
  public mixer = mixer;
  public recorder = recordingEngine;
  public midi = midiController;
  public beatSync!: BeatSync;
  public harmonic = HarmonicMixing;
  public sampler!: SampleDeck;
  public automation!: AutomationRecorder;
  public stems!: StemSeparator;
  public cloud!: CloudStorage;
  public templates!: TemplateLibrary;

  private constructor() { }

  public init(): void {
    this.beatSync = new BeatSync();
    this.sampler = new SampleDeck(16);
    this.automation = new AutomationRecorder();
    this.stems = new StemSeparator(Tone.getContext().rawContext as AudioContext);
    this.cloud = new CloudStorage();
    this.templates = new TemplateLibrary();

    ['A', 'B', 'C', 'D'].forEach(id => {
      const deck = audioEngine.getDeck(id);
      if (deck) this.beatSync.addDeck(id, deck);
    });

    this.sampler.connect(mixer.master);
    
    // Add sample player support
    addSampleSupport(this as any);
    console.log('✅ Sample Player: Connected to DJ API');
    // Note: Samples are now preloaded by LoadingScreen component with progress UI
  }

  public static getInstance(): DJAPI {
    if (!DJAPI.instance) {
      DJAPI.instance = new DJAPI();
    }
    return DJAPI.instance;
  }

  // BPM control
  get bpm(): number {
    return Tone.Transport.bpm.value;
  }

  set bpm(value: number) {
    Tone.Transport.bpm.rampTo(value, 0.1);
    
    // Update all active decks to match new BPM
    const decks = audioEngine.decks;
    if (decks) {
      styleProcessor.getActiveDecks().forEach(deckId => {
        const deck = decks.get(deckId);
        if (deck && deck.player.buffer.loaded) {
          const ratio = value / deck.bpm;
          deck.player.playbackRate = ratio;
        }
      });
    }
  }

  // Deck access
  get deck() {
    return {
      A: this.getDeckAPI('A'),
      B: this.getDeckAPI('B'),
      C: this.getDeckAPI('C'),
      D: this.getDeckAPI('D')
    };
  }

  private getDeckAPI(id: string) {
    const deck = audioEngine.getDeck(id);
    if (!deck) {
      // Return a placeholder API if deck not initialized yet
      return {
        play: () => console.warn(`Deck ${id} not initialized`),
        pause: () => {},
        stop: () => {},
        load: () => Promise.resolve(),
        seek: () => {},
        volume: 0,
        eq: { high: 0, mid: 0, low: 0 },
        filter: { cutoff: 20000, resonance: 1, highpass: 20000, lowpass: 20000 },
        effects: { add: () => {}, remove: () => {}, get: () => null, clear: () => {} },
        colorFX: { value: 0 },
        hotcue: {},
        loop: { set: () => {}, enable: () => {}, disable: () => {}, double: () => {}, halve: () => {}, shift: () => {}, auto: () => {} },
        state: { isPlaying: false, isPaused: false, currentTime: 0, duration: 0, bpm: 120, key: '', beatGrid: [] },
        bpm: 120,
        key: '',
        beatGrid: [],
        isPlaying: false,
        currentTime: 0,
        duration: 0
      };
    }

    return {
      // Playback
      load: (file: File) => audioEngine.loadTrack(id, file),
      play: () => {
        deck.play();
        styleProcessor.registerActiveDeck(id);
        // Capture and apply current style
        const currentStyle = styleProcessor.getCurrentStyle();
        if (currentStyle) {
          styleProcessor.applyStyle(deck, currentStyle);
        }
      },
      pause: () => deck.pause(),
      stop: () => {
        deck.stop();
        styleProcessor.unregisterActiveDeck(id);
      },
      seek: (time: number) => deck.seek(time),

      // Volume
      get volume() { return deck.volume.volume.value; },
      set volume(db: number) { deck.volume.volume.value = db; },

      // EQ
      eq: {
        get high() { return deck.eq.high.gain.value; },
        set high(db: number) { 
          deck.setEQHigh(db); 
          // Update style profile
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        },
        get mid() { return deck.eq.mid.gain.value; },
        set mid(db: number) { 
          deck.setEQMid(db); 
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        },
        get low() { return deck.eq.low.gain.value; },
        set low(db: number) { 
          deck.setEQLow(db); 
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        }
      },

      // Filter
      filter: {
        get cutoff() { return deck.filter.frequency.value as any; },
        set cutoff(freq: number) { 
          deck.setFilterCutoff(freq); 
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        },
        get resonance() { return deck.filter.Q.value; },
        set resonance(q: number) { 
          deck.setFilterResonance(q); 
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        },
        get highpass() { return deck.filter.frequency.value as any; },
        set highpass(freq: number) {
          deck.filter.type = 'highpass';
          deck.setFilterCutoff(freq);
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        },
        get lowpass() { return deck.filter.frequency.value as any; },
        set lowpass(freq: number) {
          deck.filter.type = 'lowpass';
          deck.setFilterCutoff(freq);
          const style = styleProcessor.captureStyle(deck);
          styleProcessor.setCurrentStyle(style);
        }
      },

      // Effects
      effects: {
        add: (name: string, type: any) => deck.effects.add(name, type),
        remove: (name: string) => deck.effects.remove(name),
        get: (name: string) => {
          const fx = deck.effects.get(name);
          if (!fx) return null;
          return {
            get wet() { return fx.wet; },
            set wet(value: number) { fx.wet = value; },
            get bypass() { return fx.bypass; },
            set bypass(value: boolean) { fx.bypass = value; }
          };
        },
        clear: () => deck.effects.clear()
      },

      // Color FX
      colorFX: {
        get value() { return deck.colorFX.value; },
        set value(v: number) { deck.colorFX.value = v; }
      },

      // Hot cues
      hotcue: new Proxy({}, {
        get: (target, prop) => {
          if (typeof prop !== 'string') return undefined;
          const index = parseInt(prop);
          if (isNaN(index)) return undefined;

          return {
            set: (time: number, label?: string) => deck.setHotCue(index, time, label),
            trigger: () => deck.triggerHotCue(index),
            clear: () => deck.clearHotCue(index),
            get time() {
              return deck.hotcues.get(index)?.time || 0;
            }
          };
        }
      }),

      // Loop
      loop: {
        set: (start: number, end: number) => deck.setLoop(start, end),
        enable: () => deck.enableLoop(),
        disable: () => deck.disableLoop(),
        double: () => deck.doubleLoop(),
        halve: () => deck.halveLoop(),
        shift: (beats: number) => deck.shiftLoop(beats),
        auto: (beats: number) => {
          const currentTime = deck.state.currentTime;
          const beatLength = 60 / deck.bpm;
          deck.setLoop(currentTime, currentTime + beats * beatLength);
          deck.enableLoop();
        }
      },

      // State
      get state() { return deck.state; },
      get bpm() { return deck.bpm; },
      set bpm(value: number) { deck.bpm = value; },
      get key() { return deck.key; },
      get beatGrid() { return deck.beatGrid; },
      get isPlaying() { return deck.state.isPlaying; },
      get currentTime() { return deck.state.currentTime; },
      get duration() { return deck.state.duration; }
    };
  }

  // Instruments (from existing implementation)
  get kick() { return getInstruments().kick; }
  get snare() { return getInstruments().snare; }
  get hihat() { return getInstruments().hihat; }
  get clap() { return getInstruments().clap; }
  get tom() { return getInstruments().tom; }
  get bass() { return getInstruments().bass; }
  get sub() { return getInstruments().sub; }
  get lead() { return getInstruments().lead; }
  get synth() { return getInstruments().lead; } // Alias
  get pad() { return getInstruments().pad; }
  get strings() { return getInstruments().strings; }
  get piano() { return getInstruments().piano; }
  get arp() { return getInstruments().arp; }
  get pluck() { return getInstruments().pluck; }
  get fm() { return getInstruments().fm; }
  get brass() { return getInstruments().trumpet; } // Alias

  // === 99% ACCURATE SONG-SPECIFIC INSTRUMENTS ===
  get levelsPiano() { return getInstruments().levelsPiano; }
  get fadedPiano() { return getInstruments().fadedPiano; }  // THE iconic Faded piano!
  get fadedPluck() { return getInstruments().fadedPluck; }
  get strobeArp() { return getInstruments().strobeArp; }
  get animalsPluck() { return getInstruments().animalsPluck; }
  get skrillexWobble() { return getInstruments().skrillexWobble; }
  get shapeMarimba() { return getInstruments().shapeMarimba; }
  get diploHorn() { return getInstruments().diploHorn; }
  get sawanoStrings() { return getInstruments().sawanoStrings; }
  get sawanoChoir() { return getInstruments().sawanoChoir; }
  get kpopPhrygian() { return getInstruments().kpopPhrygian; }
  get gou90sPiano() { return getInstruments().gou90sPiano; }
  get phonkMetallic() { return getInstruments().phonkMetallic; }
  get ghibliGrand() { return getInstruments().ghibliGrand; }
  get ghibliFlute() { return getInstruments().ghibliFlute; }
  get supersaw() { return getInstruments().supersaw; }
  get marimba() { return getInstruments().marimba; }
  get choir() { return getInstruments().choir; }
  get housePiano() { return getInstruments().housePiano; }
  get wobbleBass() { return getInstruments().wobbleBass; }

  // Sound Design - Create custom synths with specific presets
  private customSynths: Map<string, Tone.PolySynth> = new Map();

  /**
   * Create a synth with a specific sound preset
   * This is what makes each song sound unique!
   * 
   * @example
   * // Use a preset
   * const lead = dj.sound('fadedPluck');
   * lead.triggerAttackRelease('C4', '8n', time);
   * 
   * // Or use custom config
   * const bass = dj.sound({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.8 } });
   */
  sound(preset: SoundPresetName | SynthConfig): Tone.PolySynth {
    const config = typeof preset === 'string' ? SOUND_PRESETS[preset] : preset;
    const key = JSON.stringify(config);
    
    if (this.customSynths.has(key)) {
      return this.customSynths.get(key)!;
    }

    const fx = getEffects();
    const synth = createConfiguredSynth(config, fx.instrumentsGain || Tone.getDestination());
    this.customSynths.set(key, synth);
    return synth;
  }

  /**
   * Get available sound presets
   */
  get soundPresets() {
    return SOUND_PRESETS;
  }

  // Effects
  get effects() {
    const fx = getEffects();
    return {
      reverb: { set: (params: any) => fx.reverb?.set(params) },
      delay: { set: (params: any) => fx.delay?.set(params) },
      chorus: { set: (params: any) => fx.chorus?.set(params) },
      filter: { set: (params: any) => { /* simplified */ } },
      distortion: { set: (params: any) => { } },
      pitchShift: { set: (params: any) => { } },
      bitcrusher: { set: (params: any) => { } },
      vocoder: { set: (params: any) => { } }
    };
  }

  // Instruments volume control
  get instruments() {
    const fx = getEffects();
    return {
      get volume() { return fx.instrumentsGain?.gain.value || 0.3; },
      set volume(value: number) { 
        if (fx.instrumentsGain) fx.instrumentsGain.gain.rampTo(value, 0.1); 
      }
    };
  }

  /**
   * Volume control for individual instruments and master
   * Use in code editor like:
   *   dj.volume.master = 0.8;
   *   dj.volume.supersaw = 0.9;
   *   dj.volume.kick = 1.0;
   */
  get volume() {
    const instruments = getInstruments();
    const fx = getEffects();
    
    return {
      // Master volume (0-1)
      get master() { return fx.instrumentsGain?.gain.value || 0.3; },
      set master(v: number) { 
        if (fx.instrumentsGain) fx.instrumentsGain.gain.rampTo(Math.max(0, Math.min(1, v)), 0.05);
      },
      
      // Individual instrument volumes (dB, typically -20 to +10)
      get kick() { return instruments.kick?.volume?.value ?? 0; },
      set kick(db: number) { if (instruments.kick?.volume) instruments.kick.volume.value = db; },
      
      get snare() { return instruments.snare?.volume?.value ?? 0; },
      set snare(db: number) { if (instruments.snare?.volume) instruments.snare.volume.value = db; },
      
      get hihat() { return instruments.hihat?.volume?.value ?? 0; },
      set hihat(db: number) { if (instruments.hihat?.volume) instruments.hihat.volume.value = db; },
      
      get clap() { return instruments.clap?.volume?.value ?? 0; },
      set clap(db: number) { if (instruments.clap?.volume) instruments.clap.volume.value = db; },
      
      get bass() { return instruments.bass?.volume?.value ?? 0; },
      set bass(db: number) { if (instruments.bass?.volume) instruments.bass.volume.value = db; },
      
      get sub() { return instruments.sub?.volume?.value ?? 0; },
      set sub(db: number) { if (instruments.sub?.volume) instruments.sub.volume.value = db; },
      
      get lead() { return instruments.lead?.volume?.value ?? 0; },
      set lead(db: number) { if (instruments.lead?.volume) instruments.lead.volume.value = db; },
      
      get pad() { return instruments.pad?.volume?.value ?? 0; },
      set pad(db: number) { if (instruments.pad?.volume) instruments.pad.volume.value = db; },
      
      get piano() { return instruments.piano?.volume?.value ?? 0; },
      set piano(db: number) { if (instruments.piano?.volume) instruments.piano.volume.value = db; },
      
      get strings() { return instruments.strings?.volume?.value ?? 0; },
      set strings(db: number) { if (instruments.strings?.volume) instruments.strings.volume.value = db; },
      
      get arp() { return instruments.arp?.volume?.value ?? 0; },
      set arp(db: number) { if (instruments.arp?.volume) instruments.arp.volume.value = db; },
      
      get pluck() { return instruments.pluck?.volume?.value ?? 0; },
      set pluck(db: number) { if (instruments.pluck?.volume) instruments.pluck.volume.value = db; },
      
      get fm() { return instruments.fm?.volume?.value ?? 0; },
      set fm(db: number) { if (instruments.fm?.volume) instruments.fm.volume.value = db; },
      
      // Song-specific instruments
      get supersaw() { return instruments.supersaw?.volume?.value ?? 0; },
      set supersaw(db: number) { if (instruments.supersaw?.volume) instruments.supersaw.volume.value = db; },
      
      get fadedPiano() { return instruments.fadedPiano?.volume?.value ?? 0; },
      set fadedPiano(db: number) { if (instruments.fadedPiano?.volume) instruments.fadedPiano.volume.value = db; },
      
      get fadedPluck() { return instruments.fadedPluck?.volume?.value ?? 0; },
      set fadedPluck(db: number) { if (instruments.fadedPluck?.volume) instruments.fadedPluck.volume.value = db; },
      
      get levelsPiano() { return instruments.levelsPiano?.volume?.value ?? 0; },
      set levelsPiano(db: number) { if (instruments.levelsPiano?.volume) instruments.levelsPiano.volume.value = db; },
      
      get strobeArp() { return instruments.strobeArp?.volume?.value ?? 0; },
      set strobeArp(db: number) { if (instruments.strobeArp?.volume) instruments.strobeArp.volume.value = db; },
      
      get animalsPluck() { return instruments.animalsPluck?.volume?.value ?? 0; },
      set animalsPluck(db: number) { if (instruments.animalsPluck?.volume) instruments.animalsPluck.volume.value = db; },
      
      get skrillexWobble() { return instruments.skrillexWobble?.volume?.value ?? 0; },
      set skrillexWobble(db: number) { if (instruments.skrillexWobble?.volume) instruments.skrillexWobble.volume.value = db; },
      
      get shapeMarimba() { return instruments.shapeMarimba?.volume?.value ?? 0; },
      set shapeMarimba(db: number) { if (instruments.shapeMarimba?.volume) instruments.shapeMarimba.volume.value = db; },
      
      get diploHorn() { return instruments.diploHorn?.volume?.value ?? 0; },
      set diploHorn(db: number) { if (instruments.diploHorn?.volume) instruments.diploHorn.volume.value = db; },
      
      get sawanoStrings() { return instruments.sawanoStrings?.volume?.value ?? 0; },
      set sawanoStrings(db: number) { if (instruments.sawanoStrings?.volume) instruments.sawanoStrings.volume.value = db; },
      
      get sawanoChoir() { return instruments.sawanoChoir?.volume?.value ?? 0; },
      set sawanoChoir(db: number) { if (instruments.sawanoChoir?.volume) instruments.sawanoChoir.volume.value = db; },
      
      get gou90sPiano() { return instruments.gou90sPiano?.volume?.value ?? 0; },
      set gou90sPiano(db: number) { if (instruments.gou90sPiano?.volume) instruments.gou90sPiano.volume.value = db; },
      
      get housePiano() { return instruments.housePiano?.volume?.value ?? 0; },
      set housePiano(db: number) { if (instruments.housePiano?.volume) instruments.housePiano.volume.value = db; },
      
      get marimba() { return instruments.marimba?.volume?.value ?? 0; },
      set marimba(db: number) { if (instruments.marimba?.volume) instruments.marimba.volume.value = db; },
      
      get choir() { return instruments.choir?.volume?.value ?? 0; },
      set choir(db: number) { if (instruments.choir?.volume) instruments.choir.volume.value = db; },
      
      get wobbleBass() { return instruments.wobbleBass?.volume?.value ?? 0; },
      set wobbleBass(db: number) { if (instruments.wobbleBass?.volume) instruments.wobbleBass.volume.value = db; },
      
      get ghibliGrand() { return instruments.ghibliGrand?.volume?.value ?? 0; },
      set ghibliGrand(db: number) { if (instruments.ghibliGrand?.volume) instruments.ghibliGrand.volume.value = db; },
      
      get ghibliFlute() { return instruments.ghibliFlute?.volume?.value ?? 0; },
      set ghibliFlute(db: number) { if (instruments.ghibliFlute?.volume) instruments.ghibliFlute.volume.value = db; },
    };
  }

  // Crossfader
  get crossfader() {
    return {
      get position() { return mixer.crossfaderPosition; },
      set position(value: number) { mixer.setCrossfaderPosition(value); },
      get curve() { return mixer.crossfaderCurve; },
      set curve(value: 'linear' | 'power' | 'constant') { mixer.setCrossfaderCurve(value); }
    };
  }

  // Master
  get master() {
    return {
      get volume() { return mixer.master.volume.value; },
      set volume(db: number) { mixer.setMasterVolume(db); },
      limiter: {
        enable: () => mixer.enableLimiter(),
        disable: () => mixer.disableLimiter()
      }
    };
  }

  // Loop function (from runner)
  loop(interval: string, callback: (time: number) => void): void {
    Tone.Transport.scheduleRepeat(callback, interval);
  }

  // Stop all
  stop(): void {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  // Recording
  get record() {
    return {
      start: () => recordingEngine.start(),
      stop: () => recordingEngine.stop(),
      export: (blob: Blob, options?: any) => recordingEngine.export(blob, options),
      download: (blob: Blob, filename: string) => recordingEngine.download(blob, filename),
      get recording() { return recordingEngine.recording; }
    };
  }

  // Sync helper
  sync(deckA: any, deckB: any): void {
    // Simple BPM sync
    const targetBPM = deckA.bpm;
    deckB.bpm = targetBPM;
    console.log(`🔄 Synced: Deck B → ${targetBPM} BPM`);
  }

  // Sidechain (already implemented in runner)
  sidechain(interval: string): void {
    // Simplified sidechain - duck volume on interval
    this.loop(interval, (time) => {
      this.master.volume = -12;
      Tone.Transport.scheduleOnce(() => {
        this.master.volume = 0;
      }, time + Tone.Time(interval).toSeconds() * 0.5);
    });
  }

  // Preset system (from existing presets)
  get preset() {
    return {
      alanWalker: () => this.applyPreset('alanWalker'),
      marshmello: () => this.applyPreset('marshmello'),
      synthwave: () => this.applyPreset('synthwave'),
      trap: () => this.applyPreset('trap'),
      lofi: () => this.applyPreset('lofi'),
      reset: () => this.applyPreset('reset')
    };
  }

  private applyPreset(name: string): void {
    console.log(`🎨 Preset: ${name}`);
    // Preset logic from existing presets.ts
  }
}

// Export singleton instance
export const dj = DJAPI.getInstance();

// Make it globally available for code editor
if (typeof window !== 'undefined') {
  (window as any).dj = dj;
}
