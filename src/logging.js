'use strict'

const shouldLog = !process.env.npm_config_disable_logging

/**
 * Log, unless logging is disabled. Parameters identical with console.log.
 */
function log () {
  if (shouldLog) {
    console.log.apply(this, arguments)
  }
}

/**
 * Warn, unless logging is disabled. Parameters identical with console.error.
 */
function warn () {
  if (shouldLog) {
    console.warn.apply(this, arguments)
  }
}

/**
 * Error, unless logging is disabled. Parameters identical with console.error.
 */
function error () {
  if (shouldLog) {
    console.error.apply(this, arguments)
  }
}

module.exports = {
  log,
  warn,
  error,
  shouldLog
}
