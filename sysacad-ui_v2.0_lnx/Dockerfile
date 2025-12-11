# Dockerfile para SysACAD UI en Linux
# Basado en Node.js LTS (compatible con package.json: >=18 <=22)
# Version: 1.0.0
# Date: 2025-12-11
# Último Cambio: 2025-12-11 - Añadido --legacy-peer-deps para resolver conflictos de dependencias

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