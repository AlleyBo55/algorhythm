// Recording Engine - VOD Export & Session Recording
// Patterns: Netflix (chunked recording), Spotify (high-quality export), TikTok (fast processing)

import type {
  RecordingConfig,
  RecordingState,
  RecordingMarker,
  RecoveryData,
  ExportFormat,
  MarkerExportFormat,
} from './types';
import { dbManager } from './storage';

// ============================================================================
// MARKER MANAGER (Spotify pattern: timestamped highlights)
// ============================================================================

class MarkerManager {
  private markers: RecordingMarker[] = [];

  addMarker(timestamp: number, label?: string): RecordingMarker {
    const marker: RecordingMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp,
      label,
      createdAt: new Date(),
    };
    this.markers.push(marker);
    this.markers.sort((a, b) => a.timestamp - b.timestamp);
    return marker;
  }

  removeMarker(id: string): boolean {
    const index = this.markers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.markers.splice(index, 1);
      return true;
    }
    return false;
  }

  getMarkers(): RecordingMarker[] {
    return [...this.markers];
  }

  clear(): void {
    this.markers = [];
  }

  // Export to JSON format
  exportJSON(): string {
    return JSON.stringify(this.markers, null, 2);
  }

  // Export to CUE format (for audio players)
  exportCUE(title: string = 'DJ Session'): string {
    const lines = [
      `TITLE "${title}"`,
      `FILE "recording.wav" WAVE`,
    ];

    this.markers.forEach((marker, index) => {
      const trackNum = String(index + 1).padStart(2, '0');
      const minutes = Math.floor(marker.timestamp / 60000);
      const seconds = Math.floor((marker.timestamp % 60000) / 1000);
      const frames = Math.floor(((marker.timestamp % 1000) / 1000) * 75);
      
      lines.push(`  TRACK ${trackNum} AUDIO`);
      lines.push(`    TITLE "${marker.label || `Marker ${index + 1}`}"`);
      lines.push(`    INDEX 01 ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`);
    });

    return lines.join('\n');
  }

  // Import from JSON
  importJSON(json: string): void {
    try {
      const imported = JSON.parse(json) as RecordingMarker[];
      this.markers = imported.map(m => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
      this.markers.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('[MarkerManager] Failed to import markers:', error);
    }
  }
}

// ============================================================================
// RECORDING ENGINE (Netflix pattern: chunked recording with recovery)
// ============================================================================

