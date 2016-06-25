[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$path
)

# Setting the MSVS Version
[Environment]::SetEnvironmentVariable("GYP_MSVS_VERSION", "2015", "User")
npm config set msvs_version 2015

# Setting python path
npm config set python $path/python2.7