import * as nugget from 'nugget';

import chalk from 'chalk';
import { IS_BUILD_TOOLS_INSTALLED, IS_DRY_RUN, IS_PYTHON_INSTALLED } from './constants';
import { Installer } from './interfaces';
import { log } from './logging';
import { getBuildToolsInstallerPath } from './utils/get-build-tools-installer-path';
import { getPythonInstallerPath } from './utils/get-python-installer-path';

/**
 * Downloads the Visual Studio C++ Build Tools and Python installer to a temporary folder
 * at %USERPROFILE%\.windows-build-tools
 */
export async function download(cb: () => void) {
  const handleFailure = (error: Error, name: string) => {
    log(chalk.bold.red(`Downloading ${name} failed. Error:`), error);
    log(chalk.bold.red(`windows-build-tools will now exit.`));
    process.exit(1);
  };

  if (!IS_PYTHON_INSTALLED) {
    try {
      await downloadTools(getPythonInstallerPath());
    } catch (error) {
      handleFailure(error, 'Python');
    }
  }

  if (!IS_BUILD_TOOLS_INSTALLED) {
    try {
      await downloadTools(getBuildToolsInstallerPath());
    } catch (error) {
      handleFailure(error, 'Visual Studio Build Tools');
    }
  }

  cb();
}

/**
 * Downloads specified file with a url from the installer.
 */
function downloadTools(installer: Installer): Promise<string> {
  return new Promise((resolve, reject) => {
    const nuggetOptions = {
      target: installer.fileName,
      dir: installer.directory,
      resume: process.env.npm_config_resume || true,
      verbose: true,
      strictSSL: process.env.npm_config_strict_ssl || false,
      proxy: process.env.npm_config_proxy || process.env.PROXY || undefined,
      sockets: process.env.npm_config_sockets || undefined
    };

    const nuggetCallback = (errors?: Array<Error>) => {
      if (errors) {
        // nugget returns an array of errors but we only need 1st because we only have 1 url
        const error = errors[0];

        if (error.message.indexOf('404') === -1) {
          return reject(error);
        } else {
          return reject(new Error(`Could not find ${installer.fileName} at ${installer.url}`));
        }
      }

      log(`Downloaded ${installer.fileName}. Saved to ${installer.path}.`);
      resolve(installer.path);
    };

    if (IS_DRY_RUN) {
      nuggetCallback();
    } else {
      // Log double newline because Nugget is the worst about overwriting
      // output
      log('\n');
      nugget(installer.url, nuggetOptions, nuggetCallback);
    }
  });
}
