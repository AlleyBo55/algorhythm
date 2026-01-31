// Audio Router - OBS/Streamlabs Integration
// Patterns: Spotify (multi-output), Netflix (adaptive routing), OBS (virtual devices)

import type {
  AudioChannel,
  AudioLevelMeter,
  VirtualAudioDevice,
  VirtualDeviceType,
  AudioRouterConfig,
} from './types';

// ============================================================================
// VIRTUAL DEVICE DETECTION (OBS pattern)
// ============================================================================

const VIRTUAL_DEVICE_PATTERNS: Record<VirtualDeviceType, RegExp[]> = {
  'vb-cable': [/vb-cable/i, /virtual cable/i, /vb-audio/i],
  'blackhole': [/blackhole/i, /black hole/i],
  'voicemeeter': [/voicemeeter/i, /voice meeter/i, /vb-audio voicemeeter/i],
  'obs-virtual': [/obs/i, /obs-camera/i, /obs virtual/i],
  'unknown': [],
};

function detectDeviceType(name: string): VirtualDeviceType {
  for (const [type, patterns] of Object.entries(VIRTUAL_DEVICE_PATTERNS)) {
    if (type === 'unknown') continue;
    for (const pattern of patterns) {
      if (pattern.test(name)) {
        return type as VirtualDeviceType;
      }
    }
  }
  return 'unknown';
}

function isVirtualDevice(device: MediaDeviceInfo): boolean {
  const name = device.label.toLowerCase();
  return (
    name.includes('virtual') ||
    name.includes('vb-') ||
    name.includes('blackhole') ||
    name.includes('voicemeeter') ||
    name.includes('obs') ||
    name.includes('cable')
  );
}

// ============================================================================
// AUDIO LEVEL METER (Spotify pattern: real-time metering)
// ============================================================================

class AudioLevelMeterImpl {
  private analyser: AnalyserNode | null = null;
  private dataArray: Float32Array<ArrayBuffer> | null = null;
  private peak: number = -60;
  private peakTimestamp: number = 0;
  private peakHoldDuration: number = 3000;

  constructor(context: AudioContext, source: AudioNode, peakHoldDuration: number = 3000) {
    this.peakHoldDuration = peakHoldDuration;
    this.analyser = context.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.3;
    this.dataArray = new Float32Array(this.analyser.frequencyBinCount) as Float32Array<ArrayBuffer>;
    source.connect(this.analyser);
  }

  getLevel(): AudioLevelMeter {
    if (!this.analyser || !this.dataArray) {
      return this.createDefaultMeter();
    }

    this.analyser.getFloatTimeDomainData(this.dataArray);
    
    // Calculate RMS level
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    const rms = Math.sqrt(sum / this.dataArray.length);
    
    // Convert to dB (with floor at -60dB)
    const db = Math.max(-60, 20 * Math.log10(rms + 0.0001));
    
    // Update peak with hold
    const now = Date.now();
    if (db > this.peak || now - this.peakTimestamp > this.peakHoldDuration) {
      this.peak = db;
      this.peakTimestamp = now;
    }

    return {
      current: db,
      peak: this.peak,
      peakTimestamp: this.peakTimestamp,
      isWarning: db > -3,
      isClipping: db > 0,
    };
  }

  private createDefaultMeter(): AudioLevelMeter {
    return {
      current: -60,
      peak: -60,
      peakTimestamp: Date.now(),
      isWarning: false,
      isClipping: false,
    };
  }

  dispose(): void {
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    this.dataArray = null;
  }
}

// ============================================================================
// AUDIO CHANNEL (Netflix pattern: independent channel management)
// ============================================================================

class AudioChannelImpl {
  readonly id: string;
  readonly name: string;
  private gainNode: GainNode;
  private meter: AudioLevelMeterImpl;
  private _deviceId: string = 'default';
  private _muted: boolean = false;
  private _volume: number = 1;

