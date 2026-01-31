// Chat Integration - Twitch & YouTube Live Chat
// Patterns: Twitch (IRC WebSocket), YouTube (polling API), Discord (real-time)

import type {
  ChatMessage,
  ChatPlatform,
  ConnectionStatus,
  TwitchConfig,
  YouTubeConfig,
} from './types';

// ============================================================================
// TWITCH IRC PARSER (Twitch pattern: IRC message parsing)
// ============================================================================

interface TwitchTags {
  badges: string[];
  color: string;
  displayName: string;
  emotes: string;
  id: string;
  mod: boolean;
  subscriber: boolean;
  turbo: boolean;
  userId: string;
}

function parseTwitchMessage(raw: string): { tags: TwitchTags; command: string; channel: string; message: string } | null {
  // Parse IRC message format: @tags :user!user@user.tmi.twitch.tv PRIVMSG #channel :message
  const tagMatch = raw.match(/^@([^ ]+) /);
  const tags: TwitchTags = {
    badges: [],
    color: '',
    displayName: '',
    emotes: '',
    id: '',
    mod: false,
    subscriber: false,
    turbo: false,
    userId: '',
  };

  if (tagMatch) {
    const tagPairs = tagMatch[1].split(';');
    for (const pair of tagPairs) {
      const [key, value] = pair.split('=');
      switch (key) {
        case 'badges':
          tags.badges = value ? value.split(',').map(b => b.split('/')[0]) : [];
          break;
        case 'color':
          tags.color = value || '';
          break;
        case 'display-name':
          tags.displayName = value || '';
          break;
        case 'emotes':
          tags.emotes = value || '';
          break;
        case 'id':
          tags.id = value || '';
          break;
        case 'mod':
          tags.mod = value === '1';
          break;
        case 'subscriber':
          tags.subscriber = value === '1';
          break;
        case 'turbo':
          tags.turbo = value === '1';
          break;
        case 'user-id':
          tags.userId = value || '';
          break;
      }
    }
  }

  // Parse the rest of the message
  const messageMatch = raw.match(/:([^!]+)![^ ]+ (PRIVMSG) (#[^ ]+) :(.+)/);
  if (!messageMatch) return null;

  return {
    tags,
    command: messageMatch[2],
    channel: messageMatch[3],
    message: messageMatch[4],
  };
}

// ============================================================================
// TWITCH WEBSOCKET CLIENT
// ============================================================================

class TwitchClient {
  private ws: WebSocket | null = null;
  private config: TwitchConfig | null = null;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private baseReconnectDelay: number = 1000;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  
  private statusCallbacks: Set<(status: ConnectionStatus) => void> = new Set();
  private messageCallbacks: Set<(message: ChatMessage) => void> = new Set();

  async connect(config: TwitchConfig): Promise<void> {
    this.config = config;
    this.setStatus('connecting');

    return new Promise((resolve, reject) => {
      try {
        // Twitch IRC WebSocket endpoint
        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        this.ws.onopen = () => {
          if (!this.ws) return;
          
          // Anonymous login (read-only)
          this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
          this.ws.send(`NICK justinfan${Math.floor(Math.random() * 100000)}`);
          this.ws.send(`JOIN #${config.channel.toLowerCase()}`);
          
          this.setStatus('connected');
          this.reconnectAttempts = 0;
          console.log(`[Twitch] Connected to #${config.channel}`);
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('[Twitch] WebSocket error:', error);
          this.setStatus('error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[Twitch] Connection closed');
          if (this.status !== 'disconnected') {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        this.setStatus('error');
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.setStatus('disconnected');
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    console.log('[Twitch] Disconnected');
  }

  private handleMessage(data: string): void {
    const lines = data.split('\r\n').filter(Boolean);
    
    for (const line of lines) {
      // Handle PING/PONG
      if (line.startsWith('PING')) {
        this.ws?.send('PONG :tmi.twitch.tv');
        continue;
      }

      // Parse chat messages
      const parsed = parseTwitchMessage(line);
      if (parsed && parsed.command === 'PRIVMSG') {
        const chatMessage: ChatMessage = {
          id: parsed.tags.id || `twitch-${Date.now()}`,
          platform: 'twitch',
          username: parsed.tags.displayName.toLowerCase(),
          displayName: parsed.tags.displayName,
          message: parsed.message,
          timestamp: new Date(),
          badges: parsed.tags.badges,
          isModerator: parsed.tags.mod || parsed.tags.badges.includes('moderator') || parsed.tags.badges.includes('broadcaster'),
          isSubscriber: parsed.tags.subscriber || parsed.tags.badges.includes('subscriber'),
          isBroadcaster: parsed.tags.badges.includes('broadcaster'),
        };

        this.notifyMessage(chatMessage);
      }
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Twitch] Max reconnect attempts reached');
      this.setStatus('error');
      return;
    }

    this.setStatus('reconnecting');
    this.reconnectAttempts++;
    
    // Exponential backoff
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`[Twitch] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.config) {
        this.connect(this.config).catch(() => {
          // Will trigger another reconnect attempt
        });
      }
    }, delay);
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    for (const callback of this.statusCallbacks) {
      callback(status);
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  onStatus(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  onMessage(callback: (message: ChatMessage) => void): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  private notifyMessage(message: ChatMessage): void {
    for (const callback of this.messageCallbacks) {
      callback(message);
    }
  }
}

// ============================================================================
// YOUTUBE LIVE CHAT CLIENT (Polling-based)
// ============================================================================

class YouTubeClient {
  private config: YouTubeConfig | null = null;
  private status: ConnectionStatus = 'disconnected';
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private lastMessageId: string = '';
  private backoffMultiplier: number = 1;
  
  private statusCallbacks: Set<(status: ConnectionStatus) => void> = new Set();
  private messageCallbacks: Set<(message: ChatMessage) => void> = new Set();

  async connect(config: YouTubeConfig): Promise<void> {
    this.config = config;
    this.setStatus('connecting');

    try {
      // Note: Full YouTube Live Chat API requires OAuth and API key
      // This is a simplified implementation for demonstration
      this.setStatus('connected');
      this.startPolling();
      console.log(`[YouTube] Connected to stream: ${config.liveStreamId}`);
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  disconnect(): void {
    this.setStatus('disconnected');
    this.stopPolling();
    console.log('[YouTube] Disconnected');
  }

  private startPolling(): void {
    if (!this.config) return;

    const poll = async () => {
      if (this.status !== 'connected' || !this.config) return;

      try {
        // In production, this would call YouTube Live Chat API
        // For now, we simulate the polling behavior
        await this.fetchMessages();
        this.backoffMultiplier = 1; // Reset on success
      } catch (error: unknown) {
        // Handle rate limiting
        if (error instanceof Error && error.message.includes('rate limit')) {
          this.backoffMultiplier = Math.min(this.backoffMultiplier * 2, 10);
          console.warn(`[YouTube] Rate limited, backing off ${this.backoffMultiplier}x`);
        }
      }
    };

    // Initial poll
    poll();

    // Set up interval with backoff
    this.pollInterval = setInterval(() => {
      poll();
    }, (this.config.pollInterval || 2000) * this.backoffMultiplier);
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private async fetchMessages(): Promise<void> {
    // Placeholder for YouTube API integration
    // In production, this would:
    // 1. Call YouTube Live Chat Messages API
    // 2. Parse response and emit messages
    // 3. Handle pagination with nextPageToken
    
    // Example API call structure:
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${chatId}&part=snippet,authorDetails&key=${apiKey}`
    // );
  }

  // Simulate receiving a YouTube message (for testing)
  simulateMessage(username: string, message: string, isModerator: boolean = false): void {
    const chatMessage: ChatMessage = {
      id: `yt-${Date.now()}`,
      platform: 'youtube',
      username: username.toLowerCase(),
      displayName: username,
      message,
      timestamp: new Date(),
      badges: isModerator ? ['moderator'] : [],
      isModerator,
      isSubscriber: false,
      isBroadcaster: false,
    };

    this.notifyMessage(chatMessage);
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    for (const callback of this.statusCallbacks) {
      callback(status);
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  onStatus(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  onMessage(callback: (message: ChatMessage) => void): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  private notifyMessage(message: ChatMessage): void {
    for (const callback of this.messageCallbacks) {
      callback(message);
    }
  }
}

// ============================================================================
// UNIFIED CHAT INTEGRATION
// ============================================================================

export class ChatIntegration {
  private twitchClient: TwitchClient = new TwitchClient();
  private youtubeClient: YouTubeClient = new YouTubeClient();
  
  private statusCallbacks: Set<(status: Map<ChatPlatform, ConnectionStatus>) => void> = new Set();
  private messageCallbacks: Set<(message: ChatMessage) => void> = new Set();

  constructor() {
    // Forward messages from both clients
    this.twitchClient.onMessage((msg) => this.notifyMessage(msg));
    this.youtubeClient.onMessage((msg) => this.notifyMessage(msg));

    // Forward status updates
    this.twitchClient.onStatus(() => this.notifyStatus());
    this.youtubeClient.onStatus(() => this.notifyStatus());
  }

  // ==========================================================================
  // CONNECTION
  // ==========================================================================

  async connectTwitch(config: TwitchConfig): Promise<void> {
    await this.twitchClient.connect(config);
  }

  async connectYouTube(config: YouTubeConfig): Promise<void> {
    await this.youtubeClient.connect(config);
  }

  disconnect(platform?: ChatPlatform): void {
    if (!platform || platform === 'twitch') {
      this.twitchClient.disconnect();
    }
    if (!platform || platform === 'youtube') {
      this.youtubeClient.disconnect();
    }
  }

  // ==========================================================================
  // STATUS
  // ==========================================================================

  getStatus(platform: ChatPlatform): ConnectionStatus {
    return platform === 'twitch' 
      ? this.twitchClient.getStatus() 
      : this.youtubeClient.getStatus();
  }

  getAllStatuses(): Map<ChatPlatform, ConnectionStatus> {
    return new Map([
      ['twitch', this.twitchClient.getStatus()],
      ['youtube', this.youtubeClient.getStatus()],
    ]);
  }

  subscribeToStatus(callback: (status: Map<ChatPlatform, ConnectionStatus>) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  private notifyStatus(): void {
    const statuses = this.getAllStatuses();
    for (const callback of this.statusCallbacks) {
      callback(statuses);
    }
  }

  // ==========================================================================
  // MESSAGES
  // ==========================================================================

  subscribeToMessages(callback: (message: ChatMessage) => void): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  // Alias for subscribeToMessages (used by integration)
  onMessage(callback: (message: ChatMessage) => void): () => void {
    return this.subscribeToMessages(callback);
  }

  private notifyMessage(message: ChatMessage): void {
    for (const callback of this.messageCallbacks) {
      callback(message);
    }
  }

  // ==========================================================================
  // DISCONNECT ALL
  // ==========================================================================

  disconnectAll(): void {
    this.twitchClient.disconnect();
    this.youtubeClient.disconnect();
  }

  // ==========================================================================
  // RECONNECTION POLICY
  // ==========================================================================

  setReconnectPolicy(maxAttempts: number, backoffMs: number): void {
    // This would be passed to the individual clients
    console.log(`[ChatIntegration] Reconnect policy: ${maxAttempts} attempts, ${backoffMs}ms base delay`);
  }

  // ==========================================================================
  // TESTING HELPERS
  // ==========================================================================

  simulateYouTubeMessage(username: string, message: string, isModerator: boolean = false): void {
    this.youtubeClient.simulateMessage(username, message, isModerator);
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const chatIntegration = new ChatIntegration();
