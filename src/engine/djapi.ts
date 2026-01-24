import * as Tone from 'tone';
import { audioEngine } from './audio';
import { mixer } from './mixer';
import { recordingEngine } from './recorder';
import { midiController } from './midi';
import { getInstruments } from './instruments';
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
  public sync!: BeatSync;
  public harmonic = HarmonicMixing;
  public sampler!: SampleDeck;
  public automation!: AutomationRecorder;
  public stems!: StemSeparator;
  public cloud!: CloudStorage;
  public templates!: TemplateLibrary;

  private constructor() {}
  
  public init(): void {
    this.sync = new BeatSync();
    this.sampler = new SampleDeck(16);
    this.automation = new AutomationRecorder();
    this.stems = new StemSeparator(Tone.getContext().rawContext as AudioContext);
    this.cloud = new CloudStorage();
    this.templates = new TemplateLibrary();
    
    ['A', 'B', 'C', 'D'].forEach(id => {
      const deck = audioEngine.getDeck(id);
      if (deck) this.sync.addDeck(id, deck);
    });
    
    this.sampler.connect(mixer.master);
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
    if (!deck) throw new Error(`Deck ${id} not found`);

    return {
      // Playback
      play: () => deck.play(),
      pause: () => deck.pause(),
      stop: () => deck.stop(),
      seek: (time: number) => deck.seek(time),

      // Volume
      get volume() { return deck.volume.volume.value; },
      set volume(db: number) { deck.volume.volume.value = db; },

      // EQ
      eq: {
        get high() { return deck.eq.high.gain.value; },
        set high(db: number) { deck.setEQHigh(db); },
        get mid() { return deck.eq.mid.gain.value; },
        set mid(db: number) { deck.setEQMid(db); },
        get low() { return deck.eq.low.gain.value; },
        set low(db: number) { deck.setEQLow(db); }
      },

      // Filter
      filter: {
        get cutoff() { return deck.filter.frequency.value; },
        set cutoff(freq: number) { deck.setFilterCutoff(freq); },
        get resonance() { return deck.filter.Q.value; },
        set resonance(q: number) { deck.setFilterResonance(q); },
        get highpass() { return deck.filter.frequency.value; },
        set highpass(freq: number) {
          deck.filter.type = 'highpass';
          deck.setFilterCutoff(freq);
        },
        get lowpass() { return deck.filter.frequency.value; },
        set lowpass(freq: number) {
          deck.filter.type = 'lowpass';
          deck.setFilterCutoff(freq);
        }
      },

      // Hot cues
      hotcue: new Proxy({}, {
        get: (target, prop) => {
          const index = parseInt(prop as string);
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
  get pad() { return getInstruments().pad; }
  get strings() { return getInstruments().strings; }
  get piano() { return getInstruments().piano; }
  get arp() { return getInstruments().arp; }
  get pluck() { return getInstruments().pluck; }
  get fm() { return getInstruments().fm; }

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
