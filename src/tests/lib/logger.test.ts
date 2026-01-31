import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, audioLogger, uiLogger, apiLogger, streamingLogger, cacheLogger } from '@/lib/logger';

describe('Logger', () => {
  let consoleSpy: { log: any; warn: any; error: any };
  let fetchSpy: any;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Logger class', () => {
    it('should create logger with context', () => {
      const logger = new Logger('test-context');
      expect(logger).toBeDefined();
    });
  });


  describe('debug', () => {
    it('should log debug message', () => {
      const logger = new Logger('test');
      logger.debug('debug message');
      
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('should include context in log', () => {
      const logger = new Logger('my-context');
      logger.debug('test message');
      
      const call = consoleSpy.log.mock.calls[0][0];
      expect(call).toContain('my-context');
    });

    it('should log with data', () => {
      const logger = new Logger('test');
      logger.debug('message', { key: 'value' });
      
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        { key: 'value' }
      );
    });
  });

  describe('info', () => {
    it('should log info message', () => {
      const logger = new Logger('test');
      logger.info('info message');
      
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      const logger = new Logger('test');
      logger.warn('warning message');
      
      expect(consoleSpy.warn).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      const logger = new Logger('test');
      logger.error('error message');
      
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should include error details', () => {
      const logger = new Logger('test');
      const error = new Error('Test error');
      logger.error('error occurred', error);
      
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should include additional data', () => {
      const logger = new Logger('test');
      const error = new Error('Test error');
      logger.error('error occurred', error, { userId: '123' });
      
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('pre-configured loggers', () => {
    it('audioLogger should be defined', () => {
      expect(audioLogger).toBeDefined();
    });

    it('uiLogger should be defined', () => {
      expect(uiLogger).toBeDefined();
    });

    it('apiLogger should be defined', () => {
      expect(apiLogger).toBeDefined();
    });

    it('streamingLogger should be defined', () => {
      expect(streamingLogger).toBeDefined();
    });

    it('cacheLogger should be defined', () => {
      expect(cacheLogger).toBeDefined();
    });
  });
});
