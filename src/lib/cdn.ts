// Team 6: Infrastructure - CDN Manager
// Cloudflare R2 integration with multi-tier caching

export class CDNManager {
  private cache: Map<string, ArrayBuffer>;
  private readonly CACHE_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB
  private currentCacheSize: number = 0;
  
  constructor() {
    this.cache = new Map();
  }
  
  async getSample(key: string): Promise<ArrayBuffer> {
    // L1: Memory cache
    if (this.cache.has(key)) {
      console.log(`✅ Cache hit (memory): ${key}`);
      return this.cache.get(key)!;
    }
    
    // L2: Service Worker cache
    const cached = await this.checkServiceWorkerCache(key);
    if (cached) {
      console.log(`✅ Cache hit (service worker): ${key}`);
      this.cache.set(key, cached);
      return cached;
    }
    
    // L3: CDN (Cloudflare R2)
    console.log(`📡 Fetching from CDN: ${key}`);
    const buffer = await this.fetchFromCDN(key);
    
    // Cache for future use
    await this.cacheBuffer(key, buffer);
    
    return buffer;
  }
  
  private async fetchFromCDN(key: string): Promise<ArrayBuffer> {
    const endpoint = process.env.NEXT_PUBLIC_R2_ENDPOINT || '/api/samples';
    const url = `${endpoint}/${key}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.arrayBuffer();
      
    } catch (error) {
      console.error(`❌ CDN fetch failed for ${key}:`, error);
      throw error;
    }
  }
  
  private async cacheBuffer(key: string, buffer: ArrayBuffer): Promise<void> {
    // Check size limit
    if (this.currentCacheSize + buffer.byteLength > this.CACHE_SIZE_LIMIT) {
      this.evictOldest();
    }
    
    // Add to memory cache
    this.cache.set(key, buffer);
    this.currentCacheSize += buffer.byteLength;
    
    // Add to Service Worker cache
    await this.cacheInServiceWorker(key, buffer);
  }
  
  private evictOldest(): void {
    // Simple FIFO eviction
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const buffer = this.cache.get(firstKey);
      if (buffer) {
        this.currentCacheSize -= buffer.byteLength;
      }
      this.cache.delete(firstKey);
      console.log(`🗑️ Evicted from cache: ${firstKey}`);
    }
  }
  
  private async checkServiceWorkerCache(key: string): Promise<ArrayBuffer | null> {
    if (!('caches' in window)) return null;
    
    try {
      const cache = await caches.open('audio-samples-v1');
      const response = await cache.match(`/samples/${key}`);
      
      if (response) {
        return await response.arrayBuffer();
      }
    } catch (error) {
      console.error('Service Worker cache check failed:', error);
    }
    
    return null;
  }
  
  private async cacheInServiceWorker(key: string, buffer: ArrayBuffer): Promise<void> {
    if (!('caches' in window)) return;
    
    try {
      const cache = await caches.open('audio-samples-v1');
      const response = new Response(buffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Cache-Control': 'public, max-age=31536000' // 1 year
        }
      });
      
      await cache.put(`/samples/${key}`, response);
    } catch (error) {
      console.error('Service Worker cache write failed:', error);
    }
  }
  
  // Prefetch samples
  async prefetch(keys: string[]): Promise<void> {
    console.log(`📦 Prefetching ${keys.length} samples...`);
    
    for (const key of keys) {
      if (!this.cache.has(key)) {
        try {
          await this.getSample(key);
        } catch (error) {
          console.error(`❌ Prefetch failed for ${key}:`, error);
        }
      }
    }
  }
  
  // Get cache statistics
  getStats(): CDNStats {
    return {
      cacheSize: this.currentCacheSize,
      cacheItems: this.cache.size,
      cacheSizeLimit: this.CACHE_SIZE_LIMIT,
      cacheUsagePercent: (this.currentCacheSize / this.CACHE_SIZE_LIMIT) * 100
    };
  }
  
  // Clear cache
  clear(): void {
    this.cache.clear();
    this.currentCacheSize = 0;
    console.log('🗑️ CDN cache cleared');
  }
}

export interface CDNStats {
  cacheSize: number;
  cacheItems: number;
  cacheSizeLimit: number;
  cacheUsagePercent: number;
}

// Singleton instance
export const cdnManager = new CDNManager();
