// Zustand Store for Streaming Integration
// Patterns: Spotify (state management), Netflix (real-time updates), TikTok (performance)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AudioChannel,
  AudioLevelMeter,
  VirtualAudioDevice,
  RecordingStatus,
  RecordingMarker,
  ThemeId,
  LayoutId,
  ChromaKeyColor,
  OverlayComponent,
  VisualizerConfig,
  NotificationConfig,
  ConnectionStatus,
  ChatPlatform,
  CommandDefinition,
  CooldownState,
  QueuedEffect,
} from '@/engine/streaming/types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '@/engine/streaming/storage';

// Type for saved preferences
interface SavedThemePreferences {
  currentTheme: ThemeId;
  currentLayout: LayoutId;
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface StreamingState {
  // Audio Router
  audioRouter: {
    channels: Map<string, AudioChannel>;
    virtualDevices: VirtualAudioDevice[];
    isRouting: boolean;
    error: string | null;
  };

  // Recording
  recording: {
    status: RecordingStatus;
    duration: number;
    fileSize: number;
    markers: RecordingMarker[];
    hasRecoveryData: boolean;
  };

  // Theme & Layout
  theme: {
    currentTheme: ThemeId;
    currentLayout: LayoutId;
    transparentMode: boolean;
    chromaKeyColor: ChromaKeyColor | null;
  };

  // Overlay
  overlay: {
    components: Map<string, OverlayComponent>;
    visualizerConfig: VisualizerConfig;
    notificationConfig: NotificationConfig;
    notifications: Array<{ id: string; message: string; username?: string; timestamp: number }>;
  };

  // Chat Integration
  chat: {
    twitchStatus: ConnectionStatus;
    youtubeStatus: ConnectionStatus;
    twitchChannel: string | null;
    youtubeStreamId: string | null;
    lastError: string | null;
  };

  // Commands
  commands: {
    definitions: Map<string, CommandDefinition>;
    cooldowns: Map<string, CooldownState>;
    globalCooldown: number;
    queue: QueuedEffect[];
    isProcessing: boolean;
  };
}

// ============================================================================
// ACTIONS INTERFACE
// ============================================================================

interface StreamingActions {
  // Audio Router Actions
  setAudioChannel: (id: string, channel: Partial<AudioChannel>) => void;
  updateChannelMeter: (id: string, meter: AudioLevelMeter) => void;
  setVirtualDevices: (devices: VirtualAudioDevice[]) => void;
  setRouting: (enabled: boolean) => void;
  setRoutingError: (error: string | null) => void;

  // Recording Actions
  setRecordingStatus: (status: RecordingStatus) => void;
  setRecordingDuration: (duration: number) => void;
  setRecordingFileSize: (size: number) => void;
  addMarker: (marker: RecordingMarker) => void;
  removeMarker: (id: string) => void;
  clearMarkers: () => void;
  setHasRecoveryData: (has: boolean) => void;

  // Theme Actions
  setTheme: (theme: ThemeId) => void;
  setLayout: (layout: LayoutId) => void;
  setTransparentMode: (enabled: boolean, color?: ChromaKeyColor) => void;

