import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {string} - Path to windows-build-tools working dir
 */
export function getWorkDirectory() {
  const homeDir = process.env.USERPROFILE || require('os').homedir();
  const workDir = path.join(homeDir, '.windows-build-tools');

  try {
    fs.ensureDirSync(workDir);
    return workDir;
  } catch (error) {
    console.log(error);
  }
}
