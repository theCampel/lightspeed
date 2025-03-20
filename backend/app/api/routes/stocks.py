"""
API routes for stock data.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
import uuid

from app.core.polygon_service import polygon_service
from app.schemas.stock import StockChartData, StockPriceData, StockTickerSearchResults

router = APIRouter()

@router.get("/price/{ticker}", response_model=StockPriceData)
async def get_stock_price(ticker: str):
    """Get current stock price for a ticker."""
    response = await polygon_service.get_stock_price(ticker.upper())
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    if not response.get("results"):
        raise HTTPException(status_code=404, detail=f"No data found for ticker {ticker}")
    
    # Extract the latest price data
    result = response["results"][0]
    
    # Calculate change and percentage change
    close_price = result.get("c", 0)
    prev_close = result.get("o", close_price)  # Use open as previous if available
    change = close_price - prev_close
    change_percent = (change / prev_close) * 100 if prev_close else 0
    
    return StockPriceData(
        ticker=ticker.upper(),
        price=close_price,
        change=round(change, 2),
        change_percent=round(change_percent, 2),
        timestamp=datetime.now()
    )

@router.get("/chart/{ticker}", response_model=StockChartData)
async def get_stock_chart(
    ticker: str,
    timespan: str = Query("day", description="Timespan unit: minute, hour, day, week, month, quarter, year"),
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    """Get historical stock data for charting."""
    # Set default dates if not provided
    if not to_date:
        to_date = datetime.now().strftime("%Y-%m-%d")
    if not from_date:
        from_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    response = await polygon_service.get_stock_chart_data(
        ticker.upper(), 
        timespan, 
        from_date, 
        to_date
    )
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    if not response.get("results"):
        raise HTTPException(status_code=404, detail=f"No chart data found for ticker {ticker}")
    
    # Format the data for the chart
    chart_points = []
    for point in response["results"]:
        chart_points.append({
            "timestamp": point.get("t"),
            "open": point.get("o"),
            "high": point.get("h"),
            "low": point.get("l"),
            "close": point.get("c"),
            "volume": point.get("v")
        })
    
    return StockChartData(
        ticker=ticker.upper(),
        timespan=timespan,
        from_date=from_date,
        to_date=to_date,
        data=chart_points
    )

@router.get("/search", response_model=StockTickerSearchResults)
async def search_tickers(query: str = Query(..., min_length=1)):
    """Search for stock tickers."""
    response = await polygon_service.search_ticker(query)
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    results = []
    for item in response.get("results", []):
        results.append({
            "ticker": item.get("ticker"),
            "name": item.get("name"),
            "market": item.get("market"),
            "locale": item.get("locale"),
            "primary_exchange": item.get("primary_exchange")
        })
    
    return StockTickerSearchResults(
        count=len(results),
        results=results
    ) 