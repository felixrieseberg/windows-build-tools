import * as stringWidth from 'string-width';

const MOVE_LEFT = Buffer.from('1b5b3130303044', 'hex').toString();
const MOVE_UP = Buffer.from('1b5b3141', 'hex').toString();
const CLEAR_LINE = Buffer.from('1b5b304b', 'hex').toString();
const stream = process.stdout;

export function createSingleLineLogger() {
  const write = stream.write;
  let str;

  stream.write = function(data: string) {
    if (str && data !== str) str = null;
    return write.apply(this, arguments);
  };

  process.on('exit', () => {
    if (str !== null) stream.write('');
  });

  let prevLineCount = 0;

  const log = function(...args: Array<string>) {
    str = '';
    const nextStr = Array.prototype.join.call(args, ' ');

    // Clear screen
    for (let i = 0; i < prevLineCount; i++) {
      str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '');
    }

    // Actual log output
    str += nextStr;
    stream.write(str);

    // How many lines to remove on next clear screen
    const prevLines = nextStr.split('\n');
    prevLineCount = 0;

    for (const prevLine of prevLines) {
      prevLineCount += Math.ceil(stringWidth(prevLine) / stream.columns) || 1;
    }
  };

  const clear = () => stream.write('');

  return { log, clear };
}
