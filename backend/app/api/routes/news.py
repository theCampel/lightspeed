"""
API routes for news data.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.core.news_service import news_service
from app.schemas.news import NewsResponse

router = APIRouter()

@router.get("/stock/{ticker}", response_model=NewsResponse)
async def get_stock_news(
    ticker: str,
    company_name: Optional[str] = None,
    days: int = Query(7, ge=1, le=30)
):
    """Get news for a specific stock."""
    response = await news_service.get_stock_news(ticker.upper(), company_name, days)
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    return response

@router.get("/market", response_model=NewsResponse)
async def get_market_news():
    """Get general market news."""
    response = await news_service.get_market_news()
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    return response 