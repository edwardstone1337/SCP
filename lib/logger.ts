/**
 * Simple structured logger for server-side logging
 * In production, this could be replaced with a service like Sentry, LogRocket, etc.
 */

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, context?: LogContext) {
    console.error(this.formatMessage('error', message, context))
  }
}

export const logger = new Logger()
