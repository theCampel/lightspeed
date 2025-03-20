
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SuggestedQuestion } from '@/utils/mockData';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onQuestionClick: (question: SuggestedQuestion) => void;
}

export const SuggestedQuestions = ({ 
  questions, 
  onQuestionClick 
}: SuggestedQuestionsProps) => {
  const [activeQuestions, setActiveQuestions] = useState<SuggestedQuestion[]>([]);
  
  // Effect to update the timer and remove expired questions
  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveQuestions(prevQuestions => 
        prevQuestions
          .map(q => ({ ...q, expiresIn: q.expiresIn - 1 }))
          .filter(q => q.expiresIn > 0)
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Effect to add new questions, but limit to 3
  useEffect(() => {
    setActiveQuestions(prevQuestions => {
      // Keep existing questions
      const existingQuestions = [...prevQuestions];
      
      // Add any new questions from props that aren't in the active list
      const newQuestions = questions.filter(
        q => !prevQuestions.some(pq => pq.id === q.id)
      );
      
      // Combine and limit to 3 questions total
      const combinedQuestions = [...existingQuestions, ...newQuestions];
      
      // Sort by expiry time (ascending, so closest to expiry first)
      combinedQuestions.sort((a, b) => a.expiresIn - b.expiresIn);
      
      // Limit to 3 questions
      return combinedQuestions.slice(0, 3);
    });
  }, [questions]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'portfolio': return { bg: 'bg-portfolio-light/20', text: 'text-portfolio-dark', timer: '#6366f1' };
      case 'market': return { bg: 'bg-market-light/20', text: 'text-market-dark', timer: '#ec4899' };
      case 'strategy': return { bg: 'bg-news-light/20', text: 'text-news-dark', timer: '#8b5cf6' };
      case 'general': return { bg: 'bg-question-light/20', text: 'text-question-dark', timer: '#f59e0b' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', timer: '#64748b' };
    }
  };

  return (
    <div className="w-full px-4 py-3 min-h-[156px] flex flex-col">
      <h3 className="text-sm font-medium text-slate-500 mb-3 tracking-wide uppercase">Suggested Questions</h3>
      
      {/* Fixed height container with grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[110px]">
        {activeQuestions.length > 0 ? (
          // Create fixed slots for up to 3 questions
          [0, 1, 2].map((index) => {
            const question = activeQuestions[index];
            
            if (!question) {
              // Empty slot to maintain layout
              return <div key={`empty-${index}`} className="rounded-lg border border-transparent" />;
            }
            
            const colors = getCategoryColor(question.category);
            const timePercentage = (question.expiresIn / 30) * 100;
            const isExpiringSoon = timePercentage <= 30;
            
            return (
              <div key={question.id} className="relative h-full animate-fade-in">
                <button
                  onClick={() => onQuestionClick(question)}
                  className={cn(
                    'w-full h-full text-sm font-medium p-4 rounded-lg transition-all',
                    'hover:opacity-90 active:scale-95 flex flex-col justify-between',
                    'border-2',
                    colors.bg, 
                    colors.text,
                    isExpiringSoon ? 'border-orange-400' : 'border-transparent'
                  )}
                >
                  <div className="flex-1">{question.text}</div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/30">
                    <div className="flex items-center text-xs">
                      {isExpiringSoon ? (
                        <AlertCircle className="mr-1 h-3 w-3 text-orange-400" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3 opacity-70" />
                      )}
                      <span className={isExpiringSoon ? "text-orange-400 font-medium" : "opacity-70"}>
                        {question.expiresIn}s
                      </span>
                    </div>
                  </div>
                  
                  {/* Time indicator bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-slate-200/30 w-full overflow-hidden rounded-b-lg">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000 ease-linear rounded-b-lg",
                        isExpiringSoon ? "bg-orange-400" : "bg-slate-400/50"
                      )}
                      style={{ 
                        width: `${timePercentage}%`,
                        transition: 'width 1s linear'
                      }}
                    />
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          // Placeholder when no questions are available
          <div className="col-span-3 h-full flex items-center justify-center bg-slate-50/80 rounded-lg border border-slate-200/50 animate-fade-in">
            <div className="text-center p-4 max-w-md">
              <div className="flex justify-center mb-3">
                <HelpCircle className="h-8 w-8 text-slate-300" />
              </div>
              <h4 className="text-slate-600 font-medium mb-1">No questions yet</h4>
              <p className="text-slate-500 text-sm">As you talk with the client, more questions will be generated based on the conversation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
