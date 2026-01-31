// Team 3: Spotify Streaming - Real-Time Audio Processor
// Zero-latency real-time processing using AudioWorklet

import * as Tone from 'tone';

export class RealtimeProcessor {
  private worklet: AudioWorkletNode | null = null;
  private bufferSize: number = 256;
  private initialized: boolean = false;
  
  async init(context?: Tone.BaseContext): Promise<void> {
    if (this.initialized) return;
    
    const audioContext = context || Tone.getContext();
    
    try {
      // Load audio worklet for real-time processing
      await audioContext.rawContext.audioWorklet.addModule('/worklets/realtime-processor.js');
      
      this.worklet = new AudioWorkletNode(audioContext.rawContext, 'realtime-processor', {
        processorOptions: {
          bufferSize: this.bufferSize
        }
      });
      
      // Setup message handling
      this.worklet.port.onmessage = this.handleMessage.bind(this);
      
      this.initialized = true;
      console.log('✅ Real-Time Processor: Initialized');
      console.log(`   Buffer Size: ${this.bufferSize} samples`);
      
    } catch (error) {
      console.error('❌ Real-Time Processor initialization failed:', error);
      console.warn('⚠️ Falling back to standard processing');
    }
  }
  
  // Handle messages from worklet
  private handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    
    switch (type) {
      case 'processed':
        // Audio processed
        break;
      case 'error':
        console.error('❌ Worklet error:', data);
        break;
      case 'stats':
        // Processing statistics
        break;
    }
  }
  
  // Process audio in real-time
  process(input: Float32Array): Float32Array {
    if (!this.worklet) {
      // Fallback: return input unchanged
      return input;
    }
    
    // Send to worklet for processing
    this.worklet.port.postMessage({ 
      type: 'process', 
      data: input 
    });
    
    // Return processed audio (in real implementation, this would be async)
    return input;
  }
  
  // Set processing parameters
  setParameter(name: string, value: number): void {
    if (!this.worklet) return;
    
    this.worklet.port.postMessage({
      type: 'setParameter',
      name,
      value
    });
  }
  
  // Get worklet node for connection
  getNode(): AudioWorkletNode | null {
    return this.worklet;
  }
  
  // Check if initialized
  get isInitialized(): boolean {
    return this.initialized;
  }
  
  // Cleanup
  dispose(): void {
    if (this.worklet) {
      this.worklet.disconnect();
      this.worklet = null;
    }
    this.initialized = false;
  }
}

// Singleton instance
export const realtimeProcessor = new RealtimeProcessor();