  constructor(
    id: string,
    name: string,
    context: AudioContext,
    source: AudioNode,
    peakHoldDuration: number
  ) {
    this.id = id;
    this.name = name;
    this.gainNode = context.createGain();
    source.connect(this.gainNode);
    this.meter = new AudioLevelMeterImpl(context, this.gainNode, peakHoldDuration);
  }

  get deviceId(): string { return this._deviceId; }
  set deviceId(id: string) { this._deviceId = id; }

  get volume(): number { return this._volume; }
  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    this.gainNode.gain.value = this._muted ? 0 : this._volume;
  }

  get muted(): boolean { return this._muted; }
  set muted(m: boolean) {
    this._muted = m;
    this.gainNode.gain.value = m ? 0 : this._volume;
  }

  getLevel(): AudioLevelMeter {
    return this.meter.getLevel();
  }

  getOutput(): GainNode {
    return this.gainNode;
  }

  toJSON(): AudioChannel {
    return {
      id: this.id,
      name: this.name,
      deviceId: this._deviceId,
      volume: this._volume,
      muted: this._muted,
      meter: this.getLevel(),
    };
  }

  dispose(): void {
    this.meter.dispose();
    this.gainNode.disconnect();
  }
}

// ============================================================================
// AUDIO ROUTER (Main class - OBS/Streamlabs integration)
// ============================================================================

