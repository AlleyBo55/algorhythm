import * as Tone from 'tone';

export class DeckBus {
  private input: Tone.Gain;
  private preEQ: Tone.EQ3;
  private effectsChain: Tone.Gain;
  private postEQ: Tone.EQ3;
  private fader: Tone.Gain;
  private output: Tone.Gain;
  
  constructor() {
    this.input = new Tone.Gain(1);
    this.preEQ = new Tone.EQ3();
    this.effectsChain = new Tone.Gain(1);
    this.postEQ = new Tone.EQ3();
    this.fader = new Tone.Gain(0.85);
    this.output = new Tone.Gain(1);
    
    this.setupSignalChain();
  }
  
  private setupSignalChain(): void {
    this.input
      .connect(this.preEQ)
      .connect(this.effectsChain)
      .connect(this.postEQ)
      .connect(this.fader)
      .connect(this.output);
  }
  
  enableDirectMonitoring(): void {
    this.input.connect(this.output);
  }
  
  disableDirectMonitoring(): void {
    this.input.disconnect(this.output);
  }
  
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  get preEQNode(): Tone.EQ3 {
    return this.preEQ;
  }
  
  get postEQNode(): Tone.EQ3 {
    return this.postEQ;
  }
  
  get faderNode(): Tone.Gain {
    return this.fader;
  }
  
  get effectsNode(): Tone.Gain {
    return this.effectsChain;
  }
  
  setVolume(value: number): void {
    this.fader.gain.rampTo(value, 0.05);
  }
  
  setPreEQ(low: number, mid: number, high: number): void {
    this.preEQ.low.rampTo(low, 0.05);
    this.preEQ.mid.rampTo(mid, 0.05);
    this.preEQ.high.rampTo(high, 0.05);
  }
  
  setPostEQ(low: number, mid: number, high: number): void {
    this.postEQ.low.rampTo(low, 0.05);
    this.postEQ.mid.rampTo(mid, 0.05);
    this.postEQ.high.rampTo(high, 0.05);
  }
  
  dispose(): void {
    this.input.dispose();
    this.preEQ.dispose();
    this.effectsChain.dispose();
    this.postEQ.dispose();
    this.fader.dispose();
    this.output.dispose();
  }
}
