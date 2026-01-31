import * as Tone from 'tone';
import { EffectsRack, ColorFX } from './effects';
import { TimeStretcher } from './timestretch';
import { VinylMode, JogWheel } from './vinyl';
import { SpectrumAnalyzer } from './spectrum';
import { SlipMode } from './slip';
import { Quantize } from './quantize';
import { DeckBus } from './deckBus';

export interface HotCue {
  time: number;
  label?: string;
}

export interface DeckState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  bpm: number;
  key: string;
  beatGrid: number[];
}

export class Deck {
  public id: string;
  public player: Tone.Player;
  public volume: Tone.Volume;
  public eq: { high: Tone.Filter; mid: Tone.Filter; low: Tone.Filter };
  public filter: Tone.Filter;
  public hotcues: Map<number, HotCue>;
  public readonly effects: EffectsRack;
  public readonly colorFX: ColorFX;
  private timeStretcher: TimeStretcher;
  public readonly vinyl: VinylMode;
  public readonly jogWheel: JogWheel;
  public readonly spectrum: SpectrumAnalyzer;
  public readonly slip: SlipMode;
  public readonly quantize: Quantize;
  private _pausedAt: number = 0;
  
  // Professional audio bus (Phase 1)
  public readonly bus: DeckBus;

  private _bpm: number = 120;
  private _key: string = '';
  private _beatGrid: number[] = [];
  private _loopStart: number = 0;
  private _loopEnd: number = 0;
  private _loopEnabled: boolean = false;

  constructor(id: string) {
    this.id = id;
    this.hotcues = new Map();
    
    // Initialize professional deck bus (Phase 1)
    this.bus = new DeckBus();

    // Audio chain: Player → Volume → EQ → Filter → Effects → Spectrum → Bus → Master
    this.player = new Tone.Player();
    this.volume = new Tone.Volume(0);

    // Phase 2: Advanced features
    this.effects = new EffectsRack();
    this.colorFX = new ColorFX();
    this.timeStretcher = new TimeStretcher(Tone.getContext().rawContext as AudioContext);
    this.vinyl = new VinylMode(this.player);
    this.jogWheel = new JogWheel(this.vinyl);
    this.spectrum = new SpectrumAnalyzer(Tone.getContext().rawContext as AudioContext);
    this.slip = new SlipMode(this.player);
    this.quantize = new Quantize();

    // 3-band EQ (isolator style)
    this.eq = {
      high: new Tone.Filter({ type: 'highshelf', frequency: 2500, Q: 0.7 }),
      mid: new Tone.Filter({ type: 'peaking', frequency: 1000, Q: 0.7 }),
      low: new Tone.Filter({ type: 'lowshelf', frequency: 250, Q: 0.7 })
    };

    // Main filter
    this.filter = new Tone.Filter({ type: 'lowpass', frequency: 20000, Q: 1 });

    // Connect chain with Phase 1 professional bus
    this.player.chain(
      this.volume,
      this.eq.low,
      this.eq.mid,
      this.eq.high,
      this.filter,
      this.effects.input
    );
    
    // Connect effects to bus input
    this.effects.output.connect(this.bus.inputNode);
    
    // Connect spectrum analyzer
    this.bus.outputNode.connect(this.spectrum.node);
  }

  // Helper to get the final output node for the mixer to connect to
  public get outputNode(): Tone.ToneAudioNode {
    // Return the bus output node (professional signal chain)
    return this.bus.outputNode;
  }

  async load(file: File | string): Promise<void> {
    const buffer = typeof file === 'string'
      ? await Tone.Buffer.fromUrl(file)
      : await this.fileToBuffer(file);

    this.player.buffer = buffer;
  }

  private async fileToBuffer(file: File): Promise<Tone.ToneAudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
    return new Tone.ToneAudioBuffer(audioBuffer);
  }

  play(): void {
    if (!this.player.buffer.loaded) return;
    
    if (this.player.state === 'started') return; // Already playing
    
    // Resume from paused position or start from beginning
    this.player.start(undefined, this._pausedAt);
    this._pausedAt = 0; // Clear pause position after resuming
  }

  pause(): void {
    if (this.player.state !== 'started') return;
    
    // Calculate current position: how long it's been playing + where it started
    const now = Tone.now();
    const startTime = (this.player as any)._startTime || 0;
    const offset = (this.player as any)._offset || 0;
    this._pausedAt = offset + (now - startTime);
    
    this.player.stop();
  }

  stop(): void {
    this.player.stop();
    this._pausedAt = 0;
  }

  seek(time: number): void {
    this.player.seek(time);
  }

  // Hot cues
  setHotCue(index: number, time: number, label?: string): void {
    this.hotcues.set(index, { time, label });
  }

  triggerHotCue(index: number): void {
    const cue = this.hotcues.get(index);
    if (cue) {
      this.seek(cue.time);
    }
  }

  clearHotCue(index: number): void {
    this.hotcues.delete(index);
  }

  // Loop controls
  setLoop(start: number, end: number): void {
    this._loopStart = start;
    this._loopEnd = end;
    this.player.loop = true;
    this.player.loopStart = start;
    this.player.loopEnd = end;
  }

  enableLoop(): void {
    this._loopEnabled = true;
    this.player.loop = true;
  }

  disableLoop(): void {
    this._loopEnabled = false;
    this.player.loop = false;
  }

  doubleLoop(): void {
    const length = this._loopEnd - this._loopStart;
    this.setLoop(this._loopStart, this._loopEnd + length);
  }

  halveLoop(): void {
    const length = this._loopEnd - this._loopStart;
    this.setLoop(this._loopStart, this._loopStart + length / 2);
  }

  shiftLoop(beats: number): void {
    if (this._beatGrid.length === 0) return;
    const beatLength = 60 / this._bpm;
    const shift = beats * beatLength;
    this.setLoop(this._loopStart + shift, this._loopEnd + shift);
  }

  // EQ controls
  setEQHigh(db: number): void {
    this.eq.high.gain.value = db;
  }

  setEQMid(db: number): void {
    this.eq.mid.gain.value = db;
  }

  setEQLow(db: number): void {
    this.eq.low.gain.value = db;
  }

  // Filter controls
  setFilterCutoff(freq: number): void {
    this.filter.frequency.value = freq;
  }

  setFilterResonance(q: number): void {
    this.filter.Q.value = q;
  }

  // Getters
  get state(): DeckState {
    return {
      isPlaying: this.player.state === 'started',
      isPaused: this.player.state === 'stopped',
      currentTime: this.player.buffer.loaded ? this.player.immediate() : 0,
      duration: this.player.buffer.loaded ? this.player.buffer.duration : 0,
      bpm: this._bpm,
      key: this._key,
      beatGrid: this._beatGrid
    };
  }

  set bpm(value: number) {
    this._bpm = value;
  }

  get bpm(): number {
    return this._bpm;
  }

  set key(value: string) {
    this._key = value;
  }

  get key(): string {
    return this._key;
  }

  set beatGrid(grid: number[]) {
    this._beatGrid = grid;
  }

  get beatGrid(): number[] {
    return this._beatGrid;
  }

  dispose(): void {
    this.player.dispose();
    this.volume.dispose();
    this.eq.high.dispose();
    this.eq.mid.dispose();
    this.eq.low.dispose();
    this.filter.dispose();
    this.effects.dispose();
    this.colorFX.dispose();
    this.timeStretcher.dispose();
    this.vinyl.dispose();
    this.spectrum.dispose();
    this.slip.dispose();
    this.bus.dispose(); // Dispose professional bus
  }
}
