import * as Tone from 'tone';

export type EffectType = 'reverb' | 'delay' | 'filter' | 'distortion' | 'phaser' | 'chorus' | 'bitcrusher' | 'autofilter';

export interface EffectChain {
  effects: Effect[];
  wet: number;
}

export class Effect {
  public readonly type: EffectType;
  public readonly node: Tone.ToneAudioNode;
  private _wet: Tone.Signal<'normalRange'>;
  private _bypass: boolean = false;

  constructor(type: EffectType) {
    this.type = type;
    this._wet = new Tone.Signal(0);
    this.node = this.createEffect(type);
  }

  private createEffect(type: EffectType): Tone.ToneAudioNode {
    switch (type) {
      case 'reverb':
        return new Tone.Reverb({ decay: 2, wet: 0 });
      case 'delay':
        return new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.5, wet: 0 });
      case 'filter':
        return new Tone.Filter({ frequency: 1000, type: 'lowpass', rolloff: -24 });
      case 'distortion':
        return new Tone.Distortion({ distortion: 0.4, wet: 0 });
      case 'phaser':
        return new Tone.Phaser({ frequency: 0.5, octaves: 3, baseFrequency: 350, wet: 0 });
      case 'chorus':
        return new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0 });
      case 'bitcrusher':
        return new Tone.BitCrusher({ bits: 4 });
      case 'autofilter':
        return new Tone.AutoFilter({ frequency: '4n', type: 'sine', depth: 1, baseFrequency: 200, octaves: 2.6, wet: 0 });
      default:
        return new Tone.Gain(1);
    }
  }

  get wet(): number {
    return this._wet.value;
  }

  set wet(value: number) {
    this._wet.value = Math.max(0, Math.min(1, value));
    if ('wet' in this.node) {
      (this.node as any).wet.value = this._wet.value;
    }
  }

  get bypass(): boolean {
    return this._bypass;
  }

  set bypass(value: boolean) {
    this._bypass = value;
    this.wet = value ? 0 : this._wet.value;
  }

  dispose(): void {
    this.node.dispose();
    this._wet.dispose();
  }
}

export class EffectsRack {
  private effects: Map<string, Effect> = new Map();
  private chain: Tone.ToneAudioNode[] = [];
  public input: Tone.Gain;
  public output: Tone.Gain;

  constructor() {
    this.input = new Tone.Gain(1);
    this.output = new Tone.Gain(1);
    this.input.connect(this.output);
  }

  add(name: string, type: EffectType): Effect {
    const effect = new Effect(type);
    this.effects.set(name, effect);
    this.rebuildChain();
    return effect;
  }

  remove(name: string): void {
    const effect = this.effects.get(name);
    if (effect) {
      effect.dispose();
      this.effects.delete(name);
      this.rebuildChain();
    }
  }

  get(name: string): Effect | undefined {
    return this.effects.get(name);
  }

  private rebuildChain(): void {
    // Disconnect all
    this.input.disconnect();
    this.chain.forEach(node => node.disconnect());

    // Rebuild chain
    this.chain = Array.from(this.effects.values()).map(e => e.node);

    if (this.chain.length === 0) {
      this.input.connect(this.output);
    } else {
      this.input.connect(this.chain[0]);
      for (let i = 0; i < this.chain.length - 1; i++) {
        this.chain[i].connect(this.chain[i + 1]);
      }
      this.chain[this.chain.length - 1].connect(this.output);
    }
  }

  clear(): void {
    this.effects.forEach(effect => effect.dispose());
    this.effects.clear();
    this.rebuildChain();
  }

  dispose(): void {
    this.clear();
    this.input.dispose();
    this.output.dispose();
  }
}

// Color FX - One-knob creative effects
export class ColorFX {
  private filter: Tone.Filter;
  private reverb: Tone.Reverb;
  private delay: Tone.FeedbackDelay;
  private distortion: Tone.Distortion;
  private _value: number = 0;

  constructor() {
    this.filter = new Tone.Filter({ frequency: 20000, type: 'lowpass', rolloff: -24 });
    this.reverb = new Tone.Reverb({ decay: 1.5, wet: 0 });
    this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0 });
    this.distortion = new Tone.Distortion({ distortion: 0, wet: 0 });
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = Math.max(0, Math.min(1, v));

    // Map 0-1 to multiple parameters
    this.filter.frequency.value = 20000 - (this._value * 19500); // 20kHz -> 500Hz
    this.reverb.wet.value = this._value * 0.5;
    this.delay.wet.value = this._value * 0.3;
    this.distortion.distortion = this._value * 0.8;
    this.distortion.wet.value = this._value * 0.4;
  }

  connect(destination: Tone.ToneAudioNode): void {
    this.filter.connect(this.reverb);
    this.reverb.connect(this.delay);
    this.delay.connect(this.distortion);
    this.distortion.connect(destination);
  }

  dispose(): void {
    this.filter.dispose();
    this.reverb.dispose();
    this.delay.dispose();
    this.distortion.dispose();
  }
}
