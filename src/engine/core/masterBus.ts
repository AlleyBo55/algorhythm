import * as Tone from 'tone';

export class MasterBus {
  private input: Tone.Gain;
  private eq: Tone.EQ3;
  private compressor: Tone.Compressor;
  private limiter: Tone.Limiter;
  private analyzer: Tone.Analyser;
  private output: Tone.Gain;
  
  private readonly LIMITER_THRESHOLD = -0.3;
  
  constructor() {
    this.input = new Tone.Gain(1);
    this.eq = new Tone.EQ3();
    this.compressor = new Tone.Compressor({
      threshold: -12,
      ratio: 3,
      attack: 0.01,
      release: 0.3
    });
    this.limiter = new Tone.Limiter(this.LIMITER_THRESHOLD);
    this.analyzer = new Tone.Analyser('fft', 2048);
    this.output = new Tone.Gain(1).toDestination();
    
    this.setupSignalChain();
  }
  
  private setupSignalChain(): void {
    this.input
      .connect(this.eq)
      .connect(this.compressor)
      .connect(this.limiter)
      .connect(this.analyzer)
      .connect(this.output);
  }
  
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  get analyzerNode(): Tone.Analyser {
    return this.analyzer;
  }
  
  setMasterVolume(value: number): void {
    this.output.gain.rampTo(value, 0.1);
  }
  
  setMasterEQ(low: number, mid: number, high: number): void {
    this.eq.low.rampTo(low, 0.05);
    this.eq.mid.rampTo(mid, 0.05);
    this.eq.high.rampTo(high, 0.05);
  }
  
  setCompression(threshold: number, ratio: number): void {
    this.compressor.threshold.value = threshold;
    this.compressor.ratio.value = ratio;
  }
  
  getFrequencyData(): Uint8Array {
    const value = this.analyzer.getValue();
    return value instanceof Uint8Array ? value : new Uint8Array(0);
  }
  
  getWaveform(): Float32Array {
    const analyser = new Tone.Analyser('waveform', 1024);
    this.limiter.connect(analyser);
    const waveform = analyser.getValue() as Float32Array;
    analyser.dispose();
    return waveform;
  }
  
  dispose(): void {
    this.input.dispose();
    this.eq.dispose();
    this.compressor.dispose();
    this.limiter.dispose();
    this.analyzer.dispose();
    this.output.dispose();
  }
}

export const masterBus = new MasterBus();
