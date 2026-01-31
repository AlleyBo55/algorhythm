interface Metric {
  name: string;
  value: number;
  timestamp: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  bufferHealth: number;
  dropouts: number;
  cpuUsage: number;
  memoryUsage: number;
  cacheHitRate: number;
}

export interface PerformanceReport {
  name: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
  p99: number;
}

export class PerformanceAnalytics {
  private metrics: Map<string, Metric[]>;
  private readonly MAX_METRICS = 1000;
  
  constructor() {
    this.metrics = new Map();
  }
  
  track(name: string, value: number): void {
    const metric: Metric = { name, value, timestamp: Date.now() };
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);
    
    if (metricArray.length > this.MAX_METRICS) {
      metricArray.shift();
    }
  }

  getDashboard(): PerformanceMetrics {
    return {
      loadTime: this.getP95('loadTime'),
      bufferHealth: this.getAverage('bufferHealth'),
      dropouts: this.getCount('dropout'),
      cpuUsage: this.getAverage('cpuUsage'),
      memoryUsage: this.getAverage('memoryUsage'),
      cacheHitRate: this.getCacheHitRate()
    };
  }
  
  private getP95(metric: string): number {
    const values = this.metrics.get(metric)?.map(m => m.value) || [];
    if (values.length === 0) return 0;
    
    values.sort((a, b) => a - b);
    const index = Math.floor(values.length * 0.95);
    return values[index] || 0;
  }
  
  private getAverage(metric: string): number {
    const values = this.metrics.get(metric)?.map(m => m.value) || [];
    if (values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  private getCount(metric: string): number {
    return this.metrics.get(metric)?.length || 0;
  }
  
  private getCacheHitRate(): number {
    const hits = this.getCount('cacheHit');
    const misses = this.getCount('cacheMiss');
    const total = hits + misses;
    
    return total > 0 ? hits / total : 0;
  }
  
  getMetricsInRange(name: string, startTime: number, endTime: number): Metric[] {
    const allMetrics = this.metrics.get(name) || [];
    return allMetrics.filter(m => 
      m.timestamp >= startTime && m.timestamp <= endTime
    );
  }
  
  getLatest(name: string): number | null {
    const metricArray = this.metrics.get(name);
    if (!metricArray || metricArray.length === 0) return null;
    
    return metricArray[metricArray.length - 1].value;
  }
  
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }
  
  clearOldMetrics(olderThan: number): void {
    const cutoff = Date.now() - olderThan;
    
    this.metrics.forEach((metricArray, name) => {
      const filtered = metricArray.filter(m => m.timestamp >= cutoff);
      this.metrics.set(name, filtered);
    });
  }
  
  exportMetrics(): Record<string, Metric[]> {
    const exported: Record<string, Metric[]> = {};
    
    this.metrics.forEach((metricArray, name) => {
      exported[name] = [...metricArray];
    });
    
    return exported;
  }
  
  getSummary(name: string): PerformanceReport | null {
    const values = this.metrics.get(name)?.map(m => m.value) || [];
    if (values.length === 0) return null;
    
    values.sort((a, b) => a - b);
    
    return {
      name,
      count: values.length,
      min: values[0],
      max: values[values.length - 1],
      mean: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: values[Math.floor(values.length / 2)],
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)]
    };
  }
  
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceAnalytics = new PerformanceAnalytics();
