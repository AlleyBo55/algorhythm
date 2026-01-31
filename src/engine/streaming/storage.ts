// IndexedDB & LocalStorage Utilities for Streaming Integration
// Patterns: Netflix (offline storage), Spotify (cache management), TikTok (fast recovery)

import type { 
  RecordingChunk, 
  RecordingMetadata, 
  RecoveryData 
} from './types';
import { STORAGE_KEYS } from './types';

export { STORAGE_KEYS };

const DB_NAME = 'dj-streaming';
const DB_VERSION = 1;
const STORES = {
  CHUNKS: 'recording_chunks',
  METADATA: 'recording_metadata',
} as const;

// ============================================================================
// INDEXEDDB MANAGER (Netflix pattern: robust offline storage)
// ============================================================================

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Recording chunks store
        if (!db.objectStoreNames.contains(STORES.CHUNKS)) {
          const chunksStore = db.createObjectStore(STORES.CHUNKS, { keyPath: 'id' });
          chunksStore.createIndex('recordingId', 'recordingId', { unique: false });
          chunksStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Recording metadata store
        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          const metaStore = db.createObjectStore(STORES.METADATA, { keyPath: 'id' });
          metaStore.createIndex('startTime', 'startTime', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  // Spotify pattern: transactional writes for data integrity
  async saveChunk(chunk: RecordingChunk): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CHUNKS, 'readwrite');
      const store = tx.objectStore(STORES.CHUNKS);
      const request = store.put(chunk);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getChunksByRecordingId(recordingId: string): Promise<RecordingChunk[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CHUNKS, 'readonly');
      const store = tx.objectStore(STORES.CHUNKS);
      const index = store.index('recordingId');
      const request = index.getAll(recordingId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMetadata(metadata: RecordingMetadata): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.METADATA, 'readwrite');
      const store = tx.objectStore(STORES.METADATA);
      const request = store.put(metadata);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMetadata(id: string): Promise<RecordingMetadata | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.METADATA, 'readonly');
      const store = tx.objectStore(STORES.METADATA);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMetadata(): Promise<RecordingMetadata[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.METADATA, 'readonly');
      const store = tx.objectStore(STORES.METADATA);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // TikTok pattern: fast cleanup for old data
  async deleteRecording(recordingId: string): Promise<void> {
    const db = await this.init();
    
    // Delete chunks
    const chunksTx = db.transaction(STORES.CHUNKS, 'readwrite');
    const chunksStore = chunksTx.objectStore(STORES.CHUNKS);
    const chunksIndex = chunksStore.index('recordingId');
    const chunksRequest = chunksIndex.getAllKeys(recordingId);
    
    await new Promise<void>((resolve, reject) => {
      chunksRequest.onsuccess = async () => {
        const keys = chunksRequest.result;
        for (const key of keys) {
          chunksStore.delete(key);
        }
        resolve();
      };
      chunksRequest.onerror = () => reject(chunksRequest.error);
    });

    // Delete metadata
    const metaTx = db.transaction(STORES.METADATA, 'readwrite');
    const metaStore = metaTx.objectStore(STORES.METADATA);
    await new Promise<void>((resolve, reject) => {
      const request = metaStore.delete(recordingId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Netflix pattern: cleanup old recovery data (7 days)
  async cleanupOldRecoveryData(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const cutoff = Date.now() - maxAgeMs;
    const allMetadata = await this.getAllMetadata();
    let deletedCount = 0;

    for (const meta of allMetadata) {
      if (meta.lastSaveTime < cutoff) {
        await this.deleteRecording(meta.id);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// ============================================================================
// RECOVERY MANAGER (TikTok pattern: fast crash recovery)
// ============================================================================

class RecoveryManager {
  private dbManager: IndexedDBManager;

  constructor(dbManager: IndexedDBManager) {
    this.dbManager = dbManager;
  }

  async checkForRecovery(): Promise<RecoveryData | null> {
    const allMetadata = await this.dbManager.getAllMetadata();
    
    // Find most recent incomplete recording
    const incomplete = allMetadata
      .filter(m => m.duration > 0)
      .sort((a, b) => b.lastSaveTime - a.lastSaveTime)[0];

    if (!incomplete) return null;

    const chunks = await this.dbManager.getChunksByRecordingId(incomplete.id);
    if (chunks.length === 0) return null;

    // Sort chunks by index
    chunks.sort((a, b) => a.index - b.index);

    return {
      id: incomplete.id,
      chunks: chunks.map(c => c.data),
      markers: incomplete.markers,
      startTime: incomplete.startTime,
      lastSaveTime: incomplete.lastSaveTime,
    };
  }

  async recoverRecording(data: RecoveryData): Promise<Blob> {
    // Combine all chunks into single blob
    return new Blob(data.chunks, { type: 'audio/webm' });
  }

  async clearRecoveryData(): Promise<void> {
    await this.dbManager.cleanupOldRecoveryData(0); // Delete all
  }
}

// ============================================================================
// LOCAL STORAGE UTILITIES (Spotify pattern: fast preferences)
// ============================================================================

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to remove ${key}:`, error);
  }
}

// ============================================================================
// SINGLETON EXPORTS
// ============================================================================

export const dbManager = new IndexedDBManager();
export const recoveryManager = new RecoveryManager(dbManager);

// Auto-cleanup on module load (background task)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    dbManager.cleanupOldRecoveryData().then(count => {
      if (count > 0) {
        console.log(`[Storage] Cleaned up ${count} old recovery files`);
      }
    }).catch(() => {
      // Silently fail - not critical
    });
  }, 5000);
}
