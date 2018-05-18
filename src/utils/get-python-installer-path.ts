import * as path from 'path';

import { python } from '../constants';
import { getWorkDirectory } from './get-work-dir';

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 */
export function getPythonInstallerPath() {
  const directory = getWorkDirectory();

  return {
    path: path.join(directory, python.installerName),
    fileName: python.installerName,
    url: python.installerUrl,
    logPath: path.join(directory, python.logName),
    targetPath: path.join(directory, python.targetName),
    directory
  };
}
