@echo off
setlocal
title Portfolio - Local Preview

cd /d "%~dp0"

netstat -ano | findstr ":5174" | findstr /I "LISTENING" >nul
if not errorlevel 1 (
  echo.
  echo Local preview is already running. Opening:
  echo http://127.0.0.1:5174/zhechun333/
  start "" "http://127.0.0.1:5174/zhechun333/"
  exit /b 0
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo.
  echo npm was not found. Install Node.js LTS, then try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo.
  echo Installing project dependencies. Please wait...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Installation failed. Check your network or Node.js setup, then try again.
    pause
    exit /b 1
  )
)

echo.
echo Starting local preview: http://127.0.0.1:5174/zhechun333/
echo Keep this window open. Press Ctrl+C to stop the preview.
echo.
call npm.cmd run dev -- --port 5174 --strictPort --open
