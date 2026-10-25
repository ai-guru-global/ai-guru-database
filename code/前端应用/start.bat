@echo off
chcp 65001 >nul

:: AI Guru Knowledge Base - Start Script (Windows)
:: This script checks prerequisites and starts the dev server

echo 🚀 AI Guru Knowledge Base - Starting Development Server
echo =======================================================

:: Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️  node_modules not found. Installing dependencies...
    
    :: Check if pnpm is available
    where pnpm >nul 2>nul
    if %errorlevel% == 0 (
        echo 📦 Using pnpm to install dependencies...
        pnpm install
    ) else (
        where npm >nul 2>nul
        if %errorlevel% == 0 (
            echo 📦 Using npm to install dependencies...
            npm install
        ) else (
            echo ❌ Error: Neither pnpm nor npm found. Please install Node.js and npm first.
            exit /b 1
        )
    )
)

:: Clean old cache if exists
if exist ".parcel-cache" (
    echo 🧹 Cleaning old .parcel-cache...
    rmdir /s /q ".parcel-cache"
)

:: Check port availability (simplified check)
echo 🔍 Checking port 3055...
netstat -an | findstr ":3055" >nul
if %errorlevel% == 0 (
    echo ❌ Error: Port 3055 is already in use.
    echo    Please stop the other process or change the port in vite.config.ts
    exit /b 1
)

echo ✅ All checks passed!
echo 🌐 Starting development server on http://localhost:3055
echo.

:: Start the dev server
where pnpm >nul 2>nul
if %errorlevel% == 0 (
    pnpm dev
) else (
    npm run dev
)
