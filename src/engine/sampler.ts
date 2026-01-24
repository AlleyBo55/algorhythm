import * as Tone from 'tone';

export interface Sample {
  id: string;
  buffer: Tone.ToneAudioBuffer;
  name: string;
  color?: string;
}

export class SamplePad {
  public id: number;
  private player: Tone.Player;
  private volume: Tone.Volume;
  private _sample: Sample | null = null;
  private _mode: 'oneshot' | 'loop' | 'gate' = 'oneshot';

  constructor(id: number, destination: Tone.ToneAudioNode) {
    this.id = id;
    this.player = new Tone.Player();
    this.volume = new Tone.Volume(0);
    this.player.connect(this.volume);
    this.volume.connect(destination);
  }

  load(sample: Sample): void {
    this._sample = sample;
    this.player.buffer = sample.buffer;
    this.player.loop = this._mode === 'loop';
  }

  trigger(velocity: number = 1): void {
    if (!this._sample) return;

    this.volume.volume.value = Tone.gainToDb(velocity);

    if (this._mode === 'oneshot') {
      this.player.start();
    } else if (this._mode === 'loop') {
      if (this.player.state === 'started') {
        this.player.stop();
      } else {
        this.player.start();
      }
    } else if (this._mode === 'gate') {
      this.player.start();
    }
  }

  stop(): void {
    this.player.stop();
  }

  get mode(): 'oneshot' | 'loop' | 'gate' {
    return this._mode;
  }

  set mode(value: 'oneshot' | 'loop' | 'gate') {
    this._mode = value;
    this.player.loop = value === 'loop';
  }

  get sample(): Sample | null {
    return this._sample;
  }

  dispose(): void {
    this.player.dispose();
    this.volume.dispose();
  }
}

export class SampleDeck {
  private pads: Map<number, SamplePad> = new Map();
  private output: Tone.Gain;
  private samples: Map<string, Sample> = new Map();

  constructor(padCount: number = 16) {
    this.output = new Tone.Gain(1);
    
    for (let i = 0; i < padCount; i++) {
      this.pads.set(i, new SamplePad(i, this.output));
    }
  }

  async loadSample(id: string, file: File | string, name?: string): Promise<void> {
    const buffer = typeof file === 'string'
      ? await Tone.Buffer.fromUrl(file)
      : await this.fileToBuffer(file);

    this.samples.set(id, {
      id,
      buffer,
      name: name || id
    });
  }

  private async fileToBuffer(file: File): Promise<Tone.ToneAudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
    return new Tone.ToneAudioBuffer(audioBuffer);
  }

  assignSample(padId: number, sampleId: string): void {
    const pad = this.pads.get(padId);
    const sample = this.samples.get(sampleId);
    if (pad && sample) {
      pad.load(sample);
    }
  }

  trigger(padId: number, velocity: number = 1): void {
    this.pads.get(padId)?.trigger(velocity);
  }

  stop(padId: number): void {
    this.pads.get(padId)?.stop();
  }

  stopAll(): void {
    this.pads.forEach(pad => pad.stop());
  }

  getPad(id: number): SamplePad | undefined {
    return this.pads.get(id);
  }

  connect(destination: Tone.ToneAudioNode): void {
    this.output.connect(destination);
  }

  dispose(): void {
    this.pads.forEach(pad => pad.dispose());
    this.output.dispose();
  }
}
