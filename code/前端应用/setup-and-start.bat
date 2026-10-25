@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: AI Guru Knowledge Base - Setup and Start Script (Windows)

echo 🚀 AI Guru Knowledge Base - Complete Setup
echo ===========================================
echo.

:: Check Node.js
echo 📋 Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    exit /b 1
)

for /f "tokens=1" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✅ Node.js %NODE_VERSION%

:: Clean up
echo.
echo 🧹 Cleaning up...
if exist ".parcel-cache" (
    rmdir /s /q ".parcel-cache"
    echo    ✓ Removed .parcel-cache
)

if exist "dist" (
    rmdir /s /q "dist"
    echo    ✓ Removed dist
)

:: Install dependencies
echo.
echo 📦 Installing dependencies...

where pnpm >nul 2>&1
if %errorlevel% == 0 (
    echo    Using pnpm...
    pnpm install
) else (
    where npm >nul 2>&1
    if %errorlevel% == 0 (
        echo    Using npm...
        npm install
    ) else (
        echo ❌ Neither pnpm nor npm found.
        exit /b 1
    )
)

if not exist "node_modules" (
    echo ❌ Installation failed. node_modules not found.
    exit /b 1
)

echo ✅ Dependencies installed

:: Check port
echo.
echo 🔍 Checking port 3055...
netstat -ano | findstr ":3055" >nul
if %errorlevel% == 0 (
    echo ⚠️  Port 3055 is in use. Trying to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3055"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 >nul
)

netstat -ano | findstr ":3055" >nul
if %errorlevel% == 0 (
    echo ❌ Port 3055 is still in use.
    exit /b 1
)

echo ✅ Port 3055 is available

:: Start server
echo.
echo 🌐 Starting development server...
echo.
echo    Application will be available at:
echo    → http://localhost:3055
echo    → http://127.0.0.1:3055
echo.
echo    Press Ctrl+C to stop
echo.

where pnpm >nul 2>&1
if %errorlevel% == 0 (
    pnpm dev
) else (
    npm run dev
)
