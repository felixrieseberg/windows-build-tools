'use strict'

var chalk = require('chalk')

// Somebody just installed as a developer,
// let's run build

console.log(chalk.bold.green('If you want to install the Windows Build Tools, you don\'t want to run "npm install" from the repo.\n'))
console.log('Instead, run "npm install --global --production windows-build-tools instead\n\n')
console.log('If you\'re a developer and you want to work on this script, run "npm run build".')
