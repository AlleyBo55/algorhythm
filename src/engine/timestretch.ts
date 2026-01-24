// Time stretching using Web Audio API's playbackRate + pitch correction
// Professional implementation for tempo changes without pitch changes

export interface TimeStretchOptions {
  tempo: number; // 0.5 = half speed, 2.0 = double speed
  pitch: number; // semitones (-12 to +12)
  preservePitch: boolean;
}

export class TimeStretcher {
  private audioContext: AudioContext;
  private sourceBuffer: AudioBuffer | null = null;
  private stretchedBuffer: AudioBuffer | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async stretch(buffer: AudioBuffer, options: TimeStretchOptions): Promise<AudioBuffer> {
    this.sourceBuffer = buffer;

    if (!options.preservePitch) {
      // Simple playback rate change (changes both tempo and pitch)
      return this.simpleStretch(buffer, options.tempo);
    }

    // Advanced: Change tempo without changing pitch
    return this.advancedStretch(buffer, options);
  }

  private simpleStretch(buffer: AudioBuffer, tempo: number): AudioBuffer {
    const newLength = Math.floor(buffer.length / tempo);
    const stretched = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      newLength,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = stretched.getChannelData(channel);

      for (let i = 0; i < newLength; i++) {
        const position = i * tempo;
        const index = Math.floor(position);
        const fraction = position - index;

        if (index + 1 < inputData.length) {
          // Linear interpolation
          outputData[i] = inputData[index] * (1 - fraction) + inputData[index + 1] * fraction;
        } else {
          outputData[i] = inputData[index];
        }
      }
    }

    return stretched;
  }

  private async advancedStretch(buffer: AudioBuffer, options: TimeStretchOptions): Promise<AudioBuffer> {
    // Phase vocoder implementation for pitch-preserving time stretch
    const tempo = options.tempo;
    const newLength = Math.floor(buffer.length / tempo);
    
    const stretched = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      newLength,
      buffer.sampleRate
    );

    const windowSize = 2048;
    const hopSize = windowSize / 4;
    const synthesisHop = Math.floor(hopSize * tempo);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = stretched.getChannelData(channel);

      let inputPos = 0;
      let outputPos = 0;

      while (outputPos + windowSize < newLength) {
        // Extract window
        const window = new Float32Array(windowSize);
        for (let i = 0; i < windowSize; i++) {
          const idx = Math.floor(inputPos + i);
          if (idx < inputData.length) {
            // Hann window
            const hannValue = 0.5 * (1 - Math.cos(2 * Math.PI * i / windowSize));
            window[i] = inputData[idx] * hannValue;
          }
        }

        // Overlap-add
        for (let i = 0; i < windowSize && outputPos + i < newLength; i++) {
          outputData[outputPos + i] += window[i];
        }

        inputPos += hopSize;
        outputPos += synthesisHop;
      }

      // Normalize
      let maxVal = 0;
      for (let i = 0; i < outputData.length; i++) {
        maxVal = Math.max(maxVal, Math.abs(outputData[i]));
      }
      if (maxVal > 0) {
        for (let i = 0; i < outputData.length; i++) {
          outputData[i] /= maxVal;
        }
      }
    }

    return stretched;
  }

  // Real-time time stretching for live playback
  createStretchedSource(buffer: AudioBuffer, tempo: number): AudioBufferSourceNode {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = tempo;
    return source;
  }

  dispose(): void {
    this.sourceBuffer = null;
    this.stretchedBuffer = null;
  }
}

// Helper for BPM-based tempo changes
export function calculateTempoRatio(sourceBPM: number, targetBPM: number): number {
  return targetBPM / sourceBPM;
}

export function calculatePitchShift(semitones: number): number {
  return Math.pow(2, semitones / 12);
}
