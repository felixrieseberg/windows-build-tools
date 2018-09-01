import { OFFLINE_PATH } from './constants';
import { download } from './download';
import { copyInstallers } from './offline';

/**
 * Aquire the installers, either by copying them from
 * their offline location or by downloading them.
 *
 * @param {() => void} cb\
 * @returns {Promise.void}
 */
export async function aquireInstallers(cb: () => void): Promise<void> {
  console.log(OFFLINE_PATH);

  if (OFFLINE_PATH) {
    await copyInstallers();

    cb();
  } else {
    download(cb);
  }
}
