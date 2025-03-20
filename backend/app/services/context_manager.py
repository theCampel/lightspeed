import logging
import re
from typing import Any, Dict, List, Optional, Union

from .stock_service import StockService

logger = logging.getLogger(__name__)

class ContextManager:
    """
    Context manager that analyzes text input and determines which service to call.
    Acts as a router between natural language inputs and backend services.
    """
    
    def __init__(self):
        """Initialize the context manager with available services."""
        self.stock_service = StockService()
        # Add other services as needed
        # self.news_service = NewsService()
        # self.weather_service = WeatherService()
        
    async def process_text(self, text: str) -> Dict[str, Any]:
        """
        Process text input and route to appropriate service based on content analysis.
        
        Args:
            text: The text input to analyze
            
        Returns:
            Response from the appropriate service
        """
        logger.info(f"Processing text input: {text}")
        
        # Determine the intent of the text
        intent = self._analyze_intent(text)
        
        if intent["type"] == "stock_price":
            # Extract stock symbol from the input
            symbol = intent.get("symbol")
            if not symbol:
                return {"error": "No stock symbol found in the request"}
            
            # Call the stock service
            return await self.stock_service.get_stock_price(symbol)
            
        elif intent["type"] == "stock_history":
            symbol = intent.get("symbol")
            days = intent.get("days", 30)
            if not symbol:
                return {"error": "No stock symbol found in the request"}
                
            return await self.stock_service.get_historical_prices(symbol, days)
            
        elif intent["type"] == "company_info":
            symbol = intent.get("symbol")
            if not symbol:
                return {"error": "No company symbol found in the request"}
                
            return await self.stock_service.get_company_info(symbol)
            
        elif intent["type"] == "stock_search":
            query = intent.get("query")
            if not query:
                return {"error": "No search query found in the request"}
                
            return await self.stock_service.search_stocks(query)
            
        else:
            return {
                "error": "I couldn't understand what you're asking for",
                "input": text
            }
    
    def _analyze_intent(self, text: str) -> Dict[str, Any]:
        """
        Analyze the text to determine the user's intent.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dict containing intent type and extracted parameters
        """
        text = text.lower()
        
        # Check for stock price requests
        price_patterns = [
            r"(price|value|worth|quote) of (\w+)",
            r"how much is (\w+) (trading|worth|priced)",
            r"(\w+) stock price"
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, text)
            if match:
                # Extract the stock symbol from the match
                symbol = match.group(2) if match.group(2) else match.group(1)
                return {"type": "stock_price", "symbol": symbol.upper()}
        
        # Check for historical data requests
        history_patterns = [
            r"history of (\w+)",
            r"(\w+) (performance|history) (over|in) (\d+) days",
            r"historical data for (\w+)"
        ]
        
        for pattern in history_patterns:
            match = re.search(pattern, text)
            if match:
                symbol = match.group(1)
                # Try to extract number of days
                days_match = re.search(r"(\d+) days", text)
                days = int(days_match.group(1)) if days_match else 30
                
                return {"type": "stock_history", "symbol": symbol.upper(), "days": days}
        
        # Check for company info requests
        company_patterns = [
            r"(info|information|details) (about|on) (\w+)",
            r"tell me about (\w+)",
            r"who is (\w+)"
        ]
        
        for pattern in company_patterns:
            match = re.search(pattern, text)
            if match:
                # The symbol might be in different group positions depending on the pattern
                symbol = match.group(3) if len(match.groups()) >= 3 else match.group(1)
                return {"type": "company_info", "symbol": symbol.upper()}
        
        # Check for search requests
        if "search" in text or "find" in text or "look for" in text:
            # Extract the search query
            search_match = re.search(r"(search|find|look for) (.+)", text)
            if search_match:
                query = search_match.group(2)
                return {"type": "stock_search", "query": query}
        
        # Default case if no patterns match
        return {"type": "unknown", "text": text} 