[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$pythonPath,
    [Parameter(Mandatory=$True)]
    [string]$pythonExePath,
    [switch]$AddPythonToPath
)

# Setting the MSVS Version
[Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", "2017", "User")
npm config set msvs_version 2017

# Setting python path
npm config set python $pythonExePath

# Add Python to path, if that's inteded by the User
if ($AddPythonToPath.IsPresent) {
    [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;$env:Path", "User")
    [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;$env:Path", "Process")
}
