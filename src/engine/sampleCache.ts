/**
 * Sample Cache with IndexedDB persistence
 * Samples are fetched once from R2, stored in IndexedDB, and reused across sessions
 * Only re-fetches if user clears browser data
 */

const DB_NAME = 'dj-sample-cache';
const DB_VERSION = 1;
const STORE_NAME = 'samples';

// All samples that need to be preloaded
// These match the keys uploaded to R2 (with .mp3 extension in path)
export const ALL_SAMPLES = [
  // Core drums
  'drums/kick-1.mp3',
  'drums/kick-2.mp3',
  'drums/kick-3.mp3',
  'drums/kick-4.mp3',
  'drums/kick-5.mp3',
  'drums/snare-1.mp3',
  'drums/snare-2.mp3',
  'drums/hihat-1.mp3',
  'drums/hihat-2.mp3',
  'drums/clap-1.mp3',
  'drums/clap-2.mp3',
  'drums/tom-1.mp3',
  // Bass
  'bass/sub-1.mp3',
  'bass/sub-2.mp3',
  'bass/synth-1.mp3',
  'bass/808-1.mp3',
  // Synths
  'synth/lead-1.mp3',
  'synth/pad-1.mp3',
  'synth/pluck-1.mp3',
  'synth/brass-1.mp3',
  // Vocals
  'vocals/chops-1.mp3',
  // Indonesian
  'indonesian/kendang-1.mp3',
  'indonesian/tabla-1.mp3',
  'indonesian/suling-1.mp3',
  'indonesian/gendang-1.mp3',
] as const;

export type SampleName = typeof ALL_SAMPLES[number];

interface CacheEntry {
  path: string;
  data: ArrayBuffer;
  timestamp: number;
}

// Cache for decoded AudioBuffers to prevent re-decoding
const decodedBufferCache = new Map<string, AudioBuffer>();

export interface LoadProgress {
  loaded: number;
  total: number;
  current: string;
  percent: number;
  status: 'checking' | 'loading' | 'ready' | 'error';
  message: string;
}

type ProgressCallback = (progress: LoadProgress) => void;

class SampleCache {
  private db: IDBDatabase | null = null;
  private memoryCache: Map<string, ArrayBuffer> = new Map();
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        console.warn('IndexedDB not available, using memory-only cache');
        this.isInitialized = true;
        resolve();
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('✅ IndexedDB sample cache initialized');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'path' });
        }
      };
    });
  }

  private async getFromDB(path: string): Promise<ArrayBuffer | null> {
    if (!this.db) return null;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(path);
      
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        resolve(entry?.data || null);
      };
      
      request.onerror = () => resolve(null);
    });
  }

  private async saveToDB(path: string, data: ArrayBuffer): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const entry: CacheEntry = { path, data, timestamp: Date.now() };
      
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }

  async get(path: string): Promise<ArrayBuffer | null> {
    // Ensure initialized
    await this.init();
    
    // Check memory first
    if (this.memoryCache.has(path)) {
      return this.memoryCache.get(path)!;
    }
    
    // Check IndexedDB
    const dbData = await this.getFromDB(path);
    if (dbData) {
      this.memoryCache.set(path, dbData);
      return dbData;
    }
    
    return null;
  }

  /**
   * Get decoded AudioBuffer (cached to prevent re-decoding)
   */
  async getDecoded(path: string, audioContext: AudioContext): Promise<AudioBuffer | null> {
    // Check decoded cache first
    if (decodedBufferCache.has(path)) {
      return decodedBufferCache.get(path)!;
    }
    
    // Get raw data
    const rawData = await this.get(path);
    if (!rawData) return null;
    
    // Decode and cache
    try {
      const clonedBuffer = rawData.slice(0);
      const decoded = await audioContext.decodeAudioData(clonedBuffer);
      decodedBufferCache.set(path, decoded);
      return decoded;
    } catch (e) {
      console.error(`Failed to decode ${path}:`, e);
      return null;
    }
  }

  async set(path: string, data: ArrayBuffer): Promise<void> {
    this.memoryCache.set(path, data);
    await this.saveToDB(path, data);
  }

  async has(path: string): Promise<boolean> {
    if (this.memoryCache.has(path)) return true;
    const dbData = await this.getFromDB(path);
    return dbData !== null;
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    if (this.db) {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    }
  }
}

export const sampleCache = new SampleCache();

const R2_CDN = process.env.NEXT_PUBLIC_R2_CDN || 'https://pub-1bb3c1da6ec04255a43c86fb314974e5.r2.dev';

/**
 * Preload all samples with progress tracking
 * Uses IndexedDB to persist across sessions
 * Pre-decodes all samples for instant playback!
 */
