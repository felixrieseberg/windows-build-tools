[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$pythonPath,
    [Parameter(Mandatory=$True)]
    [string]$pythonExePath,
    [switch]$AddPythonToPath
)

# Setting the MSVS Version
# We need to set it to 2015 for both Visual Studio 2015 and Visual Studio 2017 - 
# at least as long as the underlying gyp tools don't understand 2017
[Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", "2015", "User")
npm config set msvs_version 2015

# Setting python path
npm config set python $pythonExePath

# Add Python to path, if that's inteded by the User
if ($AddPythonToPath.IsPresent) {
    [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;$env:Path", "User")
    [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;$env:Path", "Process")
}
