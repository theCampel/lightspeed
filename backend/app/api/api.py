import sys
import os
from fastapi import APIRouter

# Adjust import paths if needed
try:
    from app.api.routes import stocks, news, queries
except ModuleNotFoundError:
    # Handle case when run directly from app directory
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
    from api.routes import stocks, news, queries

api_router = APIRouter()
api_router.include_router(stocks.router, prefix="/stocks", tags=["stocks"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(queries.router, prefix="/queries", tags=["queries"]) 