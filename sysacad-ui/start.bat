@echo off
setlocal
cd /d %~dp0
if not exist logs mkdir logs
echo Iniciando Sysacad UI...
node server.js >> logs\out.log 2>> logs\error.log
