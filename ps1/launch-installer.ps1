[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$path,
    [string]$extraBuildToolsParameters
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
        $extraParams = $extraBuildToolsParameters -split "%_; "

        if ($extraParams.count -gt 0)
        {
            foreach ($element in $extraParams)
            {
                $params += $element
            }
        }

        cd $path
        ./BuildTools_Full.exe $params

    }
}

function runPythonInstaller
{
    if (Test-Path $path)
    {
        cd $path
        $pyParams = "/i", "python-2.7.13.msi", "TARGETDIR=```"$path\python27```"", "ALLUSERS=0", "/qn", "/L*P", "`"$path\python-log.txt`""
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

# SIG # Begin signature block
# MIINQAYJKoZIhvcNAQcCoIINMTCCDS0CAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQUHZNLBoIXNfE5bv0qDrFM3cCc
# OL6gggp+MIIFJzCCBA+gAwIBAgIQBicsjH4LxacitIAMXdcrMDANBgkqhkiG9w0B
# AQsFADB2MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYD
# VQQLExB3d3cuZGlnaWNlcnQuY29tMTUwMwYDVQQDEyxEaWdpQ2VydCBTSEEyIEhp
# Z2ggQXNzdXJhbmNlIENvZGUgU2lnbmluZyBDQTAeFw0xNjA3MjkwMDAwMDBaFw0x
# NzExMDIxMjAwMDBaMGYxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UE
# BxMNU2FuIEZyYW5jaXNjbzEYMBYGA1UEChMPRmVsaXggUmllc2ViZXJnMRgwFgYD
# VQQDEw9GZWxpeCBSaWVzZWJlcmcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
# AoIBAQDes7XIX/iojJzc5bEQH+mG23t9iaAceti856llFiwmUn+sYFKLrwOsa4Tb
# L2IOHQq6TvyMi3IGk2JgmOVJm8+Ge1apHuUl0TY+Mc7gmEMTcSFPTf1bwRzbVy9n
# WV7N42kCKHnYSL81SE36FVyUwBAfilmAl7laWpeXs3vq58VyVYo7y2G/TqOnlJgF
# j4zvJ8yQZ1en1VoO89PoxCyXBcgwYJHdWaLtSieH8b5A0Ee1uas0wpx1w0V+kPKn
# 0CmBAPHzeFM9SX5FHSKCbCyZW2Tg9wkIBNs9ddVcEWq187nC/lzAUo/jbzdKAYBr
# Qi3VmXsi9akgspKTW0MeL0Gdgpm5AgMBAAGjggG/MIIBuzAfBgNVHSMEGDAWgBRn
# nQ8gCQzMijrlgkZyYvzxzJDlQDAdBgNVHQ4EFgQU2O0vzu/SWHPgwaCtyWbDl2aH
# UBwwDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMG0GA1UdHwRm
# MGQwMKAuoCyGKmh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWhhLWNzLWcx
# LmNybDAwoC6gLIYqaHR0cDovL2NybDQuZGlnaWNlcnQuY29tL3NoYTItaGEtY3Mt
# ZzEuY3JsMEwGA1UdIARFMEMwNwYJYIZIAYb9bAMBMCowKAYIKwYBBQUHAgEWHGh0
# dHBzOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwCAYGZ4EMAQQBMIGIBggrBgEFBQcB
# AQR8MHowJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBSBggr
# BgEFBQcwAoZGaHR0cDovL2NhY2VydHMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0U0hB
# MkhpZ2hBc3N1cmFuY2VDb2RlU2lnbmluZ0NBLmNydDAMBgNVHRMBAf8EAjAAMA0G
# CSqGSIb3DQEBCwUAA4IBAQAzrd3bUmtQp/JyRiYwD3C4tYDwIKZTCCeNrAzrEMut
# IKwVrzzrqg+977hem1tGhCev6FPeDvBYhgvREngbD3KlSv8fPuVZKZTnBw6ADGBj
# ntldXbHtA9w7C9PizvvS0pqrIycGnnEIFKxc5YeJoJwFSleCGndmp7ps933FmfpI
# jQdnEFQmtVuNvHdFIZBm0D279ivUFuSRkqd5tZ68Z2W4JWxzt/j1CCxsFWh5tmNN
# yAfKcKsNDusB6G9nse41p2D09a9bo6ktdqW4B46tSCUVOVa5p99OLswNdAA7mjYa
# +5Gk5c8H4dBnK9F4pAnnzN1cuy7timNXHAN1Aqsu3yRuMIIFTzCCBDegAwIBAgIQ
# C34QkDw4SQ/6L2eah6GnuTANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJVUzEV
# MBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNlcnQuY29t
# MSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5jZSBFViBSb290IENBMB4X
# DTEzMTAyMjEyMDAwMFoXDTI4MTAyMjEyMDAwMFowdjELMAkGA1UEBhMCVVMxFTAT
# BgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0LmNvbTE1
# MDMGA1UEAxMsRGlnaUNlcnQgU0hBMiBIaWdoIEFzc3VyYW5jZSBDb2RlIFNpZ25p
# bmcgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC0Sl59Bw9B3sT1
# dhY2vXH/zz9Pc0uc0Q3+SstXWF6FFt0CFVSZ8I88L00CeBBoyNg1Sz/B92fOmByu
# M7ktHaQKVJPEhaLfNbH18TynszT7XUjJRsliRLxImesoSVPDPY/ADt41mOliUd89
# a0Bh7gRB2s+nXFaW0flMt0SEh5hp5YK5E+ZVv8iScJIKMW9/izKrz2tan2LEPu6+
# 7VmkU38L8VKIinsKZyTLkM3s0k00TLDhtZ+cxvZvLM3mylN0AZ9nNd44SS3O7TlE
# ghl5Thqytfu7ePBJZqfP+lyWdZKLGnLZ/1CSU8w+wkMyCRqGE2k8+4EyMzJkdXMo
# Jh0IMDsHAgMBAAGjggHhMIIB3TASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB
# /wQEAwIBhjATBgNVHSUEDDAKBggrBgEFBQcDAzB/BggrBgEFBQcBAQRzMHEwJAYI
# KwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBJBggrBgEFBQcwAoY9
# aHR0cDovL2NhY2VydHMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0SGlnaEFzc3VyYW5j
# ZUVWUm9vdENBLmNydDCBjwYDVR0fBIGHMIGEMECgPqA8hjpodHRwOi8vY3JsNC5k
# aWdpY2VydC5jb20vRGlnaUNlcnRIaWdoQXNzdXJhbmNlRVZSb290Q0EuY3JsMECg
# PqA8hjpodHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGlnaUNlcnRIaWdoQXNzdXJh
# bmNlRVZSb290Q0EuY3JsME8GA1UdIARIMEYwOAYKYIZIAYb9bAACBDAqMCgGCCsG
# AQUFBwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BTMAoGCGCGSAGG/WwD
# MB0GA1UdDgQWBBRnnQ8gCQzMijrlgkZyYvzxzJDlQDAfBgNVHSMEGDAWgBSxPsNp
# A/i/RwHUmCYaCALvY2QrwzANBgkqhkiG9w0BAQsFAAOCAQEAag7/fhN8BqVLwC6M
# +VNkCeK6WJEwUOzMn+HTqC9IRjYYKdB4KF+YVkAPHrq9sTuHXNxb2CAN7RoWTdUR
# JCFL8SdpkBPrEaEB2v21TnlZdb04KmrD9o5BK4qii9csUVHZnKDI4066bKhH0k7R
# aB+MAlc7sylqjmogKrnyAGJkusjpAPnMpNS6mjXYryxlbBZ8WCHeSjDQ+uskXQbJ
# nRa3rUpF0yXiDPBAqlxNrH7NBoK5dkZpCNgytoL+46lYNEMbjmdnlz9oMRY2OJU+
# h/fHw6+dencZ2d6Ttf1uK/yU+T23TBI1LDC+6I2eBXCaSBP0jNbnHqw456jzrQy3
# euxn7TGCAiwwggIoAgEBMIGKMHYxCzAJBgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdp
# Q2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xNTAzBgNVBAMTLERp
# Z2lDZXJ0IFNIQTIgSGlnaCBBc3N1cmFuY2UgQ29kZSBTaWduaW5nIENBAhAGJyyM
# fgvFpyK0gAxd1yswMAkGBSsOAwIaBQCgeDAYBgorBgEEAYI3AgEMMQowCKACgACh
# AoAAMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAM
# BgorBgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBQiLPk3N6rpLHc+zJpSXqV7NkDH
# rDANBgkqhkiG9w0BAQEFAASCAQCId+ESBkhigxShLezY4Yx7mL4pF9+lk+0C7UND
# 0okepr7gR1nqH9HY4TgNHSa6ThQ3LNp9ghtoSZSedlp9WdpWMVw090EDuglBKvyt
# f/WC/NnBE4BIx7H3YrutT4dfHWMYCcCcIgpLkgQfal6flNMvF4omgJJaMAmR3xtV
# KnT0y78B3VJ7448Jxbenn+rJ4z049k6MTcLK54hA7v/U3e2sm/l00/YUiTncMTwn
# bXC8okSr2rZdW90T5pdA6SE6/BmvZVsyhC/NHvItpAifV2yJnTdZoXwv5y0ImBcH
# aMO/SUJlEPnNcm6DvtNrpxtOQ8J4Un1JO9srNhhHyRWp7t9t
# SIG # End signature block
