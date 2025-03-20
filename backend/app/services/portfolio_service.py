import json
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class PortfolioService:
    def __init__(self):
        """Initialize the PortfolioService."""
        pass

    def get_portfolio(self, url= "backend/app/database/portfolios.json"):
        """Get the portfolio from the Path."""
        try:
            with open(url, 'r') as file:
                portfolios = json.load(file)
                return portfolios
        except FileNotFoundError:
            logger.error(f"Portfolio file not found: {url}")
            return []

    def get_portfolio_by_id(self, id: str):
        """Get the portfolio by id."""
        portfolios = self.get_portfolio()
        for portfolio in portfolios:
            if portfolio['id'] == id:
                return portfolio
        return None
