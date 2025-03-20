# LightSpeed

A full-stack application providing real-time insights for high-value clients.

## Structure

- `backend/` - FastAPI backend server
- `frontend/` - React frontend application with Vite, TypeScript, and Tailwind CSS

## Quick Start

The easiest way to start both backend and frontend servers is to use the provided script:

```bash
./start.sh
```

This script will:
1. Start the backend server on port 8000
2. Start the frontend development server on port 8080
3. Install all necessary dependencies

You can then access the application at http://localhost:8080

## Manual Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set up a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   cd app
   python main.py
   ```

The backend will be accessible at http://localhost:8000.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # Or: yarn install
   # Or: bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # Or: yarn dev
   # Or: bun run dev
   ```

The frontend will be accessible at http://localhost:8080.

## Development

The frontend is configured to proxy API requests to the backend automatically. If the backend is not available, the application will gracefully fall back to using mock data.

## Connecting to websocket

The application uses WebSockets for real-time communication. The WebSocket endpoint is available at:

```
ws://localhost:8000/media
```