export class RecordingEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private markerManager: MarkerManager = new MarkerManager();
  private state: RecordingState = {
    status: 'idle',
    startTime: null,
    duration: 0,
    fileSize: 0,
    markers: [],
  };
  private config: RecordingConfig;
  private recordingId: string = '';
  private chunkIndex: number = 0;
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null;
  private durationInterval: ReturnType<typeof setInterval> | null = null;
  private subscribers: Set<(state: RecordingState) => void> = new Set();
  private stream: MediaStream | null = null;

  constructor(config: Partial<RecordingConfig> = {}) {
    this.config = {
      format: 'webm',
      bitrate: 320000,
      sampleRate: 48000,
      autoSaveInterval: 30000,
      maxDuration: 0,
      ...config,
    };
  }

  // ==========================================================================
  // RECORDING CONTROL
  // ==========================================================================

  async start(source?: MediaStream | AudioNode): Promise<void> {
    if (this.state.status !== 'idle') {
      throw new Error('Recording already in progress');
    }

    try {
      // Get audio stream
      if (source instanceof MediaStream) {
        this.stream = source;
      } else if (source instanceof AudioNode) {
        const context = source.context as AudioContext;
        const dest = context.createMediaStreamDestination();
        source.connect(dest);
        this.stream = dest.stream;
      } else {
        // Capture system audio (requires user permission)
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      // Create MediaRecorder
      const mimeType = this.getMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: this.config.bitrate,
      });

      // Setup event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          this.updateFileSize();
        }
      };

      this.mediaRecorder.onstop = () => {
        this.finalizeRecording();
      };

      // Initialize recording state
      this.recordingId = `rec-${Date.now()}`;
      this.chunkIndex = 0;
      this.chunks = [];
      this.markerManager.clear();

      // Start recording with timeslice for chunked data
      this.mediaRecorder.start(1000); // 1 second chunks

      // Update state
      this.updateState({
        status: 'recording',
        startTime: Date.now(),
        duration: 0,
        fileSize: 0,
        markers: [],
      });

      // Start duration tracking
      this.startDurationTracking();

      // Start auto-save
      this.startAutoSave();

      console.log('[RecordingEngine] Recording started');
    } catch (error) {
      console.error('[RecordingEngine] Failed to start recording:', error);
      throw error;
    }
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.state.status === 'idle') {
        reject(new Error('No recording in progress'));
        return;
      }

      const recorder = this.mediaRecorder;
      const originalOnStop = recorder.onstop;
      recorder.onstop = (event) => {
        if (originalOnStop) {
          originalOnStop.call(recorder, event);
        }
        const blob = new Blob(this.chunks, { type: this.getMimeType() });
        resolve(blob);
      };

      recorder.stop();
      this.stopAutoSave();
      this.stopDurationTracking();
    });
  }

  pause(): void {
    if (this.mediaRecorder && this.state.status === 'recording') {
      this.mediaRecorder.pause();
      this.updateState({ status: 'paused' });
      console.log('[RecordingEngine] Recording paused');
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.state.status === 'paused') {
      this.mediaRecorder.resume();
      this.updateState({ status: 'recording' });
      console.log('[RecordingEngine] Recording resumed');
    }
  }

  // ==========================================================================
  // MARKERS
  // ==========================================================================

  addMarker(label?: string): RecordingMarker {
    const timestamp = this.state.duration;
    const marker = this.markerManager.addMarker(timestamp, label);
    this.updateState({ markers: this.markerManager.getMarkers() });
    console.log(`[RecordingEngine] Marker added at ${timestamp}ms: ${label || 'unnamed'}`);
    return marker;
  }

  removeMarker(id: string): void {
    this.markerManager.removeMarker(id);
    this.updateState({ markers: this.markerManager.getMarkers() });
  }

  getMarkers(): RecordingMarker[] {
    return this.markerManager.getMarkers();
  }

  // ==========================================================================
  // EXPORT (Spotify pattern: multiple formats)
  // ==========================================================================

  async exportAs(format: ExportFormat): Promise<Blob> {
    if (this.chunks.length === 0) {
      throw new Error('No recording data available');
    }

    this.updateState({ status: 'processing' });

    try {
      const sourceBlob = new Blob(this.chunks, { type: this.getMimeType() });

      // For WebM, return directly
      if (format === 'webm') {
        this.updateState({ status: 'idle' });
        return sourceBlob;
      }

      // For WAV/MP3, we need to decode and re-encode
      // Note: Full conversion requires AudioContext decoding
      // For now, return WebM with correct extension hint
      console.warn(`[RecordingEngine] ${format} export requires audio conversion. Returning WebM.`);
      this.updateState({ status: 'idle' });
      return sourceBlob;
    } catch (error) {
      this.updateState({ status: 'idle' });
      throw error;
    }
  }

  exportMarkers(format: MarkerExportFormat): string {
    if (format === 'json') {
      return this.markerManager.exportJSON();
    } else {
      return this.markerManager.exportCUE();
    }
  }

  downloadRecording(filename: string = 'dj-session'): void {
    if (this.chunks.length === 0) {
      console.error('[RecordingEngine] No recording to download');
      return;
    }

    const blob = new Blob(this.chunks, { type: this.getMimeType() });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`[RecordingEngine] Downloaded: ${filename}.webm`);
  }

  // ==========================================================================
  // RECOVERY (TikTok pattern: crash recovery)
  // ==========================================================================

  async checkForRecovery(): Promise<RecoveryData | null> {
    try {
      const allMetadata = await dbManager.getAllMetadata();
      if (allMetadata.length === 0) return null;

      const latest = allMetadata.sort((a, b) => b.lastSaveTime - a.lastSaveTime)[0];
      const chunks = await dbManager.getChunksByRecordingId(latest.id);
      
      if (chunks.length === 0) return null;

      chunks.sort((a, b) => a.index - b.index);

      return {
        id: latest.id,
        chunks: chunks.map(c => c.data),
        markers: latest.markers,
        startTime: latest.startTime,
        lastSaveTime: latest.lastSaveTime,
      };
    } catch (error) {
      console.error('[RecordingEngine] Recovery check failed:', error);
      return null;
    }
  }

  async recoverRecording(data: RecoveryData): Promise<Blob> {
    this.chunks = data.chunks;
    this.markerManager.importJSON(JSON.stringify(data.markers));
    this.updateState({
      markers: this.markerManager.getMarkers(),
      duration: data.lastSaveTime - data.startTime,
    });
    return new Blob(data.chunks, { type: this.getMimeType() });
  }

  async clearRecoveryData(): Promise<void> {
    await dbManager.cleanupOldRecoveryData(0);
    console.log('[RecordingEngine] Recovery data cleared');
  }

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  getState(): RecordingState {
    return { ...this.state };
  }

  subscribe(callback: (state: RecordingState) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private updateState(updates: Partial<RecordingState>): void {
    this.state = { ...this.state, ...updates };
    for (const callback of this.subscribers) {
      callback(this.state);
    }
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private getMimeType(): string {
    // Check browser support
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return 'audio/webm';
  }

  private updateFileSize(): void {
    const size = this.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    this.updateState({ fileSize: size });
  }

  private startDurationTracking(): void {
    this.durationInterval = setInterval(() => {
      if (this.state.status === 'recording' && this.state.startTime) {
        const duration = Date.now() - this.state.startTime;
        this.updateState({ duration });

        // Check max duration
        if (this.config.maxDuration > 0 && duration >= this.config.maxDuration) {
          console.log('[RecordingEngine] Max duration reached, stopping');
          this.stop();
        }
      }
    }, 100);
  }

  private stopDurationTracking(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(async () => {
      await this.saveChunkToIndexedDB();
    }, this.config.autoSaveInterval);
  }

  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  private async saveChunkToIndexedDB(): Promise<void> {
    if (this.chunks.length === 0) return;

    try {
      // Save latest chunk
      const latestChunk = this.chunks[this.chunks.length - 1];
      await dbManager.saveChunk({
        id: `${this.recordingId}-chunk-${this.chunkIndex}`,
        recordingId: this.recordingId,
        index: this.chunkIndex++,
        data: latestChunk,
        timestamp: Date.now(),
      });

      // Save metadata
      await dbManager.saveMetadata({
        id: this.recordingId,
        startTime: this.state.startTime || Date.now(),
        lastSaveTime: Date.now(),
        duration: this.state.duration,
        format: this.config.format,
        markers: this.markerManager.getMarkers(),
      });

      console.log(`[RecordingEngine] Auto-saved chunk ${this.chunkIndex}`);
    } catch (error) {
      console.error('[RecordingEngine] Auto-save failed:', error);
    }
  }

  private finalizeRecording(): void {
    this.updateState({ status: 'idle' });
    
    // Cleanup stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    console.log('[RecordingEngine] Recording finalized');
  }

  dispose(): void {
    this.stopAutoSave();
    this.stopDurationTracking();
    if (this.mediaRecorder && this.state.status !== 'idle') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.chunks = [];
    this.markerManager.clear();
  }

  // Set audio stream for recording (used by integration)
  setAudioStream(stream: MediaStream): void {
    this.stream = stream;
    console.log('[RecordingEngine] Audio stream set');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const recordingEngine = new RecordingEngine();
