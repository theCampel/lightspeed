"""
Service to handle News API requests.
"""
import aiohttp
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

from app.core.config import NEWS_API_KEY, NEWS_API_BASE_URL

class NewsService:
    def __init__(self):
        self.api_key = NEWS_API_KEY
        self.base_url = NEWS_API_BASE_URL
        
    async def get_stock_news(self, ticker: str, company_name: Optional[str] = None, days: int = 7) -> Dict[str, Any]:
        """Get news articles related to a stock ticker.
        
        Args:
            ticker: Stock ticker symbol
            company_name: Company name (optional, for better search results)
            days: Number of days to look back (default: 7)
        """
        if not self.api_key:
            return {"error": "No API key available"}
        
        # Calculate date range
        to_date = datetime.now()
        from_date = to_date - timedelta(days=days)
        
        # Build search query
        query = ticker
        if company_name:
            query = f"{ticker} OR {company_name}"
            
        url = f"{self.base_url}/everything"
        params = {
            "apiKey": self.api_key,
            "q": query,
            "language": "en",
            "sortBy": "publishedAt",
            "from": from_date.strftime("%Y-%m-%d"),
            "to": to_date.strftime("%Y-%m-%d"),
            "pageSize": 10
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
    
    async def get_market_news(self) -> Dict[str, Any]:
        """Get general market news."""
        if not self.api_key:
            return {"error": "No API key available"}
        
        url = f"{self.base_url}/top-headlines"
        params = {
            "apiKey": self.api_key,
            "category": "business",
            "language": "en",
            "country": "us",
            "pageSize": 10
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
news_service = NewsService() 