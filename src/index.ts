// Set verbose mode
if (process.env.npm_config_debug) {
  process.env.DEBUG = '*';
}

require('./compatible');
require('./start');
