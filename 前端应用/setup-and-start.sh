#!/bin/bash

# AI Guru Knowledge Base - Setup and Start Script
# This script performs a complete setup and starts the dev server

set -e  # Exit on error

echo "🚀 AI Guru Knowledge Base - Complete Setup"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version is too old. Please upgrade to 18+.${NC}"
    echo "   Current version: $(node --version)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Clean up old files
echo ""
echo -e "${BLUE}🧹 Cleaning up...${NC}"
if [ -d ".parcel-cache" ]; then
    rm -rf .parcel-cache
    echo "   ✓ Removed .parcel-cache"
fi

if [ -d "dist" ]; then
    rm -rf dist
    echo "   ✓ Removed dist"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"

if command -v pnpm &> /dev/null; then
    echo "   Using pnpm..."
    pnpm install
elif command -v npm &> /dev/null; then
    echo "   Using npm..."
    npm install
else
    echo -e "${RED}❌ Neither pnpm nor npm found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check if installation was successful
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Installation failed. node_modules not found.${NC}"
    exit 1
fi

# Check port availability
echo ""
echo -e "${BLUE}🔍 Checking port 3055...${NC}"
if lsof -i :3055 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3055 is in use. Trying to kill existing process...${NC}"
    kill $(lsof -t -i :3055) 2>/dev/null || true
    sleep 1
fi

if lsof -i :3055 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 3055 is still in use. Please stop the other process manually.${NC}"
    lsof -i :3055
    exit 1
fi

echo -e "${GREEN}✅ Port 3055 is available${NC}"

# Start the server
echo ""
echo -e "${GREEN}🌐 Starting development server...${NC}"
echo ""
echo -e "   ${BLUE}Application will be available at:${NC}"
echo -e "   ${GREEN}→ http://localhost:3055${NC}"
echo -e "   ${GREEN}→ http://127.0.0.1:3055${NC}"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

if command -v pnpm &> /dev/null; then
    pnpm dev
else
    npm run dev
fi
