"""
Service to handle Polygon.io API requests.
"""
import aiohttp
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

from app.services.config import POLYGON_BASE_URL
from app.services.key_cycling_service import polygon_key_service

logger = logging.getLogger(__name__)

class StockService:
    def __init__(self):
        """Initialize the Polygon.io service."""
        self.base_url = POLYGON_BASE_URL
        self.key_service = polygon_key_service
        
    async def get_stock_bars(
        self, 
        ticker: str, 
        multiplier: int, 
        timespan: str, 
        from_date: str, 
        to_date: str, 
        adjusted: bool = True, 
        sort: str = "asc", 
        limit: int = 120
    ) -> Dict[str, Any]:
        """
        Get OHLC (Open, High, Low, Close) data for a specified stock ticker.
        
        Args:
            ticker: Stock ticker symbol
            multiplier: The size of the timespan multiplier
            timespan: The size of the time window (minute, hour, day, week, month, quarter, year)
            from_date: The start date (YYYY-MM-DD)
            to_date: The end date (YYYY-MM-DD)
            adjusted: Whether to include split/dividend adjustments
            sort: Sort order ("asc" or "desc")
            limit: Maximum number of results
            
        Returns:
            Dictionary containing the OHLC data or error information
        """
        api_key = self.key_service.get_api_key()
        if not api_key:
            logger.error("No available API keys for Polygon.io")
            return {"error": "Rate limit exceeded for all API keys"}
        
        url = f"{self.base_url}/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from_date}/{to_date}"
        params = {
            "apiKey": api_key,
            "adjusted": str(adjusted).lower(),
            "sort": sort,
            "limit": limit
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        error_data = await response.text()
                        logger.error(f"Polygon API error: {response.status} - {error_data}")
                        return {"error": f"API error: {response.status}"}
            except Exception as e:
                logger.error(f"Error accessing Polygon API: {str(e)}")
                return {"error": str(e)}

