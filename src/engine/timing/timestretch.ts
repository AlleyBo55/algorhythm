export interface TimeStretchOptions {
  tempo: number;
  pitch: number;
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
      return this.simpleStretch(buffer, options.tempo);
    }

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
          outputData[i] = inputData[index] * (1 - fraction) + inputData[index + 1] * fraction;
        } else {
          outputData[i] = inputData[index];
        }
      }
    }

    return stretched;
  }

  private async advancedStretch(buffer: AudioBuffer, options: TimeStretchOptions): Promise<AudioBuffer> {
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
        const window = new Float32Array(windowSize);
        for (let i = 0; i < windowSize; i++) {
          const idx = Math.floor(inputPos + i);
          if (idx < inputData.length) {
            const hannValue = 0.5 * (1 - Math.cos(2 * Math.PI * i / windowSize));
            window[i] = inputData[idx] * hannValue;
          }
        }

        for (let i = 0; i < windowSize && outputPos + i < newLength; i++) {
          outputData[outputPos + i] += window[i];
        }

        inputPos += hopSize;
        outputPos += synthesisHop;
      }

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

export function calculateTempoRatio(sourceBPM: number, targetBPM: number): number {
  return targetBPM / sourceBPM;
}

export function calculatePitchShift(semitones: number): number {
  return Math.pow(2, semitones / 12);
}
