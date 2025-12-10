//  -----------------------------------------------------------------------------
//  Project:     SysACAD Web 2.0
//  File:        app-version.js
//  Version:     1.0.0
//  Date:        2025-12-10
//  Author:      Lic. Ricardo MONLA
//  Email:       rmonla@gmail.com
//  Description: Sistema de versionado centralizado para la aplicación SysACAD Web 2.0.
//  -----------------------------------------------------------------------------
/**
 * SISTEMA DE VERSIONADO CENTRALIZADO - SysACAD Web 2.0
 *
 * Este archivo centraliza toda la información de versionado de la aplicación.
 * Al actualizar la versión, modifica únicamente los valores aquí y ejecuta
 * el proceso de actualización automática.
 */

// ========== CONFIGURACIÓN DE VERSIÓN ==========
const APP_VERSION = "0.1.0";
const APP_NAME = "SysACAD Web 2.0";
const APP_FULL_NAME = `${APP_NAME} v${APP_VERSION}`;

// ========== HISTORIAL DE VERSIONES ==========
/**
 * Historial completo de versiones con cambios principales.
 * Se mantiene para referencia y documentación.
 */
const VERSION_HISTORY = {
    "0.1.0": {
        date: "2025-12-10",
        changes: [
            "Configuración inicial para estudio de SysACAD Web 2.0",
            "Preparación de entorno con Next.js 14.2.5",
            "Estructura base en sysacad-ui/ para análisis",
            "Sistema de versionado preparatorio en app-data/",
            "Documentación inicial para fase de estudio",
            "Configuración centralizada para evaluación técnica"
        ],
        type: "Estudio"
    }
};

// ========== ARCHIVOS A ACTUALIZAR ==========
/**
 * Lista de archivos que requieren actualización manual al cambiar versión.
 * El sistema automático actualiza los marcados como 'auto'.
 */
const VERSION_UPDATE_FILES = {
    auto: [
        "sysacad-ui/package.json",        // Versión y dependencias
        "sysacad-ui/public/runtime_config.js", // Configuración de runtime
        "app-prompt/251207-1823_Actu+Commit.md" // Documentación de commit
    ],
    manual: [
        "CHANGELOG.md",                  // Agregar nueva entrada
        "README.md",                     // Actualizar versión en documentación
        "sysacad-ui/server.js",          // Configuración del servidor
        "app-docs/analisis_sysacad_ui.md" // Análisis de la aplicación
    ]
};

// ========== FUNCIONES DE VERSIONADO ==========
/**
 * Obtiene la versión actual formateada
 */
function getCurrentVersion() {
    return APP_VERSION;
}

/**
 * Obtiene el nombre completo de la aplicación
 */
function getAppFullName() {
    return APP_FULL_NAME;
}

/**
 * Obtiene el historial de versiones
 */
function getVersionHistory() {
    return VERSION_HISTORY;
}

/**
 * Valida que la versión siga el formato semántico (major.minor.patch)
 */
function validateVersion(version = APP_VERSION) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
}

/**
 * Valida dependencias críticas para la aplicación
 */
function validateCriticalDependencies() {
    const criticalDeps = [
        { name: "next", version: "14.2.5", critical: true },
        { name: "react", version: "18.2.0", critical: true },
        { name: "next-auth", version: "4.24.7", critical: true },
        { name: "typescript", version: "5.1.6", critical: false }
    ];

    return {
        required: criticalDeps.filter(dep => dep.critical),
        optional: criticalDeps.filter(dep => !dep.critical),
        validate: function(deps) {
            return this.required.every(req =>
                deps[req.name] && deps[req.name] === req.version
            );
        }
    };
}

// ========== PROCESO DE ACTUALIZACIÓN DE VERSIÓN ==========
/**
 * IMPORTANTE: CLARIFICACIÓN SOBRE VERSIONADO
 *
 * Este archivo gestiona la versión de la aplicación en general (APP_VERSION).
 * Cada archivo individual del proyecto mantiene su propia versión independiente,
 * que no necesariamente coincide con la versión global de la aplicación.
 * Estos dos esquemas de versionado (individual vs. aplicación general) son
 * distintos y separados.
 *
 * PROCESO COMPLETO DE ACTUALIZACIÓN DE VERSIÓN:
 *
 * 1. **Modificar APP_VERSION** en este archivo (incrementar según semver: major.minor.patch)
 * 2. **Agregar entrada en VERSION_HISTORY** con fecha, cambios y tipo
 * 3. **Actualizar CHANGELOG.md**:
 *    - Crear nueva sección [X.Y.Z] - YYYY-MM-DD
 *    - Documentar cambios bajo categorías: Añadido, Cambiado, Corregido
 * 4. **Actualizar README.md** si las modificaciones afectan la documentación principal
 * 5. **Verificar package.json** si es necesario (para dependencias)
 * 6. **Actualizar encabezados de archivos** individuales si corresponde (versión independiente)
 * 7. **Probar aplicación** completamente y verificar estabilidad
 * 8. **Ejecutar commit** con mensaje descriptivo siguiendo el formato: "vX.Y.Z: Descripción de cambios"
 *
 * EJEMPLO DE NUEVA VERSIÓN:
 *
 * // Cambiar aquí
 * const APP_VERSION = "1.0.1";
 *
 * // Agregar al historial
 * "1.0.1": {
 *     date: "2025-12-11",
 *     changes: [
 *         "Corrección de bug en autenticación",
 *         "Optimización de configuración de runtime"
 *     ],
 *     type: "Corregido"
 * }
 *
 * NOTA: Los commits deben reflejar cambios significativos en la aplicación general.
 * Cambios menores en archivos individuales no requieren actualización de APP_VERSION.
 */

// ========== EXPORTACIONES ==========
if (typeof module !== 'undefined' && module.exports) {
    // Para Node.js
    module.exports = {
        APP_VERSION,
        APP_NAME,
        APP_FULL_NAME,
        VERSION_HISTORY,
        VERSION_UPDATE_FILES,
        getCurrentVersion,
        getAppFullName,
        getVersionHistory,
        validateVersion,
        validateCriticalDependencies
    };
} else {
    // Para navegador (global)
    window.AppVersion = {
        APP_VERSION,
        APP_NAME,
        APP_FULL_NAME,
        VERSION_HISTORY,
        VERSION_UPDATE_FILES,
        getCurrentVersion,
        getAppFullName,
        getVersionHistory,
        validateVersion,
        validateCriticalDependencies
    };
}