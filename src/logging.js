'use strict'

/**
 * Log, unless logging is disabled. Parameters identical with console.log.
 */
function log () {
  if (!process.env.npm_config_disable_logging) {
    console.log.apply(this, arguments)
  }
}

/**
 * Warn, unless logging is disabled. Parameters identical with console.error.
 */
function warn () {
  if (!process.env.npm_config_disable_logging) {
    console.warn.apply(this, arguments)
  }
}

/**
 * Error, unless logging is disabled. arameters identical with console.error.
 */
function error () {
  if (!process.env.npm_config_disable_logging) {
    console.error.apply(this, arguments)
  }
}

module.exports = {
  log,
  warn,
  error
}
