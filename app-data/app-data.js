//  -----------------------------------------------------------------------------
//  Project:     SysACAD Web 2.0
//  File:        app-data.js
//  Version:     1.0.0
//  Date:        2025-12-10
//  Author:      Lic. Ricardo MONLA
//  Email:       rmonla@gmail.com
//  Description: Configuración centralizada de datos específicos de la aplicación.
//  -----------------------------------------------------------------------------
/**
 * CONFIGURACIÓN CENTRALIZADA - SysACAD Web 2.0
 *
 * Este archivo contiene toda la información específica de la aplicación
 * que es referenciada por el prompt genérico. Permite actualizaciones
 * dinámicas sin modificar el core del prompt.
 */

// ========== CONFIGURACIÓN DE LA APLICACIÓN ==========
const APP_CONFIG = {
    // Información básica de la aplicación
    name: "SysACAD Web 2.0",
    fullName: "SysACAD Web 2.0",
    version: "0.1.0",

    // Estructura de directorios
    directories: {
        root: "sysacad-ui",
        public: "sysacad-ui/public",
        config: "sysacad-ui/public/runtime_config.js",
        server: "sysacad-ui/server.js",
        package: "sysacad-ui/package.json"
    },

    // Archivos controlados por el sistema de versionado
    versionControlledFiles: {
        auto: [
            "sysacad-ui/package.json",
            "sysacad-ui/public/runtime_config.js",
            "app-prompt/251207-1823_Actu+Commit.md"
        ],
        manual: [
            "CHANGELOG.md",
            "README.md",
            "sysacad-ui/server.js",
            "app-docs/analisis_sysacad_ui.md"
        ]
    },

    // Dependencias críticas y sus versiones requeridas
    criticalDependencies: [
        { name: "next", version: "14.2.5", critical: true, purpose: "Framework principal" },
        { name: "react", version: "18.2.0", critical: true, purpose: "Biblioteca de UI" },
        { name: "next-auth", version: "4.24.7", critical: true, purpose: "Autenticación" },
        { name: "typescript", version: "5.1.6", critical: false, purpose: "Tipado estático" }
    ],

    // Comandos específicos de la aplicación
    commands: {
        start: "npm run dev",
        build: "npm run build",
        test: "npm run lint",
        deploy: "npm run deploy:local"
    },

    // Patrones de validación
    validationPatterns: {
        version: /^\d+\.\d+\.\d+$/,
        filePath: /^[a-zA-Z0-9\-_\/]+\.[a-zA-Z0-9]+$/,
        dependencyName: /^[a-z0-9\-]+$/
    }
};

// ========== FUNCIONES DE CONFIGURACIÓN ==========
/**
 * Obtiene la configuración completa de la aplicación
 */
function getAppConfig() {
    return APP_CONFIG;
}

/**
 * Obtiene la versión actual de la aplicación
 */
function getAppVersion() {
    return APP_CONFIG.version;
}

/**
 * Obtiene el nombre completo de la aplicación
 */
function getAppFullName() {
    return APP_CONFIG.fullName;
}

/**
 * Obtiene la lista de archivos controlados por el sistema de versionado
 */
function getVersionControlledFiles() {
    return APP_CONFIG.versionControlledFiles;
}

/**
 * Obtiene las dependencias críticas de la aplicación
 */
function getCriticalDependencies() {
    return APP_CONFIG.criticalDependencies;
}

/**
 * Valida que una versión siga el formato semántico
 */
function validateVersion(version = APP_CONFIG.version) {
    return APP_CONFIG.validationPatterns.version.test(version);
}

/**
 * Valida que una dependencia crítica esté correctamente configurada
 */
function validateDependency(dep) {
    return dep &&
           APP_CONFIG.validationPatterns.dependencyName.test(dep.name) &&
           APP_CONFIG.validationPatterns.version.test(dep.version);
}

/**
 * Valida todas las dependencias críticas
 */
function validateAllDependencies() {
    return APP_CONFIG.criticalDependencies
        .filter(dep => dep.critical)
        .every(validateDependency);
}

// ========== EXPORTACIONES ==========
if (typeof module !== 'undefined' && module.exports) {
    // Para Node.js
    module.exports = {
        APP_CONFIG,
        getAppConfig,
        getAppVersion,
        getAppFullName,
        getVersionControlledFiles,
        getCriticalDependencies,
        validateVersion,
        validateDependency,
        validateAllDependencies
    };
} else {
    // Para navegador (global)
    window.AppData = {
        APP_CONFIG,
        getAppConfig,
        getAppVersion,
        getAppFullName,
        getVersionControlledFiles,
        getCriticalDependencies,
        validateVersion,
        validateDependency,
        validateAllDependencies
    };
}