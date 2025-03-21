import logging
import os
import re
import json
from typing import Any, Dict, List, Optional, Union
from openai import OpenAI

from app.services.profile_service import ProfileService


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

        if intent["intent_type"] == "stock_analysis":
            # Extract stock ticker from the input
            ticker = intent.get("parameters").get("ticker")
            if not ticker:
                return {
                    "status": "skipped",
                    "error": "No stock symbol found in the request",
                }

            # Call the stock service
            stock_data = await self.stock_service.get_stock_bars(
                ticker,
            )
            return {"card": "stock_card", "data": stock_data}

        elif intent["intent_type"] == "esg_card":
            buckets = self.buckets_service.get_buckets()
            return {"card": "esg_card", "data": buckets}

        elif intent["intent_type"] == "highlight_esg":
            return {"card": "highlight_esg"}

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
                "status": "skipped",
                "error": "I couldn't understand what you're asking for",
                "input": text,
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

        # Create a prompt for intent classification and parameter extraction
        prompt = f"""
        Analyze the following text and determine the user's intent. The text is: "{text}"
        
        Available intents are:
        - esg_card: When the user wants to make more sustainability focused investments.
        - highlight_esg: When the user chooses one specific ESG fund to changes to.
        - stock_analysis: When the user mentions one specific stock.
        
        Return a JSON object with the following structure:
        {{
            "intent_type": "one of the available intents or 'unknown'",
            "parameters": {{
                // For stock_search only:
                "ticker": "the ticker of the mentioned stock"
            }}
        }}
        
        Respond with ONLY the JSON object, nothing else.
        """

        try:
            completion = self.client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )

            # Parse the response
            response_content = completion.choices[0].message.content
            logger.info(f"Intent analysis response: {response_content}")

            # Parse the JSON response
            intent_data = json.loads(response_content)

            return intent_data

        except Exception as e:
            logger.error(f"Error analyzing intent: {e}")

        # Default case if analysis fails
        return {"type": "unknown", "text": text}