import * as fs from 'fs-extra';
import { tmpdir } from 'os';
import * as path from 'path';

const debug = require('debug')('windows-build-tools');
const tmp = tmpdir();

/**
 * Looks for a dd_client_ file and returns the path if found.\
 * Returns null if not found.
 *
 * @returns {string|null}
 */
export function findVCCLogFile(): Promise<string> {
  return new Promise((resolve) => {
    fs.readdir(tmp)
      .then((contents) => {
        // Files that begin with dd_client_
        const matchingFiles = contents.filter((f) => f.startsWith('dd_client_'));
        let matchingFile = null;

        if (matchingFiles && matchingFiles.length === 1) {
          // Is it just one? Cool, let's use that one
          matchingFile = path.join(tmp, matchingFiles[0]);
          debug(`Find LogFile: Just one file found, resolving with ${matchingFile}`);
        } else if (!matchingFiles || matchingFiles.length === 0) {
          // No files? Return null
          debug(`Find LogFile: No files found, resolving with null`);
          matchingFile = null;
        } else {
          // Multiple files! Oh boy, let's find the last one
          debug(`Find LogFile: Multiple files found, determining last modified one`);
          const lastModified = matchingFiles.reduce((previous, current) => {
            const file = path.join(tmp, current);
            const stats = fs.statSync(file);

            let modifiedTime;

            if (stats && (stats as any).mtimeMs) {
              // This value is only available in Node 8+
              modifiedTime = (stats as any).mtimeMs;
            } else if (stats && stats.mtime) {
              // Fallback for the other versions
              modifiedTime = new Date(stats.mtime).getTime();
            }

            debug(`Find LogFile: Comparing ${modifiedTime} to ${previous.timestamp}`);

            if (modifiedTime && modifiedTime > previous.timestamp) {
              return { file: current, timestamp: modifiedTime };
            } else {
              return previous;
            }
          }, { file: null, timestamp: 0 });

          debug(`Find LogFile: Returning ${lastModified.file}`);
          matchingFile = path.join(tmp, lastModified.file);
        }

        resolve(matchingFile);
      })
      .catch((error) => {
        debug(`Did not find VCC logfile: ${error}`);
        return null;
      });
  });
}
