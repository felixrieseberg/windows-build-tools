import * as fs from 'fs';
import { getBuildToolsInstallerPath } from './get-build-tools-installer-path';
import { getPythonInstallerPath } from './get-python-installer-path';

/**
 * Cleans existing log files
 */
export function cleanExistingLogFiles() {
  const files = [ getBuildToolsInstallerPath().logPath, getPythonInstallerPath().logPath ];

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}
