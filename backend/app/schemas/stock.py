from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class StockPriceData(BaseModel):
    ticker: str
    price: float
    change: float
    change_percent: float
    timestamp: datetime

class StockChartPoint(BaseModel):
    timestamp: int
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: float
    volume: Optional[int] = None

class StockChartData(BaseModel):
    ticker: str
    timespan: str
    from_date: str
    to_date: str
    data: List[StockChartPoint]

class StockTickerInfo(BaseModel):
    ticker: str
    name: str
    market: Optional[str] = None
    locale: Optional[str] = None
    primary_exchange: Optional[str] = None
    
class StockTickerSearchResults(BaseModel):
    count: int
    results: List[StockTickerInfo] 