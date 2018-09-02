import { BUILD_TOOLS } from '../constants';

export function includesSuccess(input: string = '') {
  let isBuildToolsSuccess;
  let isPythonSuccess;

  if (BUILD_TOOLS.version === 2015) {
    // Success strings for build tools (2015)
    isBuildToolsSuccess = input.includes('Variable: IsInstalled = 1') ||
      input.includes('Variable: BuildTools_Core_Installed = ') ||
      input.includes('WixBundleInstalled = 1') ||
      input.includes('Setting string variable \'IsInstalled\' to value \'1\'') ||
      input.includes('Apply complete, result: 0x0, restart: None, ba requested restart:');
  } else {
    // Success strings for build tools (2017)
    isBuildToolsSuccess = input.includes('Closing installer. Return code: 3010.') ||
      input.includes('Closing installer. Return code: 0.');
  }

  // Success strings for Python
  isPythonSuccess = input.includes('INSTALL. Return value 1') ||
    input.includes('Installation completed successfully') ||
    input.includes('Configuration completed successfully');

  return {
    isBuildToolsSuccess,
    isPythonSuccess
  };
}

export function includesFailure(input: string = '') {
  return input.includes('Closing installer. Return code:') ||
    input.includes('Shutting down, exit code:') ||
    input.includes(' -- Installation failed.');
}
