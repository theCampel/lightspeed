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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2 } from 'lucide-react';

interface CardProps {
  data: CardData;
  onPin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
  onSelectFund?: (id: string) => void;
  selectedFundId?: string | null;
}

export const Card = ({ data, onPin, onDelete, onSelectFund, selectedFundId }: CardProps) => {
  const [hover, setHover] = useState(false);
  const [timeframe, setTimeframe] = useState('6m');
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const renderCardContent = () => {
    if (isLoading) {
      return <LoadingChart />;
    }

    switch (type) {
      case 'portfolio':
        return data.portfolioData ? 
          <PortfolioCard portfolioData={data.portfolioData} timestamp={timestamp} /> : null;
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
        return data.fundSuggestions ? (
          <FundCard 
            content={content}
            fundSuggestions={data.fundSuggestions}
            timestamp={timestamp}
            onSelectFund={onSelectFund}
            selectedFundId={selectedFundId || undefined}
          />
        ) : null;
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
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <h3 className="font-medium text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePin}
              className={cn(
                "p-1 rounded-full transition-colors",
                isPinned ? "text-primary bg-primary/10" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              )}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {renderCardContent()}
      </CardUI>
    </div>
  );
};
