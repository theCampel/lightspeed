import React from 'react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isActive: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isActive, 
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <div className={cn(
        "h-3 w-3 rounded-full transition-colors duration-300",
        isActive ? "bg-green-500" : "bg-red-500"
      )} />
      <span className="text-xs text-gray-500">
        {isActive ? 'On Call' : 'Idle'}
      </span>
    </div>
  );
}; 