  // Overlay Actions
  addOverlayComponent: (component: OverlayComponent) => void;
  updateOverlayComponent: (id: string, updates: Partial<OverlayComponent>) => void;
  removeOverlayComponent: (id: string) => void;
  setVisualizerConfig: (config: Partial<VisualizerConfig>) => void;
  setNotificationConfig: (config: Partial<NotificationConfig>) => void;
  addNotification: (message: string, username?: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Chat Actions
  setChatStatus: (platform: ChatPlatform, status: ConnectionStatus) => void;
  setTwitchChannel: (channel: string | null) => void;
  setYouTubeStreamId: (streamId: string | null) => void;
  setChatError: (error: string | null) => void;

  // Command Actions
  registerCommand: (definition: CommandDefinition) => void;
  unregisterCommand: (name: string) => void;
  setCommandEnabled: (name: string, enabled: boolean) => void;
  updateCooldown: (command: string, state: CooldownState | null) => void;
  setGlobalCooldown: (ms: number) => void;
  enqueueEffect: (effect: QueuedEffect) => void;
  dequeueEffect: () => QueuedEffect | undefined;
  clearQueue: () => void;
  setProcessing: (processing: boolean) => void;

  // Persistence
  savePreferences: () => void;
  loadPreferences: () => void;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultVisualizerConfig: VisualizerConfig = {
  type: 'frequency-bars',
  colors: ['#00ff88', '#00ccff', '#ff00ff'],
  intensity: 75,
  smoothing: 0.8,
  barCount: 64,
  lineWidth: 2,
};

const defaultNotificationConfig: NotificationConfig = {
  duration: 3000,
  position: 'top-right',
  maxVisible: 5,
  animation: 'slide',
};

// ============================================================================
// STORE CREATION
// ============================================================================

export const useStreamingStore = create<StreamingState & StreamingActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    audioRouter: {
      channels: new Map(),
      virtualDevices: [],
      isRouting: false,
      error: null,
    },

    recording: {
      status: 'idle',
      duration: 0,
      fileSize: 0,
      markers: [],
      hasRecoveryData: false,
    },

    theme: {
      currentTheme: 'dark',
      currentLayout: 'landscape-16-9',
      transparentMode: false,
      chromaKeyColor: null,
    },

    overlay: {
      components: new Map(),
      visualizerConfig: defaultVisualizerConfig,
      notificationConfig: defaultNotificationConfig,
      notifications: [],
    },

    chat: {
      twitchStatus: 'disconnected',
      youtubeStatus: 'disconnected',
      twitchChannel: null,
      youtubeStreamId: null,
      lastError: null,
    },

    commands: {
      definitions: new Map(),
      cooldowns: new Map(),
      globalCooldown: 5000,
      queue: [],
      isProcessing: false,
    },

    // ========================================================================
    // AUDIO ROUTER ACTIONS
    // ========================================================================

    setAudioChannel: (id, channel) => set(state => {
      const channels = new Map(state.audioRouter.channels);
      const existing = channels.get(id);
      channels.set(id, { ...existing, ...channel } as AudioChannel);
      return { audioRouter: { ...state.audioRouter, channels } };
    }),

    updateChannelMeter: (id, meter) => set(state => {
      const channels = new Map(state.audioRouter.channels);
      const channel = channels.get(id);
      if (channel) {
        channels.set(id, { ...channel, meter });
      }
      return { audioRouter: { ...state.audioRouter, channels } };
    }),

    setVirtualDevices: (devices) => set(state => ({
      audioRouter: { ...state.audioRouter, virtualDevices: devices }
    })),

    setRouting: (enabled) => set(state => ({
      audioRouter: { ...state.audioRouter, isRouting: enabled }
    })),

    setRoutingError: (error) => set(state => ({
      audioRouter: { ...state.audioRouter, error }
    })),

    // ========================================================================
    // RECORDING ACTIONS
    // ========================================================================

    setRecordingStatus: (status) => set(state => ({
      recording: { ...state.recording, status }
    })),

    setRecordingDuration: (duration) => set(state => ({
      recording: { ...state.recording, duration }
    })),

    setRecordingFileSize: (size) => set(state => ({
      recording: { ...state.recording, fileSize: size }
    })),

    addMarker: (marker) => set(state => ({
      recording: { 
        ...state.recording, 
        markers: [...state.recording.markers, marker].sort((a, b) => a.timestamp - b.timestamp)
      }
    })),

    removeMarker: (id) => set(state => ({
      recording: { 
        ...state.recording, 
        markers: state.recording.markers.filter(m => m.id !== id)
      }
    })),

    clearMarkers: () => set(state => ({
      recording: { ...state.recording, markers: [] }
    })),

    setHasRecoveryData: (has) => set(state => ({
      recording: { ...state.recording, hasRecoveryData: has }
    })),

    // ========================================================================
    // THEME ACTIONS
    // ========================================================================

    setTheme: (theme) => set(state => {
      const newState = { theme: { ...state.theme, currentTheme: theme } };
      get().savePreferences();
      return newState;
    }),

    setLayout: (layout) => set(state => {
      const newState = { theme: { ...state.theme, currentLayout: layout } };
      get().savePreferences();
      return newState;
    }),

    setTransparentMode: (enabled, color) => set(state => ({
      theme: { 
        ...state.theme, 
        transparentMode: enabled,
        chromaKeyColor: enabled ? (color || '#00FF00') : null
      }
    })),

    // ========================================================================
    // OVERLAY ACTIONS
    // ========================================================================

    addOverlayComponent: (component) => set(state => {
      const components = new Map(state.overlay.components);
      components.set(component.id, component);
      return { overlay: { ...state.overlay, components } };
    }),

    updateOverlayComponent: (id, updates) => set(state => {
      const components = new Map(state.overlay.components);
      const existing = components.get(id);
      if (existing) {
        components.set(id, { ...existing, ...updates });
      }
      return { overlay: { ...state.overlay, components } };
    }),

    removeOverlayComponent: (id) => set(state => {
      const components = new Map(state.overlay.components);
      components.delete(id);
      return { overlay: { ...state.overlay, components } };
    }),

    setVisualizerConfig: (config) => set(state => ({
      overlay: { 
        ...state.overlay, 
        visualizerConfig: { ...state.overlay.visualizerConfig, ...config }
      }
    })),

    setNotificationConfig: (config) => set(state => ({
      overlay: { 
        ...state.overlay, 
        notificationConfig: { ...state.overlay.notificationConfig, ...config }
      }
    })),

    addNotification: (message, username) => set(state => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const notification = { id, message, username, timestamp: Date.now() };
      const notifications = [...state.overlay.notifications, notification]
        .slice(-state.overlay.notificationConfig.maxVisible);
      return { overlay: { ...state.overlay, notifications } };
    }),

