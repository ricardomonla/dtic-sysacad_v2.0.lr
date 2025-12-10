#!/bin/bash

# Script de sincronización entre versiones Windows y Linux
# Este script copia los archivos comunes entre ambas versiones

# Directorios
WX_DIR="sysacad-ui_v2.0_wx"
LNX_DIR="sysacad-ui_v2.0_lnx"

# Archivos comunes a sincronizar (excluyendo scripts específicos de plataforma)
COMMON_FILES=(
  "server.js"
  "package.json"
  "public/"
  ".next/"
)

echo "Sincronizando versiones entre $WX_DIR y $LNX_DIR..."

# Sincronizar de Windows a Linux
for file in "${COMMON_FILES[@]}"; do
  if [ -e "$WX_DIR/$file" ]; then
    echo "Copiando $file de Windows a Linux..."
    cp -r "$WX_DIR/$file" "$LNX_DIR/"
  fi
done

# Sincronizar de Linux a Windows (solo archivos comunes)
for file in "${COMMON_FILES[@]}"; do
  if [ -e "$LNX_DIR/$file" ]; then
    echo "Copiando $file de Linux a Windows..."
    cp -r "$LNX_DIR/$file" "$WX_DIR/"
  fi
done

echo "Sincronización completada."