import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};
vi.stubGlobal('localStorage', localStorageMock);

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '@/engine/streaming/storage';

describe('LocalStorage Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.store = {};
  });

  describe('saveToLocalStorage', () => {
    it('should save string value', () => {
      saveToLocalStorage('test-key', 'test-value');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        '"test-value"'
      );
    });

    it('should save object value as JSON', () => {
      const data = { name: 'test', value: 123 };
      saveToLocalStorage('test-key', data);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data)
      );
    });

    it('should save array value as JSON', () => {
      const data = [1, 2, 3];
      saveToLocalStorage('test-key', data);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data)
      );
    });

    it('should save number value', () => {
      saveToLocalStorage('test-key', 42);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        '42'
      );
    });

    it('should save boolean value', () => {
      saveToLocalStorage('test-key', true);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        'true'
      );
    });

    it('should handle save errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });
      
      // Should not throw
      expect(() => saveToLocalStorage('test-key', 'value')).not.toThrow();
    });
  });

  describe('loadFromLocalStorage', () => {
    it('should load string value', () => {
      localStorageMock.store['test-key'] = '"test-value"';
      
      const result = loadFromLocalStorage('test-key', '');
      
      expect(result).toBe('test-value');
    });

    it('should load object value', () => {
      const data = { name: 'test', value: 123 };
      localStorageMock.store['test-key'] = JSON.stringify(data);
      
      const result = loadFromLocalStorage<typeof data>('test-key', { name: '', value: 0 });
      
      expect(result).toEqual(data);
    });

    it('should load array value', () => {
      const data = [1, 2, 3];
      localStorageMock.store['test-key'] = JSON.stringify(data);
      
      const result = loadFromLocalStorage<number[]>('test-key', []);
      
      expect(result).toEqual(data);
    });

    it('should return default value for missing key', () => {
      const result = loadFromLocalStorage('missing-key', 'default');
      
      expect(result).toBe('default');
    });

    it('should return default value for invalid JSON', () => {
      localStorageMock.store['test-key'] = 'invalid json {';
      
      const result = loadFromLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
    });

    it('should handle load errors gracefully', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Access denied');
      });
      
      const result = loadFromLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
    });
  });

  describe('removeFromLocalStorage', () => {
    it('should remove item', () => {
      localStorageMock.store['test-key'] = 'value';
      
      removeFromLocalStorage('test-key');
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle remove errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Access denied');
      });
      
      // Should not throw
      expect(() => removeFromLocalStorage('test-key')).not.toThrow();
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have COMMAND_CONFIG key', () => {
      expect(STORAGE_KEYS.COMMAND_CONFIG).toBeDefined();
      expect(typeof STORAGE_KEYS.COMMAND_CONFIG).toBe('string');
    });

    it('should have THEME_PREFERENCES key', () => {
      expect(STORAGE_KEYS.THEME_PREFERENCES).toBeDefined();
    });

    it('should have OVERLAY_LAYOUT key', () => {
      expect(STORAGE_KEYS.OVERLAY_LAYOUT).toBeDefined();
    });

    it('should have AUDIO_ROUTING key', () => {
      expect(STORAGE_KEYS.AUDIO_ROUTING).toBeDefined();
    });

    it('should have CHAT_CONFIG key', () => {
      expect(STORAGE_KEYS.CHAT_CONFIG).toBeDefined();
    });
  });
});

describe('LocalStorage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.store = {};
  });

  it('should round-trip complex data', () => {
    const complexData = {
      settings: {
        volume: 0.8,
        effects: ['reverb', 'delay'],
        enabled: true,
      },
      history: [
        { command: 'drop', timestamp: Date.now() },
        { command: 'filter', timestamp: Date.now() },
      ],
    };
    
    saveToLocalStorage('complex-key', complexData);
    const loaded = loadFromLocalStorage('complex-key', null);
    
    expect(loaded).toEqual(complexData);
  });

  it('should handle nested arrays and objects', () => {
    const nestedData = {
      matrix: [[1, 2], [3, 4]],
      deep: { level1: { level2: { value: 'deep' } } },
    };
    
    saveToLocalStorage('nested-key', nestedData);
    const loaded = loadFromLocalStorage('nested-key', null);
    
    expect(loaded).toEqual(nestedData);
  });

  it('should handle null values', () => {
    saveToLocalStorage('null-key', null);
    const loaded = loadFromLocalStorage('null-key', 'default');
    
    expect(loaded).toBeNull();
  });

  it('should handle empty objects', () => {
    saveToLocalStorage('empty-key', {});
    const loaded = loadFromLocalStorage('empty-key', { default: true });
    
    expect(loaded).toEqual({});
  });

  it('should handle empty arrays', () => {
    saveToLocalStorage('empty-array-key', []);
    const loaded = loadFromLocalStorage<unknown[]>('empty-array-key', [1, 2, 3]);
    
    expect(loaded).toEqual([]);
  });
});
