import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  TooltipProps,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
} from 'recharts';

interface PortfolioCardProps {
  timestamp: string;
}

interface ApiPortfolioData {
  portfolio: {
    total_value_tracked: string;
    percentage_change: number;
    holdings: {
      ticker: string;
      company: string;
      value: string;
      portfolio_weight: string;
      percentage_change: string;
    }[];
    biggest_movers: {
      ticker: string;
      company: string;
      movement: string;
      news_article: {
        title: string;
        source: string;
        url: string;
        excerpt: string;
      };
    }[];
    performance?: {
      date: string;
      value: number;
    }[];
  };
}

export const PortfolioCard = ({ timestamp }: PortfolioCardProps) => {
  const [timeframe, setTimeframe] = useState('6m');
  const [apiData, setApiData] = useState<ApiPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/portfolio/');
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data: ${response.status}`);
        }
        const data = await response.json();
        
        // Add sample performance data if not available from API
        if (!data.portfolio.performance) {
          data.portfolio.performance = [
            { date: 'Jan', value: 11800000 },
            { date: 'Feb', value: 12100000 },
            { date: 'Mar', value: 12000000 },
            { date: 'Apr', value: 12200000 },
            { date: 'May', value: 12350000 },
            { date: 'Jun', value: 12500000 },
          ];
        }
        
        setApiData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Get the soft color palette for charts
  const softColorPalette = [
    "#8E9196",
    "#9b87f5",
    "#7E69AB",
    "#D6BCFA",
    "#FDE1D3",
    "#D3E4FD",
    "#E5DEFF",
    "#F1F0FB",
  ];

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string' && value.startsWith('$')) {
      return value; // Already formatted
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(typeof value === 'number' ? value : 0);
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-800 border-l-2 border-green-500';
      case 'negative': return 'bg-red-50 text-red-800 border-l-2 border-red-500';
      default: return 'bg-slate-50 text-slate-800 border-l-2 border-slate-300';
    }
  };

  const getMovementSentiment = (movement: string): 'positive' | 'negative' | 'neutral' => {
    if (movement.startsWith('+')) return 'positive';
    if (movement.startsWith('-')) return 'negative';
    return 'neutral';
  };
  
  // Handle timeframe filtering for performance data
  const getTimeframeData = () => {
    if (!apiData?.portfolio.performance) return [];
    
    const performance = apiData.portfolio.performance;
    
    if (timeframe === '1m') return performance.slice(-2);
    if (timeframe === '3m') return performance.slice(-4);
    if (timeframe === '1y') return performance;
    
    // 6m is default
    return performance;
  };

  // Generate pie chart data from API holdings
  const generateAllocationData = () => {
    if (!apiData) return [];
    
    return apiData.portfolio.holdings.map(holding => ({
      label: holding.ticker,
      value: parseFloat(holding.portfolio_weight.replace('%', '')),
      color: softColorPalette[Math.floor(Math.random() * softColorPalette.length)]
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-3 space-y-3 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="h-[180px] bg-slate-100 rounded-xl"></div>
          <div className="h-[180px] bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-[200px] bg-slate-100 rounded-xl mt-3"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-3 text-red-500">
        <p>Error loading portfolio data: {error}</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  // If we don't have API data, show loading or return early
  if (!apiData) {
    return (
      <div className="p-3 space-y-3 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="h-[180px] bg-slate-100 rounded-xl"></div>
          <div className="h-[180px] bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-[200px] bg-slate-100 rounded-xl mt-3"></div>
      </div>
    );
  }

  // We have API data, use it
  const portfolio = apiData.portfolio;
  const isPositive = portfolio.percentage_change >= 0;
  const hasPerformanceData = portfolio.performance && portfolio.performance.length > 0;

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-2xl font-semibold">{portfolio.total_value_tracked}</p>
          <div className={cn(
            "flex items-center text-sm",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span className="font-medium">
              {isPositive ? '+' : ''}{portfolio.percentage_change}%
            </span>
            <span className="text-slate-500 ml-1">YTD</span>
          </div>
        </div>
        <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value)}>
          <ToggleGroupItem value="1m" size="sm">1M</ToggleGroupItem>
          <ToggleGroupItem value="3m" size="sm">3M</ToggleGroupItem>
          <ToggleGroupItem value="6m" size="sm">6M</ToggleGroupItem>
          <ToggleGroupItem value="1y" size="sm">1Y</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3">
        {/* Portfolio Growth Chart */}
        <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-medium text-slate-500 mb-2">Portfolio Growth</h3>
          {hasPerformanceData ? (
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart 
                data={getTimeframeData()}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
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
                  fillOpacity={0} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-sm text-slate-500">Historical data not available</p>
            </div>
          )}
        </div>
        
        {/* Asset Allocation Pie Chart */}
        <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-medium text-slate-500 mb-2">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={generateAllocationData()}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
              >
                {generateAllocationData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || softColorPalette[index % softColorPalette.length]} 
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
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', paddingLeft: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio Breakdown */}
      {portfolio.holdings && (
        <div className="mt-3">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Portfolio Breakdown</h3>
          <div className="bg-white rounded-lg p-2 overflow-x-auto border border-slate-100 shadow-sm">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 font-medium text-slate-500">Name</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Value</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Change</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-500">Weight</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((item, index) => {
                  const isItemPositive = item.percentage_change.startsWith('+');
                  return (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-2 px-2">
                        <div className="font-medium">{item.company}</div>
                        <div className="text-slate-400">{item.ticker}</div>
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {item.value}
                      </td>
                      <td className={cn(
                        "text-right py-2 px-2 font-medium",
                        isItemPositive ? "text-green-600" : "text-red-600"
                      )}>
                        {item.percentage_change}
                      </td>
                      <td className="text-right py-2 px-2 text-slate-600">
                        {item.portfolio_weight}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Movers and News */}
      {portfolio.biggest_movers && portfolio.biggest_movers.length > 0 && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Top Movers</h3>
            <div className="space-y-2">
              {portfolio.biggest_movers.map((mover, index) => {
                const isMovementPositive = mover.movement.startsWith('+');
                return (
                  <div key={index} className={cn(
                    "p-2 rounded-lg border",
                    isMovementPositive ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  )}>
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{mover.company}</span>
                        <span className="text-xs text-slate-500 ml-1">({mover.ticker})</span>
                      </div>
                      <span className={cn(
                        "font-medium",
                        isMovementPositive ? "text-green-600" : "text-red-600"
                      )}>
                        {mover.movement}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Recent News</h3>
            <div className="space-y-2">
              {portfolio.biggest_movers.map((mover, index) => (
                <div key={index} className={cn(
                  "p-2 rounded-lg border-l-2",
                  getMovementSentiment(mover.movement) === 'positive' 
                    ? "bg-green-50 text-green-800 border-l-2 border-green-500" 
                    : "bg-red-50 text-red-800 border-l-2 border-red-500"
                )}>
                  <div className="text-xs font-medium mb-1">
                    {mover.ticker}
                  </div>
                  <div className="text-sm">{mover.news_article.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {mover.news_article.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
