#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Lightspeed frontend...${NC}"

# Change to frontend directory
cd "$(dirname "$0")/frontend" || { 
  echo -e "${RED}Failed to change to frontend directory${NC}"
  exit 1
}

# Check for Node.js installation
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js to run the frontend.${NC}"
  exit 1
fi

# Check for npm installation
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm is not installed. Please install npm to run the frontend.${NC}"
  exit 1
fi

# Install dependencies if node_modules doesn't exist or package.json was modified
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install || {
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
  }
fi

# Set environment variables if .env file doesn't exist
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating default .env file...${NC}"
  cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/media
EOL
fi

# Start the development server
echo -e "${GREEN}Starting frontend development server...${NC}"
npm run dev || {
  echo -e "${RED}Failed to start the frontend development server${NC}"
  exit 1
}

# If we reach here, something went wrong
echo -e "${RED}Frontend server stopped unexpectedly${NC}" 