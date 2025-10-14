@echo off
cd /d "%~dp0"
echo Starting CORE Dashboard Server...
echo.
set DASHBOARD_PORT=3001
node server.js
