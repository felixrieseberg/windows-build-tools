import { EventEmitter } from 'events';
import * as fs from 'fs-extra';

import { IS_DRY_RUN } from '../constants';
import { findVCCLogFile } from '../utils/find-logfile';
import { includesFailure, includesSuccess } from '../utils/installation-sucess';

const debug = require('debug')('windows-build-tools');

export class Tailer extends EventEmitter {
  public logFile: string;
  public encoding: string;
  public tailInterval;

  constructor(logfile: string, encoding: string = 'utf8') {
    super();

    this.logFile = logfile;
    this.encoding = encoding;
  }

  /**
   * Starts watching a the logfile
   */
  public start() {
    if (this.logFile) {
      debug(`Tail: Waiting for log file to appear in ${this.logFile}`);
    } else {
      debug(`Tail: Waiting for log file to appear. Searching in %TEMP%`);
    }
    this.waitForLogFile();
  }

  /**
   * Stop watching
   */
  public stop(...args: Array<string>) {
    debug(`Tail: Stopping`, ...args);
    this.emit('exit', ...args);
    clearInterval(this.tailInterval);
  }

  /**
   * Start tailing things
   */
  public tail() {
    debug(`Tail: Tailing ${this.logFile}`);

    this.tailInterval = setInterval(() => this.readData(), 500);
  }

  public readData() {
    if (IS_DRY_RUN) {
      this.emit('lastLines', `Dry run, we're all done`);
      return this.stop('success');
    }

    let data = '';

    // Read the log file
    try {
      data = fs.readFileSync(this.logFile, this.encoding);
    } catch (err) {
      debug(`Tail start: Could not read logfile ${this.logFile}: ${err}`);
      return;
    }

    if (data && data.length > 0) {
      const split = data.split(/\r?\n/) || [ 'Still looking for log file...' ];
      const lastLines = split
        .filter((l) => l.trim().length > 0)
        .slice(split.length - 6, split.length);

      this.emit('lastLines', lastLines);
      this.handleData(data);
    }
  }

  /**
   * Handle data and see if there's something we'd like to report
   *
   * @param {string} data
   */
  public handleData(data: string) {
    // Handle Success
    const { isBuildToolsSuccess, isPythonSuccess } = includesSuccess(data);

    if (isBuildToolsSuccess) {
      debug(`Tail: Reporting success for VCC Build Tools`);
      this.stop('success');
      return;
    }

    if (isPythonSuccess) {
      // Finding the python installation path from the log file
      const matches = data.match(/Property\(S\): TARGETDIR = (.*)\r\n/);
      let pythonPath;

      if (matches) {
        pythonPath = matches[1];
      }

      debug(`Tail: Reporting success for Python`);
      this.stop('success', pythonPath);
      return;
    }

    // Handle Failure
    const { isPythonFailure, isBuildToolsFailure } = includesFailure(data);

    if (isPythonFailure || isBuildToolsFailure) {
      debug(`Tail: Reporting failure in ${this.logFile}`);
      this.stop('failure');
    }
  }

  /**
   * Waits for a given file, resolving when it's available
   *
   * @param file {string} - Path to file
   * @returns {Promise.<Object>} - Promise resolving with fs.stats object
   */
  public waitForLogFile() {
    if (IS_DRY_RUN) return this.tail();

    const handleStillWaiting = () => {
      debug('Tail: waitForFile: still waiting');
      setTimeout(this.waitForLogFile.bind(this), 2000);
    };

    const handleKnownPath = (logFile) => {
      fs.lstat(logFile, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          handleStillWaiting();
        } else if (err) {
          debug('Tail: waitForFile: Unexpected error', err);
          throw err;
        } else {
          debug(`Tail: waitForFile: Found ${logFile}`);
          this.tail();
        }
      });
    };

    // If don't have a logfile, we need to find one. The only one
    // we need to find right now is the VCC 2017 logfile.
    if (!this.logFile) {
      findVCCLogFile()
        .then((logFile) => {
          debug(`Tail: LogFile found: ${logFile}`);

          if (!logFile) {
            handleStillWaiting();
          } else {
            this.logFile = logFile;
            handleKnownPath(logFile);
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      handleKnownPath(this.logFile);
    }
  }
}
