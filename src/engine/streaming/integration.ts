// Streaming Integration - Wiring all modules together
// Patterns: Spotify (event-driven), Netflix (resilience), OBS (real-time)

import { audioRouter } from './audioRouter';
import { recordingEngine } from './recordingEngine';
import { chatIntegration } from './chatIntegration';
import { commandParser } from './commandParser';
import { overlayRenderer } from './overlayRenderer';
import type { ChatMessage } from './types';

// ============================================================================
// INTEGRATION MANAGER
// ============================================================================

class StreamingIntegration {
  private isInitialized = false;
  private audioContext: AudioContext | null = null;
  private masterNode: AudioNode | null = null;
  private unsubscribers: (() => void)[] = [];

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  async initialize(audioContext: AudioContext, masterNode: AudioNode): Promise<void> {
    if (this.isInitialized) {
      console.log('[Integration] Already initialized');
      return;
    }

    this.audioContext = audioContext;
    this.masterNode = masterNode;

    // 16.1 Connect AudioRouter to MasterBus
    this.connectAudioRouter();

    // 16.2 Connect RecordingEngine to MasterBus
    this.connectRecordingEngine();

    // 16.3 Connect Chat → Parser → Queue → Effects
    this.connectChatPipeline();

    // 16.4 Connect EffectQueue to AudioEngine
    this.connectEffectQueue();

    // 16.5 Connect EffectQueue to OverlayRenderer
    this.connectNotifications();

    this.isInitialized = true;
    console.log('[Integration] All modules connected');
  }

  // ==========================================================================
  // 16.1 AUDIO ROUTER CONNECTION
  // ==========================================================================

  private connectAudioRouter(): void {
    if (!this.audioContext || !this.masterNode) return;

    // Create a channel for the master output
    const masterChannel = audioRouter.createChannel('master', 'Master Output');
    
    // Enable level monitoring
    audioRouter.enableLevelMonitoring(this.audioContext, this.masterNode);

    console.log('[Integration] AudioRouter connected to MasterBus');
  }

  // ==========================================================================
  // 16.2 RECORDING ENGINE CONNECTION
  // ==========================================================================

  private connectRecordingEngine(): void {
    if (!this.audioContext || !this.masterNode) return;

    // Create a MediaStreamDestination to capture audio
    const destination = this.audioContext.createMediaStreamDestination();
    this.masterNode.connect(destination);

    // Set the stream for recording
    recordingEngine.setAudioStream(destination.stream);

    console.log('[Integration] RecordingEngine connected to MasterBus');
  }

  // ==========================================================================
  // 16.3 CHAT PIPELINE CONNECTION
  // ==========================================================================

  private connectChatPipeline(): void {
    // Subscribe to chat messages
    const unsubTwitch = chatIntegration.onMessage((message: ChatMessage) => {
      this.processChatMessage(message);
    });

    this.unsubscribers.push(unsubTwitch);
    console.log('[Integration] Chat pipeline connected');
  }

  private processChatMessage(message: ChatMessage): void {
    // Route through command parser
    const success = commandParser.processMessage(message);
    
    if (success) {
      console.log(`[Integration] Command processed: ${message.message}`);
    }
  }

  // ==========================================================================
  // 16.4 EFFECT QUEUE TO AUDIO ENGINE
  // ==========================================================================

  private connectEffectQueue(): void {
    const effectQueue = commandParser.getEffectQueue();

    // Start processing effects
    effectQueue.startProcessing((effect) => {
      this.triggerEffect(effect.command.name, effect.command.parameters);
    });

    console.log('[Integration] EffectQueue connected to AudioEngine');
  }

  private triggerEffect(name: string, params: Record<string, unknown>): void {
    // Dispatch effect to audio engine
    // This would connect to the actual deck/effects system
    const effectHandlers: Record<string, () => void> = {
      drop: () => this.triggerBassDrop(),
      filter: () => this.triggerFilterSweep(params.type as string),
      reverb: () => this.triggerReverb(params.amount as number),
      delay: () => this.triggerDelay(params.time as number),
      scratch: () => this.triggerScratch(),
      airhorn: () => this.triggerAirhorn(),
      djstop: () => this.stopAllEffects(),
      bpm: () => this.showBPM(),
    };

    const handler = effectHandlers[name];
    if (handler) {
      handler();
      console.log(`[Integration] Effect triggered: ${name}`);
    }
  }

  // Effect implementations (stubs - connect to actual audio engine)
  private triggerBassDrop(): void {
    // Would trigger bass drop on active deck
    overlayRenderer.showNotification('🔊 BASS DROP!');
  }

  private triggerFilterSweep(type: string): void {
    overlayRenderer.showNotification(`🎛️ Filter: ${type}`);
  }

  private triggerReverb(amount: number): void {
    overlayRenderer.showNotification(`🌊 Reverb: ${amount}%`);
  }

  private triggerDelay(time: number): void {
    overlayRenderer.showNotification(`⏱️ Delay: ${time}ms`);
  }

  private triggerScratch(): void {
    overlayRenderer.showNotification('💿 Scratch!');
  }

  private triggerAirhorn(): void {
    overlayRenderer.showNotification('📢 AIRHORN!');
  }

  private stopAllEffects(): void {
    commandParser.getEffectQueue().clear();
    overlayRenderer.showNotification('🛑 All effects stopped');
  }

  private showBPM(): void {
    // Would get actual BPM from deck
    overlayRenderer.showNotification('🎵 BPM: 128');
  }

  // ==========================================================================
  // 16.5 NOTIFICATIONS CONNECTION
  // ==========================================================================

  private connectNotifications(): void {
    // Notifications are already connected via overlayRenderer.showNotification()
    // in the effect handlers above
    console.log('[Integration] Notifications connected');
  }

  // ==========================================================================
  // CLEANUP
  // ==========================================================================

  dispose(): void {
    // Stop effect queue processing
    commandParser.getEffectQueue().stopProcessing();

    // Unsubscribe from all events
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers = [];

    // Disconnect chat
    chatIntegration.disconnectAll();

    // Stop recording if active
    if (recordingEngine.getState().status === 'recording') {
      recordingEngine.stop();
    }

    this.isInitialized = false;
    console.log('[Integration] Disposed');
  }

  // ==========================================================================
  // STATUS
  // ==========================================================================

  getStatus(): {
    isInitialized: boolean;
    audioRouterActive: boolean;
    recordingActive: boolean;
    chatConnected: boolean;
    queueLength: number;
  } {
    return {
      isInitialized: this.isInitialized,
      audioRouterActive: audioRouter.getChannels().size > 0,
      recordingActive: recordingEngine.getState().status === 'recording',
      chatConnected: chatIntegration.getStatus('twitch') === 'connected' ||
                     chatIntegration.getStatus('youtube') === 'connected',
      queueLength: commandParser.getEffectQueue().getQueueLength(),
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const streamingIntegration = new StreamingIntegration();
