"""
Configuration settings for the application.
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
POLYGON_API_KEYS = os.getenv("POLYGON_API_KEYS", "").split(",")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

# API Settings
POLYGON_BASE_URL = "https://api.polygon.io"
NEWS_API_BASE_URL = "https://newsapi.org/v2"

# API Rate Limiting
POLYGON_REQUESTS_PER_MINUTE = 5 