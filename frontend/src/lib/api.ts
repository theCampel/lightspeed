/**
 * API service for handling communication with the backend
 */

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/media';

/**
 * Basic fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Health check endpoint
 */
export async function checkHealth() {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/health`);
}

/**
 * Creates a WebSocket connection to the media endpoint
 */
export function createWebSocketConnection() {
  const socket = new WebSocket(WS_URL);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
  
  return socket;
}

export const api = {
  checkHealth,
  createWebSocketConnection,
};

export default api; 