# Windows-Build-Tools
<a href="https://ci.appveyor.com/project/felixrieseberg/windows-build-tools"><img src="https://ci.appveyor.com/api/projects/status/gpna6y54wnfp07xr?svg=true" /></a>
<a href="http://badge.fury.io/js/windows-build-tools"><img src="https://badge.fury.io/js/windows-build-tools.svg" alt="npm version" height="18"></a> <a href="https://david-dm.org/felixrieseberg/windows-build-tools"><img src="https://david-dm.org/felixrieseberg/windows-build-tools.svg" alt="dependencies" height="18px"></a> <img src="https://img.shields.io/npm/dm/windows-build-tools.svg" height="18px" />

On Windows? Want to compile native Node modules? Install the build tools with this one-liner:

```
npm install --global windows-build-tools
```

![Gif](https://cloud.githubusercontent.com/assets/1426799/15993939/2bbb470a-30aa-11e6-9cde-94c39b3f35cb.gif)

After installation, npm will automatically execute this module, which downloads and installs Visual C++ Build Tools 2015, provided free of charge by Microsoft. These tools are [required to compile popular native modules](https://github.com/nodejs/node-gyp). It will also install Python 2.7, configuring your machine and npm appropriately.

 > :bulb: [Windows Vista / 7 only] requires [.NET Framework 4.5.1](http://www.microsoft.com/en-us/download/details.aspx?id=40773) (Currently not installed automatically by this package)

Both installations are conflict-free, meaning that they do not mess with existing installations of Visual Studio, C++ Build Tools, or Python. If you see anything that indiciates otherwise, please file a bug.

## Contents

 - Visual C++ Compilers (targeting x86, X64 and ARM)
 - Visual C++ headers & libraries (CRT & STL)
 - Visual C++ build scripts (targeting Windows desktop)
 - Microsoft Build Tools 2015 (MSBuild)
 - Windows SDK 8.1 (optional, on by default)
 - Windows SDK 10 (optional, off by default)
 - ATL and MFC (optional, off by default)
 - C++ Build tools specific command prompts

## Usage

```
npm [--add-python-to-path] [--python-mirror=''] [--proxy=''] [--debug] [--strict-ssl] [--resume] [--sockets=5] [--vcc-build-tools-parameters=''] install --global windows-build-tools
```

Optional arguments:
 - `--add-python-to-path`: Add Python to the environment, allowing you to type `python.exe` in any shell. Defaults to `false`.
 - `--python-mirror`: Use a given mirror to download Python (like `--python_mirror=https://npm.taobao.org/mirrors/python/`). You can alternatively set a `PYTHON_MIRROR` environment variable.
 - `--proxy`: Use a given proxy. You can alternatively set a `PROXY` environment variable.
 - `--debug`: Be extra verbose in the logger output. Equal to setting the environment variable `DEBUG` to `*`.
 - `--strict-ssl`: Enables "Strict SSL" mode. Defaults to false.
 - `--resume`: By default, `windows-build-tools` will resume aborted downloads. Set to `false` to disable.
 - `--sockets`: Specifies the number of http sockets to use at once (this controls concurrency). Defaults to infinity.
 - `--vcc-build-tools-parameters`: Specifies additional parameters for the Visual C++ Build Tools 2015. See below for more detailed usage instructions.
 - `--silent`: The script will not output any information.

## Supplying Parameters to the VCC Build Tools
You can pass additional parameters directly to the VCC Build Tools installer. This tool does not check if the parameters make sense - passing incorrect parameters might break the whole installation. As of January 2017, the following parameters are available:

 - `/AdminFile`: <filename> Specifies the installation control file.
 - `/CreateAdminFile`: <filename> Specifies the location to create a control file that can then be used
 - `/CustomInstallPath`: <path> Set Custom install location.
 - `/ForceRestart`: Always restart the system after installation.
 - `/Full`: Install all product features.
 - `/InstallSelectableItems`: <item1;item2;...;itemN> Choose which selectable item(s) to be installed.
selectable item to be installed, just pass in this switch without any value.
 - `/Layout`: Create a copy of the media in specified folder.
 - `/NoRefresh`: Prevent setup checking for updates from the internet.
 - `/NoRestart`: Do not restart during or after installation.
 - `/NoWeb`: Prevent setup downloading from the internet.
 - `/Passive`: Display progress but do not wait for user input.
 - `/ProductKey`: <25-character product key> Set custom product key (no dashes).
 - `/PromptRestart`: Prompt the user before restarting the system.
 - `/Repair`: Repair the product.
 - `/Uninstall`: Uninstall the product.
 - `/Uninstall /Force`: Uninstall the product and features shared with other products.

 Supply parameters to `windows-build-tools` as a JSON array. Here's quick example (note the double quotes):

 ```
 npm --vcc-build-tools-parameters='[""/InstallSelectableItems"", ""item1;item2;item3""]' install --global windows-build-tools
 ```

## Support & Help

This package currently only handles the most common use case, none of the edge cases. If you encounter errors, we'd greatly appreciate [error reports](https://github.com/felixrieseberg/windows-build-tools) (and even pull requests). This is currently tested on Windows 10.

#### Where is Python installed?
It's saved under `%USERPROFILE%\.windows-build-tools\python27`.

#### 'Python' is not recognized as a command
To not mess with your machine in unnecessary ways, Python is only installed to disk and configured with npm. If you'd like for the `python` command to work in `cmd.exe` and PowerShell, add the folder `%USERPROFILE%\.windows-build-tools\python27` to your environment variables.

## License & Credits

The Python installation was made possible by [Ali Hajimirza](https://github.com/A92hm), who kindly wrestled with Python's MSIs until they surrendered.

Copyright (C) 2016 Felix Rieseberg and Microsoft Corporation. Licensed MIT. For more details, please see LICENSE.
