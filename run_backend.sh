#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Lightspeed backend...${NC}"

# Change to backend directory
cd "$(dirname "$0")/backend" || { 
  echo -e "${RED}Failed to change to backend directory${NC}"
  exit 1
}

# Check for Python installation
if ! command -v python3 &> /dev/null; then
  echo -e "${RED}Python 3 is not installed. Please install Python 3 to run the backend.${NC}"
  exit 1
fi

# Setup virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo -e "${YELLOW}Creating virtual environment...${NC}"
  python3 -m venv venv || {
    echo -e "${RED}Failed to create virtual environment. Please install venv package.${NC}"
    echo -e "${YELLOW}Try: pip3 install virtualenv${NC}"
    exit 1
  }
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate || {
  echo -e "${RED}Failed to activate virtual environment${NC}"
  exit 1
}

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt || {
  echo -e "${RED}Failed to install requirements${NC}"
  exit 1
}

# Check for .env file
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating default .env file...${NC}"
  cat > .env << EOL
# Backend Server Settings
BACKEND_HOST=localhost
BACKEND_PORT=8000

# API Keys - Replace these with your actual API keys
POLYGON_API_KEYS=your_polygon_api_key_1,your_polygon_api_key_2,your_polygon_api_key_3
NEWS_API_KEY=your_news_api_key
EOL
  echo -e "${RED}WARNING: Default .env file created. Please update with your actual API keys.${NC}"
  echo -e "${YELLOW}Edit the .env file with your API keys before proceeding for full functionality.${NC}"
fi

# Set PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Run the backend application
echo -e "${GREEN}Starting backend server...${NC}"
cd app || {
  echo -e "${RED}Failed to change to app directory${NC}"
  exit 1
}

python main.py

# If we reach here, something went wrong
echo -e "${RED}Backend server stopped unexpectedly${NC}" 