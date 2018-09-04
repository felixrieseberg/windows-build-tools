import chalk from 'chalk';

import { INSTALLED_PYTHON_VERSION, IS_PYTHON_INSTALLED } from '../constants';
import { InstallationDetails, InstallationReport } from '../interfaces';
import { log, shouldLog } from '../logging';
import { cleanExistingLogFiles } from '../utils/clean';
import { getBuildToolsInstallerPath } from '../utils/get-build-tools-installer-path';
import { getPythonInstallerPath } from '../utils/get-python-installer-path';
import { getWorkDirectory } from '../utils/get-work-dir';
import { removePath } from '../utils/remove-path';
import { createSingleLineLogger } from '../utils/single-line-log';
import { launchInstaller } from './launch';
import { Tailer } from './tailer';

const singleLineLogger = createSingleLineLogger();
const vccInstaller = getBuildToolsInstallerPath();

const vcLogTitle = chalk.bold.green('---------- Visual Studio Build Tools ----------');
const pyLogTitle = chalk.bold.green('------------------- Python --------------------');
let vccLastLines = [ 'Still waiting for installer log file...' ];
let pythonLastLines = [ 'Still waiting for installer log file...' ];
let lastLinesInterval = null;

const debug = require('debug')('windows-build-tools');

/**
 * Installs the build tools, tailing the installation log file
 * to understand what's happening
 */

export function install(cb: (details: InstallationDetails) => void) {
  log(chalk.green('\nStarting installation...'));

  cleanExistingLogFiles();
  removePath();

  launchInstaller()
    .then(() => launchLog())
    .then(() => Promise.all([ tailBuildInstallation(), tailPythonInstallation() ]))
    .then((details: [ InstallationReport, InstallationReport ]) => {
      cb({ buildTools: details[0], python: details[1] });
    })
    .catch((error) => {
      log(error);
    });
}

function logStatus() {
  const updatedLog = [ vcLogTitle, ...vccLastLines, pyLogTitle, ...pythonLastLines ];

  // We expect a length of 16
  if (updatedLog.length < 16) {
    updatedLog.fill('', updatedLog.length, 16);
  }

  if (debug.enabled) {
  updatedLog.forEach((s) => debug(s));
  } else {
    singleLineLogger.log(updatedLog.join('\n'));
  }
}

function launchLog() {
  if (!shouldLog) return;

  log('Launched installers, now waiting for them to finish.');
  log('This will likely take some time - please be patient!\n');
  log('Status from the installers:');

  lastLinesInterval = setInterval(logStatus, 500);
}

function stopLog() {
  if (!shouldLog) return;

  clearInterval(lastLinesInterval);

  // Flush newlines
  log('\n');
}

function tailBuildInstallation(): Promise<InstallationReport> {
  return new Promise((resolve, reject) => {
    const tailer = new Tailer(vccInstaller.logPath);

    tailer.on('lastLines', (lastLines) => {
      vccLastLines = lastLines;
    });

    tailer.on('exit', (result, details) => {
      debug('Install: Build tools tailer exited');

      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details);
        reject(new Error(`Found error with VCC installer: ${details}`));
      }

      if (result === 'success') {
        vccLastLines = [ chalk.bold.green('Successfully installed Visual Studio Build Tools.') ];
        debug('Installer: Successfully installed Visual Studio Build Tools according to tailer');
        resolve({ success: true, toConfigure: true });
      }

      // Stop the log now. If we need to report failures, we need
      // to do it after the single-line-logger has stopped messing
      // with the terminal.
      logStatus();
      stopLog();

      if (result === 'failure') {
        log(chalk.bold.red('\nCould not install Visual Studio Build Tools.'));
        log('Please find more details in the log files, which can be found at');
        log(getWorkDirectory() + '\n');
        debug('Installer: Failed to install according to tailer');
        resolve({ success: false });
      }
    });

    tailer.start();
  });
}

function tailPythonInstallation(): Promise<InstallationReport> {
  return new Promise((resolve, reject) => {
    if (IS_PYTHON_INSTALLED) {
      debug('Installer: Python is already installed');
      pythonLastLines = [ chalk.bold.green(`${INSTALLED_PYTHON_VERSION} is already installed, not installing again.`) ];

      return resolve({ toConfigure: false, installPath: '', success: true });
    }

    // The log file for msiexe is utf-16
    const tailer = new Tailer(getPythonInstallerPath().logPath, 'ucs2');

    tailer.on('lastLines', (lastLines) => {
      pythonLastLines = lastLines;
    });

    tailer.on('exit', (result, details) => {
      debug('python tailer exited');
      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details);
        reject(new Error(`Found error with Python installer: ${details}`));
      }

      if (result === 'success') {
        pythonLastLines = [ chalk.bold.green('Successfully installed Python 2.7') ];

        debug('Installer: Successfully installed Python 2.7 according to tailer');
        resolve({
          installPath: details || getPythonInstallerPath().targetPath,
          toConfigure: true,
          success: true
        });
      }

      if (result === 'failure') {
        log(chalk.bold.red('\nCould not install Python 2.7.'));
        log('Please find more details in the log files, which can be found at');
        log(getWorkDirectory() + '\n');

        debug('Installer: Failed to install Python 2.7 according to tailer');
        resolve({
          success: false
        });
      }
    });

    tailer.start();
  });
}
