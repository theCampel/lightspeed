import React from 'react';
import { FundSuggestion } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface FundCardProps {
  content: string;
  fundSuggestions: FundSuggestion[];
  timestamp?: string;
  onSelectFund?: (id: string) => void;
  selectedFundId?: string;
}

export const FundCard = ({ 
  fundSuggestions, 
  content, 
  timestamp, 
  onSelectFund, 
  selectedFundId 
}: FundCardProps) => {
  if (!fundSuggestions) return null;
  
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-slate-600">{content}</p>
      
      <div className="space-y-4">
        {fundSuggestions.map((fund) => (
          <div 
            key={fund.id} 
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors",
              selectedFundId === fund.id 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : fund.esg
                  ? "bg-emerald-50 hover:bg-emerald-100"
                  : "bg-slate-50 hover:bg-slate-100",
              fund.esg && "border-l-4 border-emerald-500"
            )}
            onClick={() => onSelectFund && onSelectFund(fund.id)}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left side: Title, description, tags, category */}
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  {fund.name}
                  {fund.esg && (
                    <span className={cn(
                      "text-sm px-3 py-0.5 rounded-md font-medium border shadow-sm",
                      selectedFundId === fund.id
                        ? "bg-white text-emerald-700 border-emerald-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    )}>
                      ESG
                    </span>
                  )}
                </h4>
                
                <div className="flex items-center gap-2 mt-1">
                  <p className={cn(
                    "text-xs",
                    selectedFundId === fund.id ? "text-white opacity-80" : "text-slate-500"
                  )}>
                    {fund.category} • {fund.ticker}
                  </p>
                  
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    selectedFundId === fund.id
                      ? "bg-white bg-opacity-20 text-white"
                      : fund.isDistributing 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                  )}>
                    {fund.isDistributing ? "Distributing" : "Accumulating"}
                  </span>
                </div>
                
                <p className={cn(
                  "text-sm mt-2",
                  selectedFundId === fund.id ? "text-white opacity-90" : "text-slate-600"
                )}>
                  {fund.description}
                </p>
                
                <div className="mt-3">
                  <button className={cn(
                    "text-xs flex items-center gap-1 hover:underline",
                    selectedFundId === fund.id ? "text-white" : "text-blue-600"
                  )}>
                    <span>View Details</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
              
              {/* Right side: Stats */}
              <div className={cn(
                "w-full md:w-auto md:min-w-[200px] rounded-md p-3",
                selectedFundId === fund.id 
                  ? "bg-white bg-opacity-10" 
                  : "bg-white shadow-md border border-slate-100"
              )}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className={cn("text-xs font-medium", selectedFundId === fund.id ? "text-blue-200" : "text-slate-500")}>TER</div>
                    <div className="font-medium">{fund.ter.toFixed(2)}%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={cn("text-xs font-medium", selectedFundId === fund.id ? "text-blue-200" : "text-slate-500")}>Yield</div>
                    <div className="font-medium">{fund.yield.toFixed(2)}%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={cn("text-xs font-medium", selectedFundId === fund.id ? "text-blue-200" : "text-slate-500")}>5Y Performance</div>
                    <div className={cn(
                      "font-medium",
                      fund.fiveYearPerformance > 0 
                        ? selectedFundId === fund.id ? "text-white" : "text-green-600" 
                        : selectedFundId === fund.id ? "text-white" : "text-red-600"
                    )}>
                      {fund.fiveYearPerformance.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={cn("text-xs font-medium", selectedFundId === fund.id ? "text-blue-200" : "text-slate-500")}>Turnover</div>
                    <div className="font-medium">{fund.turnoverPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {timestamp && (
        <div className="text-right">
          <span className="text-xs text-slate-400">{timestamp}</span>
        </div>
      )}
    </div>
  );
};
