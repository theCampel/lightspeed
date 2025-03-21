
import React from 'react';
import { MarketData, StockData } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MarketCardProps {
  content: string;
  timestamp: string;
  marketData?: MarketData;
  stockData?: StockData;
  insights?: string;
  actionItems?: string[];
}

export const MarketCard = ({ content, timestamp, marketData, stockData, insights, actionItems }: MarketCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };
  
  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-800 border-l-2 border-green-500';
      case 'negative': return 'bg-red-50 text-red-800 border-l-2 border-red-500';
      default: return 'bg-slate-50 text-slate-800 border-l-2 border-slate-300';
    }
  };

  if (!marketData && !stockData) {
    return (
      <div className="p-4 space-y-2">
        <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-lg p-4">
          <p className="text-slate-700 font-medium leading-relaxed">{content}</p>
          {insights && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm text-slate-600 italic">{insights}</p>
            </div>
          )}
        </div>

        {actionItems && (
          <div className="bg-blue-50 p-3 rounded-lg mt-2">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (stockData) {
    const { symbol, price, change, changePercent, volume, relatedNews } = stockData;
    const isPositive = change >= 0;
    
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{symbol}</h3>
            <p className="text-sm text-slate-500">{stockData.company}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{formatCurrency(price)}</p>
            <p className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
        
        {relatedNews && relatedNews.length > 0 && (
          <div className="border-t border-slate-100 pt-3 mt-3">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Recent News</h4>
            <div className="space-y-2">
              {relatedNews.map((item, index) => (
                <div key={index} className={cn(
                  "p-2 rounded text-sm",
                  getSentimentColor(item.sentiment)
                )}>
                  {item.headline}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 flex justify-between">
          <span>Volume: {new Intl.NumberFormat().format(volume)}</span>
          <span>Last Updated: {timestamp}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-2">
      <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-lg p-4">
        <p className="text-slate-700 font-medium leading-relaxed">{content}</p>
      </div>
    </div>
  );
};
