export interface SpectrumData {
  frequencies: Float32Array;
  waveform: Float32Array;
  peak: number;
  rms: number;
}

export class SpectrumAnalyzer {
  private analyser: AnalyserNode;
  private frequencyData: Float32Array;
  private waveformData: Float32Array;
  private _fftSize: number = 2048;
  private _smoothing: number = 0.8;

  constructor(audioContext: AudioContext) {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = this._fftSize;
    this.analyser.smoothingTimeConstant = this._smoothing;

    this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.waveformData = new Float32Array(this.analyser.fftSize);
  }

  get node(): AnalyserNode {
    return this.analyser;
  }

  getData(): SpectrumData {
    this.analyser.getFloatFrequencyData(this.frequencyData as any);
    this.analyser.getFloatTimeDomainData(this.waveformData as any);

    // Calculate peak and RMS
    let peak = 0;
    let sumSquares = 0;

    for (let i = 0; i < this.waveformData.length; i++) {
      const abs = Math.abs(this.waveformData[i]);
      peak = Math.max(peak, abs);
      sumSquares += this.waveformData[i] * this.waveformData[i];
    }

    const rms = Math.sqrt(sumSquares / this.waveformData.length);

    return {
      frequencies: this.frequencyData,
      waveform: this.waveformData,
      peak,
      rms
    };
  }

  // Get frequency bands (bass, mid, high)
  getBands(): { bass: number; mid: number; high: number } {
    this.analyser.getFloatFrequencyData(this.frequencyData as any);

    const nyquist = this.analyser.context.sampleRate / 2;
    const binCount = this.frequencyData.length;

    // Frequency ranges
    const bassEnd = Math.floor((250 / nyquist) * binCount);
    const midEnd = Math.floor((4000 / nyquist) * binCount);

    let bass = 0, mid = 0, high = 0;
    let bassCount = 0, midCount = 0, highCount = 0;

    for (let i = 0; i < binCount; i++) {
      const db = this.frequencyData[i];

      if (i < bassEnd) {
        bass += db;
        bassCount++;
      } else if (i < midEnd) {
        mid += db;
        midCount++;
      } else {
        high += db;
        highCount++;
      }
    }

    return {
      bass: this.dbToLinear(bass / bassCount),
      mid: this.dbToLinear(mid / midCount),
      high: this.dbToLinear(high / highCount)
    };
  }

  // Get specific frequency magnitude
  getFrequency(freq: number): number {
    this.analyser.getFloatFrequencyData(this.frequencyData as any);

    const nyquist = this.analyser.context.sampleRate / 2;
    const index = Math.floor((freq / nyquist) * this.frequencyData.length);

    return this.dbToLinear(this.frequencyData[index]);
  }

  private dbToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }

  get fftSize(): number {
    return this._fftSize;
  }

  set fftSize(size: number) {
    const validSizes = [256, 512, 1024, 2048, 4096, 8192, 16384];
    if (!validSizes.includes(size)) {
      console.warn(`Invalid FFT size: ${size}. Using 2048.`);
      size = 2048;
    }

    this._fftSize = size;
    this.analyser.fftSize = size;
    this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.waveformData = new Float32Array(this.analyser.fftSize);
  }

  get smoothing(): number {
    return this._smoothing;
  }

  set smoothing(value: number) {
    this._smoothing = Math.max(0, Math.min(1, value));
    this.analyser.smoothingTimeConstant = this._smoothing;
  }

  dispose(): void {
    this.analyser.disconnect();
  }
}

// Visualizer helper for Canvas rendering
export class SpectrumVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyzer: SpectrumAnalyzer;
  private animationFrame: number | null = null;
  private _barCount: number = 64;
  private _barColor: string = '#00ff00';
  private _backgroundColor: string = '#000000';

  constructor(canvas: HTMLCanvasElement, analyzer: SpectrumAnalyzer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.analyzer = analyzer;
  }

  start(): void {
    if (this.animationFrame) return;

    const draw = () => {
      const data = this.analyzer.getData();
      this.drawSpectrum(data);
      this.animationFrame = requestAnimationFrame(draw);
    };

    draw();
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private drawSpectrum(data: SpectrumData): void {
    const { width, height } = this.canvas;
    const barWidth = width / this._barCount;

    // Clear
    this.ctx.fillStyle = this._backgroundColor;
    this.ctx.fillRect(0, 0, width, height);

    // Draw bars
    this.ctx.fillStyle = this._barColor;

    for (let i = 0; i < this._barCount; i++) {
      const index = Math.floor((i / this._barCount) * data.frequencies.length);
      const db = data.frequencies[index];
      const normalized = (db + 100) / 100; // -100dB to 0dB -> 0 to 1
      const barHeight = normalized * height;

      this.ctx.fillRect(
        i * barWidth,
        height - barHeight,
        barWidth - 1,
        barHeight
      );
    }
  }

  set barCount(count: number) {
    this._barCount = Math.max(8, Math.min(256, count));
  }

  set barColor(color: string) {
    this._barColor = color;
  }

  set backgroundColor(color: string) {
    this._backgroundColor = color;
  }
}
