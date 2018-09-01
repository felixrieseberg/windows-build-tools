import * as fs from 'fs-extra';
import * as path from 'path';
import { BUILD_TOOLS, IS_DRY_RUN, OFFLINE_PATH, PYTHON } from './constants';
import { error, log } from './logging';
import { getBuildToolsInstallerPath } from './utils/get-build-tools-installer-path';
import { getPythonInstallerPath } from './utils/get-python-installer-path';

const PYTHON_INSTALLER = path.join(OFFLINE_PATH || '', PYTHON.installerName);
const VS_INSTALLER = path.join(OFFLINE_PATH || '', BUILD_TOOLS.installerName);

/**
 * Check if the installer at a given path can be found and error out if
 * it does not exist.
 *
 * @param {string} installerPath
 * @param {string} installerName
 * @returns {boolean}
 */
function ensureInstaller(installerPath: string, installerName: string): void {
  if (!fs.existsSync(installerPath)) {
    if (IS_DRY_RUN) {
      log(`Dry run: Installer ${installerPath} not found, would have stopped here.`);
      return;
    }

    let message = `Offline installation: Offline path ${OFFLINE_PATH} was passed, `;
    message += `but we could not find ${installerName} in that path. `;
    message += `Aborting installation now.`;

    error(message);

    process.exit(1);
  }
}

/**
 * Copy the installers from their offline directory to their target directory.
 *
 * @returns {Promise.void}
 */
export async function copyInstallers(): Promise<void> {
  if (!OFFLINE_PATH) {
    throw new Error(`npm_config_offline_installers not found!`);
  }

  ensureInstaller(PYTHON_INSTALLER, PYTHON.installerName);
  ensureInstaller(VS_INSTALLER, BUILD_TOOLS.installerName);

  if (IS_DRY_RUN) {
    log(`Dry run: Would have copied installers.`);
    return;
  }

  try {
    await fs.copy(PYTHON_INSTALLER, getPythonInstallerPath().path);
    await fs.copy(VS_INSTALLER, getBuildToolsInstallerPath().path);
  } catch (error) {
    let message = `Offline installation: Could not copy over installers. `;
    message += `Aborting installation now.\n`;
    message += error;

    error(message);

    process.exit(1);
  }
}
