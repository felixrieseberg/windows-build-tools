'use strict'

const stringWidth = require('string-width')

const MOVE_LEFT = Buffer.from('1b5b3130303044', 'hex').toString()
const MOVE_UP = Buffer.from('1b5b3141', 'hex').toString()
const CLEAR_LINE = Buffer.from('1b5b304b', 'hex').toString()
const stream = process.stdout

function createSingleLineLogger () {
  const write = stream.write
  let str

  stream.write = function (data) {
    if (str && data !== str) str = null
    return write.apply(this, arguments)
  }

  process.on('exit', () => {
    if (str !== null) stream.write('')
  })

  let prevLineCount = 0
  var log = function () {
    str = ''
    var nextStr = Array.prototype.join.call(arguments, ' ')

    // Clear screen
    for (var i = 0; i < prevLineCount; i++) {
      str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '')
    }

    // Actual log output
    str += nextStr
    stream.write(str)

    // How many lines to remove on next clear screen
    var prevLines = nextStr.split('\n')
    prevLineCount = 0

    for (let i = 0; i < prevLines.length; i++) {
      prevLineCount += Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1
    }
  }

  log.clear = function () {
    stream.write('')
  }

  return log
}

module.exports = { createSingleLineLogger }
