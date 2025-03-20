"""
Service to handle Polygon API requests with API key rotation.
"""
import aiohttp
import asyncio
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from app.core.config import POLYGON_API_KEYS, POLYGON_BASE_URL, POLYGON_REQUESTS_PER_MINUTE

class PolygonService:
    def __init__(self):
        self.api_keys = POLYGON_API_KEYS
        self.current_key_index = 0
        self.request_timestamps: Dict[int, List[float]] = {i: [] for i in range(len(self.api_keys))}
        
    async def get_current_api_key(self) -> str:
        """Get the current API key with rate limiting consideration."""
        # If we have no keys, return empty string
        if not self.api_keys:
            return ""
            
        current_time = time.time()
        one_minute_ago = current_time - 60
        
        # Clean up old timestamps
        for key_index in range(len(self.api_keys)):
            self.request_timestamps[key_index] = [
                ts for ts in self.request_timestamps[key_index] if ts > one_minute_ago
            ]
        
        # Find an API key that hasn't exceeded rate limits
        for _ in range(len(self.api_keys)):
            # If current key has capacity, use it
            if len(self.request_timestamps[self.current_key_index]) < POLYGON_REQUESTS_PER_MINUTE:
                api_key = self.api_keys[self.current_key_index]
                self.request_timestamps[self.current_key_index].append(current_time)
                return api_key
            
            # Otherwise, try the next key
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        
        # If all keys are at their limit, use the first one (and potentially exceed limit)
        self.current_key_index = 0
        api_key = self.api_keys[self.current_key_index]
        self.request_timestamps[self.current_key_index].append(current_time)
        return api_key
    
    async def get_stock_price(self, ticker: str) -> Dict[str, Any]:
        """Get current stock price for a ticker symbol."""
        api_key = await self.get_current_api_key()
        if not api_key:
            return {"error": "No API key available"}
        
        url = f"{POLYGON_BASE_URL}/v2/aggs/ticker/{ticker}/prev"
        params = {"apiKey": api_key}
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        return {"error": f"API error: {response.status}"}
            except Exception as e:
                return {"error": str(e)}
    
    async def get_stock_chart_data(self, ticker: str, timespan: str = "day", from_date: Optional[str] = None, to_date: Optional[str] = None) -> Dict[str, Any]:
        """Get historical stock data for charting.
        
        Args:
            ticker: Stock ticker symbol
            timespan: Timespan unit (minute, hour, day, week, month, quarter, year)
            from_date: From date in YYYY-MM-DD format (defaults to 30 days ago)
            to_date: To date in YYYY-MM-DD format (defaults to today)
        """
        api_key = await self.get_current_api_key()
        if not api_key:
            return {"error": "No API key available"}
        
        # Default date range if not specified
        if not to_date:
            to_date = datetime.now().strftime("%Y-%m-%d")
        if not from_date:
            from_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        url = f"{POLYGON_BASE_URL}/v2/aggs/ticker/{ticker}/range/1/{timespan}/{from_date}/{to_date}"
        params = {"apiKey": api_key, "sort": "asc", "limit": 120}
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        return {"error": f"API error: {response.status}"}
            except Exception as e:
                return {"error": str(e)}
    
    async def search_ticker(self, query: str) -> Dict[str, Any]:
        """Search for ticker symbols."""
        api_key = await self.get_current_api_key()
        if not api_key:
            return {"error": "No API key available"}
        
        url = f"{POLYGON_BASE_URL}/v3/reference/tickers"
        params = {
            "apiKey": api_key, 
            "search": query,
            "active": True,
            "market": "stocks",
            "limit": 10
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        return {"error": f"API error: {response.status}"}
            except Exception as e:
                return {"error": str(e)}

# Create singleton instance
polygon_service = PolygonService() 