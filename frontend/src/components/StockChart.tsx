import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockChartPoint } from '@/types/api';
import { cn } from '@/lib/utils';

interface StockChartProps {
  data: StockChartPoint[];
  ticker: string;
  className?: string;
}

export function StockChart({ data, ticker, className }: StockChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-slate-50 rounded-lg", className)}>
        <p className="text-slate-500">No chart data available for {ticker}</p>
      </div>
    );
  }

  // Format the data for Recharts
  const chartData = data.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    value: point.close,
    open: point.open,
    high: point.high,
    low: point.low
  }));

  // Calculate if stock is up or down
  const isPositive = chartData.length >= 2 && 
    chartData[chartData.length - 1].value >= chartData[0].value;

  return (
    <div className={cn("h-64 w-full bg-white rounded-lg p-4", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickMargin={10}
            tickFormatter={(value) => {
              // Only show some dates to avoid crowding
              const index = chartData.findIndex(item => item.date === value);
              return index % Math.ceil(chartData.length / 5) === 0 ? value : '';
            }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={isPositive ? "#4ade80" : "#f43f5e"} 
            fill={isPositive ? "rgba(74, 222, 128, 0.1)" : "rgba(244, 63, 94, 0.1)"} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 