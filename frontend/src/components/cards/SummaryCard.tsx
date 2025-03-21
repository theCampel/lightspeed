
import React from 'react';
import { ConversationSummary } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Calendar, ListCheck, ArrowRight } from 'lucide-react';

interface SummaryCardProps {
  conversationSummary: ConversationSummary;
}

export const SummaryCard = ({ conversationSummary }: SummaryCardProps) => {
  const { discussionPoints, actionItems, investmentGoalChanges } = conversationSummary;
  
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
