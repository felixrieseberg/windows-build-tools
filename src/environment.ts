import chalk from 'chalk';
import * as path from 'path';

import { BUILD_TOOLS, IS_DRY_RUN } from './constants';
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
  const scriptPath = IS_DRY_RUN
    ? path.join(__dirname, '..', 'ps1', 'dry-run.ps1')
    : path.join(__dirname, '..', 'ps1', 'set-environment.ps1');

  let pythonArguments = '';
  let buildArguments = '';

  // Should we configure Python?
  if (env.python.toConfigure) {
    const pythonPath = path.join(env.python.installPath);
    const pythonExePath = path.join(pythonPath, 'python.exe');

    pythonArguments += ` -ConfigurePython -pythonPath '${pythonPath}' -pythonExePath '${pythonExePath}'`;
  }

  // Should we configure the VS Build Tools?
  if (env.buildTools.toConfigure) {
    const vccParam = `-VisualStudioVersion '${BUILD_TOOLS.version.toString()}'`;
    buildArguments += ` -ConfigureBuildTools ${vccParam}`;
  }

  // Log what we're doing
  if (pythonArguments && buildArguments) {
    log(chalk.bold.green(`Now configuring the Visual Studio Build Tools and Python...`));
  } else if (pythonArguments) {
    log(chalk.bold.green(`Now configuring Python...`));
  } else if (buildArguments) {
    log(chalk.bold.green(`Now configuring the Visual Studio Build Tools..`));
  } else {
    log(chalk.bold.green(`Skipping configuration: No configuration for Python or Visual Studio Build Tools required.`));
    return;
  }

  const maybeArgs = `${pythonArguments}${buildArguments}`;
  const psArgs = `& {& '${scriptPath}' ${maybeArgs} }`;
  const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs];

  return executeChildProcess('powershell.exe', args)
    .then(() => log(chalk.bold.green(`\nAll done!\n`)))
    .catch((error) => debug(`Encountered environment setting error: ${error}`));
}
