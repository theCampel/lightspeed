import logging
import os
import re
import json
from typing import Any, Dict, List, Optional, Union
from openai import OpenAI


from .stock_service import StockService

logger = logging.getLogger(__name__)

class ContextManager:
    """
    Context manager that analyzes text input and determines which service to call.
    Acts as a router between natural language inputs and backend services.
    """
    
    def __init__(self):
        """Initialize the context manager with available services."""

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        
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
            stock_data = await self.stock_service.get_stock_bars(symbol, 1, "day", "2025-03-12", "2025-03-19", True, "asc", 120)
            return {
                "type": "stock_card",
                "data": stock_data
            }
            
        # elif intent["type"] == "stock_history":
        #     symbol = intent.get("symbol")
        #     days = intent.get("days", 30)
        #     if not symbol:
        #         return {"error": "No stock symbol found in the request"}
                
        #     return await self.stock_service.get_historical_prices(symbol, days)
            
        # elif intent["type"] == "company_info":
        #     symbol = intent.get("symbol")
        #     if not symbol:
        #         return {"error": "No company symbol found in the request"}
                
        #     return await self.stock_service.get_company_info(symbol)
            
        # elif intent["type"] == "stock_search":
        #     query = intent.get("query")
        #     if not query:
        #         return {"error": "No search query found in the request"}
                
        #     return await self.stock_service.search_stocks(query)
            
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
        
        logger.info(f"Analyzing intent for text: {text}")
        
        # Define available intent types
        available_intents = [
            "stock_price",      # For current stock price requests
            "stock_history",    # For historical stock data requests
            "company_info",     # For company information requests
            "stock_search"      # For searching/finding stocks
        ]
        
        # Create a prompt for intent classification and parameter extraction
        prompt = f"""
        Analyze the following text and determine the user's intent. The text is: "{text}"
        
        Available intents are:
        - stock_price: When the user wants to know the current price of a stock
        - stock_history: When the user wants historical price data for a stock
        - company_info: When the user wants information about a company
        - stock_search: When the user is trying to find or search for a stock
        
        Return a JSON object with the following structure:
        {{
            "intent_type": "one of the available intents or 'unknown'",
            "parameters": {{
                // For stock_price, stock_history, company_info:
                "symbol": "the stock ticker symbol mentioned (e.g., AAPL for Apple)",
                
                // For stock_history only:
                "days": number of days of history requested (default to 30 if not specified),
                
                // For stock_search only:
                "query": "the search term used to find stocks"
            }}
        }}
        
        Respond with ONLY the JSON object, nothing else.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model="openai/gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={"type": "json_object"}
            )
            
            # Parse the response
            response_content = completion.choices[0].message.content
            logger.info(f"Intent analysis response: {response_content}")
            
            # Parse the JSON response
            intent_data = json.loads(response_content)
            
            # Extract the intent type
            intent_type = intent_data.get("intent_type", "unknown")
            parameters = intent_data.get("parameters", {})
            
            # Build and return the result
            result = {"type": intent_type}
            
            # Add parameters based on intent type
            if intent_type == "stock_price" or intent_type == "company_info":
                result["symbol"] = parameters.get("symbol")
            elif intent_type == "stock_history":
                result["symbol"] = parameters.get("symbol")
                result["days"] = parameters.get("days", 30)  # Default to 30 days
            elif intent_type == "stock_search":
                result["query"] = parameters.get("query")
                
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing intent: {e}")
            
        # Default case if analysis fails
        return {"type": "unknown", "text": text} 