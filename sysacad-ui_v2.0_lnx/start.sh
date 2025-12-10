#!/bin/bash

# Script de inicio para SysACAD UI en Linux
# Crear directorio de logs si no existe
mkdir -p logs

echo "Iniciando Sysacad UI..."
node server.js >> logs/out.log 2>> logs/error.log