export class AudioRouter {
  private context: AudioContext | null = null;
  private channels: Map<string, AudioChannelImpl> = new Map();
  private virtualDevices: VirtualAudioDevice[] = [];
  private isRouting: boolean = false;
  private config: AudioRouterConfig;
  private levelCallbacks: Set<(levels: Map<string, AudioLevelMeter>) => void> = new Set();
  private levelInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<AudioRouterConfig> = {}) {
    this.config = {
      primaryOutput: 'default',
      enableLevelMonitoring: true,
      peakHoldDuration: 3000,
      ...config,
    };
  }

  // ==========================================================================
  // DEVICE DETECTION (OBS pattern)
  // ==========================================================================

  async detectVirtualDevices(): Promise<VirtualAudioDevice[]> {
    try {
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
      
      this.virtualDevices = audioOutputs
        .filter(isVirtualDevice)
        .map(device => ({
          id: device.deviceId,
          name: device.label || 'Unknown Virtual Device',
          type: detectDeviceType(device.label),
          sampleRate: 48000, // Default, actual rate determined at runtime
          channels: 2,
        }));

      console.log(`[AudioRouter] Detected ${this.virtualDevices.length} virtual devices`);
      return this.virtualDevices;
    } catch (error) {
      console.error('[AudioRouter] Failed to detect devices:', error);
      return [];
    }
  }

  async getAvailableOutputs(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'audiooutput');
    } catch (error) {
      console.error('[AudioRouter] Failed to get outputs:', error);
      return [];
    }
  }

  getVirtualDevices(): VirtualAudioDevice[] {
    return [...this.virtualDevices];
  }

  // ==========================================================================
  // CHANNEL MANAGEMENT (Netflix pattern)
  // ==========================================================================

  createChannel(
    id: string,
    name: string,
    source?: AudioNode
  ): AudioChannel {
    if (this.channels.has(id)) {
      return this.channels.get(id)!.toJSON();
    }

    // If no context or source, create a placeholder channel
    if (!this.context || !source) {
      const placeholderChannel: AudioChannel = {
        id,
        name,
        deviceId: 'default',
        volume: 1,
        muted: false,
        meter: {
          current: -60,
          peak: -60,
          peakTimestamp: Date.now(),
          isWarning: false,
          isClipping: false,
        },
      };
      console.log(`[AudioRouter] Created placeholder channel: ${name}`);
      return placeholderChannel;
    }

    const channel = new AudioChannelImpl(
      id,
      name,
      this.context,
      source,
      this.config.peakHoldDuration
    );

    this.channels.set(id, channel);
    console.log(`[AudioRouter] Created channel: ${name}`);
    
    return channel.toJSON();
  }

  removeChannel(id: string): void {
    const channel = this.channels.get(id);
    if (channel) {
      channel.dispose();
      this.channels.delete(id);
      console.log(`[AudioRouter] Removed channel: ${id}`);
    }
  }

  getChannel(id: string): AudioChannel | undefined {
    return this.channels.get(id)?.toJSON();
  }

  getAllChannels(): AudioChannel[] {
    return Array.from(this.channels.values()).map(c => c.toJSON());
  }

  // ==========================================================================
  // ROUTING (OBS pattern: device assignment)
  // ==========================================================================

  async setOutputDevice(channelId: string, deviceId: string): Promise<void> {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }

    // Verify device exists
    const devices = await this.getAvailableOutputs();
    const device = devices.find(d => d.deviceId === deviceId);
    if (!device && deviceId !== 'default') {
      throw new Error(`Device ${deviceId} not found`);
    }

    channel.deviceId = deviceId;
    
    // If using setSinkId (Chrome), apply it
    // Note: This requires the audio element approach for full device routing
    console.log(`[AudioRouter] Set channel ${channelId} output to ${device?.label || 'default'}`);
  }

  // ==========================================================================
  // VOLUME CONTROL (Spotify pattern)
  // ==========================================================================

  setChannelVolume(channelId: string, volume: number): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.volume = volume;
    }
  }

  setChannelMute(channelId: string, muted: boolean): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.muted = muted;
    }
  }

  // ==========================================================================
  // LEVEL MONITORING (TikTok pattern: real-time updates)
  // ==========================================================================

  getLevels(channelId: string): AudioLevelMeter | undefined {
    return this.channels.get(channelId)?.getLevel();
  }

  getAllLevels(): Map<string, AudioLevelMeter> {
    const levels = new Map<string, AudioLevelMeter>();
    for (const [id, channel] of this.channels) {
      levels.set(id, channel.getLevel());
    }
    return levels;
  }

  subscribeToLevels(callback: (levels: Map<string, AudioLevelMeter>) => void): () => void {
    this.levelCallbacks.add(callback);
    
    // Start level monitoring if not already running
    if (!this.levelInterval && this.config.enableLevelMonitoring) {
      this.startLevelMonitoring();
    }

    return () => {
      this.levelCallbacks.delete(callback);
      if (this.levelCallbacks.size === 0) {
        this.stopLevelMonitoring();
      }
    };
  }

  private startLevelMonitoring(): void {
    this.levelInterval = setInterval(() => {
      const levels = this.getAllLevels();
      for (const callback of this.levelCallbacks) {
        callback(levels);
      }
    }, 50); // 20fps for smooth meters
  }

  private stopLevelMonitoring(): void {
    if (this.levelInterval) {
      clearInterval(this.levelInterval);
      this.levelInterval = null;
    }
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  async init(context?: AudioContext): Promise<void> {
    this.context = context || new AudioContext({ sampleRate: 48000 });
    await this.detectVirtualDevices();
    this.isRouting = true;
    console.log('[AudioRouter] Initialized');
  }

  getIsRouting(): boolean {
    return this.isRouting;
  }

  setRouting(enabled: boolean): void {
    this.isRouting = enabled;
  }

  getChannels(): Map<string, AudioChannel> {
    const result = new Map<string, AudioChannel>();
    for (const [id, channel] of this.channels) {
      result.set(id, channel.toJSON());
    }
    return result;
  }

  enableLevelMonitoring(context: AudioContext, source: AudioNode): void {
    this.context = context;
    // Create a master channel for monitoring if it doesn't exist
    if (!this.channels.has('master')) {
      const channel = new AudioChannelImpl(
        'master',
        'Master Output',
        context,
        source,
        this.config.peakHoldDuration
      );
      this.channels.set('master', channel);
    }
    this.startLevelMonitoring();
    console.log('[AudioRouter] Level monitoring enabled');
  }

  dispose(): void {
    this.stopLevelMonitoring();
    for (const channel of this.channels.values()) {
      channel.dispose();
    }
    this.channels.clear();
    this.isRouting = false;
    console.log('[AudioRouter] Disposed');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const audioRouter = new AudioRouter();
