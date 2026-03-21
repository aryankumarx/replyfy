#!/bin/bash

# AI Keyboard Assistant - Quick Start Script
# This script helps you set up the project quickly

set -e  # Exit on error

echo "🚀 AI Keyboard Assistant - Quick Start"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
echo ""

# Ask for Claude API key
echo "📝 Configuration"
echo "================"
read -p "Enter your Claude API key (sk-ant-api03-...): " CLAUDE_KEY

if [ -z "$CLAUDE_KEY" ]; then
    echo -e "${RED}❌ API key is required${NC}"
    exit 1
fi

# Setup backend
echo ""
echo "🔧 Setting up Backend..."
echo "========================"

cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Update .env with API key
sed -i.bak "s/your_claude_api_key_here/$CLAUDE_KEY/" .env
rm .env.bak
echo -e "${GREEN}✅ Updated .env with your API key${NC}"

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Start backend in background
echo ""
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
echo "   URL: http://localhost:3000"

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Test backend
if curl -s http://localhost:3000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running!${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Setup frontend
echo ""
echo "🔧 Setting up Frontend..."
echo "========================="

cd ../frontend

echo "📦 Installing frontend dependencies..."
echo -e "${YELLOW}⚠️  This may take 5-10 minutes...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Setup Complete! ✨${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Next Steps:"
echo ""
echo "1. Open a new terminal and run:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "2. In another terminal, run:"
echo "   cd frontend"
echo "   npx react-native run-android"
echo ""
echo "3. Test the app with example messages!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backend is running at: http://localhost:3000"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "To stop the backend: kill $BACKEND_PID"
echo ""
echo -e "${YELLOW}📖 Check docs/SETUP_GUIDE.md for detailed instructions${NC}"
echo ""

# Keep script running
read -p "Press Enter to stop the backend server..."
kill $BACKEND_PID
echo -e "${GREEN}✅ Backend stopped${NC}"
