import * as inGFW from 'in-gfw';
import * as path from 'path';

import { getIsPythonInstalled } from './utils/get-is-python-installed';

const pythonMirror = process.env.npm_config_python_mirror
  || process.env.PYTHON_MIRROR
  || (inGFW.osSync() ? 'https://npm.taobao.org/mirrors/python' : 'https://www.python.org/ftp/python');

// To implement
export const IS_BUILD_TOOLS_INSTALLED = false;

export const OFFLINE_PATH = process.env.npm_config_offline_installers;

export const IS_DRY_RUN = !!process.env.npm_config_dry_run_only;

export const INSTALLED_PYTHON_VERSION = getIsPythonInstalled();

export const IS_PYTHON_INSTALLED = !!INSTALLED_PYTHON_VERSION;

export const PYTHON = process.arch === 'x64'
  ? {
    installerName: 'python-2.7.15.amd64.msi',
    installerUrl: pythonMirror.replace(/\/*$/, '/2.7.15/python-2.7.15.amd64.msi'),
    targetName: 'python27',
    logName: 'python-log.txt'
  } : {
    installerName: 'python-2.7.15.msi',
    installerUrl: pythonMirror.replace(/\/*$/, '/2.7.15/python-2.7.15.msi'),
    targetName: 'python27',
    logName: 'python-log.txt'
  };

export const BUILD_TOOLS = getBuildTools();
function getBuildTools() {
  const vs2017 = {
    installerName: 'vs_BuildTools.exe',
    installerUrl: 'https://download.visualstudio.microsoft.com/download/pr/11503713/e64d79b40219aea618ce2fe10ebd5f0d/vs_BuildTools.exe',
    logName: null,
    version: 2017
  };
  const vs2015 = {
    installerName: 'BuildTools_Full.exe',
    installerUrl: 'https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe',
    logName: 'build-tools-log.txt',
    version: 2015
  };

  if (process.env.npm_config_vs2017) {
    return vs2017;
  } else if (process.env.npm_config_vs2015) {
    return vs2015;
  }

  // Default
  return vs2017;
}

export const installerScriptPath = IS_DRY_RUN
  ? path.join(__dirname, '..', 'ps1', 'dry-run.ps1')
  : path.join(__dirname, '..', 'ps1', 'launch-installer.ps1');
