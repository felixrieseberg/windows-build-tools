import * as path from 'path';
import chalk from 'chalk';

import { InstallationDetails } from './interfaces';
import { executeChildProcess } from './utils/execute-child-process';
import { isDryRun } from './constants';
import { log } from './logging';

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
  const scriptPath = isDryRun
    ? path.join(__dirname, '..', 'ps1', 'dry-run.ps1')
    : path.join(__dirname, '..', 'ps1', 'set-environment.ps1');

  const maybeAddPythonToPath = process.env.npm_config_add_python_to_path ? ' -AddPythonToPath' : '';
  const maybePython = env.python.toConfigure ? ' -ConfigurePython' : '';
  const maybeBuildTools = env.buildTools.toConfigure ? ' -ConfigurePython' : '';
  const maybeArgs = `${maybeBuildTools}${maybePython}${maybeAddPythonToPath}`;

  const psArgs = `& {& '${scriptPath}' -pythonPath '${pythonPath}' -pythonExePath '${pythonExePath}'${maybeArgs} }`;
  const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs];

  executeChildProcess('powershell.exe', args)
    .then(() => log(chalk.bold.green(`\nAll done!\n`)))
    .catch((error) => debug(`Encountered environment setting error: ${error}`));
}
