import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { CardData, QueryType } from '@/types/api';

// Mock API implementation for fallback
const mockProcessQuery = async (query: string, queryType: QueryType, stockData?: any) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    cards: [
      {
        id: `mock-card-${Date.now()}`,
        type: queryType,
        title: `Response to: ${query}`,
        content: 'This is mock data shown because the backend is currently unavailable. The system is using pre-generated responses.',
        timestamp: new Date().toISOString(),
        ticker: stockData?.ticker || 'AAPL',
      }
    ]
  };
};

/**
 * Return type for useCardData hook
 */
interface UseCardDataReturn {
  cards: CardData[];
  loading: boolean;
  error: string | null;
  processQuery: (query: string, queryType: QueryType, stockData?: any) => Promise<void>;
  clearCards: () => void;
  getBackendStatus: () => { connected: boolean };
}

/**
 * Custom hook for managing card data
 */
export const useCardData = (): UseCardDataReturn => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackend, setUseBackend] = useState(true);
  
  // Check if the backend is available on initial load
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.checkHealth();
        setUseBackend(true);
        console.log('Backend connected successfully');
      } catch (err) {
        setUseBackend(false);
        // Add some initial mock data when backend is unavailable
        setCards([
          {
            id: `mock-initial-${Date.now()}`,
            type: 'welcome',
            title: 'Welcome to Lightspeed',
            content: 'Backend is currently unavailable. Using mock data mode. Your queries will be processed with pre-generated responses.',
            timestamp: new Date().toISOString(),
          }
        ]);
        console.warn('Backend unavailable, using mock data:', err);
      }
    };
    
    // Run the check immediately
    checkBackend();
    
    // Set up an interval to periodically check backend health
    const interval = setInterval(async () => {
      try {
        await api.checkHealth();
        if (!useBackend) {
          console.log('Backend connection restored');
          setUseBackend(true);
        }
      } catch (err) {
        if (useBackend) {
          console.warn('Backend connection lost, switching to mock data');
          setUseBackend(false);
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Process a user query to generate cards
   */
  const processQuery = useCallback(async (query: string, queryType: QueryType = QueryType.GENERAL, stockData?: any) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (useBackend) {
        try {
          // Try to use the real backend first
          result = await api.processQuery(query, queryType, stockData);
        } catch (err) {
          console.warn('Backend request failed, falling back to mock data:', err);
          setUseBackend(false);
          // Fall back to mock data
          result = await mockProcessQuery(query, queryType, stockData);
        }
      } else {
        // Use mock data if we know backend is unavailable
        result = await mockProcessQuery(query, queryType, stockData);
      }
      
      if (result && Array.isArray(result.cards)) {
        setCards(prevCards => [...result.cards, ...prevCards]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error processing query:', err);
      setError('Failed to process your query. Please try again.');
      // Keep existing cards if there was an error
    } finally {
      setLoading(false);
    }
  }, [useBackend]);
  
  /**
   * Clear all cards
   */
  const clearCards = useCallback(() => {
    setCards([]);
    setError(null);
  }, []);
  
  /**
   * Get the backend connection status
   */
  const getBackendStatus = useCallback(() => {
    return { connected: useBackend };
  }, [useBackend]);

  return {
    cards,
    loading,
    error,
    processQuery,
    clearCards,
    getBackendStatus,
  };
}; 