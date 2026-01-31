// Team 2: Yamaha DSP - Studio Reverb
// Yamaha REV-X inspired algorithm

import * as Tone from 'tone';

interface RoomParams {
  size: number;
  decay: number;
  damping: number;
}

export class StudioReverb {
  private input: Tone.Gain;
  private preDelay: Tone.Delay;
  private reverb: Tone.Reverb;
  private damping: Tone.Filter;
  private mix: Tone.Gain;
  private dry: Tone.Gain;
  private wet: Tone.Gain;
  private output: Tone.Gain;
  
  // Room types (Yamaha REV-X inspired)
  private readonly ROOMS: Record<string, RoomParams> = {
    hall: { size: 2.5, decay: 3.5, damping: 5000 },
    plate: { size: 1.8, decay: 2.0, damping: 8000 },
    room: { size: 1.2, decay: 1.2, damping: 6000 },
    chamber: { size: 1.5, decay: 1.8, damping: 7000 }
  };
  
  constructor() {
    this.input = new Tone.Gain(1);
    this.preDelay = new Tone.Delay(0.02); // 20ms pre-delay
    this.reverb = new Tone.Reverb({
      decay: 2.0,
      preDelay: 0
    });
    this.damping = new Tone.Filter({
      type: 'lowpass',
      frequency: 6000,
      Q: 0.7
    });
    this.dry = new Tone.Gain(0.7);
    this.wet = new Tone.Gain(0.3);
    this.mix = new Tone.Gain(1);
    this.output = new Tone.Gain(1);
    
    // Setup signal chain
    this.setupSignalChain();
  }
  
  private setupSignalChain(): void {
    // Dry path
    this.input.connect(this.dry);
    this.dry.connect(this.output);
    
    // Wet path
    this.input
      .connect(this.preDelay)
      .connect(this.reverb)
      .connect(this.damping)
      .connect(this.wet);
    this.wet.connect(this.output);
  }
  
  async setRoom(type: keyof typeof this.ROOMS): Promise<void> {
    const room = this.ROOMS[type];
    if (!room) return;
    
    // Update reverb parameters
    this.reverb.decay = room.decay;
    this.damping.frequency.value = room.damping;
    
    // Generate new impulse response
    await this.reverb.generate();
  }
  
  setDecay(seconds: number): void {
    this.reverb.decay = seconds;
  }
  
  setPreDelay(seconds: number): void {
    this.preDelay.delayTime.rampTo(seconds, 0.1);
  }
  
  setDamping(frequency: number): void {
    this.damping.frequency.rampTo(frequency, 0.1);
  }
  
  setMix(wetAmount: number): void {
    // wetAmount: 0-1
    this.wet.gain.rampTo(wetAmount, 0.1);
    this.dry.gain.rampTo(1 - wetAmount, 0.1);
  }
  
  // Getters
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  // Cleanup
  dispose(): void {
    this.input.dispose();
    this.preDelay.dispose();
    this.reverb.dispose();
    this.damping.dispose();
    this.dry.dispose();
    this.wet.dispose();
    this.mix.dispose();
    this.output.dispose();
  }
}
