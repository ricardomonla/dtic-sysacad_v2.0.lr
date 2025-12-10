#!/bin/bash

# Script de parada para SysACAD UI en Linux
echo "Deteniendo Sysacad UI (si corre en consola)..."
pkill -f "node server.js"