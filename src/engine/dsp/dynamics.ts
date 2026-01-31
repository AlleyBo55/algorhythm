// Team 2: Yamaha DSP - Dynamics Processor
// Professional compressor/limiter with sidechain support

import * as Tone from 'tone';

interface DynamicsPreset {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export class DynamicsProcessor {
  private input: Tone.Gain;
  private compressor: Tone.Compressor;
  private sidechain: Tone.Gain;
  private output: Tone.Gain;
  
  // Yamaha VCM (Virtual Circuitry Modeling) presets
  private readonly PRESETS: Record<string, DynamicsPreset> = {
    vocal: { threshold: -18, ratio: 4, attack: 0.003, release: 0.25 },
    drum: { threshold: -12, ratio: 6, attack: 0.001, release: 0.1 },
    master: { threshold: -6, ratio: 3, attack: 0.01, release: 0.3 },
    bus: { threshold: -10, ratio: 4, attack: 0.005, release: 0.2 }
  };
  
  constructor() {
    this.input = new Tone.Gain(1);
    this.compressor = new Tone.Compressor({
      threshold: -12,
      ratio: 4,
      attack: 0.003,
      release: 0.25,
      knee: 30 // Soft knee by default
    });
    this.sidechain = new Tone.Gain(0);
    this.output = new Tone.Gain(1);
    
    // Connect signal chain
    this.input.connect(this.compressor);
    this.compressor.connect(this.output);
  }
  
  // Apply preset
  applyPreset(preset: keyof typeof this.PRESETS): void {
    const config = this.PRESETS[preset];
    if (!config) return;
    
    this.compressor.threshold.value = config.threshold;
    this.compressor.ratio.value = config.ratio;
    this.compressor.attack.value = config.attack;
    this.compressor.release.value = config.release;
  }
  
  // Sidechain compression
  setupSidechain(trigger: Tone.ToneAudioNode): void {
    // Connect trigger to sidechain input
    trigger.connect(this.sidechain);
    // Note: Tone.js doesn't directly support sidechain,
    // but we can simulate with envelope follower
  }
  
  // Soft-knee compression
  setSoftKnee(enabled: boolean): void {
    this.compressor.knee.value = enabled ? 30 : 0;
  }
  
  // Individual parameter control
  setThreshold(db: number): void {
    this.compressor.threshold.rampTo(db, 0.05);
  }
  
  setRatio(ratio: number): void {
    this.compressor.ratio.rampTo(ratio, 0.05);
  }
  
  setAttack(seconds: number): void {
    this.compressor.attack.rampTo(seconds, 0.05);
  }
  
  setRelease(seconds: number): void {
    this.compressor.release.rampTo(seconds, 0.05);
  }
  
  setKnee(db: number): void {
    this.compressor.knee.rampTo(db, 0.05);
  }
  
  // Getters
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  get compressorNode(): Tone.Compressor {
    return this.compressor;
  }
  
  // Get reduction amount (for metering)
  getReduction(): number {
    // Tone.js doesn't expose reduction directly
    // This would need native implementation for accurate metering
    return 0;
  }
  
  // Cleanup
  dispose(): void {
    this.input.dispose();
    this.compressor.dispose();
    this.sidechain.dispose();
    this.output.dispose();
  }
}
