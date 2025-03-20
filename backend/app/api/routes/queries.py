"""
API routes for handling client queries.
"""
from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
import json

from app.schemas.query import QueryRequest, QueryResponse, CardData, QueryType
from app.core.polygon_service import polygon_service
from app.core.news_service import news_service

router = APIRouter()

@router.post("/process", response_model=QueryResponse)
async def process_query(query: QueryRequest):
    """Process a client query and return relevant data."""
    try:
        if query.query_type == QueryType.STOCK:
            return await process_stock_query(query)
        elif query.query_type == QueryType.MARKET:
            return await process_market_query(query)
        elif query.query_type == QueryType.PORTFOLIO:
            return await process_portfolio_query(query)
        else:
            return await process_general_query(query)
    except Exception as e:
        return QueryResponse(
            success=False,
            message=f"Error processing query: {str(e)}",
            cards=[]
        )

async def process_stock_query(query: QueryRequest) -> QueryResponse:
    """Process a stock-specific query."""
    if not query.stock_data or not query.stock_data.ticker:
        return QueryResponse(
            success=False,
            message="No ticker symbol provided",
            cards=[]
        )
    
    ticker = query.stock_data.ticker.upper()
    cards = []
    
    # Get stock price
    try:
        price_data = await polygon_service.get_stock_price(ticker)
        if "error" not in price_data and price_data.get("results"):
            result = price_data["results"][0]
            close_price = result.get("c", 0)
            prev_close = result.get("o", close_price)
            change = close_price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0
            
            cards.append(CardData(
                id=str(uuid.uuid4()),
                type="stock_price",
                title=f"{ticker} Price Update",
                content=f"Current price: ${close_price:.2f} ({'+' if change >= 0 else ''}{change:.2f}, {'+' if change_percent >= 0 else ''}{change_percent:.2f}%)",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ticker=ticker,
                price_data={
                    "price": close_price,
                    "change": round(change, 2),
                    "change_percent": round(change_percent, 2)
                }
            ))
    except Exception as e:
        print(f"Error getting stock price: {str(e)}")
    
    # Get chart data
    try:
        timespan = query.stock_data.timespan or "day"
        from_date = query.stock_data.from_date
        to_date = query.stock_data.to_date
        
        chart_data = await polygon_service.get_stock_chart_data(ticker, timespan, from_date, to_date)
        if "error" not in chart_data and chart_data.get("results"):
            formatted_data = []
            for point in chart_data["results"]:
                formatted_data.append({
                    "timestamp": point.get("t"),
                    "open": point.get("o"),
                    "high": point.get("h"),
                    "low": point.get("l"),
                    "close": point.get("c"),
                    "volume": point.get("v")
                })
            
            cards.append(CardData(
                id=str(uuid.uuid4()),
                type="chart",
                title=f"{ticker} Price Chart",
                content=f"Price chart for {ticker} over the past 30 days",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ticker=ticker,
                chart_data=formatted_data
            ))
    except Exception as e:
        print(f"Error getting chart data: {str(e)}")
    
    # Get news
    try:
        news_data = await news_service.get_stock_news(ticker)
        if "error" not in news_data and news_data.get("articles"):
            articles = news_data["articles"][:5]  # Limit to 5 articles
            formatted_articles = []
            
            for article in articles:
                formatted_articles.append({
                    "title": article.get("title", ""),
                    "source": article.get("source", {}).get("name", ""),
                    "url": article.get("url", ""),
                    "publishedAt": article.get("publishedAt", ""),
                    "urlToImage": article.get("urlToImage", "")
                })
            
            cards.append(CardData(
                id=str(uuid.uuid4()),
                type="news",
                title=f"Latest {ticker} News",
                content=f"Recent news articles about {ticker}",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ticker=ticker,
                news=formatted_articles
            ))
    except Exception as e:
        print(f"Error getting news data: {str(e)}")
    
    return QueryResponse(
        success=True,
        cards=cards
    )

async def process_market_query(query: QueryRequest) -> QueryResponse:
    """Process a market-related query."""
    cards = []
    
    # Get market news
    try:
        news_data = await news_service.get_market_news()
        if "error" not in news_data and news_data.get("articles"):
            articles = news_data["articles"][:5]  # Limit to 5 articles
            formatted_articles = []
            
            for article in articles:
                formatted_articles.append({
                    "title": article.get("title", ""),
                    "source": article.get("source", {}).get("name", ""),
                    "url": article.get("url", ""),
                    "publishedAt": article.get("publishedAt", ""),
                    "urlToImage": article.get("urlToImage", "")
                })
            
            cards.append(CardData(
                id=str(uuid.uuid4()),
                type="market",
                title="Market News",
                content="Latest market updates and business news",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                news=formatted_articles
            ))
    except Exception as e:
        print(f"Error getting market news: {str(e)}")
    
    return QueryResponse(
        success=True,
        cards=cards
    )

async def process_portfolio_query(query: QueryRequest) -> QueryResponse:
    """Process a portfolio-related query."""
    # This is a placeholder for future portfolio functionality
    return QueryResponse(
        success=True,
        cards=[
            CardData(
                id=str(uuid.uuid4()),
                type="portfolio",
                title="Portfolio Overview",
                content="Your portfolio is performing well with a 5.2% gain this month.",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
        ]
    )

async def process_general_query(query: QueryRequest) -> QueryResponse:
    """Process a general query."""
    return QueryResponse(
        success=True,
        cards=[
            CardData(
                id=str(uuid.uuid4()),
                type="general",
                title="General Information",
                content=f"You asked: {query.query_text}",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
        ]
    ) 