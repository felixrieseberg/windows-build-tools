[CmdletBinding()]
Param(
  [string]$pythonPath,
  [string]$pythonExePath,
  [string]$VisualStudioVersion,
  [switch]$ConfigurePython,
  [switch]$ConfigureBuildTools
)

function configureBuildTools() {
  if ($VisualStudioVersion -eq "2015") {
    # Setting MSVS version is needed only for the VS2015 Build Tools, not for other editions
    [Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", "2015", "User")
    npm config set msvs_version 2015
  } else {
    # Rely on node-gyp/gyp autodetection
    npm config delete msvs_version
    npm config delete msvs_version --global
    [Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", $null, "User")
    [Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", $null, "Machine")
  }
}

function configurePython() {
  # Setting python path
  npm config set python $pythonExePath

  # Add Python to path
  [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;" + [System.Environment]::GetEnvironmentVariable("Path", "User"), "User")
  [System.Environment]::SetEnvironmentVariable("Path", "$pythonPath;$env:Path", "Process")
}

if ($ConfigureBuildTools.IsPresent) {
  configureBuildTools;
}

if ($ConfigurePython.IsPresent) {
  configurePython;
}
