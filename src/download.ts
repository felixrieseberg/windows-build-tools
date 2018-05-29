import * as nugget from 'nugget';

import { isDryRun, isPythonInstalled } from './constants';
import { Installer } from './interfaces';
import { log } from './logging';
import { getBuildToolsInstallerPath } from './utils/get-build-tools-installer-path';
import { getPythonInstallerPath } from './utils/get-python-installer-path';

/**
 * Downloads the Visual Studio C++ Build Tools and Python installer to a temporary folder
 * at %USERPROFILE%\.windows-build-tools
 */
export function download(cb: () => void) {
  const downloads: Array<Promise<string>> = [downloadTools(getBuildToolsInstallerPath())];

  if (!isPythonInstalled) {
    downloads.push(downloadTools(getPythonInstallerPath()));
  }

  Promise.all(downloads)
    .then(() => cb())
    .catch((error) => log(error));
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

    if (isDryRun) {
      nuggetCallback();
    } else {
      nugget(installer.url, nuggetOptions, nuggetCallback);
    }
  });
}
