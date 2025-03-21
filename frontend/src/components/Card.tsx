import React, { useState } from 'react';
import { Pin, PinOff, X } from 'lucide-react';
import { CardData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Card as CardUI } from '@/components/ui/card';
import { PortfolioCard } from './cards/PortfolioCard';
import { NewsCard } from './cards/NewsCard';
import { MarketCard } from './cards/MarketCard';
import { StockCard } from './cards/StockCard';
import { FundCard } from './cards/FundCard';
import { SummaryCard } from './cards/SummaryCard';
import { ClientCard } from './cards/ClientCard';
import { LoadingChart } from './LoadingStates';

interface CardProps {
  data: CardData;
  onPin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
}

export const Card = ({ data, onPin, onDelete }: CardProps) => {
  const [hover, setHover] = useState(false);
  const { id, type, title, content, timestamp, isPinned, isLoading } = data;

  const Icon = data.icon;

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin(id, !isPinned);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const renderCardContent = () => {
    if (isLoading) {
      return <LoadingChart />;
    }

    switch (type) {
      case 'portfolio':
        return data.portfolioData ? 
          <PortfolioCard timestamp={timestamp} /> : null;
      case 'news':
        return data.newsItems ? 
          <NewsCard newsItems={data.newsItems} /> : null;
      case 'market':
        return <MarketCard 
          content={content} 
          timestamp={timestamp} 
          marketData={data.marketData} 
          stockData={data.stockData} 
          insights={data.insights}
          actionItems={data.actionItems}
        />;
      case 'stock':
        return data.stockData ? 
          <StockCard stockData={data.stockData} timestamp={timestamp} /> : null;
      case 'fund':
        return data.fundSuggestions ? 
          <FundCard 
            content={content} 
            fundSuggestions={data.fundSuggestions} 
            is_esg_highlight={data.is_esg_highlight} 
          /> : null;
      case 'summary':
        return data.conversationSummary ? 
          <SummaryCard conversationSummary={data.conversationSummary} /> : null;
      case 'client':
      default:
        return <ClientCard content={content} />;
    }
  };

  return (
    <div className={isLoading ? "animate-pulse-subtle" : ""}>
      <CardUI
        className={cn(
          'w-full bg-white/90 backdrop-blur-sm overflow-hidden transition-all duration-300',
          `card-${type}`,
          'hover:shadow-lg',
          isLoading ? 'opacity-80' : 'opacity-100',
          isPinned && 'ring-2 ring-primary/30',
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="p-3 flex justify-between items-start border-b border-slate-100">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`text-${type} w-5 h-5`} />}
            <h3 className="font-semibold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePin}
              className={cn(
                'p-1 rounded-full transition-opacity',
                (hover || isPinned) ? 'opacity-100' : 'opacity-0',
                isPinned ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                'p-1 rounded-full text-slate-400 hover:text-slate-600 transition-opacity',
                hover ? 'opacity-100' : 'opacity-0'
              )}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {renderCardContent()}

        <div className="px-3 py-2 text-right">
          <span className="text-xs text-slate-400">{timestamp}</span>
        </div>
      </CardUI>
    </div>
  );
};
