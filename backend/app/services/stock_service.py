"""
Service to handle Polygon.io API requests.
"""
import aiohttp
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

from app.services.config import POLYGON_BASE_URL
from app.services.key_cycling_service import polygon_key_service

logger = logging.getLogger(__name__)



class StockService:

    TICKER_TO_COMPANY = {
    "AAPL": "Apple Inc.",
    "GOOGL": "Alphabet Inc.",
    "MSFT": "Microsoft Corporation",
    "AMZN": "Amazon.com Inc.",
    "TSLA": "Tesla Inc.",
    "META": "Meta Platforms Inc.",
    "NFLX": "Netflix Inc.",
    "NVDA": "NVIDIA Corporation",
    "PLTR": "Palantir Technologies Inc.",
    "BRK.A": "Berkshire Hathaway Inc.",
    "JPM": "JPMorgan Chase & Co.",
    "V": "Visa Inc.",
    "MA": "Mastercard Incorporated",
    "DIS": "The Walt Disney Company",
    "AMD": "Advanced Micro Devices Inc.",
    "INTC": "Intel Corporation",
    "BA": "Boeing Company",
    "PYPL": "PayPal Holdings Inc.",
    "UBER": "Uber Technologies Inc.",
    "CRM": "Salesforce Inc.",
}

    def __init__(self):
        """Initialize the Polygon.io service."""
        self.base_url = POLYGON_BASE_URL
        self.key_service = polygon_key_service
        
    async def get_stock_bars(
        self, 
        ticker: str, 
        multiplier: int = 1, 
        timespan: str = "day", 
        from_date: str = None, 
        to_date: str = None, 
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
            from_date: The start date (YYYY-MM-DD), defaults to 7 days ago
            to_date: The end date (YYYY-MM-DD), defaults to yesterday
            adjusted: Whether to include split/dividend adjustments
            sort: Sort order ("asc" or "desc")
            limit: Maximum number of results
            
        Returns:
            Dictionary containing the OHLC data or error information
        """
        # Set default dates if not provided
        if to_date is None:
            yesterday = datetime.now() - timedelta(days=1)
            to_date = yesterday.strftime("%Y-%m-%d")
        
        if from_date is None:
            seven_days_ago = datetime.now() - timedelta(days=30)
            from_date = seven_days_ago.strftime("%Y-%m-%d")
        
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
                        # return data
                    else:
                        error_data = await response.text()
                        logger.error(f"Polygon API error: {response.status} - {error_data}")
                        return {"error": f"API error: {response.status}"}
            except Exception as e:
                logger.error(f"Error accessing Polygon API: {str(e)}")
                return {"error": str(e)}
        
        historical_entries = []
        print(f"Data: {data}")
        for item in data["results"]:
            historical_entries.append({
                "date": datetime.fromtimestamp(item["t"]/1000).strftime("%Y-%m-%d"),
                "price": item["c"],
                "volume": item["v"]
            })
        
        print(f"Historical entries: {historical_entries}")

        data_to_return = {
            "symbol": ticker,
            "company": self.TICKER_TO_COMPANY[ticker],
            "price": data["results"][-1]["c"],
            "change": data["results"][-1]["c"] - data["results"][0]["o"],
            "changePercent": ((data["results"][-1]["c"] - data["results"][0]["o"]) / data["results"][0]["o"]) * 100,
            "volume": data["results"][-1]["v"],
            "historical_data": historical_entries,
            "relatedNews": [
                {
                    "headline": "Stocks slide as Trump threatens more tariffs.",
                    "source": "The Financial Times",
                    "timestamp": "12 hours ago",
                    "sentiment": "negative"
                }
            ]
        }

        return data_to_return

