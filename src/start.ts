import { download } from './download';
import { setEnvironment } from './environment';
import { install } from './install';
import { InstallationDetails } from './interfaces';

function main() {
  download(function() {
    install(function(variables: InstallationDetails) {
      setEnvironment(variables);
    });
  });
}

main();
