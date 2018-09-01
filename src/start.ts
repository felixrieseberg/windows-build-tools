import chalk from 'chalk';

import { aquireInstallers } from './aquire-installers';
import { IS_DRY_RUN } from './constants';
import { setEnvironment } from './environment';
import { install } from './install';
import { InstallationDetails } from './interfaces';
import { log } from './logging';

function main() {
  if (IS_DRY_RUN) {
    log(chalk.bold.green(`Dry run: Not actually doing anything.`));
  }

  // The dumbest callbacks. All other methods resulted
  // in stacks that we're too deep and errored out on some
  // machines.
  aquireInstallers(() => {
    install((variables: InstallationDetails) => {
      setEnvironment(variables)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
    });
  })
    .catch(console.error);
}

main();
