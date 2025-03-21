import React, { useState, useEffect } from 'react';
import { FundSuggestion } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';

interface FundCardProps {
  content: string;
  fundSuggestions?: FundSuggestion[]; // Make fundSuggestions optional
  is_esg_highlight?: boolean;
}

export const FundCard = ({ content, fundSuggestions, is_esg_highlight = false }: FundCardProps) => {
  const [funds, setFunds] = useState<FundSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/buckets/');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setFunds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch funds');
        console.error('Error fetching funds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  // Determine which data to use - API data or prop data
  const displayFunds = funds.length > 0 ? funds : fundSuggestions || [];

  if (loading) {
    return <div className="p-4">Loading funds...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

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
            {displayFunds.map((fund, index) => (
              <TableRow 
                key={fund.id}
                className={index === 1 && is_esg_highlight ? "bg-green-50" : ""}
              >
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
        {displayFunds.map((fund, index) => (
          <div 
            key={fund.id} 
            className={cn(
              "p-3 rounded-lg",
              index === 1 && is_esg_highlight ? "bg-green-50" : "bg-slate-50"
            )}
          >
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
