/**
 * API service for handling communication with the backend
 */
import { QueryType } from '@/types/api';

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/media';

// Timeout for fetch requests (10 seconds)
const FETCH_TIMEOUT = 10000;

/**
 * Basic fetch wrapper with error handling and timeout
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout:', url);
      throw new Error('Request timeout - server may be down');
    }
    
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Health check endpoint with fast timeout
 */
export async function checkHealth() {
  try {
    // Use a shorter timeout for health checks (3 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}

/**
 * Process a client query
 */
export async function processQuery(queryText: string, queryType: QueryType, stockData?: any) {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/queries/process`, {
    method: 'POST',
    body: JSON.stringify({
      query_text: queryText,
      query_type: queryType,
      stock_data: stockData
    })
  });
}

/**
 * Get stock price data
 */
export async function getStockPrice(ticker: string) {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/stocks/price/${ticker}`);
}

/**
 * Get stock chart data
 */
export async function getStockChart(ticker: string, timespan = 'day', fromDate?: string, toDate?: string) {
  let url = `${API_BASE_URL}/api/stocks/chart/${ticker}?timespan=${timespan}`;
  if (fromDate) url += `&from_date=${fromDate}`;
  if (toDate) url += `&to_date=${toDate}`;
  return fetchWithErrorHandling(url);
}

/**
 * Search for stock tickers
 */
export async function searchTickers(query: string) {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/stocks/search?query=${encodeURIComponent(query)}`);
}

/**
 * Get stock news
 */
export async function getStockNews(ticker: string, companyName?: string, days = 7) {
  let url = `${API_BASE_URL}/api/news/stock/${ticker}?days=${days}`;
  if (companyName) url += `&company_name=${encodeURIComponent(companyName)}`;
  return fetchWithErrorHandling(url);
}

/**
 * Get market news
 */
export async function getMarketNews() {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/news/market`);
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
  processQuery,
  getStockPrice,
  getStockChart,
  searchTickers,
  getStockNews,
  getMarketNews,
  createWebSocketConnection,
};

export default api; 