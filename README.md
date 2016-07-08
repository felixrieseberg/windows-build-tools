# Windows-Build-Tools
<a href="https://ci.appveyor.com/project/felixrieseberg/windows-build-tools"><img src="https://ci.appveyor.com/api/projects/status/gpna6y54wnfp07xr?svg=true" /></a>

On Windows? Want to compile native Node modules? Install the build tools with this one-liner:

```
npm install --global --production windows-build-tools
```

![Gif](https://cloud.githubusercontent.com/assets/1426799/15993939/2bbb470a-30aa-11e6-9cde-94c39b3f35cb.gif)

After installation, npm will automatically execute this module, which downloads and installs Visual C++ Build Tools 2015, provided free of charge by Microsoft. These tools are [required to compile popular native modules](https://github.com/nodejs/node-gyp). It will also install Python 2.7, configuring your machine and npm appropriately.

 > :bulb: [Windows Vista / 7 only] requires [.NET Framework 4.5.1](http://www.microsoft.com/en-us/download/details.aspx?id=40773) (Currently not installed automatically by this package)
 
Both installations are conflict-free, meaning that they do not mess with existing installations of Visual Studio, C++ Build Tools, or Python. If you see anything that indiciates otherwise, please file a bug.

## Support & Help
This package currently only handles the most common use case, none of the edge cases. If you encounter errors, we'd greatly appreciate [error reports](https://github.com/felixrieseberg/windows-build-tools) (and even pull requests). This is currently tested on Windows 10.

## License & Credits
The Python installation was made possible by [Ali Hajimirza](https://github.com/A92hm), who kindly wrestled with Python's MSIs until they surrendered.

Copyright (C) 2016 Felix Rieseberg and Microsoft Corporation. Licensed MIT. For more details, please see LICENSE.
