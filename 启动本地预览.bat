@echo off
setlocal
title Portfolio - Local Preview

cd /d "%~dp0"
set "PREVIEW_URL=http://127.0.0.1:5174/zhechun333/#home"
set "PREVIEW_HEALTH_URL=http://127.0.0.1:5174/zhechun333/"

call :preview_is_ready
if not errorlevel 1 (
  echo.
  echo Local preview is already running. Opening:
  echo %PREVIEW_URL%
  start "" "%PREVIEW_URL%"
  exit /b 0
)

netstat -ano | findstr ":5174" | findstr /I "LISTENING" >nul
if not errorlevel 1 (
  echo.
  echo Port 5174 is in use, but the portfolio preview did not respond.
  echo Close the program using that port, then run this launcher again.
  echo.
  pause
  exit /b 1
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
echo Starting local preview in a separate minimized window...
echo.
start "Portfolio - Local Preview Server" /min cmd /k "npm.cmd run dev -- --port 5174 --strictPort"

for /L %%I in (1,1,40) do (
  call :preview_is_ready
  if not errorlevel 1 goto preview_ready
  powershell -NoProfile -Command "Start-Sleep -Milliseconds 250"
)

echo.
echo The preview server did not become ready within 10 seconds.
echo Open the minimized server window to review the error, then try again.
echo.
pause
exit /b 1

:preview_ready
echo Preview is ready: %PREVIEW_URL%
start "" "%PREVIEW_URL%"
exit /b 0

:preview_is_ready
powershell -NoProfile -Command "try { $response = Invoke-WebRequest -UseBasicParsing -Uri '%PREVIEW_HEALTH_URL%' -TimeoutSec 1; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
exit /b %errorlevel%
