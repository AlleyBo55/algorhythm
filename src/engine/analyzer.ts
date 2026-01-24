import * as Tone from 'tone';

export interface AnalysisResult {
  bpm: number;
  beats: number[];
  key: string;
  timeSignature: string;
  energy: number;
}

export class AudioAnalyzer {
  private static instance: AudioAnalyzer;

  private constructor() {}

  public static getInstance(): AudioAnalyzer {
    if (!AudioAnalyzer.instance) {
      AudioAnalyzer.instance = new AudioAnalyzer();
    }
    return AudioAnalyzer.instance;
  }

  async analyze(audioBuffer: AudioBuffer): Promise<AnalysisResult> {
    const [bpm, beats] = await this.detectBPMAndBeats(audioBuffer);
    const key = await this.detectKey(audioBuffer);
    const energy = this.calculateEnergy(audioBuffer);

    return {
      bpm,
      beats,
      key,
      timeSignature: '4/4', // Default, can be enhanced
      energy
    };
  }

  private async detectBPMAndBeats(audioBuffer: AudioBuffer): Promise<[number, number[]]> {
    // Simplified BPM detection using peak detection
    // In production, use web-audio-beat-detector or essentia.js
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Detect peaks (simplified)
    const peaks = this.findPeaks(channelData, sampleRate);
    const bpm = this.calculateBPM(peaks, sampleRate);
    const beats = this.generateBeatGrid(bpm, audioBuffer.duration);

    return [bpm, beats];
  }

  private findPeaks(data: Float32Array, sampleRate: number): number[] {
    const peaks: number[] = [];
    const threshold = 0.5;
    const minDistance = Math.floor(sampleRate * 0.1); // 100ms minimum between peaks

    for (let i = minDistance; i < data.length - minDistance; i++) {
      const sample = Math.abs(data[i]);
      if (sample > threshold) {
        let isPeak = true;
        for (let j = i - minDistance; j < i + minDistance; j++) {
          if (Math.abs(data[j]) > sample) {
            isPeak = false;
            break;
          }
        }
        if (isPeak) {
          peaks.push(i);
          i += minDistance; // Skip ahead
        }
      }
    }

    return peaks;
  }

  private calculateBPM(peaks: number[], sampleRate: number): number {
    if (peaks.length < 2) return 120; // Default

    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push((peaks[i] - peaks[i - 1]) / sampleRate);
    }

    // Find median interval
    intervals.sort((a, b) => a - b);
    const medianInterval = intervals[Math.floor(intervals.length / 2)];

    // Convert to BPM
    const bpm = 60 / medianInterval;

    // Normalize to common BPM range (60-180)
    if (bpm < 60) return bpm * 2;
    if (bpm > 180) return bpm / 2;

    return Math.round(bpm);
  }

  private generateBeatGrid(bpm: number, duration: number): number[] {
    const beatInterval = 60 / bpm;
    const beats: number[] = [];

    for (let time = 0; time < duration; time += beatInterval) {
      beats.push(time);
    }

    return beats;
  }

  private async detectKey(audioBuffer: AudioBuffer): Promise<string> {
    // Simplified key detection
    // In production, use essentia.js for accurate key detection
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const modes = ['', 'm']; // Major or minor

    // Placeholder: return random key for now
    // TODO: Implement proper key detection with essentia.js
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];

    return randomKey + randomMode;
  }

  private calculateEnergy(audioBuffer: AudioBuffer): number {
    const channelData = audioBuffer.getChannelData(0);
    let sum = 0;

    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }

    return Math.sqrt(sum / channelData.length);
  }

  // Harmonic mixing helper
  isHarmonicMatch(key1: string, key2: string): boolean {
    // Camelot wheel compatibility
    const camelotWheel: Record<string, string[]> = {
      'C': ['C', 'G', 'F', 'Am', 'Em', 'Dm'],
      'C#': ['C#', 'G#', 'F#', 'A#m', 'Fm', 'D#m'],
      'D': ['D', 'A', 'G', 'Bm', 'F#m', 'Em'],
      'D#': ['D#', 'A#', 'G#', 'Cm', 'Gm', 'Fm'],
      'E': ['E', 'B', 'A', 'C#m', 'G#m', 'F#m'],
      'F': ['F', 'C', 'A#', 'Dm', 'Am', 'Gm'],
      'F#': ['F#', 'C#', 'B', 'D#m', 'A#m', 'G#m'],
      'G': ['G', 'D', 'C', 'Em', 'Bm', 'Am'],
      'G#': ['G#', 'D#', 'C#', 'Fm', 'Cm', 'A#m'],
      'A': ['A', 'E', 'D', 'F#m', 'C#m', 'Bm'],
      'A#': ['A#', 'F', 'D#', 'Gm', 'Dm', 'Cm'],
      'B': ['B', 'F#', 'E', 'G#m', 'D#m', 'C#m']
    };

    const compatible = camelotWheel[key1] || [];
    return compatible.includes(key2);
  }
}

export const audioAnalyzer = AudioAnalyzer.getInstance();
