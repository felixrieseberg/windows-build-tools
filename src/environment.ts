import chalk from 'chalk';
import * as path from 'path';

import { IS_DRY_RUN } from './constants';
import { InstallationDetails } from './interfaces';
import { log } from './logging';
import { executeChildProcess } from './utils/execute-child-process';

const debug = require('debug')('windows-build-tools');

/**
 * Uses PowerShell to configure the environment for
 * msvs_version 2015 and npm python 2.7
 *
 * @params variables an object with paths for different environmental variables
 */
export function setEnvironment(env: InstallationDetails) {
  const pythonPath = path.join(env.python.path);
  const pythonExePath = path.join(pythonPath, 'python.exe');
  const scriptPath = IS_DRY_RUN
    ? path.join(__dirname, '..', 'ps1', 'dry-run.ps1')
    : path.join(__dirname, '..', 'ps1', 'set-environment.ps1');

  const maybePython = env.python.toConfigure ? ' -ConfigurePython' : '';
  const maybeBuildTools = env.buildTools.toConfigure ? ' -ConfigureBuildTools' : '';
  const maybeArgs = `${maybeBuildTools}${maybePython}`;

  const psArgs = `& {& '${scriptPath}' -pythonPath '${pythonPath}' -pythonExePath '${pythonExePath}'${maybeArgs} }`;
  const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs];

  return executeChildProcess('powershell.exe', args)
    .then(() => log(chalk.bold.green(`\nAll done!\n`)))
    .catch((error) => debug(`Encountered environment setting error: ${error}`));
}
