// Yamaha-grade 4-band parametric EQ
// Professional studio quality with smooth parameter changes

export class ParametricEQ {
  private context: AudioContext;
  private bands: EQBand[];
  public input: GainNode;
  public output: GainNode;
  
  constructor(context: AudioContext) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    
    // 4-band parametric EQ (Yamaha standard)
    this.bands = [
      new EQBand(context, 'lowshelf', 80, 1.0),    // Low shelf
      new EQBand(context, 'peaking', 500, 1.4),    // Low-mid
      new EQBand(context, 'peaking', 2000, 1.4),   // High-mid
      new EQBand(context, 'highshelf', 8000, 1.0)  // High shelf
    ];
    
    this.connectChain();
  }
  
  private connectChain(): void {
    this.input.connect(this.bands[0].filter);
    
    for (let i = 0; i < this.bands.length - 1; i++) {
      this.bands[i].filter.connect(this.bands[i + 1].filter);
    }
    
    this.bands[this.bands.length - 1].filter.connect(this.output);
  }
  
  // Smooth parameter changes (no zipper noise)
  setGain(band: number, db: number, rampTime: number = 0.05): void {
    if (band >= 0 && band < this.bands.length) {
      this.bands[band].setGain(db, rampTime);
    }
  }
  
  setFrequency(band: number, hz: number, rampTime: number = 0.05): void {
    if (band >= 0 && band < this.bands.length) {
      this.bands[band].setFrequency(hz, rampTime);
    }
  }
  
  setQ(band: number, q: number, rampTime: number = 0.05): void {
    if (band >= 0 && band < this.bands.length) {
      this.bands[band].setQ(q, rampTime);
    }
  }
  
  // Preset EQ curves
  setPreset(preset: 'flat' | 'vocal' | 'bass' | 'treble' | 'presence'): void {
    const presets = {
      flat: [0, 0, 0, 0],
      vocal: [-2, 2, 4, 1],
      bass: [6, 2, -2, -1],
      treble: [-1, -2, 2, 6],
      presence: [-1, 1, 6, 2]
    };
    
    const gains = presets[preset];
    gains.forEach((gain, i) => this.setGain(i, gain, 0.1));
  }
  
  // Reset to flat
  reset(): void {
    this.setPreset('flat');
  }
}

class EQBand {
  public filter: BiquadFilterNode;
  
  constructor(
    context: AudioContext,
    type: BiquadFilterType,
    frequency: number,
    q: number
  ) {
    this.filter = context.createBiquadFilter();
    this.filter.type = type;
    this.filter.frequency.value = frequency;
    this.filter.Q.value = q;
    this.filter.gain.value = 0;
  }
  
  setGain(db: number, rampTime: number): void {
    const now = this.filter.context.currentTime;
    this.filter.gain.cancelScheduledValues(now);
    this.filter.gain.setTargetAtTime(db, now, rampTime);
  }
  
  setFrequency(hz: number, rampTime: number): void {
    const now = this.filter.context.currentTime;
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setTargetAtTime(hz, now, rampTime);
  }
  
  setQ(q: number, rampTime: number): void {
    const now = this.filter.context.currentTime;
    this.filter.Q.cancelScheduledValues(now);
    this.filter.Q.setTargetAtTime(q, now, rampTime);
  }
}
