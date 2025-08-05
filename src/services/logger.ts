export class Logger {
  static info(message: string, metadata?: Record<string, unknown>) {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      metadata
    }));
  }

  static warn(message: string, metadata?: Record<string, unknown>) {
    console.log(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      metadata
    }));
  }

  static error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined,
      metadata
    }));
  }

  static debug(message: string, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify({
        level: 'debug',
        timestamp: new Date().toISOString(),
        message,
        metadata
      }));
    }
  }
}