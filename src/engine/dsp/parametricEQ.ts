// Team 2: Yamaha DSP - Parametric EQ
// Studio-grade 4-band parametric EQ

import * as Tone from 'tone';

export class ParametricEQ {
  private bands: EQBand[];
  private input: Tone.Gain;
  private output: Tone.Gain;
  
  // 4-band parametric EQ
  constructor(context?: Tone.BaseContext) {
    this.input = new Tone.Gain(1);
    this.output = new Tone.Gain(1);
    
    this.bands = [
      new EQBand('lowshelf', 80, 1.0),    // Low shelf
      new EQBand('peaking', 500, 1.4),    // Low-mid
      new EQBand('peaking', 2000, 1.4),   // High-mid
      new EQBand('highshelf', 8000, 1.0)  // High shelf
    ];
    
    // Connect bands in series
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
  
  setFrequency(band: number, freq: number, rampTime: number = 0.05): void {
    if (band >= 0 && band < this.bands.length) {
      this.bands[band].setFrequency(freq, rampTime);
    }
  }
  
  setQ(band: number, q: number, rampTime: number = 0.05): void {
    if (band >= 0 && band < this.bands.length) {
      this.bands[band].setQ(q, rampTime);
    }
  }
  
  // Preset configurations
  applyPreset(preset: 'flat' | 'vocal' | 'bass' | 'bright'): void {
    switch (preset) {
      case 'flat':
        this.bands.forEach((_, i) => this.setGain(i, 0));
        break;
      case 'vocal':
        this.setGain(0, -2);  // Low shelf: -2dB
        this.setGain(1, 3);   // Low-mid: +3dB
        this.setGain(2, 2);   // High-mid: +2dB
        this.setGain(3, 1);   // High shelf: +1dB
        break;
      case 'bass':
        this.setGain(0, 6);   // Low shelf: +6dB
        this.setGain(1, 2);   // Low-mid: +2dB
        this.setGain(2, -1);  // High-mid: -1dB
        this.setGain(3, -2);  // High shelf: -2dB
        break;
      case 'bright':
        this.setGain(0, -1);  // Low shelf: -1dB
        this.setGain(1, 0);   // Low-mid: 0dB
        this.setGain(2, 2);   // High-mid: +2dB
        this.setGain(3, 4);   // High shelf: +4dB
        break;
    }
  }
  
  // Getters
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  getBand(index: number): EQBand | undefined {
    return this.bands[index];
  }
  
  // Cleanup
  dispose(): void {
    this.bands.forEach(band => band.dispose());
    this.input.dispose();
    this.output.dispose();
  }
}

class EQBand {
  public filter: Tone.BiquadFilter;
  
  constructor(
    type: BiquadFilterType,
    frequency: number,
    q: number
  ) {
    this.filter = new Tone.BiquadFilter({
      type,
      frequency,
      Q: q,
      gain: 0
    });
  }
  
  setGain(db: number, rampTime: number = 0.05): void {
    this.filter.gain.rampTo(db, rampTime);
  }
  
  setFrequency(freq: number, rampTime: number = 0.05): void {
    this.filter.frequency.rampTo(freq, rampTime);
  }
  
  setQ(q: number, rampTime: number = 0.05): void {
    this.filter.Q.rampTo(q, rampTime);
  }
  
  get gain(): Tone.Param<"decibels"> {
    return this.filter.gain;
  }
  
  dispose(): void {
    this.filter.dispose();
  }
}
