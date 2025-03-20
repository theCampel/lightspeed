# LightSpeed Frontend

This is the frontend for the LightSpeed application. It provides a React-based interface for users.

## Setup and Installation

1. Install the dependencies:

```bash
# Using npm
npm install

# Or using yarn
yarn

# Or using bun
bun install
```

2. Create a `.env` file in the root directory with the following content:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/media
```

You can adjust these values based on your backend configuration.

## Development

To start the development server:

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using bun
bun run dev
```

The development server will start at http://localhost:8080.

## Building for Production

To build the application for production:

```bash
# Using npm
npm run build

# Or using yarn
yarn build

# Or using bun
bun run build
```

The build artifacts will be stored in the `dist/` directory.

## Preview

To preview the production build:

```bash
# Using npm
npm run preview

# Or using yarn
yarn preview

# Or using bun
bun run preview
```

## Backend Connection

The frontend is configured to connect to a backend running at http://localhost:8000. If the backend is not available, the application will gracefully fall back to using mock data.

To run the backend:

1. Navigate to the backend directory: `cd ../backend`
2. Install the backend dependencies: `pip install -r requirements.txt`
3. Start the backend server: `python app/main.py`

The backend should now be accessible at http://localhost:8000.
