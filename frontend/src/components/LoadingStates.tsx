
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Shimmer = ({ className, width = 'w-full', height = 'h-8' }: ShimmerProps) => {
  return (
    <div 
      className={cn(
        'shimmer bg-slate-200 rounded-md',
        width,
        height,
        className
      )}
    />
  );
};

interface PulseProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const PulseWrapper = ({ children, isLoading = true, className }: PulseProps) => {
  if (!isLoading) return (
    <div className="animate-fade-in-fast transition-all duration-500 ease-in-out">
      {children}
    </div>
  );
  
  return (
    <div className={cn('animate-pulse-subtle', className)}>
      {children}
    </div>
  );
};

export const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('p-6 bg-white/80 card-shadow rounded-xl space-y-4', className)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-300 animate-pulse w-7 h-7"></div>
          <Shimmer width="w-1/3" height="h-6" />
        </div>
        <Shimmer width="w-24" height="h-6" />
      </div>
      
      <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <Loader className="animate-spin h-5 w-5" />
          <span className="font-medium text-sm animate-pulse-subtle">Gathering insights...</span>
        </div>
        <div className="w-full space-y-2">
          <Shimmer width="w-full" height="h-16" className="opacity-60" />
          <div className="flex justify-between gap-2">
            <Shimmer width="w-1/2" height="h-8" className="opacity-40" />
            <Shimmer width="w-1/3" height="h-8" className="opacity-40" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Shimmer width="w-24" height="h-5" />
        <Shimmer width="w-20" height="h-5" />
      </div>
    </div>
  );
};

export const LoadingChart = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center h-[200px]">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <Loader className="animate-spin h-5 w-5" />
          <span className="font-medium text-sm animate-pulse-subtle">Processing market data...</span>
        </div>
        <div className="mt-4 w-full space-y-3">
          <Shimmer width="w-full" height="h-2" className="opacity-40" />
          <Shimmer width="w-4/5" height="h-2" className="opacity-30" />
          <Shimmer width="w-3/5" height="h-2" className="opacity-20" />
        </div>
      </div>
      <div className="flex justify-between">
        <Shimmer width="w-16" height="h-4" />
        <Shimmer width="w-16" height="h-4" />
        <Shimmer width="w-16" height="h-4" />
        <Shimmer width="w-16" height="h-4" />
        <Shimmer width="w-16" height="h-4" />
      </div>
    </div>
  );
};

export const TimerBorder = ({ 
  children, 
  className
}: { 
  children: React.ReactNode; 
  duration?: number;
  progress?: number;
  className?: string;
}) => {
  return (
    <div className={cn('relative rounded-lg', className)}>
      {children}
    </div>
  );
};
