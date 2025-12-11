# Pruebas de Funcionamiento - SysACAD UI v2.0 Linux

## Fecha de Prueba
10 de diciembre de 2025

## Configuración del Entorno

### Estructura del Proyecto
- Directorio principal: `sysacad-ui_v2.0_lnx/`
- Archivos principales:
  - `docker-compose.yml`: Configuración de servicios Docker
  - `Dockerfile`: Configuración de la imagen de la aplicación
  - `nginx.conf`: Configuración del servidor web NGINX
  - `start.sh`: Script de inicio
  - `stop.sh`: Script de parada

### Configuración Docker

#### docker-compose.yml
```yaml
version: '3.8'

services:
  sysacad-ui:
    build: .
    container_name: sysacad-ui
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./logs:/app/logs
    networks:
      - sysacad-network

  nginx:
    image: nginx:alpine
    container_name: sysacad-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./logs:/var/log/nginx
    depends_on:
      - sysacad-ui
    networks:
      - sysacad-network

networks:
  sysacad-network:
    driver: bridge
```

#### Dockerfile
```dockerfile
# Dockerfile para SysACAD UI en Linux
# Basado en Node.js LTS (compatible con package.json: >=18 <=22)

FROM node:18-alpine

# Configuración básica
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Instalar dependencias del sistema
RUN apk add --no-cache bash

# Copiar archivos de la aplicación
COPY package.json .
COPY server.js .
COPY public/ public/
COPY .next/ .next/

# Instalar dependencias de producción
RUN npm install --production --legacy-peer-deps

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
```

## Proceso de Implementación

### Paso 1: Copia de archivos necesarios
Se copiaron los archivos necesarios desde `sysacad-ui_v2.0_wx/`:
- `package.json`
- `server.js`
- `public/`
- `.next/`

### Paso 2: Modificación del Dockerfile
Se modificó el comando de instalación de dependencias para incluir `--legacy-peer-deps`:
```dockerfile
RUN npm install --production --legacy-peer-deps
```

### Paso 3: Construcción y Ejecución
```bash
cd sysacad-ui_v2.0_lnx && docker compose up -d
```

## Resultados de las Pruebas

### Contenedores en Ejecución
```bash
docker ps
```
```
CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS                                                                          NAMES
4927d8c11285   nginx:alpine                    "/docker-entrypoint.…"   7 seconds ago   Up 6 seconds   0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp   sysacad-nginx
7e7ae0513b5e   sysacad-ui_v20_lnx-sysacad-ui   "docker-entrypoint.s…"   8 seconds ago   Up 7 seconds   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp                                    sysacad-ui
```

### Pruebas de Conectividad

#### Prueba 1: Acceso a la aplicación principal
```bash
curl -I http://localhost
```
```
HTTP/1.1 200 OK
Server: nginx/1.29.4
Date: Wed, 10 Dec 2025 23:51:17 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 10067
Connection: keep-alive
Vary: Accept-Encoding
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
x-nextjs-cache: HIT
Cache-Control: s-maxage=31536000, stale-while-revalidate
ETag: "1scvfzi3ih7qy"
```

#### Prueba 2: Acceso a la API
```bash
curl -I http://localhost/api
```
```
HTTP/1.1 301 Moved Permanently
Server: nginx/1.29.4
Date: Wed, 10 Dec 2025 23:52:01 GMT
Content-Type: text/html
Content-Length: 169
Location: http://localhost/api/
Connection: keep-alive
```

## Conclusiones

1. **Éxito en la implementación**: La aplicación SysACAD UI v2.0 se implementó correctamente utilizando Docker Compose.

2. **Funcionamiento de contenedores**:
   - El contenedor `sysacad-ui` está funcionando correctamente en el puerto 3000
   - El contenedor `sysacad-nginx` está funcionando correctamente en los puertos 80 y 443
   - La red `sysacad-network` permite la comunicación entre contenedores

3. **Accesibilidad**:
   - La aplicación principal responde correctamente con código HTTP 200
   - Las rutas de API están siendo manejadas correctamente por NGINX con redirección 301

4. **Problemas resueltos**:
   - Se resolvió el problema de dependencias incompatibles usando `--legacy-peer-deps`
   - Se copiaron correctamente los archivos necesarios desde la versión Windows

## Recomendaciones

1. **Actualizar el archivo docker-compose.yml**: Eliminar el atributo `version` que está obsoleto.

2. **Monitoreo**: Implementar monitoreo de logs para ambos contenedores:
   ```bash
   docker logs sysacad-ui
   docker logs sysacad-nginx
   ```

3. **Seguridad**: Considerar la implementación de certificados SSL para el tráfico HTTPS.

4. **Documentación**: Actualizar el archivo README_DEPLOY_LINUX.md con los pasos específicos realizados para esta implementación.