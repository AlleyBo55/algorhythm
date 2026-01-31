// Yamaha REV-X style studio reverb
// Professional algorithmic reverb with multiple room types

export class StudioReverb {
  private context: AudioContext;
  public input!: GainNode;
  public output!: GainNode;
  private convolver!: ConvolverNode;
  private wet!: GainNode;
  private dry!: GainNode;
  private preDelay!: DelayNode;
  private damping!: BiquadFilterNode;
  
  constructor(context: AudioContext) {
    this.context = context;
    this.setupNodes();
    this.generateImpulseResponse('hall');
  }
  
  private setupNodes(): void {
    this.input = this.context.createGain();
    this.output = this.context.createGain();
    this.convolver = this.context.createConvolver();
    this.wet = this.context.createGain();
    this.dry = this.context.createGain();
    this.preDelay = this.context.createDelay(0.1);
    this.damping = this.context.createBiquadFilter();
    
    // Setup damping filter
    this.damping.type = 'lowpass';
    this.damping.frequency.value = 5000;
    
    // Routing: Input → Dry → Output
    //          Input → PreDelay → Convolver → Damping → Wet → Output
    this.input.connect(this.dry);
    this.input.connect(this.preDelay);
    this.preDelay.connect(this.convolver);
    this.convolver.connect(this.damping);
    this.damping.connect(this.wet);
    
    this.dry.connect(this.output);
    this.wet.connect(this.output);
    
    // Default mix (30% wet)
    this.setWet(0.3);
    this.setPreDelay(0.02); // 20ms pre-delay
  }
  
  setWet(amount: number): void {
    amount = Math.max(0, Math.min(1, amount));
    this.wet.gain.value = amount;
    this.dry.gain.value = 1 - amount;
  }
  
  setPreDelay(seconds: number): void {
    this.preDelay.delayTime.value = Math.max(0, Math.min(0.1, seconds));
  }
  
  setDamping(frequency: number): void {
    this.damping.frequency.value = Math.max(1000, Math.min(20000, frequency));
  }
  
  setRoom(type: 'hall' | 'plate' | 'room' | 'chamber' | 'spring'): void {
    this.generateImpulseResponse(type);
  }
  
  private generateImpulseResponse(type: string): void {
    const rooms = {
      hall: { size: 2.5, decay: 3.5, damping: 5000 },
      plate: { size: 1.8, decay: 2.0, damping: 8000 },
      room: { size: 1.2, decay: 1.2, damping: 6000 },
      chamber: { size: 1.5, decay: 1.8, damping: 7000 },
      spring: { size: 0.8, decay: 0.8, damping: 4000 }
    };
    
    const room = rooms[type as keyof typeof rooms] || rooms.hall;
    const sampleRate = this.context.sampleRate;
    const length = sampleRate * room.decay;
    const impulse = this.context.createBuffer(2, length, sampleRate);
    
    // Generate impulse response for each channel
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Exponential decay with random noise
        const decay = Math.exp(-i / (sampleRate * room.size));
        const noise = (Math.random() * 2 - 1) * decay;
        channelData[i] = noise;
      }
    }
    
    this.convolver.buffer = impulse;
    this.setDamping(room.damping);
  }
}
