===========================================================
README - Deploy SYSACAD UI en Windows (IIS + Node service)
===========================================================

# 0) Requisitos del servidor (una sola vez)
- Windows Server 2019/2022 (o Win10/11)
- Node.js LTS (x64) instalado → comprobar: `node -v`
- NSSM en PATH (https://nssm.cc) → comprobar: `nssm version`
- IIS instalado (consola “Administrador de IIS”) + extensiones:
  - URL Rewrite (extensión)
  - ARR - Application Request Routing (extensión)

# 1) Qué se recibe (ZIP)
Un ZIP con esta estructura (ejemplo C:\apps\sysacad-ui):
  C:\apps\sysacad-ui\
    server.js
    .next\static\...
    public\...
    start.bat
    stop.bat
    install_service.ps1
    uninstall_service.ps1
    (este README)

# 2) Instalación
1) Descomprimir el ZIP en: C:\apps\sysacad-ui
2) Instalar servicio Windows (PowerShell como Administrador):
   Set-ExecutionPolicy Bypass -Scope Process -Force
   cd C:\apps\sysacad-ui
   .\install_service.ps1 -ServiceName SysacadUI -Port 3000
   (Inicia el servicio con Node en http://localhost:3000)

3) Abrir puerto interno (si el firewall lo pide):
   netsh advfirewall firewall add rule name="Sysacad UI 3000" dir=in action=allow protocol=TCP localport=3000

# 3) Publicación con IIS (HTTP SIMPLE)
A) Habilitar proxy de ARR a nivel servidor (PowerShell Admin):
   & $env:windir\system32\inetsrv\appcmd.exe set config -section:system.webServer/proxy /enabled:"True" /commit:apphost

  & $env:windir\system32\inetsrv\appcmd.exe set config -section:system.webServer/proxy /preserveHostHeader:"True" /reverseRewriteHostInResponseHeaders:"True" /commit:apphost


B) Crear/usar un Sitio en IIS:
   - Physical Path del sitio: C:\apps\sysacad-ui  (recomendado)
   - Binding: HTTP :80

C) En C:\apps\sysacad-ui crear/colocar este web.config (mínimo, sin websockets):
   ---------------------------------------------------------
   <?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.webServer>
        <rewrite>
          <rules>
            <!-- API: quita el prefijo /api y reenvía al backend real -->
            <rule name="API_Proxy" stopProcessing="true">
              <match url="^api/(.*)$" />
              <action type="Rewrite" url="URL DE LA API/{R:1}" />
            </rule>

            <!-- App: todo lo demás a Next en 3000 -->
            <rule name="ProxyToNode" stopProcessing="true">
              <match url="(.*)" />
              <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
    </configuration>

   ---------------------------------------------------------

D) Reiniciar IIS:
   iisreset

(Con esto, http://DOMINIO/ apunta a Node:3000. HTTPS se puede agregar más tarde.)

# 4) Chequeos rápidos
- Servicio: `nssm status SysacadUI` → RUNNING
- Backend directo: `Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Select StatusCode` → 200
- Navegador:
  - http://DOMINIO/  → carga app con estilos
  - http://DOMINIO/_next/static/ → no 404
  - http://DOMINIO/images/logo/logo_utn_black.png → no 404

# 5) Actualizar versión (deploy de una nueva build)
Opción A - “en sitio” (simple):
  nssm stop SysacadUI
  remplezar la nueva build (todo menos web.config) en C:\apps\sysacad-ui\


# 6) Operación del servicio (NSSM)
- Ver estado:    nssm status SysacadUI
- Iniciar:       nssm start  SysacadUI
- Detener:       nssm stop   SysacadUI
- Reiniciar:     nssm restart SysacadUI
- Logs app Node: C:\apps\sysacad-ui\logs\out.log  /  error.log

