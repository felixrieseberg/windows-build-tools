# Windows-Build-Tools

On Windows? Want to compile native Node modules? Install the build tools with this one-liner:

```
npm install --global --production windows-build-tools
```

After installation, npm will automatically execute this module, which downloads and installs Visual C++ Build Tools 2015, provided free of charge by Microsoft. These tools are [required to compile popular native modules](https://github.com/nodejs/node-gyp).

> :warning: If you don't have Python installed, you will likely also have to install [Python 2.7](https://www.python.org/download/releases/2.7/).

## Support & Help
This package currently only handles the most common use case, none of the edge cases. If you encounter errors, we'd greatly appreciate [error reports](https://github.com/felixrieseberg/windows-build-tools) (and even pull requests). This is currently tested on Windows 10.

## License
Copyright (C) 2016 Felix Rieseberg and Microsoft Corporation. Licensed MIT. For more details, please see LICENSE.
