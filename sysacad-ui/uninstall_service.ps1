param([string]$ServiceName = "SysacadUI")
$ErrorActionPreference = "Stop"
nssm stop $ServiceName
nssm remove $ServiceName confirm
Write-Host "Servicio $ServiceName eliminado."
