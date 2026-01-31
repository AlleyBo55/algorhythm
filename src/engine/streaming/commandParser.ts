// Command Parser - Chat Command Processing
// Patterns: Discord (command handling), Twitch (bot commands), Nightbot (cooldowns)

import type {
  CommandDefinition,
  CommandParameter,
  CommandContext,
  ParsedCommand,
  ChatMessage,
  CooldownState,
} from './types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from './storage';

// ============================================================================
// COOLDOWN MANAGER (Nightbot pattern: spam prevention)
// ============================================================================

export class CooldownManager {
  private globalCooldown: number = 5000; // 5 seconds default
  private commandCooldowns: Map<string, number> = new Map();
  private activeCooldowns: Map<string, number> = new Map(); // command -> expiresAt
  private bypassUsers: Set<string> = new Set();

  setGlobalCooldown(ms: number): void {
    this.globalCooldown = Math.max(0, ms);
  }

  getGlobalCooldown(): number {
    return this.globalCooldown;
  }

  setCommandCooldown(command: string, ms: number): void {
    this.commandCooldowns.set(command.toLowerCase(), Math.max(0, ms));
  }

  getCommandCooldown(command: string): number {
    return this.commandCooldowns.get(command.toLowerCase()) ?? this.globalCooldown;
  }

  isOnCooldown(command: string): boolean {
    const expiresAt = this.activeCooldowns.get(command.toLowerCase());
    if (!expiresAt) return false;
    
    if (Date.now() >= expiresAt) {
      this.activeCooldowns.delete(command.toLowerCase());
      return false;
    }
    
    return true;
  }

  getRemainingCooldown(command: string): number {
    const expiresAt = this.activeCooldowns.get(command.toLowerCase());
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - Date.now());
  }

  startCooldown(command: string): void {
    const cooldown = this.getCommandCooldown(command);
    this.activeCooldowns.set(command.toLowerCase(), Date.now() + cooldown);
  }

  addBypassUser(username: string): void {
    this.bypassUsers.add(username.toLowerCase());
  }

  removeBypassUser(username: string): void {
    this.bypassUsers.delete(username.toLowerCase());
  }

  canBypass(username: string, isModerator: boolean): boolean {
    return isModerator || this.bypassUsers.has(username.toLowerCase());
  }

  getAllCooldowns(): CooldownState[] {
    const now = Date.now();
    const states: CooldownState[] = [];
    
    for (const [command, expiresAt] of this.activeCooldowns) {
      if (expiresAt > now) {
        states.push({
          command,
          expiresAt,
          remainingMs: expiresAt - now,
        });
      }
    }
    
    return states;
  }

  clearAllCooldowns(): void {
    this.activeCooldowns.clear();
  }
}

// ============================================================================
// EFFECT QUEUE (FIFO processing)
// ============================================================================

interface QueuedEffect {
  id: string;
  command: ParsedCommand;
  context: CommandContext;
  queuedAt: number;
}

export class EffectQueue {
  private queue: QueuedEffect[] = [];
  private maxSize: number = 10;
  private processInterval: number = 500; // ms between effects
  private isProcessing: boolean = false;
  private processTimer: ReturnType<typeof setInterval> | null = null;
  private onProcess: ((effect: QueuedEffect) => void) | null = null;
  private subscribers: Set<(queue: QueuedEffect[]) => void> = new Set();

  setConfig(config: { maxSize?: number; processInterval?: number }): void {
    if (config.maxSize !== undefined) this.maxSize = config.maxSize;
    if (config.processInterval !== undefined) this.processInterval = config.processInterval;
  }

  getConfig(): { maxSize: number; processInterval: number } {
    return { maxSize: this.maxSize, processInterval: this.processInterval };
  }

