// Overlay Renderer - Visual Overlays & Notifications
// Patterns: OBS (overlay system), Spotify (now playing), TikTok (notifications)

import type {
  OverlayComponent,
  OverlayComponentType,
  VisualizerConfig,
  VisualizerType,
  NotificationConfig,
  NotificationPosition,
} from './types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from './storage';

// Type for saved layout
interface SavedLayout {
  components: [string, OverlayComponent][];
  visualizerConfig: VisualizerConfig;
  notificationConfig: NotificationConfig;
}

// ============================================================================
// NOTIFICATION QUEUE (TikTok pattern: sequential notifications)
// ============================================================================

interface Notification {
  id: string;
  message: string;
  username?: string;
  timestamp: number;
  expiresAt: number;
}

class NotificationQueue {
  private queue: Notification[] = [];
  private config: NotificationConfig = {
    duration: 3000,
    position: 'top-right',
    maxVisible: 5,
    animation: 'slide',
  };
  private subscribers: Set<(notifications: Notification[]) => void> = new Set();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startCleanup();
  }

  setConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  add(message: string, username?: string): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      message,
      username,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.duration,
    };

    this.queue.push(notification);
    
    // Trim to max visible
    while (this.queue.length > this.config.maxVisible) {
      this.queue.shift();
    }

    this.notifySubscribers();
    return notification;
  }

  remove(id: string): void {
    this.queue = this.queue.filter(n => n.id !== id);
    this.notifySubscribers();
  }

  clear(): void {
    this.queue = [];
    this.notifySubscribers();
  }

  getAll(): Notification[] {
    return [...this.queue];
  }

  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    for (const callback of this.subscribers) {
      callback(this.getAll());
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const before = this.queue.length;
      this.queue = this.queue.filter(n => n.expiresAt > now);
      if (this.queue.length !== before) {
        this.notifySubscribers();
      }
    }, 100);
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// ============================================================================
// OVERLAY RENDERER (OBS pattern: component management)
// ============================================================================

export class OverlayRenderer {
  private components: Map<string, OverlayComponent> = new Map();
  private visualizerConfig: VisualizerConfig = {
    type: 'frequency-bars',
    colors: ['#00ff88', '#00ccff', '#ff00ff'],
    intensity: 75,
    smoothing: 0.8,
    barCount: 64,
    lineWidth: 2,
  };
  private notificationQueue: NotificationQueue = new NotificationQueue();
  private subscribers: Set<() => void> = new Set();
  private audioAnalyser: AnalyserNode | null = null;
  private isIdle: boolean = true;

  constructor() {
    this.loadLayout();
    this.initializeDefaultComponents();
  }

  // ==========================================================================
  // COMPONENT MANAGEMENT
  // ==========================================================================

  addComponent(type: OverlayComponentType, config?: Partial<OverlayComponent>): OverlayComponent {
    const id = config?.id || `${type}-${Date.now()}`;
    
    const component: OverlayComponent = {
      id,
      type,
      position: config?.position || { x: 0, y: 0 },
      size: config?.size || this.getDefaultSize(type),
      visible: config?.visible ?? true,
      config: config?.config || {},
    };

    this.components.set(id, component);
    this.notifySubscribers();
    this.saveLayout();
    
    return component;
  }

  removeComponent(id: string): void {
    this.components.delete(id);
    this.notifySubscribers();
    this.saveLayout();
  }

  updateComponent(id: string, updates: Partial<OverlayComponent>): void {
    const component = this.components.get(id);
    if (component) {
      Object.assign(component, updates);
      this.notifySubscribers();
      this.saveLayout();
    }
  }

  getComponent(id: string): OverlayComponent | undefined {
    return this.components.get(id);
  }

  getAllComponents(): OverlayComponent[] {
    return Array.from(this.components.values());
  }

  // ==========================================================================
  // VISIBILITY
  // ==========================================================================

  showComponent(id: string): void {
    this.updateComponent(id, { visible: true });
  }

  hideComponent(id: string): void {
    this.updateComponent(id, { visible: false });
  }

  toggleComponent(id: string): void {
    const component = this.components.get(id);
    if (component) {
      this.updateComponent(id, { visible: !component.visible });
    }
  }

  // ==========================================================================
  // POSITIONING
  // ==========================================================================

  moveComponent(id: string, x: number, y: number): void {
    this.updateComponent(id, { position: { x, y } });
  }

  resizeComponent(id: string, width: number, height: number): void {
    this.updateComponent(id, { size: { width, height } });
  }

  // ==========================================================================
  // VISUALIZERS
  // ==========================================================================

