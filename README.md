# Windows-Build-Tools

<a href="https://ci.appveyor.com/project/felixrieseberg/windows-build-tools"><img src="https://ci.appveyor.com/api/projects/status/gpna6y54wnfp07xr?svg=true" /></a>
<a href="http://badge.fury.io/js/windows-build-tools"><img src="https://badge.fury.io/js/windows-build-tools.svg" alt="npm version" height="18"></a> <a href="https://david-dm.org/felixrieseberg/windows-build-tools"><img src="https://david-dm.org/felixrieseberg/windows-build-tools.svg" alt="dependencies" height="18px"></a> <img src="https://img.shields.io/npm/dm/windows-build-tools.svg" height="18px" />

On Windows? Want to compile [native Node modules](#examples-of-modules-supported)? Install the build tools with this one-liner. Start PowerShell as Administrator and run:

```
npm install --global windows-build-tools
```

Or, if you are using Yarn:

```
yarn global add windows-build-tools
```

![Gif](https://user-images.githubusercontent.com/1426799/45007904-bde9f280-afb4-11e8-8a35-c77dffaffa2a.gif)

After installation, npm will automatically execute this module, which downloads and installs Visual
C++ Build Tools, provided free of charge for most users by Microsoft (as part of Visual Studio Community, please consult the license to determine whether or not you're eligible). These tools are [required to compile popular native modules](https://github.com/nodejs/node-gyp).
If not already installed, it will also install Python 2.7, configuring your machine and npm appropriately.

> :bulb: [Windows Vista / 7 only] requires [.NET Framework 4.5.1](http://www.microsoft.com/en-us/download/details.aspx?id=40773) (Currently not installed automatically by this package)

Both installations are conflict-free, meaning that they do not mess with existing installations of
Visual Studio, C++ Build Tools, or Python. If you see anything that indicates otherwise, please
file a bug.

## Visual Studio 2017 vs Visual Studio 2015
This module is capable of installing either the build tools from Visual Studio [2017](https://blogs.msdn.microsoft.com/vcblog/2016/11/16/introducing-the-visual-studio-build-tools/) or Visual
Studio [2015](https://blogs.msdn.microsoft.com/vcblog/2016/03/31/announcing-the-official-release-of-the-visual-c-build-tools-2015/).

By default, this tool will install the 2017 build tools. To change that, run this script with
the `--vs2015` parameter.

## Usage

```
npm [--python-mirror=''] [--proxy=''] [--debug] [--strict-ssl] [--resume] [--sockets=5] [--vcc-build-tools-parameters=''] [--vs2015] [--dry-run-only] install --global windows-build-tools
```

Optional arguments:

* `--offline-installers`: Path to a folder with already downloaded installers. See
* `--python-mirror`: Use a given mirror to download Python (like `--python_mirror=https://npm.taobao.org/mirrors/python/`). You can alternatively set a `PYTHON_MIRROR` environment variable.
* `--proxy`: Use a given proxy. You can alternatively set a `PROXY` environment variable.
* `--debug`: Be extra verbose in the logger output. Equal to setting the environment variable `DEBUG` to `*`.
* `--strict-ssl`: Enables "Strict SSL" mode. Defaults to false.
* `--resume`: By default, `windows-build-tools` will resume aborted downloads. Set to `false` to disable.
* `--sockets`: Specifies the number of http sockets to use at once (this controls concurrency). Defaults to infinity.
* `--vcc-build-tools-parameters`: Specifies additional parameters for the Visual C++ Build Tools 2015. See below for more detailed usage instructions.
* `--silent`: The script will not output any information.
* `--vs2015`: Install the Visual Studio 2015 Build Tools instead of the Visual Studio 2017 ones.
* `--dry-run-only`: Don't actually do anything, just print what the script would have done.
* `--include-arm64-tools`: Include the optional Visual Studio components required to build binaries for ARM64 Windows. Only available with the 2017 and newer build tools and Node.js v12 and up.

## Supplying Parameters to the VCC Build Tools

You can pass additional parameters directly to the VCC Build Tools installer. This tool does not
check if the parameters make sense - passing incorrect parameters might break the whole
installation.

Supply parameters to `windows-build-tools` as a JSON array. Here's quick example (note the double quotes):

```
npm --vcc-build-tools-parameters='[""--allWorkloads""]' install --global windows-build-tools
```

### Visual Studio 2015 Parameters

If you run `windows-build-tools` with `--vs2015`, these parameters are available:

 - `/AdminFile`: <filename> Specifies the installation control file.
 - `/CreateAdminFile`: <filename> Specifies the location to create a control file that can then be used
 - `/CustomInstallPath`: <path> Set Custom install location.
 - `/ForceRestart`: Always restart the system after installation.
 - `/Full`: Install all product features.
 - `/InstallSelectableItems`: <item1;item2;...;itemN> Choose which selectable item(s) to be installed.
-selectable item to be installed, just pass in this switch without any value.
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

### Visual Studio 2017 Parameters

The available parameters [are documented here](https://docs.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio).

### Offline Installation

By default, `windows-build-tools` will download the latest installers from Microsoft each time
it's installed. Alternatively, you can prepare a folder that contains installers. They need to
have their original names:

 * Visual Studio Build Tools: `vs_BuildTools.exe` or `BuildTools_Full.exe`
 * Python: `python-2.7.15.amd64.msi` or `python-2.7.15.msi`

Then, run `windows-build-tools` with the `--offline-installers` argument:

```ps1
npm install -g windows-build-tools --offline-installers="C:\Users\John\installers"
```

## Support & Help

This package currently only handles the most common use case, none of the edge cases. If you encounter errors, we'd greatly appreciate [error reports](https://github.com/felixrieseberg/windows-build-tools) (and even pull requests). This is currently tested on Windows 10.

#### Node versions
 * `windows-build-tools` 4.0 and up require at least Node v8.
 * `windows-build-tools` 3.0 and up require at least Node v6.
 * `windows-build-tools` 1.0 and up require at least Node v4.


#### Where is Python installed?

It's saved under `%USERPROFILE%\.windows-build-tools\python27`.

#### Installing as a Non-Administrator
`windows-build-tools` works best if installed from an account with administrative rights. However,
thanks to @brucejo75, the following steps can be taken to install to a different user account:

1. From your non-admin account (e.g. **\<Me\>**) run `cmd.exe` as administrator.
2. Set the following environment variables in the new command shell:

```
set APPDATA=C:\Users\<Me>\AppData\Roaming
npm config set prefix C:\Users\<Me>\AppData\Roaming\npm
set USERNAME=<Me>
set USERPROFILE=C:\Users\<Me>
```

Ensure that the variables passed match your location of npm's roaming data and the location
of user profiles on your machine. For `<me>`, substitute the name of the account you want to
install `windows-build-tools` for. For more information, see the `npm config set prefix`
description [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

3. Run `npm install -g windows-build-tools`

## Examples of Modules Supported
In theory, `windows-build-tools` supports all pure C++ addons for Node.js (and virtually everything
else that requires a native compiler toolchain to be installed on your machine).

To ensure that that's true, we take a fresh Windows 10 installation, add `windows-build-tools`, and
ensure that the most popular native Node addons compile from source. Those are: [node-sass](https://www.npmjs.com/package/node-sass), [bcrypt](https://www.npmjs.com/package/bcrypt), [sqlite3](https://www.npmjs.com/package/sqlite3), [serialport](https://www.npmjs.com/package/serialport), [websocket](https://www.npmjs.com/package/websocket), [deasync](https://www.npmjs.com/package/deasync), [grpc](https://www.npmjs.com/package/grpc), [canvas](https://www.npmjs.com/package/canvas), [sharp](https://www.npmjs.com/package/sharp),
[hiredis](https://www.npmjs.com/package/hiredis), [leveldown](https://www.npmjs.com/package/leveldown), [nodegit](https://www.npmjs.com/package/nodegit), [zqm](https://www.npmjs.com/package/zqm), [ffi](https://www.npmjs.com/package/ffi), [libxmljs](https://www.npmjs.com/package/libxmljs), [iconv](https://www.npmjs.com/package/iconv), [ref](https://www.npmjs.com/package/ref), [sleep](https://www.npmjs.com/package/sleep), [microtime](https://www.npmjs.com/package/microtime), [couchbase](https://www.npmjs.com/package/couchbase), [bignum](https://www.npmjs.com/package/bignum),
[kerberos](https://www.npmjs.com/package/kerberos), and [ursa](https://www.npmjs.com/package/ursa).

## License & Credits

The Python installation was made possible by [Ali Hajimirza](https://github.com/ali92hm), who kindly wrestled with Python's MSIs until they surrendered. For details regarding the license agreements applicable to Python, see *History and License* [2.x](https://docs.python.org/2/license.html) and [3.x](https://docs.python.org/3/license.html).

Use of Microsoft software is subject to the terms of the corresponding license agreements. For details regarding the license agreements applicable to Visual Studio products, refer to their [*License Directory* page](https://visualstudio.microsoft.com/license-terms/). (See also [this discussion](https://social.msdn.microsoft.com/Forums/en-US/08d62115-0b51-484f-afda-229989be9263/license-for-visual-c-2017-build-tools?forum=visualstudiogeneral) for the gist of it.)

Copyright (C) 2018 Felix Rieseberg. Licensed MIT. For more details, please see LICENSE.
This license applies to this package only, not to its dependencies or the 3rd party software that it installs.
