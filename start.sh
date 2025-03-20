#!/bin/bash

# Start the backend
echo "Starting backend..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cd app
python main.py &
BACKEND_PID=$!
cd ../..

# Start the frontend
echo "Starting frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

echo ""
echo "===================================================="
echo "LightSpeed application is running"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:8080"
echo "===================================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user input
wait 