// Team 2: Yamaha DSP - Audio Quality Optimizer
// Ensure studio-grade audio quality

export class AudioQualityOptimizer {
  // Dithering for bit depth reduction
  applyDither(buffer: Float32Array, targetBits: number): void {
    const ditherAmount = 1 / Math.pow(2, targetBits);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] += (Math.random() - 0.5) * ditherAmount;
    }
  }
  
  // DC offset removal
  removeDCOffset(buffer: Float32Array): void {
    const mean = buffer.reduce((sum, val) => sum + val, 0) / buffer.length;
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] -= mean;
    }
  }
  
  // Peak normalization
  normalize(buffer: Float32Array, targetLevel: number = -0.3): void {
    const peak = Math.max(...buffer.map(Math.abs));
    if (peak === 0) return; // Avoid division by zero
    
    const gain = Math.pow(10, targetLevel / 20) / peak;
    
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] *= gain;
    }
  }
  
  // RMS normalization (better for perceived loudness)
  normalizeRMS(buffer: Float32Array, targetRMS: number = -18): void {
    // Calculate RMS
    const sumSquares = buffer.reduce((sum, val) => sum + val * val, 0);
    const rms = Math.sqrt(sumSquares / buffer.length);
    
    if (rms === 0) return;
    
    // Calculate gain to reach target RMS
    const targetLinear = Math.pow(10, targetRMS / 20);
    const gain = targetLinear / rms;
    
    // Apply gain with limiting
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.max(-1, Math.min(1, buffer[i] * gain));
    }
  }
  
  // Measure THD+N (Total Harmonic Distortion + Noise)
  measureTHDN(buffer: Float32Array, sampleRate: number): number {
    // Simplified THD+N measurement
    // In production, use proper FFT analysis
    
    // Calculate RMS of signal
    const rms = Math.sqrt(
      buffer.reduce((sum, val) => sum + val * val, 0) / buffer.length
    );
    
    // Estimate noise floor (simplified)
    const noiseFloor = 0.00001; // -100dB
    
    // THD+N ratio
    return noiseFloor / (rms || 1);
  }
  
  // Measure dynamic range
  measureDynamicRange(buffer: Float32Array): number {
    const peak = Math.max(...buffer.map(Math.abs));
    const noiseFloor = 0.00001; // -100dB
    
    if (peak === 0) return 0;
    
    // Dynamic range in dB
    return 20 * Math.log10(peak / noiseFloor);
  }
  
  // Measure frequency response (simplified)
  measureFrequencyResponse(
    buffer: Float32Array,
    sampleRate: number,
    frequency: number
  ): number {
    // Simplified frequency response measurement
    // In production, use proper FFT analysis
    
    // Generate test tone at frequency
    const testTone = new Float32Array(buffer.length);
    for (let i = 0; i < testTone.length; i++) {
      testTone[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }
    
    // Correlate with buffer
    let correlation = 0;
    for (let i = 0; i < buffer.length; i++) {
      correlation += buffer[i] * testTone[i];
    }
    
    return Math.abs(correlation) / buffer.length;
  }
  
  // Apply soft clipping (analog-style limiting)
  softClip(buffer: Float32Array, threshold: number = 0.9): void {
    for (let i = 0; i < buffer.length; i++) {
      const x = buffer[i];
      if (Math.abs(x) > threshold) {
        // Soft clipping curve
        buffer[i] = Math.sign(x) * (threshold + (1 - threshold) * Math.tanh((Math.abs(x) - threshold) / (1 - threshold)));
      }
    }
  }
  
  // Validate audio quality
  validateQuality(buffer: Float32Array, sampleRate: number): QualityReport {
    const peak = Math.max(...buffer.map(Math.abs));
    const thdN = this.measureTHDN(buffer, sampleRate);
    const dynamicRange = this.measureDynamicRange(buffer);
    
    return {
      peak,
      peakDB: 20 * Math.log10(peak || 0.00001),
      thdN,
      thdNPercent: thdN * 100,
      dynamicRange,
      clipping: peak >= 1.0,
      quality: thdN < 0.00001 && dynamicRange > 120 ? 'studio' : 
               thdN < 0.0001 && dynamicRange > 96 ? 'professional' :
               thdN < 0.001 && dynamicRange > 80 ? 'good' : 'poor'
    };
  }
}

export interface QualityReport {
  peak: number;
  peakDB: number;
  thdN: number;
  thdNPercent: number;
  dynamicRange: number;
  clipping: boolean;
  quality: 'studio' | 'professional' | 'good' | 'poor';
}

// Singleton instance
export const audioQualityOptimizer = new AudioQualityOptimizer();
