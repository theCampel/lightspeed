import json
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class PortfolioService:
    def __init__(self):
        """Initialize the portfolio service."""
        pass

    def load_portfolio(self, url= "backend/app/database/portfolio.json"):
        """Load the portfolio from the Path."""
        try:
            with open(url, 'r') as file:
                portfolios = json.load(file)
                return portfolios
        except FileNotFoundError:
            logger.error(f"Portfolio file not found: {url}")
            return []
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON format in portfolio file: {url}")
            return []
        except Exception as e:
            logger.error(f"Error loading portfolio from {url}: {str(e)}")
            return []

        
        