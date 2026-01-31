// Team 3: Spotify Streaming - Bandwidth Monitor
// Real-time bandwidth detection

export class BandwidthMonitor {
  private samples: number[] = [];
  private readonly SAMPLE_SIZE = 10;
  private readonly TEST_SIZE = 100 * 1024; // 100KB test
  
  async measure(): Promise<number> {
    const start = performance.now();
    
    try {
      // Create test data
      const testData = new Uint8Array(this.TEST_SIZE);
      
      // Measure download speed using a small test
      // In production, use actual CDN endpoint
      const blob = new Blob([testData]);
      const url = URL.createObjectURL(blob);
      
      const response = await fetch(url);
      await response.arrayBuffer();
      
      URL.revokeObjectURL(url);
      
      const duration = (performance.now() - start) / 1000; // seconds
      const bandwidth = (this.TEST_SIZE * 8) / duration / 1000; // kbps
      
      this.samples.push(bandwidth);
      if (this.samples.length > this.SAMPLE_SIZE) {
        this.samples.shift();
      }
      
      return this.getAverage();
      
    } catch (error) {
      console.error('Bandwidth measurement failed:', error);
      // Return conservative estimate
      return 1000; // 1 Mbps
    }
  }
  
  private getAverage(): number {
    if (this.samples.length === 0) return 1000;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }
  
  // Predict future bandwidth
  predict(): number {
    // Simple moving average
    return this.getAverage();
  }
  
  // Get bandwidth statistics
  getStats(): BandwidthStats {
    if (this.samples.length === 0) {
      return {
        current: 0,
        average: 0,
        min: 0,
        max: 0,
        samples: 0
      };
    }
    
    return {
      current: this.samples[this.samples.length - 1],
      average: this.getAverage(),
      min: Math.min(...this.samples),
      max: Math.max(...this.samples),
      samples: this.samples.length
    };
  }
  
  // Reset measurements
  reset(): void {
    this.samples = [];
  }
}

export interface BandwidthStats {
  current: number;
  average: number;
  min: number;
  max: number;
  samples: number;
}
