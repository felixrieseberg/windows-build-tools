import chalk from 'chalk';

import { isDryRun } from './constants';
import { download } from './download';
import { setEnvironment } from './environment';
import { install } from './install';
import { InstallationDetails } from './interfaces';
import { log } from './logging';

function main() {
  if (isDryRun) {
    log(chalk.bold.green(`Dry run: Not actually doing anything.`));
  }

  download(function() {
    install(function(variables: InstallationDetails) {
      setEnvironment(variables);
    });
  });
}

main();
