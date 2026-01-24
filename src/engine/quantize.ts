import * as Tone from 'tone';

export type QuantizeValue = '1n' | '2n' | '4n' | '8n' | '16n' | 'off';

export class Quantize {
  private _enabled: boolean = false;
  private _value: QuantizeValue = '16n';
  private bpm: number = 128;

  enable(): void {
    this._enabled = true;
    console.log(`⚡ Quantize: ON (${this._value})`);
  }

  disable(): void {
    this._enabled = false;
    console.log('⚡ Quantize: OFF');
  }

  set value(v: QuantizeValue) {
    this._value = v;
    if (this._enabled) {
      console.log(`⚡ Quantize: ${v}`);
    }
  }

  get value(): QuantizeValue {
    return this._value;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  // Snap time to nearest beat
  snap(time: number): number {
    if (!this._enabled || this._value === 'off') return time;

    const beatLength = 60 / this.bpm;
    const quantizeLength = this.getQuantizeLength(beatLength);
    
    return Math.round(time / quantizeLength) * quantizeLength;
  }

  // Schedule action on next beat
  scheduleOnBeat(callback: () => void): void {
    if (!this._enabled || this._value === 'off') {
      callback();
      return;
    }

    const now = Tone.now();
    const nextBeat = this.getNextBeat(now);
    
    Tone.getTransport().schedule(() => {
      callback();
    }, nextBeat);
  }

  private getNextBeat(time: number): number {
    const beatLength = 60 / this.bpm;
    const quantizeLength = this.getQuantizeLength(beatLength);
    
    return Math.ceil(time / quantizeLength) * quantizeLength;
  }

  private getQuantizeLength(beatLength: number): number {
    switch (this._value) {
      case '1n': return beatLength * 4;
      case '2n': return beatLength * 2;
      case '4n': return beatLength;
      case '8n': return beatLength / 2;
      case '16n': return beatLength / 4;
      default: return 0;
    }
  }

  setBPM(bpm: number): void {
    this.bpm = bpm;
  }
}
