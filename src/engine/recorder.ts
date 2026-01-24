import * as Tone from 'tone';

export interface RecordingOptions {
  format: 'wav' | 'mp3';
  bitDepth?: 16 | 24 | 32;
  sampleRate?: number;
  bitrate?: number; // For MP3
}

export class RecordingEngine {
  private static instance: RecordingEngine;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private destination: MediaStreamAudioDestinationNode | null = null;

  private constructor() {}

  public static getInstance(): RecordingEngine {
    if (!RecordingEngine.instance) {
      RecordingEngine.instance = new RecordingEngine();
    }
    return RecordingEngine.instance;
  }

  start(): void {
    if (this.isRecording) return;

    try {
      const context = Tone.getContext();
      
      // Create destination for recording
      this.destination = context.rawContext.createMediaStreamDestination();
      
      // Connect master output to recording destination
      Tone.getDestination().connect(this.destination as any);

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.destination.stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 320000
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      console.log('🔴 Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stop(): Promise<Blob> {
    if (!this.isRecording || !this.mediaRecorder) {
      throw new Error('Not recording');
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.isRecording = false;
        
        // Disconnect recording destination
        if (this.destination) {
          Tone.getDestination().disconnect(this.destination as any);
          this.destination = null;
        }

        console.log('⏹️ Recording stopped');
        resolve(blob);
      };

      this.mediaRecorder!.stop();
    });
  }

  async export(blob: Blob, options: RecordingOptions = { format: 'wav' }): Promise<Blob> {
    // Convert WebM to AudioBuffer
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);

    if (options.format === 'wav') {
      return this.exportWAV(audioBuffer, options);
    } else {
      return this.exportMP3(audioBuffer, options);
    }
  }

  private exportWAV(audioBuffer: AudioBuffer, options: RecordingOptions): Blob {
    const bitDepth = options.bitDepth || 24;
    const sampleRate = options.sampleRate || audioBuffer.sampleRate;
    
    // Resample if needed
    const buffer = sampleRate === audioBuffer.sampleRate 
      ? audioBuffer 
      : this.resample(audioBuffer, sampleRate);

    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * (bitDepth / 8);
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // PCM
    view.setUint16(20, 1, true); // Format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true);
    view.setUint16(32, numberOfChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const value = Math.max(-1, Math.min(1, sample));
        
        if (bitDepth === 16) {
          view.setInt16(offset, value * 0x7FFF, true);
          offset += 2;
        } else if (bitDepth === 24) {
          const int24 = Math.round(value * 0x7FFFFF);
          view.setUint8(offset, int24 & 0xFF);
          view.setUint8(offset + 1, (int24 >> 8) & 0xFF);
          view.setUint8(offset + 2, (int24 >> 16) & 0xFF);
          offset += 3;
        } else { // 32-bit
          view.setInt32(offset, value * 0x7FFFFFFF, true);
          offset += 4;
        }
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private exportMP3(audioBuffer: AudioBuffer, options: RecordingOptions): Blob {
    // Simplified MP3 export (in production, use lamejs)
    // For now, return as WAV
    console.warn('MP3 export not fully implemented, exporting as WAV');
    return this.exportWAV(audioBuffer, { ...options, format: 'wav' });
  }

  private resample(audioBuffer: AudioBuffer, targetSampleRate: number): AudioBuffer {
    const context = Tone.getContext().rawContext;
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.duration * targetSampleRate,
      targetSampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    return offlineContext.startRendering() as any;
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  get recording(): boolean {
    return this.isRecording;
  }
}

export const recordingEngine = RecordingEngine.getInstance();
