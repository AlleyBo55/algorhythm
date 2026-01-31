import * as Tone from 'tone';

export type CrossfaderCurve = 'linear' | 'power' | 'constant';

export class Mixer {
  private static instance: Mixer | null = null;

  public master!: Tone.Volume;
  public limiter!: Tone.Limiter;
  public crossfade!: Tone.CrossFade;

  public reverbSend!: Tone.Reverb;
  public delaySend!: Tone.FeedbackDelay;

  private _crossfaderPosition: number = 0.5;
  private _crossfaderCurve: CrossfaderCurve = 'constant';
  private initialized: boolean = false;

  private constructor() { }

  public init(): void {
    if (this.initialized) return;

    this.master = new Tone.Volume(0);
    this.limiter = new Tone.Limiter(-1);
    this.crossfade = new Tone.CrossFade(0.5);
    this.reverbSend = new Tone.Reverb({ decay: 2.5, wet: 1 });
    this.delaySend = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.5, wet: 1 });

    this.crossfade.chain(this.master, this.limiter, Tone.getDestination());
    this.reverbSend.generate();

    this.initialized = true;
  }

  public static getInstance(): Mixer {
    if (!Mixer.instance) {
      Mixer.instance = new Mixer();
    }
    return Mixer.instance;
  }

  setCrossfaderPosition(position: number): void {
    this._crossfaderPosition = Math.max(0, Math.min(1, position));
    const curved = this.applyCurve(this._crossfaderPosition);
    this.crossfade.fade.value = curved;
  }

  setCrossfaderCurve(curve: CrossfaderCurve): void {
    this._crossfaderCurve = curve;
    this.setCrossfaderPosition(this._crossfaderPosition);
  }

  private applyCurve(position: number): number {
    switch (this._crossfaderCurve) {
      case 'linear':
        return position;

      case 'power':
        return position < 0.5
          ? Math.pow(position * 2, 3) / 2
          : 0.5 + Math.pow((position - 0.5) * 2, 3) / 2;

      case 'constant':
        return Math.sin(position * Math.PI / 2);

      default:
        return position;
    }
  }

  setMasterVolume(db: number): void {
    this.master.volume.value = db;
  }

  enableLimiter(): void {
    this.limiter.threshold.value = -1;
  }

  disableLimiter(): void {
    this.limiter.threshold.value = 0;
  }

  sendToReverb(amount: number, source: Tone.ToneAudioNode): void {
    const send = new Tone.Gain(amount);
    source.connect(send);
    send.connect(this.reverbSend);
    this.reverbSend.connect(this.master);
  }

  sendToDelay(amount: number, source: Tone.ToneAudioNode): void {
    const send = new Tone.Gain(amount);
    source.connect(send);
    send.connect(this.delaySend);
    this.delaySend.connect(this.master);
  }

  get crossfaderPosition(): number {
    return this._crossfaderPosition;
  }

  get crossfaderCurve(): CrossfaderCurve {
    return this._crossfaderCurve;
  }

  dispose(): void {
    this.master.dispose();
    this.limiter.dispose();
    this.crossfade.dispose();
    this.reverbSend.dispose();
    this.delaySend.dispose();
  }
}

export const mixer = Mixer.getInstance();