  enqueue(command: ParsedCommand, context: CommandContext): boolean {
    if (this.queue.length >= this.maxSize) {
      console.log('[EffectQueue] Queue full, rejecting command');
      return false;
    }

    const effect: QueuedEffect = {
      id: `effect-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      command,
      context,
      queuedAt: Date.now(),
    };

    this.queue.push(effect);
    this.notifySubscribers();
    console.log(`[EffectQueue] Queued: ${command.name} (${this.queue.length}/${this.maxSize})`);
    return true;
  }

  dequeue(): QueuedEffect | undefined {
    const effect = this.queue.shift();
    if (effect) {
      this.notifySubscribers();
    }
    return effect;
  }

  peek(): QueuedEffect | undefined {
    return this.queue[0];
  }

  clear(): void {
    this.queue = [];
    this.notifySubscribers();
    console.log('[EffectQueue] Queue cleared');
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getQueue(): QueuedEffect[] {
    return [...this.queue];
  }

  startProcessing(onProcess: (effect: QueuedEffect) => void): void {
    this.onProcess = onProcess;
    this.isProcessing = true;
    
    this.processTimer = setInterval(() => {
      const effect = this.dequeue();
      if (effect && this.onProcess) {
        this.onProcess(effect);
      }
    }, this.processInterval);

    console.log('[EffectQueue] Started processing');
  }

  stopProcessing(): void {
    this.isProcessing = false;
    if (this.processTimer) {
      clearInterval(this.processTimer);
      this.processTimer = null;
    }
    console.log('[EffectQueue] Stopped processing');
  }

  getIsProcessing(): boolean {
    return this.isProcessing;
  }

  subscribe(callback: (queue: QueuedEffect[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    for (const callback of this.subscribers) {
      callback(this.getQueue());
    }
  }
}

// ============================================================================
// COMMAND PARSER (Discord pattern: command handling)
// ============================================================================

export class CommandParser {
  private commands: Map<string, CommandDefinition> = new Map();
  private cooldownManager: CooldownManager = new CooldownManager();
  private effectQueue: EffectQueue = new EffectQueue();

  constructor() {
    this.loadConfig();
  }

  // ==========================================================================
  // COMMAND REGISTRATION
  // ==========================================================================

  registerCommand(definition: CommandDefinition): void {
    const name = definition.name.toLowerCase();
    this.commands.set(name, definition);
    
    // Register aliases
    for (const alias of definition.aliases) {
      this.commands.set(alias.toLowerCase(), definition);
    }

    // Set command-specific cooldown if provided
    if (definition.cooldown > 0) {
      this.cooldownManager.setCommandCooldown(name, definition.cooldown);
    }

    console.log(`[CommandParser] Registered: !${name}`);
  }

  unregisterCommand(name: string): void {
    const cmd = this.commands.get(name.toLowerCase());
    if (cmd) {
      this.commands.delete(cmd.name.toLowerCase());
      for (const alias of cmd.aliases) {
        this.commands.delete(alias.toLowerCase());
      }
      console.log(`[CommandParser] Unregistered: !${name}`);
    }
  }

  getCommand(name: string): CommandDefinition | undefined {
    return this.commands.get(name.toLowerCase());
  }

  getAllCommands(): CommandDefinition[] {
    // Return unique commands (not aliases)
    const unique = new Map<string, CommandDefinition>();
    for (const cmd of this.commands.values()) {
      unique.set(cmd.name, cmd);
    }
    return Array.from(unique.values());
  }

  // ==========================================================================
  // PARSING
  // ==========================================================================

  parse(message: string): ParsedCommand | null {
    const trimmed = message.trim();
    
    // Must start with !
    if (!trimmed.startsWith('!')) return null;

    // Extract command and parameters
    const parts = trimmed.slice(1).split(/\s+/);
    const commandName = parts[0]?.toLowerCase();
    
    if (!commandName) return null;

    // Check if command exists
    const definition = this.commands.get(commandName);
    if (!definition) return null;

    // Parse parameters
    const parameters: Record<string, unknown> = {};
    const args = parts.slice(1);

    for (let i = 0; i < definition.parameters.length; i++) {
      const param = definition.parameters[i];
      const value = args[i];

      if (value === undefined) {
        if (param.required) {
          // Missing required parameter - use default or fail
          if (param.default !== undefined) {
            parameters[param.name] = param.default;
          } else {
            return null; // Invalid command
          }
        } else if (param.default !== undefined) {
          parameters[param.name] = param.default;
        }
        continue;
      }

      // Type conversion
      switch (param.type) {
        case 'number':
          const num = parseFloat(value);
          if (isNaN(num)) {
            parameters[param.name] = param.default ?? 0;
          } else {
            // Apply min/max constraints
            let constrained = num;
            if (param.min !== undefined) constrained = Math.max(param.min, constrained);
            if (param.max !== undefined) constrained = Math.min(param.max, constrained);
            parameters[param.name] = constrained;
          }
          break;
        case 'boolean':
          parameters[param.name] = ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
          break;
        case 'string':
        default:
          parameters[param.name] = value;
      }
    }

    return {
      name: definition.name, // Use canonical name, not alias
      parameters,
      raw: trimmed,
    };
  }

  // ==========================================================================
  // EXECUTION
  // ==========================================================================

  execute(command: ParsedCommand, context: CommandContext): boolean {
    const definition = this.commands.get(command.name.toLowerCase());
    if (!definition) {
      console.log(`[CommandParser] Unknown command: ${command.name}`);
      return false;
    }

    // Check if enabled
    if (!definition.enabled) {
      console.log(`[CommandParser] Command disabled: ${command.name}`);
      return false;
    }

    // Check moderator-only
    if (definition.moderatorOnly && !context.message.isModerator) {
      console.log(`[CommandParser] Moderator-only command: ${command.name}`);
      return false;
    }

    // Check cooldown (unless user can bypass)
    if (!this.cooldownManager.canBypass(context.message.username, context.message.isModerator)) {
      if (this.cooldownManager.isOnCooldown(command.name)) {
        const remaining = this.cooldownManager.getRemainingCooldown(command.name);
        console.log(`[CommandParser] On cooldown: ${command.name} (${remaining}ms remaining)`);
        return false;
      }
    }

    // Queue the effect
    const queued = this.effectQueue.enqueue(command, context);
    if (queued) {
      // Start cooldown
      this.cooldownManager.startCooldown(command.name);
    }

    return queued;
  }

  // Process a chat message end-to-end
  processMessage(message: ChatMessage): boolean {
    const parsed = this.parse(message.message);
    if (!parsed) return false;

    const context: CommandContext = {
      message,
      platform: message.platform,
      timestamp: new Date(),
    };

    return this.execute(parsed, context);
  }

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  setCommandEnabled(name: string, enabled: boolean): void {
    const cmd = this.commands.get(name.toLowerCase());
    if (cmd) {
      cmd.enabled = enabled;
      this.saveConfig();
    }
  }

  setCommandCooldown(name: string, cooldown: number): void {
    const cmd = this.commands.get(name.toLowerCase());
    if (cmd) {
      cmd.cooldown = cooldown;
      this.cooldownManager.setCommandCooldown(name, cooldown);
      this.saveConfig();
    }
  }

  setCommandModeratorOnly(name: string, moderatorOnly: boolean): void {
    const cmd = this.commands.get(name.toLowerCase());
    if (cmd) {
      cmd.moderatorOnly = moderatorOnly;
      this.saveConfig();
    }
  }

  setGlobalCooldown(ms: number): void {
    this.cooldownManager.setGlobalCooldown(ms);
    this.saveConfig();
  }

  // ==========================================================================
  // BUILT-IN COMMANDS
  // ==========================================================================

  registerBuiltInCommands(): void {
    // !drop - Bass drop effect
    this.registerCommand({
      name: 'drop',
      aliases: ['d', 'bass'],
      description: 'Trigger a bass drop effect',
      parameters: [],
      cooldown: 10000,
      moderatorOnly: false,
      enabled: true,
      action: () => console.log('[Effect] Bass drop triggered'),
    });

    // !filter - Filter sweep
    this.registerCommand({
      name: 'filter',
      aliases: ['f', 'sweep'],
      description: 'Apply a filter sweep',
      parameters: [
        { name: 'type', type: 'string', required: false, default: 'lowpass' },
      ],
      cooldown: 5000,
      moderatorOnly: false,
      enabled: true,
      action: (params) => console.log(`[Effect] Filter: ${params.type}`),
    });

    // !reverb - Reverb effect
    this.registerCommand({
      name: 'reverb',
      aliases: ['rev', 'echo'],
      description: 'Apply reverb effect',
      parameters: [
        { name: 'amount', type: 'number', required: false, default: 50, min: 0, max: 100 },
      ],
      cooldown: 5000,
      moderatorOnly: false,
      enabled: true,
      action: (params) => console.log(`[Effect] Reverb: ${params.amount}%`),
    });

    // !delay - Delay effect
    this.registerCommand({
      name: 'delay',
      aliases: ['del'],
      description: 'Apply delay effect',
      parameters: [
        { name: 'time', type: 'number', required: false, default: 250, min: 50, max: 1000 },
      ],
      cooldown: 5000,
      moderatorOnly: false,
      enabled: true,
      action: (params) => console.log(`[Effect] Delay: ${params.time}ms`),
    });

    // !scratch - Scratch effect
    this.registerCommand({
      name: 'scratch',
      aliases: ['sc'],
      description: 'Trigger scratch effect',
      parameters: [],
      cooldown: 8000,
      moderatorOnly: false,
      enabled: true,
      action: () => console.log('[Effect] Scratch triggered'),
    });

    // !airhorn - Airhorn sample
    this.registerCommand({
      name: 'airhorn',
      aliases: ['horn', 'ah'],
      description: 'Play airhorn sample',
      parameters: [],
      cooldown: 15000,
      moderatorOnly: false,
      enabled: true,
      action: () => console.log('[Effect] Airhorn!'),
    });

    // !djstop - Stop all effects (moderator only)
    this.registerCommand({
      name: 'djstop',
      aliases: ['stop', 'killall'],
      description: 'Stop all chat-triggered effects',
      parameters: [],
      cooldown: 0,
      moderatorOnly: true,
      enabled: true,
      action: () => {
        this.effectQueue.clear();
        console.log('[Effect] All effects stopped');
      },
    });

    // !bpm - Show current BPM
    this.registerCommand({
      name: 'bpm',
      aliases: ['tempo'],
      description: 'Show current BPM',
      parameters: [],
      cooldown: 3000,
      moderatorOnly: false,
      enabled: true,
      action: () => console.log('[Info] BPM displayed'),
    });

    console.log('[CommandParser] Built-in commands registered');
  }

  // ==========================================================================
  // IMPORT/EXPORT
  // ==========================================================================

  exportConfig(): string {
    const config = {
      globalCooldown: this.cooldownManager.getGlobalCooldown(),
      commands: this.getAllCommands().map(cmd => ({
        name: cmd.name,
        enabled: cmd.enabled,
        cooldown: cmd.cooldown,
        moderatorOnly: cmd.moderatorOnly,
      })),
    };
    return JSON.stringify(config, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const config = JSON.parse(configJson);
      
      if (config.globalCooldown !== undefined) {
        this.cooldownManager.setGlobalCooldown(config.globalCooldown);
      }

      if (Array.isArray(config.commands)) {
        for (const cmdConfig of config.commands) {
          const cmd = this.commands.get(cmdConfig.name?.toLowerCase());
          if (cmd) {
            if (cmdConfig.enabled !== undefined) cmd.enabled = cmdConfig.enabled;
            if (cmdConfig.cooldown !== undefined) {
              cmd.cooldown = cmdConfig.cooldown;
              this.cooldownManager.setCommandCooldown(cmd.name, cmdConfig.cooldown);
            }
            if (cmdConfig.moderatorOnly !== undefined) cmd.moderatorOnly = cmdConfig.moderatorOnly;
          }
        }
      }

      console.log('[CommandParser] Config imported');
    } catch (error) {
      console.error('[CommandParser] Failed to import config:', error);
    }
  }

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  saveConfig(): void {
    saveToLocalStorage(STORAGE_KEYS.COMMAND_CONFIG, this.exportConfig());
  }

  loadConfig(): void {
    const saved = loadFromLocalStorage<string>(STORAGE_KEYS.COMMAND_CONFIG, '');
    if (saved) {
      this.importConfig(saved);
    }
  }

  // ==========================================================================
  // ACCESSORS
  // ==========================================================================

  getCooldownManager(): CooldownManager {
    return this.cooldownManager;
  }

  getEffectQueue(): EffectQueue {
    return this.effectQueue;
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const commandParser = new CommandParser();

// Register built-in commands on module load
commandParser.registerBuiltInCommands();
