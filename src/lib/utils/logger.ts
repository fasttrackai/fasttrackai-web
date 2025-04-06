/**
 * Logger utility for centralized logging with environment-based filtering
 * Helps avoid console logs in production while maintaining proper error logging
 */

// Determine if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Create a logger object with methods that respect environment
const logger = {
  /**
   * Log informational messages (suppressed in production)
   */
  log: (...args: any[]): void => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  /**
   * Log warning messages (suppressed in production)
   */
  warn: (...args: any[]): void => {
    if (!isProduction) {
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always logged, but could be sent to monitoring service in production)
   */
  error: (...args: any[]): void => {
    console.error(...args);
    
    // In production, you could send errors to monitoring service like Sentry
    if (isProduction && typeof window !== 'undefined') {
      // Example: if you add Sentry later
      // Sentry.captureException(args[0] instanceof Error ? args[0] : new Error(args.join(' ')));
    }
  },

  /**
   * Log development-only debug messages (completely suppressed in production)
   */
  debug: (...args: any[]): void => {
    if (!isProduction) {
      console.debug(...args);
    }
  },

  /**
   * Log messages only in production (for critical production-only logging)
   */
  prodOnly: (...args: any[]): void => {
    if (isProduction) {
      console.log(...args);
    }
  }
};

export default logger; 