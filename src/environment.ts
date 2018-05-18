import * as path from 'path';

import { InstallationDetails } from './interfaces';
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
  const scriptPath = path.join(__dirname, '..', 'ps1', 'set-environment.ps1');
  const maybeAddToPath = process.env.npm_config_add_python_to_path ? ' -AddPythonToPath' : '';

  const psArgs = `& {& '${scriptPath}' -pythonPath '${pythonPath}' -pythonExePath '${pythonExePath}'${maybeAddToPath} }`;
  const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs];

  executeChildProcess('powershell.exe', args)
    .catch((error) => debug(`Encountered environment setting error: ${error}`));
}
