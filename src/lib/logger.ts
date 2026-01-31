// Team 6: Infrastructure - Structured Logger
// Context-based logging with production aggregation

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }
  
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log('error', message, { 
      error: error?.message, 
      stack: error?.stack, 
      ...(data || {})
    });
  }
  
  private log(level: LogLevel, message: string, data?: unknown): void {
    const logEntry = {
      level,
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    };
    
    // Console output with colors
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    }[level];
    
    const consoleMethod = level === 'error' ? 'error' : 
                         level === 'warn' ? 'warn' : 'log';
    
    console[consoleMethod](
      `${emoji} [${this.context}] ${message}`,
      data ? data : ''
    );
    
    // Send to logging service in production
    if (process.env.NODE_ENV === 'production' && level !== 'debug') {
      this.sendToLoggingService(logEntry);
    }
  }
  
  private async sendToLoggingService(entry: unknown): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fail silently to avoid infinite loops
    }
  }
}

// Create loggers for different modules
export const audioLogger = new Logger('audio-engine');
export const uiLogger = new Logger('ui');
export const apiLogger = new Logger('api');
export const streamingLogger = new Logger('streaming');
export const cacheLogger = new Logger('cache');
