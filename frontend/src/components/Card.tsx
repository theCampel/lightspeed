import React, { useState } from 'react';
import { Pin, PinOff, X } from 'lucide-react';
import { CardData, NewsItem } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { PulseWrapper, Shimmer, LoadingChart } from './LoadingStates';
import { Card as CardUI } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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
        return renderPortfolioCard();
      case 'news':
        return renderNewsCard();
      case 'market':
        return renderMarketCard();
      case 'client':
      default:
        return (
          <div className="px-4 py-2">
            <p className="text-slate-700">{content}</p>
          </div>
        );
    }
  };

  const renderPortfolioCard = () => {
    if (!data.portfolioData) return null;
    
    const { totalValue, change, changePercent, period, allocation, performance } = data.portfolioData;
    const isPositive = change >= 0;

    const renderCustomizedLabel = ({ 
      cx, 
      cy, 
      midAngle, 
      innerRadius, 
      outerRadius, 
      percent, 
      index, 
      name 
    }: any) => {
      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 25;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
      return (
        <text 
          x={x} 
          y={y} 
          fill="#6b7280" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-3xl font-semibold">{formatCurrency(totalValue)}</p>
            <div className={cn(
              "flex items-center text-sm",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span className="font-medium">
                {isPositive ? '+' : ''}{formatCurrency(change)} ({isPositive ? '+' : ''}{changePercent}%)
              </span>
              <span className="text-slate-500 ml-1">{period}</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-[200px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-3">
            <h3 className="text-xs font-medium text-slate-500 mb-2">Portfolio Growth</h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart 
                data={performance}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  padding={{ left: 5, right: 5 }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => formatCurrency(value)}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  width={50}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[200px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-3">
            <h3 className="text-xs font-medium text-slate-500 mb-2">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={true}
                  label={renderCustomizedLabel}
                >
                  {allocation.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#ffffff" 
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-800 border-l-2 border-green-500';
      case 'negative': return 'bg-red-50 text-red-800 border-l-2 border-red-500';
      default: return 'bg-slate-50 text-slate-800 border-l-2 border-slate-300';
    }
  };

  const renderNewsCard = () => {
    if (!data.newsItems) return null;
    
    return (
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          {data.newsItems.map(news => (
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

  const renderMarketCard = () => {
    if (!data.marketData && !data.stockData) {
      return (
        <div className="p-4 space-y-2">
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-lg p-4">
            <p className="text-slate-700 font-medium leading-relaxed">{content}</p>
            {data.insights && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-600 italic">{data.insights}</p>
              </div>
            )}
          </div>

          {data.actionItems && (
            <div className="bg-blue-50 p-3 rounded-lg mt-2">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Recommended Actions</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                {data.actionItems.map((item, index) => (
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

    // We'll render either market data or stock data based on what's available
    if (data.stockData) {
      const { symbol, price, change, changePercent, volume, relatedNews } = data.stockData;
      const isPositive = change >= 0;
      
      return (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{symbol}</h3>
              <p className="text-sm text-slate-500">{data.stockData.company}</p>
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
        <div className="p-4 flex justify-between items-start border-b border-slate-100">
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

        <div className="px-4 py-2 text-right">
          <span className="text-xs text-slate-400">{timestamp}</span>
        </div>
      </CardUI>
    </div>
  );
};
