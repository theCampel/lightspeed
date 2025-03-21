import React, { useState } from 'react';
import { StockData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StockCardProps {
  stockData: StockData;
  timestamp: string;
}

export const StockCard = ({ stockData, timestamp }: StockCardProps) => {
  const [timeframe, setTimeframe] = useState('6m');
  const { symbol, company, price, change, changePercent, volume, historical_data, relatedNews } = stockData;
  
  
  // Debugging to check if historical_data exists
  console.log(`StockCard for ${symbol}:`, { 
    hasHistoricalData: !!historical_data, 
    historicalDataLength: historical_data?.length || 0,
    stockData
  });
  
  const isPositive = change >= 0;

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

  const getTimeframeData = () => {
    if (!historical_data || historical_data.length === 0) {
      console.log('No historical data available:', historical_data);
      return [];
    }
    
    console.log('Raw historical data:', historical_data);
    
    // Apply proper timeframe filtering
    if (timeframe === '1m') return historical_data.slice(-30); // Assuming daily data points
    if (timeframe === '3m') return historical_data.slice(-90);
    if (timeframe === '6m') return historical_data.slice(-180);
    return historical_data; // 1y is default
  };
  
  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{symbol}</h3>
          <p className="text-sm text-slate-500">{company}</p>
          <div className="mt-1">
            <span className="text-lg font-semibold">{formatCurrency(price)}</span>
            <span className={cn(
              "ml-2 text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value)}>
          <ToggleGroupItem value="1m" size="sm">1M</ToggleGroupItem>
          <ToggleGroupItem value="3m" size="sm">3M</ToggleGroupItem>
          <ToggleGroupItem value="6m" size="sm">6M</ToggleGroupItem>
          <ToggleGroupItem value="1y" size="sm">1Y</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {historical_data && historical_data.length > 0 ? (
        <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getTimeframeData()}
              margin={{ top: 5, right: 5, bottom: 15, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(value) => formatCurrency(value)}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center justify-center">
          <p className="text-slate-400 text-sm">No historical data available</p>
        </div>
      )}

      {relatedNews && relatedNews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Recent News</h4>
          <div className="space-y-2">
            {relatedNews.map((item, index) => (
              <div key={index} className={cn(
                "p-2 rounded-lg",
                getSentimentColor(item.sentiment)
              )}>
                <div className="text-sm">{item.headline}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.source} • {item.timestamp}
                </div>
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
};
