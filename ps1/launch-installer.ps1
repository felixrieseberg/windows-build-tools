[CmdletBinding()]
Param(
  [string]$BuildToolsInstallerPath,
  [string]$ExtraBuildToolsParameters,
  [string]$PythonInstaller,
  [string]$VisualStudioVersion,
  [switch]$InstallPython,
  [switch]$InstallBuildTools
)

# Returns whether or not the current user has administrative privileges
function IsAdministrator {
  $Identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
  $Principal = New-Object System.Security.Principal.WindowsPrincipal($Identity)
  $Principal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Returns whether or not UAC is enabled on Windows
function IsUacEnabled {
  (Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System).EnableLua -ne 0
}

# Runs the installer
function runInstaller {
  if (Test-Path $BuildToolsInstallerPath) {
    $extraParams = $ExtraBuildToolsParameters -split "%_; "

    if ($extraParams.count -gt 0) {
      foreach ($element in $extraParams) {
        $params += $element
      }
    }

    cd $BuildToolsInstallerPath

    if ($VisualStudioVersion -eq "2017") {
      $params = "--norestart", "--quiet", "--includeRecommended", "--add", "Microsoft.VisualStudio.Workload.VCTools"
      ./vs_BuildTools.exe $params
    } else {
      $params = "/NoRestart", "/S", "/L", "`"$BuildToolsInstallerPath\build-tools-log.txt`""
      ./BuildTools_Full.exe $params
    }
  } else {
    Write-Output "Tried to start Build Tools installer, but couldn't find $BuildToolsInstallerPath."
  }
}

function runPythonInstaller {
  if (Test-Path $BuildToolsInstallerPath) {
    cd $BuildToolsInstallerPath
    $pyParams = "/i", $PythonInstaller, "TARGETDIR=```"$BuildToolsInstallerPath\python27```"", "ALLUSERS=0", "/qn", "/L*P", "`"$BuildToolsInstallerPath\python-log.txt`""
    Invoke-Expression "msiexec.exe $pyParams"
  } else {
    Write-Output "Tried to start Python installer, but couldn't find $BuildToolsInstallerPath."
  }
}

# Check Elevation
if (!(IsAdministrator)) {
  "Please restart this script from an administrative PowerShell!"
  "We cannot install the build tools without administrative rights."
  return
}

# Print Arguments
Write-Output "Passed arguments: $args"

if ($InstallBuildTools.IsPresent) {
  runInstaller;
}

if ($InstallPython.IsPresent) {
  runPythonInstaller;
}
