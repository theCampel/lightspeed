
import React from 'react';
import { NewsItem } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  newsItems: NewsItem[];
}

export const NewsCard = ({ newsItems }: NewsCardProps) => {
  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-800 border-l-2 border-green-500';
      case 'negative': return 'bg-red-50 text-red-800 border-l-2 border-red-500';
      default: return 'bg-slate-50 text-slate-800 border-l-2 border-slate-300';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        {newsItems.map(news => (
          <div 
            key={news.id} 
            className={cn(
              "p-3 rounded-lg transition-all duration-300",
              getSentimentColor(news.sentiment)
            )}
          >
            <h4 className="font-medium text-sm">{news.title}</h4>
            <p className="text-xs text-slate-500 mt-1">
              {news.source} • {news.publishedAt}
            </p>
            <p className="text-sm mt-2">{news.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
