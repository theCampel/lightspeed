
import React from 'react';

interface ClientCardProps {
  content: string;
}

export const ClientCard = ({ content }: ClientCardProps) => {
  return (
    <div className="px-4 py-2">
      <p className="text-slate-700">{content}</p>
    </div>
  );
};
