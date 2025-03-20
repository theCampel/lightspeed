import React, { useEffect, useState } from 'react';
import { bucketData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Briefcase, 
} from 'lucide-react';

interface BucketsProps {
  buckets?: Bucket[];
}

interface Bucket {
  id: number;
  name: string;
  description: string;
  risk: number;
  return: number;
  esg: boolean;
}

export const BucketsProps = ({ buckets: initialBuckets }: BucketsProps) => {
  const [buckets, setBuckets] = useState<Bucket[] | null>(initialBuckets || null);
  const [loading, setLoading] = useState<boolean>(!initialBuckets);
  const [error, setError] = useState<string | null>(null);
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/buckets`);
        
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const bucketData: Bucket[] = await response.json();
            
        setBuckets(bucketData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load client profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuckets();
    
  }, []);

  const getESGColor = (esg: boolean) => {
    if(esg) {
        return 'bg-green-50 text-green-700 border border-green-100';
    } else {
        return 'bg-red-50 text-red-700 border border-red-100';
    }
  };

  function onBucketSelect(option: { id: number; name: string; risk: number; return: number; esg: boolean; }): void {
    setSelectedBucketId(option.id);
    console.log(option);
  }

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative p-6">
        <div className="flex justify-center items-center h-full">
          <p>Loading bucket information...</p>
        </div>
      </Card>
    );
  }

  if (error || !buckets) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative p-6">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error || 'Bucket information not available'}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full px-4 py-3 min-h-[156px] flex flex-col">
      <h3 className="text-sm font-medium text-slate-500 mb-3 tracking-wide uppercase">Bucket Options</h3>
      
      {/* Fixed height container with grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buckets.length > 0 ? (
          buckets.map((option) => {
            const esgColors = getESGColor(option.esg);
            const isSelected = selectedBucketId === option.id;
            
            return (
              <div key={option.id} className="relative h-full animate-fade-in">
                <button
                  onClick={() => onBucketSelect(option)}
                  className={cn(
                    'w-full h-full text-sm font-medium p-4 rounded-lg transition-all',
                    'hover:opacity-90 active:scale-95 flex flex-col justify-between',
                    'border-2 bg-white',
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-slate-200 hover:border-blue-300'
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{option.name}</h4>
                    <span className={cn('text-xs px-2 py-1 rounded-full', esgColors)}>
                      {option.esg ? 'ESG' : 'Non-ESG'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Risk Level</span>
                      <div className="flex items-center">
                        {Array(10).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "w-2 h-2 rounded-full mx-0.5",
                              i < option.risk ? "bg-orange-500" : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Expected Return</span>
                      <div className="flex items-center">
                        {Array(10).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "w-2 h-2 rounded-full mx-0.5",
                              i < option.return ? "bg-green-500" : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-200">
                    <span className="text-xs text-blue-600 font-medium">View Details</span>
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          // Placeholder when no bucket options are available
          <div className="col-span-3 h-full flex items-center justify-center bg-slate-50/80 rounded-lg border border-slate-200/50 animate-fade-in">
            <div className="text-center p-4 max-w-md">
              <div className="flex justify-center mb-3">
                <Briefcase className="h-8 w-8 text-slate-300" />
              </div>
              <h4 className="text-slate-600 font-medium mb-1">No bucket options available</h4>
              <p className="text-slate-500 text-sm">Please check back later or contact your financial advisor.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
