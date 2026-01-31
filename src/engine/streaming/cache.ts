// Team 3: Spotify Streaming - Intelligent Cache System
// Multi-tier caching like Spotify

import * as Tone from 'tone';

export class AudioCache {
  private memoryCache: Map<string, AudioBuffer>;
  private cacheStats: Map<string, CacheEntry>;
  private maxMemorySize: number;
  private currentMemorySize: number;
  
  // Spotify's cache strategy
  private readonly CACHE_SIZES = {
    memory: 500 * 1024 * 1024,  // 500MB RAM
    disk: 5 * 1024 * 1024 * 1024 // 5GB disk (via IndexedDB)
  };
  
  constructor() {
    this.memoryCache = new Map();
    this.cacheStats = new Map();
    this.maxMemorySize = this.CACHE_SIZES.memory;
    this.currentMemorySize = 0;
  }
  
  async get(key: string): Promise<AudioBuffer | null> {
    // L1: Memory cache (instant)
    const memCached = this.memoryCache.get(key);
    if (memCached) {
      this.updateStats(key, 'memory-hit');
      return memCached;
    }
    
    // L2: IndexedDB cache (fast)
    const diskCached = await this.getFromIndexedDB(key);
    if (diskCached) {
      this.updateStats(key, 'disk-hit');
      // Promote to memory cache
      this.set(key, diskCached);
      return diskCached;
    }
    
    // L3: Cache miss
    this.updateStats(key, 'miss');
    return null;
  }
  
  async set(key: string, buffer: AudioBuffer): Promise<void> {
    // Estimate buffer size
    const bufferSize = buffer.length * buffer.numberOfChannels * 4; // 4 bytes per sample
    
    // Check if we need to evict
    while (this.currentMemorySize + bufferSize > this.maxMemorySize && this.memoryCache.size > 0) {
      this.evictLRU();
    }
    
    // Add to memory cache
    this.memoryCache.set(key, buffer);
    this.currentMemorySize += bufferSize;
    
    // Also store in IndexedDB for persistence
    await this.setInIndexedDB(key, buffer);
    
    this.updateStats(key, 'set');
  }
  
  async has(key: string): Promise<boolean> {
    if (this.memoryCache.has(key)) return true;
    return await this.hasInIndexedDB(key);
  }
  
  // Predictive prefetching
  async prefetch(keys: string[]): Promise<void> {
    const sorted = this.sortByPriority(keys);
    
    for (const key of sorted) {
      if (!await this.has(key)) {
        // Would fetch from network here
        console.log(`📦 Prefetching: ${key}`);
      }
    }
  }
  
  private sortByPriority(keys: string[]): string[] {
    return keys.sort((a, b) => {
      const priorityA = this.calculatePriority(a);
      const priorityB = this.calculatePriority(b);
      return priorityB - priorityA;
    });
  }
  
  private calculatePriority(key: string): number {
    const stats = this.cacheStats.get(key);
    if (!stats) return 0;
    
    // Based on: recency, frequency, user patterns
    const recency = this.getRecencyScore(stats);
    const frequency = this.getFrequencyScore(stats);
    
    return recency * 0.6 + frequency * 0.4;
  }
  
  private getRecencyScore(stats: CacheEntry): number {
    const age = Date.now() - stats.lastAccess;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return Math.max(0, 1 - age / maxAge);
  }
  
  private getFrequencyScore(stats: CacheEntry): number {
    return Math.min(1, stats.accessCount / 100);
  }
  
  // LRU eviction
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    this.cacheStats.forEach((stats, key) => {
      if (stats.lastAccess < oldestTime) {
        oldestTime = stats.lastAccess;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      const buffer = this.memoryCache.get(oldestKey);
      if (buffer) {
        const bufferSize = buffer.length * buffer.numberOfChannels * 4;
        this.currentMemorySize -= bufferSize;
      }
      this.memoryCache.delete(oldestKey);
      console.log(`🗑️ Evicted: ${oldestKey}`);
    }
  }
  
  // IndexedDB operations (simplified)
  private async getFromIndexedDB(key: string): Promise<AudioBuffer | null> {
    // In production, implement proper IndexedDB access
    return null;
  }
  
  private async setInIndexedDB(key: string, buffer: AudioBuffer): Promise<void> {
    // In production, implement proper IndexedDB storage
  }
  
  private async hasInIndexedDB(key: string): Promise<boolean> {
    // In production, implement proper IndexedDB check
    return false;
  }
  
  // Statistics
  private updateStats(key: string, event: 'memory-hit' | 'disk-hit' | 'miss' | 'set'): void {
    let stats = this.cacheStats.get(key);
    if (!stats) {
      stats = {
        key,
        accessCount: 0,
        lastAccess: Date.now(),
        hits: 0,
        misses: 0
      };
      this.cacheStats.set(key, stats);
    }
    
    stats.accessCount++;
    stats.lastAccess = Date.now();
    
    if (event === 'memory-hit' || event === 'disk-hit') {
      stats.hits++;
    } else if (event === 'miss') {
      stats.misses++;
    }
  }
  
  // Get cache statistics
  getStats(): CacheStats {
    let totalHits = 0;
    let totalMisses = 0;
    
    this.cacheStats.forEach(stats => {
      totalHits += stats.hits;
      totalMisses += stats.misses;
    });
    
    const hitRate = totalHits + totalMisses > 0 
      ? totalHits / (totalHits + totalMisses) 
      : 0;
    
    return {
      memorySize: this.currentMemorySize,
      memoryItems: this.memoryCache.size,
      hitRate,
      totalHits,
      totalMisses
    };
  }
  
  // Clear cache
  clear(): void {
    this.memoryCache.clear();
    this.cacheStats.clear();
    this.currentMemorySize = 0;
  }
}

interface CacheEntry {
  key: string;
  accessCount: number;
  lastAccess: number;
  hits: number;
  misses: number;
}

export interface CacheStats {
  memorySize: number;
  memoryItems: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

// Singleton instance
export const audioCache = new AudioCache();
