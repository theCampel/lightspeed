import React from 'react';
import { FundSuggestion } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';

interface FundCardProps {
  content: string;
  fundSuggestions: FundSuggestion[];
}

export const FundCard = ({ content, fundSuggestions }: FundCardProps) => {
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
            {fundSuggestions.map((fund) => (
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
        {fundSuggestions.map((fund) => (
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
