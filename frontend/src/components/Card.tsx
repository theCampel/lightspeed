import React, { useState } from 'react';
import { Pin, PinOff, X, ArrowRight, Calendar, ListCheck, ExternalLink } from 'lucide-react';
import { CardData, NewsItem, FundSuggestion } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { PulseWrapper, Shimmer, LoadingChart } from './LoadingStates';
import { Card as CardUI } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Legend,
  LineChart,
  Line
} from 'recharts';

interface CardProps {
  data: CardData;
  onPin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
}

export const Card = ({ data, onPin, onDelete }: CardProps) => {
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
        return renderPortfolioCard();
      case 'news':
        return renderNewsCard();
      case 'market':
        return renderMarketCard();
      case 'stock':
        return renderStockCard();
      case 'fund':
        return renderFundCard();
      case 'summary':
        return renderSummaryCard();
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
    
    const { totalValue, change, changePercent, period, allocation, performance, breakdown, topMovers, relatedNews } = data.portfolioData;
    const isPositive = change >= 0;

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

    const getTimeframeData = () => {
      if (timeframe === '1m') return performance.slice(-2);
      if (timeframe === '3m') return performance.slice(-4);
      if (timeframe === '1y') return performance;
      return performance; // 6m is default
    };

    return (
      <div className="p-3 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
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
          <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value)}>
            <ToggleGroupItem value="1m" size="sm">1M</ToggleGroupItem>
            <ToggleGroupItem value="3m" size="sm">3M</ToggleGroupItem>
            <ToggleGroupItem value="6m" size="sm">6M</ToggleGroupItem>
            <ToggleGroupItem value="1y" size="sm">1Y</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="grid md:grid-cols-2 gap-3">
          <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-medium text-slate-500 mb-2">Portfolio Growth</h3>
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
          </div>
          
          <div className="h-[180px] bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
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
                  labelLine={false}
                >
                  {allocation.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={softColorPalette[index % softColorPalette.length]} 
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

        {breakdown && (
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
                  {breakdown.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-2 px-2">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-slate-400">{item.symbol}</div>
                      </td>
                      <td className="text-right py-2 px-2 font-mono">
                        {formatCurrency(item.value)}
                      </td>
                      <td className={cn(
                        "text-right py-2 px-2 font-medium",
                        item.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(1)}%
                      </td>
                      <td className="text-right py-2 px-2 text-slate-600">
                        {((item.value / totalValue) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {topMovers && topMovers.length > 0 && relatedNews && relatedNews.length > 0 && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Top Movers</h3>
              <div className="space-y-2">
                {topMovers.map((mover, index) => (
                  <div key={index} className={cn(
                    "p-2 rounded-lg border",
                    mover.changePercent >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  )}>
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{mover.name}</span>
                        <span className="text-xs text-slate-500 ml-1">({mover.symbol})</span>
                      </div>
                      <span className={cn(
                        "font-medium",
                        mover.changePercent >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {mover.changePercent >= 0 ? "+" : ""}{mover.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Recent News</h3>
              <div className="space-y-2">
                {relatedNews.slice(0, 2).flatMap(item => 
                  item.news.slice(0, 1).map((news, newsIndex) => (
                    <div key={`${item.symbol}-${newsIndex}`} className={cn(
                      "p-2 rounded-lg border-l-2",
                      getSentimentColor(news.sentiment)
                    )}>
                      <div className="text-xs font-medium mb-1">
                        {item.symbol}
                      </div>
                      <div className="text-sm">{news.headline}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {news.source} • {news.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
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

  const renderStockCard = () => {
    if (!data.stockData || !data.stockData.historicalData) return renderMarketCard();
    
    const { symbol, company, price, change, changePercent, volume, historicalData, relatedNews } = data.stockData;
    const isPositive = change >= 0;

    const getTimeframeData = () => {
      if (timeframe === '1m') return historicalData.slice(-2);
      if (timeframe === '3m') return historicalData.slice(-4);
      if (timeframe === '6m') return historicalData.slice(-7);
      return historicalData; // 1y is default
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

  const renderFundCard = () => {
    if (!data.fundSuggestions) return null;
    
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-600">{content}</p>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">TER</TableHead>
                <TableHead className="text-right">Yield</TableHead>
                <TableHead className="text-right">5Y Perf</TableHead>
                <TableHead className="text-right">Turnover</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.fundSuggestions.map((fund) => (
                <TableRow key={fund.id}>
                  <TableCell>
                    <div className="font-medium">{fund.name}</div>
                    <div className="text-xs text-slate-500">{fund.ticker}</div>
                  </TableCell>
                  <TableCell className="text-right">{fund.ter.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{fund.yield.toFixed(2)}%</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={fund.fiveYearPerformance > 0 ? "text-green-600" : "text-red-600"}>
                      {fund.fiveYearPerformance.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{fund.turnoverPercent}%</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      fund.isDistributing 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    )}>
                      {fund.isDistributing ? "Dist" : "Acc"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="space-y-4 mt-4">
          {data.fundSuggestions.map((fund) => (
            <div key={fund.id} className="bg-slate-50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{fund.name}</h4>
                  <p className="text-xs text-slate-500">{fund.category}</p>
                </div>
                <div className="bg-white px-2 py-1 rounded text-xs font-medium">
                  {fund.ticker}
                </div>
              </div>
              <p className="text-sm mt-2">{fund.description}</p>
              <div className="flex justify-end mt-2">
                <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                  <span>View Details</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSummaryCard = () => {
    if (!data.conversationSummary) return null;
    
    const { discussionPoints, actionItems, investmentGoalChanges } = data.conversationSummary;
    
    return (
      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center text-slate-800 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Discussion Points</h3>
            </div>
            <ul className="space-y-2">
              {discussionPoints.map((point, index) => (
                <li key={index} className="flex text-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 mr-2"></span>
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center text-blue-800 mb-2">
              <ListCheck className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Action Items</h3>
            </div>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="flex text-sm bg-blue-50 p-2 rounded-lg">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center text-emerald-800 mb-2">
              <ArrowRight className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Investment Goal Changes</h3>
            </div>
            <ul className="space-y-2">
              {investmentGoalChanges.map((change, index) => (
                <li key={index} className="flex text-sm bg-emerald-50 p-2 rounded-lg">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2"></span>
                  <span className="text-slate-700">{change}</span>
                </li>
              ))}
            </ul>
          </div>
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
