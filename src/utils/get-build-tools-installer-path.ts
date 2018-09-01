import * as path from 'path';

import { BUILD_TOOLS } from '../constants';
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
    path: path.join(directory, BUILD_TOOLS.installerName),
    fileName: BUILD_TOOLS.installerName,
    url: BUILD_TOOLS.installerUrl,
    logPath: BUILD_TOOLS.logName ? path.join(directory, BUILD_TOOLS.logName) : null,
    directory
  };
}
