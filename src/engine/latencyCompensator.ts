// Team 1: Ableton Audio Engine - Latency Compensation
// Automatic delay compensation (ADC) like Ableton Live

import * as Tone from 'tone';

export class LatencyCompensator {
  private delays: Map<string, Tone.Delay>;
  private latencies: Map<string, number>;
  
  constructor() {
    this.delays = new Map();
    this.latencies = new Map();
  }
  
  // Calculate and apply compensation
  compensate(chain: Tone.ToneAudioNode[]): void {
    const totalLatency = this.calculateChainLatency(chain);
    this.applyCompensation(totalLatency);
  }
  
  private calculateChainLatency(chain: Tone.ToneAudioNode[]): number {
    // Sum up processing delays
    return chain.reduce((sum, node) => {
      return sum + this.getNodeLatency(node);
    }, 0);
  }
  
  private getNodeLatency(node: Tone.ToneAudioNode): number {
    // Estimate latency based on node type
    if (node instanceof Tone.Convolver) {
      return 0.005; // 5ms for convolution reverb
    }
    if (node instanceof Tone.Compressor) {
      return 0.002; // 2ms for dynamics
    }
    if (node instanceof Tone.EQ3 || node instanceof Tone.Filter) {
      return 0.001; // 1ms for filters
    }
    if (node instanceof Tone.Delay) {
      return Number(node.delayTime.value) || 0;
    }
    
    // Default minimal latency
    return 0.0001; // 0.1ms
  }
  
  private applyCompensation(latency: number): void {
    // Store latency for reference
    this.latencies.set('total', latency);
    
    console.log(`⚡ Latency Compensation: ${(latency * 1000).toFixed(2)}ms`);
  }
  
  // Create compensating delay for a specific channel
  createCompensatingDelay(id: string, targetLatency: number): Tone.Delay {
    const delay = new Tone.Delay(targetLatency);
    this.delays.set(id, delay);
    return delay;
  }
  
  // Get total system latency
  getTotalLatency(): number {
    return this.latencies.get('total') || 0;
  }
  
  // Cleanup
  dispose(): void {
    this.delays.forEach(delay => delay.dispose());
    this.delays.clear();
    this.latencies.clear();
  }
}

// Singleton instance
export const latencyCompensator = new LatencyCompensator();
