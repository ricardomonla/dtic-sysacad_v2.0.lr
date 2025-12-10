# README - Deploy SYSACAD UI en Linux (Docker + Nginx)

## 0) Requisitos del servidor (una sola vez)
- Linux Server (Ubuntu 20.04/22.04, Debian 11/12, etc.)
- Docker instalado → comprobar: `docker --version`
- Docker Compose instalado → comprobar: `docker-compose --version`
- Puerto 80 y 3000 disponibles

## 1) Qué se recibe (ZIP)
Un ZIP con esta estructura (ejemplo /opt/apps/sysacad-ui):
```
/opt/apps/sysacad-ui/
  Dockerfile
  docker-compose.yml
  nginx.conf
  server.js
  package.json
  .next/
  public/
  (este README)
```

## 2) Instalación

1) Descomprimir el ZIP en: /opt/apps/sysacad-ui
2) Construir y levantar contenedores:
```bash
cd /opt/apps/sysacad-ui
docker-compose up -d --build
```

## 3) Verificación

- Contenedores: `docker ps` → debe mostrar sysacad-ui y sysacad-nginx
- Backend directo: `curl http://localhost:3000` → debe devolver HTML
- Navegador:
  - http://DOMINIO/ → carga app con estilos
  - http://DOMINIO/_next/static/ → no 404
  - http://DOMINIO/images/logo/logo_utn_black.png → no 404

## 4) Operación del servicio

- Ver logs: `docker-compose logs -f`
- Reiniciar: `docker-compose restart`
- Detener: `docker-compose down`
- Actualizar: `docker-compose pull && docker-compose up -d --build`

## 5) Configuración adicional

- Para HTTPS, modificar nginx.conf y agregar certificados SSL
- Para personalizar puertos, editar docker-compose.yml
- Variables de entorno en docker-compose.yml (PORT, NODE_ENV)

## 6) Actualizar versión (deploy de una nueva build)

1) Detener servicios:
```bash
docker-compose down
```

2) Reemplazar archivos (excepto Dockerfile, docker-compose.yml, nginx.conf)
3) Reconstruir y levantar:
```bash
docker-compose up -d --build