// Tempo-synced stereo delay
// Professional delay with feedback and filtering

export class StereoDelay {
  private context: AudioContext;
  public input!: GainNode;
  public output!: GainNode;
  private delayL!: DelayNode;
  private delayR!: DelayNode;
  private feedbackL!: GainNode;
  private feedbackR!: GainNode;
  private filter!: BiquadFilterNode;
  private wet!: GainNode;
  private dry!: GainNode;
  private crossfeed: boolean = false;
  
  constructor(context: AudioContext) {
    this.context = context;
    this.setupNodes();
  }
  
  private setupNodes(): void {
    this.input = this.context.createGain();
    this.output = this.context.createGain();
    this.delayL = this.context.createDelay(2);
    this.delayR = this.context.createDelay(2);
    this.feedbackL = this.context.createGain();
    this.feedbackR = this.context.createGain();
    this.filter = this.context.createBiquadFilter();
    this.wet = this.context.createGain();
    this.dry = this.context.createGain();
    
    // Setup filter (darkens repeats)
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 4000;
    this.filter.Q.value = 0.7;
    
    // Routing
    this.input.connect(this.dry);
    this.input.connect(this.delayL);
    this.input.connect(this.delayR);
    
    // Left channel
    this.delayL.connect(this.filter);
    this.filter.connect(this.feedbackL);
    this.feedbackL.connect(this.delayL);
    this.feedbackL.connect(this.wet);
    
    // Right channel
    this.delayR.connect(this.feedbackR);
    this.feedbackR.connect(this.delayR);
    this.feedbackR.connect(this.wet);
    
    this.dry.connect(this.output);
    this.wet.connect(this.output);
    
    // Defaults
    this.delayL.delayTime.value = 0.375; // Dotted 8th at 120 BPM
    this.delayR.delayTime.value = 0.375 * 1.05; // Slight offset
    this.feedbackL.gain.value = 0.4;
    this.feedbackR.gain.value = 0.4;
    this.setWet(0.3);
  }
  
  syncToTempo(bpm: number, division: '1n' | '2n' | '4n' | '8n' | '16n' | '8nd' | '16nd'): void {
    const beatLength = 60 / bpm;
    const divisions: Record<string, number> = {
      '1n': 4,
      '2n': 2,
      '4n': 1,
      '8n': 0.5,
      '16n': 0.25,
      '8nd': 0.75,  // Dotted 8th
      '16nd': 0.375 // Dotted 16th
    };
    
    const delayTime = beatLength * divisions[division];
    
    // Smooth ramp to new time
    const now = this.context.currentTime;
    this.delayL.delayTime.cancelScheduledValues(now);
    this.delayR.delayTime.cancelScheduledValues(now);
    this.delayL.delayTime.setTargetAtTime(delayTime, now, 0.1);
    this.delayR.delayTime.setTargetAtTime(delayTime * 1.05, now, 0.1);
  }
  
  setFeedback(amount: number): void {
    amount = Math.max(0, Math.min(0.95, amount));
    this.feedbackL.gain.value = amount;
    this.feedbackR.gain.value = amount;
  }
  
  setWet(amount: number): void {
    amount = Math.max(0, Math.min(1, amount));
    this.wet.gain.value = amount;
    this.dry.gain.value = 1 - amount;
  }
  
  setFilterFrequency(hz: number): void {
    this.filter.frequency.value = Math.max(200, Math.min(20000, hz));
  }
  
  // Enable ping-pong delay
  setPingPong(enabled: boolean): void {
    if (enabled && !this.crossfeed) {
      // Add crossfeed for ping-pong effect
      this.feedbackL.connect(this.delayR);
      this.feedbackR.connect(this.delayL);
      this.crossfeed = true;
    } else if (!enabled && this.crossfeed) {
      // Remove crossfeed
      this.feedbackL.disconnect(this.delayR);
      this.feedbackR.disconnect(this.delayL);
      this.crossfeed = false;
    }
  }
}
