// API Types
export enum QueryType {
  STOCK = "stock",
  MARKET = "market",
  PORTFOLIO = "portfolio",
  GENERAL = "general"
}

export interface StockPriceData {
  ticker: string;
  price: number;
  change: number;
  change_percent: number;
  timestamp: string;
}

export interface StockChartPoint {
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: number;
}

export interface StockChartData {
  ticker: string;
  timespan: string;
  from_date: string;
  to_date: string;
  data: StockChartPoint[];
}

export interface NewsArticleSource {
  id?: string;
  name: string;
}

export interface NewsArticle {
  source: NewsArticleSource;
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface StockQuery {
  ticker: string;
  timespan?: string;
  from_date?: string;
  to_date?: string;
}

export interface QueryRequest {
  query_text: string;
  query_type: QueryType;
  stock_data?: StockQuery;
  additional_context?: Record<string, any>;
}

export interface CardData {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: string;
  ticker?: string;
  price_data?: Record<string, any>;
  chart_data?: Record<string, any>[];
  news?: Record<string, any>[];
}

export interface QueryResponse {
  success: boolean;
  message?: string;
  cards: CardData[];
} 