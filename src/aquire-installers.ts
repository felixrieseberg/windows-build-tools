import chalk from 'chalk';

import { OFFLINE_PATH } from './constants';
import { download } from './download';
import { log } from './logging';
import { copyInstallers } from './offline';


/**
 * Aquire the installers, either by copying them from
 * their offline location or by downloading them.
 *
 * @param {() => void} cb\
 * @returns {Promise.void}
 */
export async function aquireInstallers(cb: () => void): Promise<void> {
  const handleFailure = (error: Error) => {
    log(chalk.bold.red(`Downloading installers failed. Error:`), error);
    log(chalk.bold.red(`windows-build-tools will now exit.`));

    process.exit(1);
  };

  if (OFFLINE_PATH) {
    try {
      await copyInstallers();

      cb();
    } catch (error) {
      handleFailure(error);
    }
  } else {
    try {
      await download(cb);
    } catch (error) {
      handleFailure(error);
    }
  }
}
