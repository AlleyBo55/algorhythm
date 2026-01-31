// Team 6: Infrastructure - Monitoring Service
// Performance and error tracking

export class MonitoringService {
  private enabled: boolean;
  
  constructor() {
    this.enabled = typeof window !== 'undefined';
  }
  
  // Track performance metrics
  trackPerformance(metric: string, value: number): void {
    if (!this.enabled) return;
    
    // Send to analytics
    this.sendToAnalytics({
      type: 'performance',
      metric,
      value,
      timestamp: Date.now(),
      url: window.location.href
    });
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metric}: ${value.toFixed(2)}`);
    }
  }
  
  // Track errors
  trackError(error: Error, context?: Record<string, unknown>): void {
    if (!this.enabled) return;
    
    console.error('❌ Error:', error);
    
    this.sendToAnalytics({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
  
  // Track user actions
  trackAction(action: string, data?: Record<string, unknown>): void {
    if (!this.enabled) return;
    
    this.sendToAnalytics({
      type: 'action',
      action,
      data,
      timestamp: Date.now(),
      url: window.location.href
    });
  }
  
  // Track page view
  trackPageView(path: string): void {
    if (!this.enabled) return;
    
    this.sendToAnalytics({
      type: 'pageview',
      path,
      timestamp: Date.now(),
      referrer: document.referrer
    });
  }
  
  // Track custom event
  trackEvent(name: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return;
    
    this.sendToAnalytics({
      type: 'event',
      name,
      properties,
      timestamp: Date.now()
    });
  }
  
  private async sendToAnalytics(data: unknown): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      // Don't send in development
      return;
    }
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Fail silently to avoid infinite loops
      console.error('Failed to send analytics:', error);
    }
  }
  
  // Measure and track Web Vitals
  trackWebVitals(): void {
    if (!this.enabled) return;
    
    // Track FCP (First Contentful Paint)
    this.trackPaintTiming('first-contentful-paint', 'FCP');
    
    // Track LCP (Largest Contentful Paint)
    this.trackLargestContentfulPaint();
    
    // Track FID (First Input Delay)
    this.trackFirstInputDelay();
    
    // Track CLS (Cumulative Layout Shift)
    this.trackCumulativeLayoutShift();
  }
  
  private trackPaintTiming(name: string, metric: string): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === name) {
          this.trackPerformance(metric, entry.startTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }
  
  private trackLargestContentfulPaint(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackPerformance('LCP', lastEntry.startTime);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  private trackFirstInputDelay(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        this.trackPerformance('FID', fid);
      }
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
  
  private trackCumulativeLayoutShift(): void {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // LayoutShift is a browser-specific type
        const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value || 0;
        }
      }
      this.trackPerformance('CLS', clsValue);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Auto-track Web Vitals on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    monitoring.trackWebVitals();
  });
}
