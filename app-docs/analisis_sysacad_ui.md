# Análisis de la Aplicación SysACAD UI

## Resumen Ejecutivo

SysACAD UI es una aplicación web moderna construida con Next.js 14.2.5 que sirve como interfaz de usuario para el sistema académico SysACAD. La aplicación está diseñada para ser desplegada en entornos Windows con IIS y Node.js, utilizando una arquitectura de proxy para integrarse con servicios backend.

## Arquitectura General

### Tecnologías Principales

- **Framework**: Next.js 14.2.5 (React 18.2.0)
- **Lenguaje**: TypeScript 5.1.6
- **Estilos**: Tailwind CSS 3.3.3
- **Backend Proxy**: Node.js con Next.js en modo standalone
- **Servidor Web**: IIS con ARR (Application Request Routing)
- **Gestión de Servicios**: NSSM (Non-Sucking Service Manager)

### Estructura de Directorios

```
sysacad-ui/
├── .next/                  # Build de producción
│   ├── server/             # Código del servidor compilado
│   │   ├── app/            # Rutas de la aplicación
│   │   │   ├── api/        # Endpoints API
│   │   │   ├── auth/       # Autenticación
│   │   │   ├── BoletoWS/   # Servicios de boletos
│   │   │   ├── docente/    # Módulo docente
│   │   │   ├── estudiante/ # Módulo estudiante
│   │   │   └── proxy-boleto/ # Proxy para boletos
│   │   └── ...             # Otros archivos del servidor
│   └── static/             # Assets estáticos
├── public/                 # Archivos públicos
│   ├── images/             # Recursos visuales
│   │   ├── brand/          # Logos y branding
│   │   ├── user/           # Imágenes de usuarios
│   │   └── ...             # Otros recursos
│   └── runtime_config.js   # Configuración en tiempo de ejecución
├── server.js               # Servidor Node.js
├── nginx.conf              # Configuración NGINX (alternativa)
├── package.json            # Dependencias y scripts
├── README_DEPLOY.txt       # Instrucciones de despliegue
└── scripts de servicio/    # Scripts para Windows Service
```

## Configuración y Dependencias

### Dependencias Principales

```json
{
  "next": "^14.2.5",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "typescript": "5.1.6",
  "tailwindcss": "3.3.3",
  "next-auth": "^4.24.7",
  "axios": "^1.6.2",
  "jwt-decode": "^4.0.0",
  "@react-pdf/renderer": "^3.4.4",
  "apexcharts": "^3.41.1",
  "swiper": "^10.0.4"
}
```

### Configuración del Servidor

El archivo [`server.js`](sysacad-ui/server.js:1) configura un servidor Next.js en modo producción:

- **Puerto por defecto**: 3000
- **Host**: 0.0.0.0 (accesible desde cualquier interfaz)
- **Modo**: Producción con compresión habilitada
- **Configuración especial**: Proxy de API a backend en `http://10.13.0.61:8080`

### Configuración de Runtime

El archivo [`runtime_config.js`](sysacad-ui/public/runtime_config.js:1) define configuraciones en tiempo de ejecución:

```javascript
window.RUNTIME_CONFIG = {
  NEXT_PUBLIC_BOLETO_ESTUDIANTIL: true,
  NEXT_PUBLIC_EDICION_LIBRES_ABANDONOS: true,
};
```

## Módulos y Funcionalidades

### Módulos Principales

1. **Autenticación**: Manejo de sesiones y autenticación de usuarios
2. **Docente**: Funcionalidades para profesores y personal académico
3. **Estudiante**: Interfaz para estudiantes y gestión académica
4. **BoletoWS**: Servicios relacionados con boletos estudiantiles
5. **API Proxy**: Integración con backend mediante proxy

### Rutas de API

La aplicación utiliza un sistema de proxy para redirigir solicitudes:

- **Rutas `/api/*`**: Se redirigen al backend en `http://10.13.0.61:8080`
- **Otras rutas**: Son manejadas por el servidor Next.js en el puerto 3000

## Despliegue y Configuración

### Requisitos del Servidor

- Windows Server 2019/2022 o Windows 10/11
- Node.js LTS (versión 18-22)
- NSSM para gestión de servicios
- IIS con extensiones URL Rewrite y ARR

### Proceso de Despliegue

1. **Instalación del servicio**:
   ```powershell
   .\install_service.ps1 -ServiceName SysacadUI -Port 3000
   ```

2. **Configuración de IIS**:
   - Crear sitio con physical path a la carpeta de la aplicación
   - Configurar web.config con reglas de proxy
   - Habilitar proxy de ARR

3. **Configuración de Proxy**:
   - `/api/*` → Backend real (`http://10.13.0.61:8080`)
   - `/*` → Servidor Next.js (`http://localhost:3000`)

### Configuración Alternativa con NGINX

El archivo [`nginx.conf`](sysacad-ui/nginx.conf:1) proporciona una configuración alternativa:

```nginx
server {
    listen 80;
    server_name localhost;

    # Proxy para API
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy para la aplicación
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

## Características Técnicas

### Optimizaciones

- **Compresión GZIP**: Habilitada para mejor rendimiento
- **Caching**: Configuración de caché para assets estáticos
- **Imágenes optimizadas**: Soporte para WebP y optimización automática
- **Minificación**: Código JavaScript y CSS minificado

### Seguridad

- **Content Security Policy**: Configuración estricta
- **Headers de seguridad**: X-Real-IP, X-Forwarded-For
- **Autenticación**: Integración con next-auth

### Internacionalización

- Configuración preparada para i18n (actualmente no habilitada)
- Soporte para múltiples idiomas en la estructura

## Integración con Backend

La aplicación se integra con un backend mediante:

1. **Proxy de API**: Todas las solicitudes `/api/*` son redirigidas
2. **Autenticación JWT**: Uso de jwt-decode para manejo de tokens
3. **Configuración de entorno**: Variables de entorno para URLs de backend

## Estructura de Build

El build de producción incluye:

- **Server standalone**: Servidor Node.js independiente
- **Assets estáticos**: Optimizados y con hash para caching
- **Rutas pre-renderizadas**: Para mejor SEO y rendimiento
- **Manifestos**: Para carga diferida y optimización

## Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node .next/standalone/server.js",
    "lint": "next lint",
    "deploy:local": "powershell -ExecutionPolicy Bypass -File .\\scripts\\build_deploy.ps1",
    "start:deploy": "node server.js"
  }
}
```

## Consideraciones de Despliegue

1. **Puertos**: Asegurar que el puerto 3000 esté disponible
2. **Firewall**: Configurar reglas para permitir tráfico
3. **Logs**: Los logs se generan en `logs/out.log` y `logs/error.log`
4. **Actualizaciones**: Detener servicio, reemplazar build, reiniciar

## Conclusión

SysACAD UI es una aplicación web moderna construida con Next.js que proporciona una interfaz completa para el sistema académico. Su arquitectura basada en proxy permite una integración flexible con servicios backend, mientras que su configuración de despliegue está optimizada para entornos Windows con IIS. La aplicación incluye módulos específicos para diferentes roles (docentes, estudiantes) y servicios especializados como gestión de boletos estudiantiles.