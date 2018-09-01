import * as path from 'path';

import { PYTHON } from '../constants';
import { getWorkDirectory } from './get-work-dir';

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 */
export function getPythonInstallerPath() {
  const directory = getWorkDirectory();

  return {
    path: path.join(directory, PYTHON.installerName),
    fileName: PYTHON.installerName,
    url: PYTHON.installerUrl,
    logPath: path.join(directory, PYTHON.logName),
    targetPath: path.join(directory, PYTHON.targetName),
    directory
  };
}