    removeNotification: (id) => set(state => ({
      overlay: { 
        ...state.overlay, 
        notifications: state.overlay.notifications.filter(n => n.id !== id)
      }
    })),

    clearNotifications: () => set(state => ({
      overlay: { ...state.overlay, notifications: [] }
    })),

    // ========================================================================
    // CHAT ACTIONS
    // ========================================================================

    setChatStatus: (platform, status) => set(state => ({
      chat: { 
        ...state.chat, 
        [platform === 'twitch' ? 'twitchStatus' : 'youtubeStatus']: status 
      }
    })),

    setTwitchChannel: (channel) => set(state => ({
      chat: { ...state.chat, twitchChannel: channel }
    })),

    setYouTubeStreamId: (streamId) => set(state => ({
      chat: { ...state.chat, youtubeStreamId: streamId }
    })),

    setChatError: (error) => set(state => ({
      chat: { ...state.chat, lastError: error }
    })),

    // ========================================================================
    // COMMAND ACTIONS
    // ========================================================================

    registerCommand: (definition) => set(state => {
      const definitions = new Map(state.commands.definitions);
      definitions.set(definition.name.toLowerCase(), definition);
      // Also register aliases
      for (const alias of definition.aliases) {
        definitions.set(alias.toLowerCase(), definition);
      }
      return { commands: { ...state.commands, definitions } };
    }),

    unregisterCommand: (name) => set(state => {
      const definitions = new Map(state.commands.definitions);
      const cmd = definitions.get(name.toLowerCase());
      if (cmd) {
        definitions.delete(cmd.name.toLowerCase());
        for (const alias of cmd.aliases) {
          definitions.delete(alias.toLowerCase());
        }
      }
      return { commands: { ...state.commands, definitions } };
    }),

    setCommandEnabled: (name, enabled) => set(state => {
      const definitions = new Map(state.commands.definitions);
      const cmd = definitions.get(name.toLowerCase());
      if (cmd) {
        definitions.set(cmd.name.toLowerCase(), { ...cmd, enabled });
      }
      return { commands: { ...state.commands, definitions } };
    }),

    updateCooldown: (command, cooldownState) => set(state => {
      const cooldowns = new Map(state.commands.cooldowns);
      if (cooldownState) {
        cooldowns.set(command.toLowerCase(), cooldownState);
      } else {
        cooldowns.delete(command.toLowerCase());
      }
      return { commands: { ...state.commands, cooldowns } };
    }),

    setGlobalCooldown: (ms) => set(state => ({
      commands: { ...state.commands, globalCooldown: ms }
    })),

    enqueueEffect: (effect) => set(state => {
      const queue = [...state.commands.queue, effect];
      return { commands: { ...state.commands, queue } };
    }),

    dequeueEffect: () => {
      const state = get();
      if (state.commands.queue.length === 0) return undefined;
      const [first, ...rest] = state.commands.queue;
      set({ commands: { ...state.commands, queue: rest } });
      return first;
    },

    clearQueue: () => set(state => ({
      commands: { ...state.commands, queue: [] }
    })),

    setProcessing: (processing) => set(state => ({
      commands: { ...state.commands, isProcessing: processing }
    })),

    // ========================================================================
    // PERSISTENCE
    // ========================================================================

    savePreferences: () => {
      const state = get();
      saveToLocalStorage(STORAGE_KEYS.THEME_PREFERENCES, {
        currentTheme: state.theme.currentTheme,
        currentLayout: state.theme.currentLayout,
      });
    },

    loadPreferences: () => {
      const saved = loadFromLocalStorage<SavedThemePreferences | null>(STORAGE_KEYS.THEME_PREFERENCES, null);
      if (saved) {
        set(state => ({
          theme: { 
            ...state.theme, 
            currentTheme: saved.currentTheme || 'dark',
            currentLayout: saved.currentLayout || 'landscape-16-9',
          }
        }));
      }
    },
  }))
);

// ============================================================================
// SELECTORS (Spotify pattern: memoized selectors)
// ============================================================================

export const selectIsRecording = (state: StreamingState) => 
  state.recording.status === 'recording';

export const selectIsChatConnected = (state: StreamingState) => 
  state.chat.twitchStatus === 'connected' || state.chat.youtubeStatus === 'connected';

export const selectQueueLength = (state: StreamingState) => 
  state.commands.queue.length;

export const selectActiveNotifications = (state: StreamingState) => 
  state.overlay.notifications;

// Auto-load preferences on module init
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useStreamingStore.getState().loadPreferences();
  }, 0);
}
