#!/bin/bash

# AI Guru Knowledge Base - Start Script
# This script checks prerequisites and starts the dev server

echo "🚀 AI Guru Knowledge Base - Starting Development Server"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    
    # Check if pnpm is available
    if command -v pnpm &> /dev/null; then
        echo "📦 Using pnpm to install dependencies..."
        pnpm install
    elif command -v npm &> /dev/null; then
        echo "📦 Using npm to install dependencies..."
        npm install
    else
        echo -e "${RED}❌ Error: Neither pnpm nor npm found. Please install Node.js and npm first.${NC}"
        exit 1
    fi
fi

# Clean old cache if exists
if [ -d ".parcel-cache" ]; then
    echo -e "${YELLOW}🧹 Cleaning old .parcel-cache...${NC}"
    rm -rf .parcel-cache
fi

# Check port availability
PORT=3055
if lsof -i :$PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Port $PORT is already in use.${NC}"
    echo "   Please stop the other process or change the port in vite.config.ts"
    exit 1
fi

echo -e "${GREEN}✅ All checks passed!${NC}"
echo "🌐 Starting development server on http://localhost:$PORT"
echo ""

# Start the dev server
if command -v pnpm &> /dev/null; then
    pnpm dev
else
    npm run dev
fi