  setVisualizerConfig(config: Partial<VisualizerConfig>): void {
    this.visualizerConfig = { ...this.visualizerConfig, ...config };
    
    // Clamp intensity to 0-100
    this.visualizerConfig.intensity = Math.max(0, Math.min(100, this.visualizerConfig.intensity));
    
    this.notifySubscribers();
    this.saveLayout();
  }

  getVisualizerConfig(): VisualizerConfig {
    return { ...this.visualizerConfig };
  }

  setAudioSource(analyser: AnalyserNode): void {
    this.audioAnalyser = analyser;
  }

  getVisualizerData(): { frequencies: Uint8Array; waveform: Uint8Array } | null {
    if (!this.audioAnalyser) return null;

    const frequencies = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    const waveform = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    
    this.audioAnalyser.getByteFrequencyData(frequencies);
    this.audioAnalyser.getByteTimeDomainData(waveform);

    // Check if audio is playing (not idle)
    const sum = frequencies.reduce((a, b) => a + b, 0);
    this.isIdle = sum < 100;

    return { frequencies, waveform };
  }

  isVisualizerIdle(): boolean {
    return this.isIdle;
  }

  // ==========================================================================
  // NOTIFICATIONS
  // ==========================================================================

  showNotification(message: string, username?: string): void {
    this.notificationQueue.add(message, username);
  }

  setNotificationConfig(config: Partial<NotificationConfig>): void {
    this.notificationQueue.setConfig(config);
    this.saveLayout();
  }

  getNotificationConfig(): NotificationConfig {
    return this.notificationQueue.getConfig();
  }

  clearNotifications(): void {
    this.notificationQueue.clear();
  }

  subscribeToNotifications(callback: (notifications: Notification[]) => void): () => void {
    return this.notificationQueue.subscribe(callback);
  }

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  saveLayout(): void {
    const layout = {
      components: Array.from(this.components.entries()),
      visualizerConfig: this.visualizerConfig,
      notificationConfig: this.notificationQueue.getConfig(),
    };
    saveToLocalStorage(STORAGE_KEYS.OVERLAY_LAYOUT, layout);
  }

  loadLayout(): void {
    const saved = loadFromLocalStorage<SavedLayout | null>(STORAGE_KEYS.OVERLAY_LAYOUT, null);
    if (saved) {
      if (saved.components) {
        this.components = new Map(saved.components);
      }
      if (saved.visualizerConfig) {
        this.visualizerConfig = saved.visualizerConfig;
      }
      if (saved.notificationConfig) {
        this.notificationQueue.setConfig(saved.notificationConfig);
      }
    }
  }

  resetLayout(): void {
    this.components.clear();
    this.initializeDefaultComponents();
    this.visualizerConfig = {
      type: 'frequency-bars',
      colors: ['#00ff88', '#00ccff', '#ff00ff'],
      intensity: 75,
      smoothing: 0.8,
      barCount: 64,
      lineWidth: 2,
    };
    this.saveLayout();
    this.notifySubscribers();
  }

  // ==========================================================================
  // SUBSCRIPTIONS
  // ==========================================================================

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    for (const callback of this.subscribers) {
      callback();
    }
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private initializeDefaultComponents(): void {
    // Now Playing
    this.addComponent('now-playing', {
      id: 'now-playing',
      position: { x: 20, y: 20 },
      size: { width: 350, height: 80 },
      visible: true,
      config: { showAlbumArt: true },
    });

    // BPM Display
    this.addComponent('bpm-display', {
      id: 'bpm-display',
      position: { x: 20, y: 110 },
      size: { width: 100, height: 50 },
      visible: true,
    });

    // Visualizer
    this.addComponent('visualizer', {
      id: 'visualizer',
      position: { x: 0, y: 60 },
      size: { width: 100, height: 30 }, // Percentage
      visible: true,
      config: { type: 'frequency-bars' },
    });

    // Chat Notifications
    this.addComponent('chat-notification', {
      id: 'chat-notification',
      position: { x: 80, y: 5 },
      size: { width: 18, height: 30 }, // Percentage
      visible: true,
    });
  }

  private getDefaultSize(type: OverlayComponentType): { width: number; height: number } {
    const defaults: Record<OverlayComponentType, { width: number; height: number }> = {
      'now-playing': { width: 350, height: 80 },
      'bpm-display': { width: 100, height: 50 },
      'waveform': { width: 400, height: 100 },
      'time-elapsed': { width: 150, height: 40 },
      'next-track': { width: 300, height: 60 },
      'visualizer': { width: 100, height: 30 },
      'chat-notification': { width: 300, height: 200 },
    };
    return defaults[type] || { width: 200, height: 100 };
  }

  dispose(): void {
    this.notificationQueue.dispose();
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const overlayRenderer = new OverlayRenderer();
