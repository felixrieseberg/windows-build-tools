import * as path from 'path';

import { buildTools } from '../constants';
import { getWorkDirectory } from './get-work-dir';

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {Object} - Object containing path and fileName of installer
 */
export function getBuildToolsInstallerPath() {
  const directory = getWorkDirectory();

  return {
    path: path.join(directory, buildTools.installerName),
    fileName: buildTools.installerName,
    url: buildTools.installerUrl,
    logPath: buildTools.logName ? path.join(directory, buildTools.logName) : null,
    directory
  };
}
