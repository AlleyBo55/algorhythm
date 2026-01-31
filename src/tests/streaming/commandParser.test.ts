import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

import { CommandParser, CooldownManager, EffectQueue } from '@/engine/streaming/commandParser';
import type { ChatMessage, CommandDefinition } from '@/engine/streaming/types';

describe('CooldownManager', () => {
  let cooldownManager: CooldownManager;

  beforeEach(() => {
    vi.useFakeTimers();
    cooldownManager = new CooldownManager();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('global cooldown', () => {
    it('should have default global cooldown of 5000ms', () => {
      expect(cooldownManager.getGlobalCooldown()).toBe(5000);
    });

    it('should set global cooldown', () => {
      cooldownManager.setGlobalCooldown(10000);
      expect(cooldownManager.getGlobalCooldown()).toBe(10000);
    });

    it('should not allow negative cooldown', () => {
      cooldownManager.setGlobalCooldown(-1000);
      expect(cooldownManager.getGlobalCooldown()).toBe(0);
    });
  });

  describe('command cooldown', () => {
    it('should set command-specific cooldown', () => {
      cooldownManager.setCommandCooldown('drop', 15000);
      expect(cooldownManager.getCommandCooldown('drop')).toBe(15000);
    });

    it('should return global cooldown for unset commands', () => {
      expect(cooldownManager.getCommandCooldown('unknown')).toBe(5000);
    });

    it('should be case-insensitive', () => {
      cooldownManager.setCommandCooldown('DROP', 15000);
      expect(cooldownManager.getCommandCooldown('drop')).toBe(15000);
    });
  });

  describe('cooldown state', () => {
    it('should not be on cooldown initially', () => {
      expect(cooldownManager.isOnCooldown('drop')).toBe(false);
    });

    it('should be on cooldown after starting', () => {
      cooldownManager.startCooldown('drop');
      expect(cooldownManager.isOnCooldown('drop')).toBe(true);
    });

    it('should expire after cooldown duration', () => {
      cooldownManager.setCommandCooldown('drop', 1000);
      cooldownManager.startCooldown('drop');
      
      expect(cooldownManager.isOnCooldown('drop')).toBe(true);
      
      vi.advanceTimersByTime(1100);
      
      expect(cooldownManager.isOnCooldown('drop')).toBe(false);
    });

    it('should return remaining cooldown time', () => {
      cooldownManager.setCommandCooldown('drop', 5000);
      cooldownManager.startCooldown('drop');
      
      vi.advanceTimersByTime(2000);
      
      const remaining = cooldownManager.getRemainingCooldown('drop');
      expect(remaining).toBeLessThanOrEqual(3000);
      expect(remaining).toBeGreaterThan(2900);
    });
  });

  describe('bypass users', () => {
    it('should add bypass user', () => {
      cooldownManager.addBypassUser('admin');
      expect(cooldownManager.canBypass('admin', false)).toBe(true);
    });

    it('should remove bypass user', () => {
      cooldownManager.addBypassUser('admin');
      cooldownManager.removeBypassUser('admin');
      expect(cooldownManager.canBypass('admin', false)).toBe(false);
    });

    it('should allow moderators to bypass', () => {
      expect(cooldownManager.canBypass('anyone', true)).toBe(true);
    });

    it('should be case-insensitive for usernames', () => {
      cooldownManager.addBypassUser('Admin');
      expect(cooldownManager.canBypass('admin', false)).toBe(true);
    });
  });

  describe('getAllCooldowns', () => {
    it('should return all active cooldowns', () => {
      cooldownManager.startCooldown('drop');
      cooldownManager.startCooldown('filter');
      
      const cooldowns = cooldownManager.getAllCooldowns();
      expect(cooldowns.length).toBe(2);
    });

    it('should not include expired cooldowns', () => {
      cooldownManager.setCommandCooldown('drop', 1000);
      cooldownManager.startCooldown('drop');
      
      vi.advanceTimersByTime(1100);
      
      const cooldowns = cooldownManager.getAllCooldowns();
      expect(cooldowns.length).toBe(0);
    });
  });

  describe('clearAllCooldowns', () => {
    it('should clear all active cooldowns', () => {
      cooldownManager.startCooldown('drop');
      cooldownManager.startCooldown('filter');
      
      cooldownManager.clearAllCooldowns();
      
      expect(cooldownManager.isOnCooldown('drop')).toBe(false);
      expect(cooldownManager.isOnCooldown('filter')).toBe(false);
    });
  });
});

describe('EffectQueue', () => {
  let effectQueue: EffectQueue;

  beforeEach(() => {
    vi.useFakeTimers();
    effectQueue = new EffectQueue();
  });

  afterEach(() => {
    effectQueue.stopProcessing();
    vi.useRealTimers();
  });

  describe('configuration', () => {
    it('should have default config', () => {
      const config = effectQueue.getConfig();
      expect(config.maxSize).toBe(10);
      expect(config.processInterval).toBe(500);
    });

    it('should update config', () => {
      effectQueue.setConfig({ maxSize: 20, processInterval: 1000 });
      const config = effectQueue.getConfig();
      expect(config.maxSize).toBe(20);
      expect(config.processInterval).toBe(1000);
    });
  });

  describe('enqueue', () => {
    const mockCommand = { name: 'drop', parameters: {}, raw: '!drop' };
    const mockContext = {
      message: { username: 'user', message: '!drop', platform: 'twitch' as const, isModerator: false },
      platform: 'twitch' as const,
      timestamp: new Date(),
    };

    it('should add effect to queue', () => {
      const result = effectQueue.enqueue(mockCommand, mockContext);
      expect(result).toBe(true);
      expect(effectQueue.getQueueLength()).toBe(1);
    });

    it('should reject when queue is full', () => {
      effectQueue.setConfig({ maxSize: 2 });
      
      effectQueue.enqueue(mockCommand, mockContext);
      effectQueue.enqueue(mockCommand, mockContext);
      const result = effectQueue.enqueue(mockCommand, mockContext);
      
      expect(result).toBe(false);
      expect(effectQueue.getQueueLength()).toBe(2);
    });
  });

  describe('dequeue', () => {
    it('should remove and return first effect', () => {
      const mockCommand = { name: 'drop', parameters: {}, raw: '!drop' };
      const mockContext = {
        message: { username: 'user', message: '!drop', platform: 'twitch' as const, isModerator: false },
        platform: 'twitch' as const,
        timestamp: new Date(),
      };
      
      effectQueue.enqueue(mockCommand, mockContext);
      const effect = effectQueue.dequeue();
      
      expect(effect).toBeDefined();
      expect(effect?.command.name).toBe('drop');
      expect(effectQueue.getQueueLength()).toBe(0);
    });

    it('should return undefined for empty queue', () => {
      const effect = effectQueue.dequeue();
      expect(effect).toBeUndefined();
    });
  });

  describe('peek', () => {
    it('should return first effect without removing', () => {
      const mockCommand = { name: 'drop', parameters: {}, raw: '!drop' };
      const mockContext = {
        message: { username: 'user', message: '!drop', platform: 'twitch' as const, isModerator: false },
        platform: 'twitch' as const,
        timestamp: new Date(),
      };
      
      effectQueue.enqueue(mockCommand, mockContext);
      const effect = effectQueue.peek();
      
      expect(effect).toBeDefined();
      expect(effectQueue.getQueueLength()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all effects', () => {
      const mockCommand = { name: 'drop', parameters: {}, raw: '!drop' };
      const mockContext = {
        message: { username: 'user', message: '!drop', platform: 'twitch' as const, isModerator: false },
        platform: 'twitch' as const,
        timestamp: new Date(),
      };
      
      effectQueue.enqueue(mockCommand, mockContext);
      effectQueue.enqueue(mockCommand, mockContext);
      effectQueue.clear();
      
      expect(effectQueue.getQueueLength()).toBe(0);
    });
  });

  describe('processing', () => {
    it('should start processing', () => {
      const onProcess = vi.fn();
      effectQueue.startProcessing(onProcess);
      
      expect(effectQueue.getIsProcessing()).toBe(true);
    });

    it('should stop processing', () => {
      const onProcess = vi.fn();
      effectQueue.startProcessing(onProcess);
      effectQueue.stopProcessing();
      
      expect(effectQueue.getIsProcessing()).toBe(false);
    });
  });
});

describe('CommandParser', () => {
  let commandParser: CommandParser;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorageMock.getItem.mockReturnValue(null);
    commandParser = new CommandParser();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('registerCommand', () => {
    it('should register a command', () => {
      const command: CommandDefinition = {
        name: 'test',
        aliases: ['t'],
        description: 'Test command',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      };
      
      commandParser.registerCommand(command);
      
      expect(commandParser.getCommand('test')).toBeDefined();
    });

    it('should register aliases', () => {
      const command: CommandDefinition = {
        name: 'test',
        aliases: ['t', 'tst'],
        description: 'Test command',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      };
      
      commandParser.registerCommand(command);
      
      expect(commandParser.getCommand('t')).toBeDefined();
      expect(commandParser.getCommand('tst')).toBeDefined();
    });
  });

  describe('parse', () => {
    beforeEach(() => {
      commandParser.registerCommand({
        name: 'reverb',
        aliases: ['rev'],
        description: 'Reverb effect',
        parameters: [
          { name: 'amount', type: 'number', required: false, default: 50, min: 0, max: 100 },
        ],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
    });

    it('should parse valid command', () => {
      const result = commandParser.parse('!reverb 75');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('reverb');
      expect(result?.parameters.amount).toBe(75);
    });

    it('should return null for non-command messages', () => {
      expect(commandParser.parse('hello world')).toBeNull();
      expect(commandParser.parse('reverb 50')).toBeNull();
    });

    it('should use default parameter value', () => {
      const result = commandParser.parse('!reverb');
      
      expect(result?.parameters.amount).toBe(50);
    });

    it('should constrain parameter to min/max', () => {
      const result = commandParser.parse('!reverb 150');
      
      expect(result?.parameters.amount).toBe(100);
    });

    it('should parse alias', () => {
      const result = commandParser.parse('!rev 30');
      
      expect(result?.name).toBe('reverb');
    });
  });

  describe('getAllCommands', () => {
    it('should return unique commands', () => {
      commandParser.registerCommand({
        name: 'test1',
        aliases: ['t1'],
        description: 'Test 1',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      commandParser.registerCommand({
        name: 'test2',
        aliases: ['t2'],
        description: 'Test 2',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      const commands = commandParser.getAllCommands();
      const names = commands.map(c => c.name);
      
      // Should not include aliases as separate entries
      expect(names).toContain('test1');
      expect(names).toContain('test2');
      expect(names).not.toContain('t1');
    });
  });

  describe('configuration', () => {
    it('should enable/disable command', () => {
      commandParser.registerCommand({
        name: 'test',
        aliases: [],
        description: 'Test',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      commandParser.setCommandEnabled('test', false);
      
      expect(commandParser.getCommand('test')?.enabled).toBe(false);
    });

    it('should set command cooldown', () => {
      commandParser.registerCommand({
        name: 'test',
        aliases: [],
        description: 'Test',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      commandParser.setCommandCooldown('test', 5000);
      
      expect(commandParser.getCommand('test')?.cooldown).toBe(5000);
    });
  });

  describe('export/import config', () => {
    it('should export config as JSON', () => {
      commandParser.registerCommand({
        name: 'test',
        aliases: [],
        description: 'Test',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      const config = commandParser.exportConfig();
      const parsed = JSON.parse(config);
      
      expect(parsed).toHaveProperty('globalCooldown');
      expect(parsed).toHaveProperty('commands');
    });

    it('should import config from JSON', () => {
      commandParser.registerCommand({
        name: 'test',
        aliases: [],
        description: 'Test',
        parameters: [],
        cooldown: 1000,
        moderatorOnly: false,
        enabled: true,
        action: vi.fn(),
      });
      
      const config = JSON.stringify({
        globalCooldown: 10000,
        commands: [{ name: 'test', enabled: false, cooldown: 5000 }],
      });
      
      commandParser.importConfig(config);
      
      expect(commandParser.getCommand('test')?.enabled).toBe(false);
      expect(commandParser.getCommand('test')?.cooldown).toBe(5000);
    });
  });
});
