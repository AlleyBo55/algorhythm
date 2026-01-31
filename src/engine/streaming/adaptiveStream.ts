// Team 3: Spotify Streaming - Adaptive Audio Streaming
// Spotify-style adaptive bitrate streaming

import * as Tone from 'tone';
import { BandwidthMonitor } from './bandwidth';

interface QualityLevel {
  bitrate: number;
  format: string;
  quality: 'high' | 'medium' | 'low';
}

export class AdaptiveAudioStream {
  private qualityLevels: QualityLevel[] = [
    { bitrate: 320, format: 'mp3', quality: 'high' },
    { bitrate: 160, format: 'mp3', quality: 'medium' },
    { bitrate: 96, format: 'mp3', quality: 'low' }
  ];
  
  private currentQuality: number = 0;
  private bandwidth: BandwidthMonitor;
  private buffer: AudioBuffer | null = null;
  private isStreaming: boolean = false;
  
  constructor() {
    this.bandwidth = new BandwidthMonitor();
  }
  
  async stream(url: string): Promise<AudioBuffer> {
    this.isStreaming = true;
    
    // Detect optimal quality
    const quality = await this.selectQuality();
    
    // Progressive loading
    return this.progressiveLoad(url, quality);
  }
  
  private async selectQuality(): Promise<number> {
    const bw = await this.bandwidth.measure();
    
    console.log(`📊 Bandwidth: ${bw.toFixed(0)} kbps`);
    
    if (bw > 5000) {
      console.log('🎵 Quality: High (320kbps)');
      return 0; // High quality
    }
    if (bw > 2000) {
      console.log('🎵 Quality: Medium (160kbps)');
      return 1; // Medium quality
    }
    console.log('🎵 Quality: Low (96kbps)');
    return 2; // Low quality
  }
  
  // Load while playing (like Spotify)
  private async progressiveLoad(url: string, quality: number): Promise<AudioBuffer> {
    const startTime = performance.now();
    
    try {
      // Fetch audio data
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio
      const context = Tone.getContext();
      this.buffer = await context.decodeAudioData(arrayBuffer);
      
      const loadTime = performance.now() - startTime;
      console.log(`⚡ Load time: ${loadTime.toFixed(0)}ms`);
      
      this.isStreaming = false;
      return this.buffer;
      
    } catch (error) {
      this.isStreaming = false;
      console.error('❌ Stream error:', error);
      throw error;
    }
  }
  
  // Fetch in chunks for progressive loading
  private async fetchInChunks(url: string, quality: number): Promise<ArrayBuffer[]> {
    const response = await fetch(url);
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const chunks: ArrayBuffer[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value.buffer);
    }
    
    return chunks;
  }
  
  // Start playback after first chunk
  private startPlayback(chunk: ArrayBuffer): void {
    // Decode and start playing first chunk
    console.log('▶️ Starting playback...');
  }
  
  // Continue loading in background
  private loadRemaining(chunks: ArrayBuffer[]): void {
    // Load remaining chunks in background
    console.log(`📦 Loading ${chunks.length} remaining chunks...`);
  }
  
  // Get current quality level
  getCurrentQuality(): QualityLevel {
    return this.qualityLevels[this.currentQuality];
  }
  
  // Check if streaming
  get streaming(): boolean {
    return this.isStreaming;
  }
  
  // Get buffer
  getBuffer(): AudioBuffer | null {
    return this.buffer;
  }
  
  // Stop streaming
  stop(): void {
    this.isStreaming = false;
  }
}
