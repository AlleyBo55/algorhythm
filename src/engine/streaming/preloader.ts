// Team 3: Spotify Streaming - Audio Preloader
// Smart preloading based on user behavior

import { audioCache } from './cache';

export class AudioPreloader {
  private patterns: UserPatternAnalyzer;
  private prefetchQueue: Set<string>;
  private isPrefetching: boolean = false;
  
  constructor() {
    this.patterns = new UserPatternAnalyzer();
    this.prefetchQueue = new Set();
  }
  
  // Preload next likely tracks
  async preloadNext(currentTrack: string): Promise<void> {
    const predictions = await this.patterns.predictNext(currentTrack);
    
    // Preload top 3 predictions
    const topPredictions = predictions.slice(0, 3);
    
    console.log(`📦 Preloading ${topPredictions.length} tracks...`);
    
    for (const trackId of topPredictions) {
      if (!await audioCache.has(trackId)) {
        this.prefetchQueue.add(trackId);
      }
    }
    
    // Start prefetching if not already running
    if (!this.isPrefetching) {
      this.processPrefetchQueue();
    }
  }
  
  // Process prefetch queue
  private async processPrefetchQueue(): Promise<void> {
    if (this.prefetchQueue.size === 0) {
      this.isPrefetching = false;
      return;
    }
    
    this.isPrefetching = true;
    
    // Get next item from queue
    const trackId = Array.from(this.prefetchQueue)[0];
    this.prefetchQueue.delete(trackId);
    
    try {
      // Fetch and cache
      console.log(`📦 Prefetching: ${trackId}`);
      // In production, fetch from CDN
      // const buffer = await fetchAudio(trackId);
      // await audioCache.set(trackId, buffer);
      
    } catch (error) {
      console.error(`❌ Prefetch failed for ${trackId}:`, error);
    }
    
    // Continue with next item
    setTimeout(() => this.processPrefetchQueue(), 100);
  }
  
  // Learn from user behavior
  learn(from: string, to: string): void {
    this.patterns.recordTransition(from, to);
  }
  
  // Get predictions
  getPredictions(currentTrack: string): string[] {
    return this.patterns.predictNext(currentTrack);
  }
  
  // Clear queue
  clearQueue(): void {
    this.prefetchQueue.clear();
    this.isPrefetching = false;
  }
  
  // Get queue size
  getQueueSize(): number {
    return this.prefetchQueue.size;
  }
}

class UserPatternAnalyzer {
  private transitions: Map<string, Map<string, number>>;
  private readonly MAX_HISTORY = 1000;
  
  constructor() {
    this.transitions = new Map();
  }
  
  predictNext(current: string): string[] {
    const nextTracks = this.transitions.get(current);
    if (!nextTracks) return [];
    
    // Sort by frequency (most common transitions first)
    return Array.from(nextTracks.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([track]) => track);
  }
  
  recordTransition(from: string, to: string): void {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, new Map());
    }
    
    const next = this.transitions.get(from)!;
    next.set(to, (next.get(to) || 0) + 1);
    
    // Limit history size
    if (this.transitions.size > this.MAX_HISTORY) {
      // Remove oldest entry
      const firstKey = this.transitions.keys().next().value;
      if (firstKey) this.transitions.delete(firstKey);
    }
  }
  
  // Get transition probability
  getTransitionProbability(from: string, to: string): number {
    const nextTracks = this.transitions.get(from);
    if (!nextTracks) return 0;
    
    const count = nextTracks.get(to) || 0;
    const total = Array.from(nextTracks.values()).reduce((sum, c) => sum + c, 0);
    
    return total > 0 ? count / total : 0;
  }
  
  // Get most common transitions
  getMostCommonTransitions(limit: number = 10): Array<[string, string, number]> {
    const allTransitions: Array<[string, string, number]> = [];
    
    this.transitions.forEach((nextTracks, from) => {
      nextTracks.forEach((count, to) => {
        allTransitions.push([from, to, count]);
      });
    });
    
    return allTransitions
      .sort((a, b) => b[2] - a[2])
      .slice(0, limit);
  }
  
  // Export patterns
  exportPatterns(): string {
    const patterns: Record<string, Record<string, number>> = {};
    
    this.transitions.forEach((nextTracks, from) => {
      patterns[from] = {};
      nextTracks.forEach((count, to) => {
        patterns[from][to] = count;
      });
    });
    
    return JSON.stringify(patterns, null, 2);
  }
  
  // Import patterns
  importPatterns(json: string): void {
    try {
      const patterns = JSON.parse(json);
      this.transitions.clear();
      
      Object.entries(patterns).forEach(([from, nextTracks]) => {
        const map = new Map<string, number>();
        Object.entries(nextTracks as Record<string, number>).forEach(([to, count]) => {
          map.set(to, count);
        });
        this.transitions.set(from, map);
      });
      
      console.log('📦 Imported user patterns');
    } catch (error) {
      console.error('❌ Failed to import patterns:', error);
    }
  }
  
  // Clear patterns
  clear(): void {
    this.transitions.clear();
  }
}

// Singleton instance
export const audioPreloader = new AudioPreloader();
