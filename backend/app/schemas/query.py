from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from enum import Enum

class QueryType(str, Enum):
    STOCK = "stock"
    MARKET = "market"
    PORTFOLIO = "portfolio"
    GENERAL = "general"

class StockQuery(BaseModel):
    ticker: str
    timespan: Optional[str] = "day"
    from_date: Optional[str] = None
    to_date: Optional[str] = None

class QueryRequest(BaseModel):
    query_text: str
    query_type: QueryType
    stock_data: Optional[StockQuery] = None
    additional_context: Optional[Dict[str, Any]] = None

class CardData(BaseModel):
    id: str
    type: str
    title: str
    content: str
    timestamp: str
    ticker: Optional[str] = None
    price_data: Optional[Dict[str, Any]] = None
    chart_data: Optional[List[Dict[str, Any]]] = None
    news: Optional[List[Dict[str, Any]]] = None

class QueryResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    cards: List[CardData] 