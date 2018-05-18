export const shouldLog = !process.env.npm_config_disable_logging;

/**
 * Log, unless logging is disabled. Parameters identical with console.log.
 */
export function log(...args: Array<any>) {
  if (shouldLog) {
    console.log.apply(this, args);
  }
}

/**
 * Warn, unless logging is disabled. Parameters identical with console.error.
 */
export function warn(...args: Array<any>) {
  if (shouldLog) {
    console.warn.apply(this, args);
  }
}

/**
 * Error, unless logging is disabled. Parameters identical with console.error.
 */
export function error(...args: Array<any>) {
  if (shouldLog) {
    console.error.apply(this, args);
  }
}
