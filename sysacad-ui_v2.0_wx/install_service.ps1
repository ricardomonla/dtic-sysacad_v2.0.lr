param(
  [string]$ServiceName = "SysacadUI",
  [string]$NodePath = "C:\Program Files\nodejs\node.exe",
  [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$APP = Split-Path -Parent $MyInvocation.MyCommand.Path  # carpeta donde está este script

if (!(Test-Path "$APP\logs")) { New-Item -ItemType Directory -Force -Path "$APP\logs" | Out-Null }

# Validar NSSM
$nssm = (Get-Command nssm -ErrorAction SilentlyContinue)
if (!$nssm) {
  Write-Error "NSSM no está en PATH. Instalalo (https://nssm.cc) o copialo al PATH y probá de nuevo."
}

# Crear/actualizar servicio
nssm install $ServiceName "$NodePath" "$APP\server.js"
nssm set $ServiceName AppDirectory $APP
nssm set $ServiceName AppEnvironmentExtra "NODE_ENV=production" "PORT=$Port"
nssm set $ServiceName AppExit Default Restart
nssm set $ServiceName AppThrottle 2000
nssm set $ServiceName AppStdout "$APP\logs\out.log"
nssm set $ServiceName AppStderr "$APP\logs\error.log"
nssm set $ServiceName AppRotateFiles 1
nssm set $ServiceName AppRotateOnline 1
nssm set $ServiceName AppRotateSeconds 86400
nssm set $ServiceName AppRotateBytes 10485760

# Abrir firewall (puerto interno)
netsh advfirewall firewall add rule name="$ServiceName $Port" dir=in action=allow protocol=TCP localport=$Port | Out-Null

nssm start $ServiceName
Write-Host "Servicio $ServiceName instalado y arrancado en puerto $Port."
