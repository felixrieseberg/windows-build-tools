[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$path
)

# Returns whether or not the current user has administrative privileges
function IsAdministrator
{
    $Identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
    $Principal = New-Object System.Security.Principal.WindowsPrincipal($Identity)
    $Principal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Returns whether or not UAC is enabled on Windows
function IsUacEnabled
{
    (Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System).EnableLua -ne 0
}

# Runs the installer
function runInstaller
{
    if (Test-Path $path)
    {
        $params = "/NoRestart", "/S", "/L", "`"$path\build-tools-log.txt`""
        cd $path
        ./BuildTools_Full.exe $params
    }
}

function runPythonInstaller
{
    if (Test-Path $path)
    {
        cd $path
        $pyParams = "/i", "python-2.7.11.msi", "TARGETDIR=`"$path\python27`"", "ALLUSERS=0", "/qn", "/L*P", "`"$path\python-log.txt`""
        msiexec.exe $pyParams
    }
}

# Check Elevation
if (!(IsAdministrator))
{
    "Please restart this script from an administrative PowerShell!"
    "We cannot install the build tools without administrative rights."
    return
}

runInstaller;
runPythonInstaller;
