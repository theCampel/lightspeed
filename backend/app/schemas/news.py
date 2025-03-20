from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from datetime import datetime

class NewsArticleSource(BaseModel):
    id: Optional[str] = None
    name: str

class NewsArticle(BaseModel):
    source: NewsArticleSource
    author: Optional[str] = None
    title: str
    description: Optional[str] = None
    url: HttpUrl
    urlToImage: Optional[HttpUrl] = None
    publishedAt: datetime
    content: Optional[str] = None

class NewsResponse(BaseModel):
    status: str
    totalResults: int
    articles: List[NewsArticle] 