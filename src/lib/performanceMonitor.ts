// Performance Monitor
// Phase 3: Real-time performance tracking for UI

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  cpuUsage: number;
  memoryUsage: number;
  audioLatency: number;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private renderTimes: number[] = [];
  private maxSamples = 60;

  /**
   * Get current FPS
   */
  getFPS(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;
    }
    
    this.frameCount++;
    return this.fps;
  }

  /**
   * Record a render time
   */
  recordRenderTime(time: number): void {
    this.renderTimes.push(time);
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }
  }

  /**
   * Get average render time
   */
  getRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    const sum = this.renderTimes.reduce((a, b) => a + b, 0);
    return Math.round((sum / this.renderTimes.length) * 100) / 100;
  }

  /**
   * Estimate CPU usage from render time
   */
  getCPUUsage(): number {
    const renderTime = this.getRenderTime();
    const frameTime = 1000 / 60; // 16.67ms target
    return Math.min(100, Math.round((renderTime / frameTime) * 100));
  }

  /**
   * Get memory usage in MB (Chrome only)
   */
  getMemoryUsage(): number {
    // @ts-ignore - Chrome only API
    if (typeof performance !== 'undefined' && performance.memory) {
      // @ts-ignore
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }

  /**
   * Get audio latency in ms
   */
  getAudioLatency(): number {
    if (typeof AudioContext !== 'undefined') {
      try {
        const ctx = new AudioContext();
        const latency = ((ctx.baseLatency || 0) + (ctx.outputLatency || 0)) * 1000;
        ctx.close();
        return Math.round(latency * 100) / 100;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.getFPS(),
      renderTime: this.getRenderTime(),
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      audioLatency: this.getAudioLatency(),
    };
  }

  /**
   * Check if performance is healthy
   */
  isHealthy(): boolean {
    const metrics = this.getMetrics();
    return (
      metrics.fps >= 55 &&
      metrics.renderTime < 16 &&
      metrics.cpuUsage < 80 &&
      metrics.memoryUsage < 500
    );
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.renderTimes = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