export async function preloadAllSamples(onProgress?: ProgressCallback): Promise<void> {
  await sampleCache.init();
  
  const total = ALL_SAMPLES.length;
  let loaded = 0;
  
  const updateProgress = (current: string, status: LoadProgress['status'], message: string) => {
    onProgress?.({
      loaded,
      total,
      current,
      percent: Math.round((loaded / total) * 100),
      status,
      message,
    });
  };

  updateProgress('', 'checking', 'Checking cached samples...');

  // Check which samples need to be fetched
  const toFetch: string[] = [];
  for (const path of ALL_SAMPLES) {
    const cached = await sampleCache.has(path);
    if (cached) {
      loaded++;
      // Load into memory from IndexedDB
      await sampleCache.get(path);
    } else {
      toFetch.push(path);
    }
  }

  if (toFetch.length === 0) {
    // Pre-decode all cached samples for instant playback
    updateProgress('', 'loading', 'Preparing audio buffers...');
    await preDecodeAllSamples(onProgress);
    updateProgress('', 'ready', 'All samples ready!');
    console.log('✅ All samples already cached and decoded');
    return;
  }

  console.log(`🔄 Fetching ${toFetch.length} samples from R2...`);
  updateProgress('', 'loading', `Loading ${toFetch.length} samples...`);

  // Fetch missing samples
  for (const path of toFetch) {
    try {
      updateProgress(path, 'loading', `Loading ${path}...`);
      
      // Path already includes .mp3 extension
      const url = `${R2_CDN}/${path}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        // Skip missing samples - they might not be uploaded yet
        console.warn(`Sample not found (${response.status}): ${path}`);
        loaded++;
        continue;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      await sampleCache.set(path, arrayBuffer);
      
      loaded++;
      updateProgress(path, 'loading', `Loaded ${path}`);
      
    } catch (error) {
      console.warn(`Failed to load ${path}:`, error);
      loaded++; // Continue anyway
    }
  }

  // Pre-decode all samples
  updateProgress('', 'loading', 'Preparing audio buffers...');
  await preDecodeAllSamples(onProgress);
  
  updateProgress('', 'ready', 'All samples loaded!');
  console.log('✅ All samples preloaded, cached, and decoded');
}

/**
 * Pre-decode all samples into AudioBuffers for instant playback
 */
async function preDecodeAllSamples(onProgress?: ProgressCallback): Promise<void> {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  try {
    // Get or create AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    let decoded = 0;
    const total = ALL_SAMPLES.length;
    
    for (const path of ALL_SAMPLES) {
      try {
        await sampleCache.getDecoded(path, audioContext);
        decoded++;
        onProgress?.({
          loaded: decoded,
          total,
          current: path,
          percent: Math.round((decoded / total) * 100),
          status: 'loading',
          message: `Decoding ${path}...`,
        });
      } catch (e) {
        console.warn(`Failed to decode ${path}:`, e);
        decoded++;
      }
    }
    
    console.log(`✅ Pre-decoded ${decoded}/${total} samples`);
  } catch (e) {
    console.warn('Pre-decoding skipped:', e);
  }
}

/**
 * Get sample as ArrayBuffer (from cache)
 */
export async function getCachedSample(path: string): Promise<ArrayBuffer | null> {
  await sampleCache.init();
  return sampleCache.get(path);
}

/**
 * Check if all samples are cached
 */
export async function areSamplesCached(): Promise<boolean> {
  await sampleCache.init();
  for (const path of ALL_SAMPLES) {
    if (!(await sampleCache.has(path))) {
      return false;
    }
  }
  return true;
}

/**
 * Parse code to extract sample paths used
 * Looks for patterns like: dj.sample('drums/kick-1', ...) or dj.sample("drums/kick-1", ...)
 */
function extractSamplesFromCode(code: string): string[] {
  const samples = new Set<string>();
  
  // Match dj.sample('path', ...) or dj.sample("path", ...)
  const sampleRegex = /dj\.sample\s*\(\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = sampleRegex.exec(code)) !== null) {
    samples.add(match[1]);
  }
  
  return Array.from(samples);
}

/**
 * Preload samples used in code BEFORE execution
 * This ensures no streaming/lag during playback
 */
export async function preloadSamplesFromCode(
  code: string, 
  onProgress?: (progress: { loaded: number; total: number; current: string; phase: string }) => void
): Promise<void> {
  await sampleCache.init();
  
  // Phase 1: Preload ALL core instrument samples (drums, bass, etc.)
  // These are used by Tone.Sampler instruments
  onProgress?.({ loaded: 0, total: ALL_SAMPLES.length, current: '', phase: 'Loading instruments...' });
  
  let loaded = 0;
  const total = ALL_SAMPLES.length;
  
  for (const path of ALL_SAMPLES) {
    const cached = await sampleCache.has(path);
    if (!cached) {
      try {
        onProgress?.({ loaded, total, current: path, phase: 'Downloading...' });
        // Path already includes .mp3 extension
        const url = `${R2_CDN}/${path}`;
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          await sampleCache.set(path, arrayBuffer);
        } else {
          console.warn(`Sample not found (${response.status}): ${path}`);
        }
      } catch (e) {
        console.warn(`Failed to preload ${path}:`, e);
      }
    } else {
      // Load into memory from IndexedDB
      await sampleCache.get(path);
    }
    loaded++;
    onProgress?.({ loaded, total, current: path, phase: 'Loading instruments...' });
  }
  
  // Phase 2: Extract and preload any additional samples from code
  const samplesInCode = extractSamplesFromCode(code);
  const additionalSamples = samplesInCode.filter(s => !ALL_SAMPLES.includes(s as any));
  
  if (additionalSamples.length > 0) {
    console.log(`🔍 Found ${additionalSamples.length} additional samples in code:`, additionalSamples);
    
    for (const path of additionalSamples) {
      const cached = await sampleCache.has(path);
      if (!cached) {
        try {
          onProgress?.({ loaded, total: total + additionalSamples.length, current: path, phase: 'Loading code samples...' });
          const url = `${R2_CDN}/${path}.mp3`;
          const response = await fetch(url);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            await sampleCache.set(path, arrayBuffer);
          }
        } catch (e) {
          console.warn(`Failed to preload ${path}:`, e);
        }
      }
      loaded++;
    }
  }
  
  onProgress?.({ loaded: total, total, current: '', phase: 'Ready!' });
  console.log('✅ All samples preloaded');
}
