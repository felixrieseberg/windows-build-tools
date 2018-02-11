[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$path,
    [string]$extraBuildToolsParameters,
    [string]$pythonInstaller
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
        $params = "--norestart", "--quiet", "--add", "Microsoft.VisualStudio.Workload.VCTools"
        $extraParams = $extraBuildToolsParameters -split "%_; "

        if ($extraParams.count -gt 0)
        {
            foreach ($element in $extraParams)
            {
                $params += $element
            }
        }

        cd $path
        ./vs_BuildTools.exe $params

    }
}

function runPythonInstaller
{
    if (Test-Path $path)
    {
        cd $path
        $pyParams = "/i", $pythonInstaller, "TARGETDIR=```"$path\python27```"", "ALLUSERS=0", "/qn", "/L*P", "`"$path\python-log.txt`""
        Invoke-Expression "msiexec.exe $pyParams"
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
