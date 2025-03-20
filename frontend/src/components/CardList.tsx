
import React, { useState, useEffect } from 'react';
import { CardData } from '@/utils/mockData';
import { Card } from './Card';
import { LoadingCard } from './LoadingStates';
import { cn } from '@/lib/utils';

interface CardListProps {
  cards: CardData[];
  onCardPin: (id: string, isPinned: boolean) => void;
  onCardDelete: (id: string) => void;
}

export const CardList = ({ cards, onCardPin, onCardDelete }: CardListProps) => {
  const [sortedCards, setSortedCards] = useState<CardData[]>([]);
  const [loadedCardIds, setLoadedCardIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Sort cards: 
    // 1. Pinned cards go to the top
    // 2. Then sort by timestamp (newest first)
    const sorted = [...cards].sort((a, b) => {
      // Pinned cards go to the top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // For unpinned cards, newest first (assuming newer cards have lower index in the array)
      // This puts newest cards at the top since the API provides newest cards first
      if (!a.isPinned && !b.isPinned) {
        // Since we know card ID patterns include timestamps (card-${Date.now()}), 
        // we can use these for newest-first ordering
        const aIsNumeric = a.id.startsWith('card-');
        const bIsNumeric = b.id.startsWith('card-');
        
        if (aIsNumeric && bIsNumeric) {
          const aTimestamp = parseInt(a.id.split('-')[1]);
          const bTimestamp = parseInt(b.id.split('-')[1]);
          return bTimestamp - aTimestamp; // descending order (newest first)
        }
        
        // If we can't parse timestamps from IDs, use array index as a proxy (lower index = newer)
        const aIndex = cards.findIndex(card => card.id === a.id);
        const bIndex = cards.findIndex(card => card.id === b.id);
        return aIndex - bIndex;
      }
      
      return 0;
    });
    
    setSortedCards(sorted);
    
    // Track when cards change from loading to loaded state
    const newlyLoadedCards = cards.filter(card => 
      !card.isLoading && !loadedCardIds.has(card.id)
    );
    
    if (newlyLoadedCards.length > 0) {
      // Add newly loaded cards to our set
      setLoadedCardIds(prev => {
        const updated = new Set(prev);
        newlyLoadedCards.forEach(card => updated.add(card.id));
        return updated;
      });
    }
  }, [cards, loadedCardIds]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h2 className="text-lg font-bold text-slate-800 tracking-tight px-2">
        Client Insights
        <span className="text-slate-400 text-sm font-normal ml-2">
          {sortedCards.length} {sortedCards.length === 1 ? 'item' : 'items'}
        </span>
      </h2>
      
      {sortedCards.map(card => {
        const isNewlyLoaded = !card.isLoading && loadedCardIds.has(card.id);
        
        return (
          <div 
            key={card.id}
            className={cn(
              "w-full transition-all duration-500",
              "hover:translate-y-[-2px]",
              isNewlyLoaded ? "animate-fade-in" : ""
            )}
          >
            <Card 
              data={card} 
              onPin={onCardPin} 
              onDelete={onCardDelete} 
            />
          </div>
        );
      })}
      
      {sortedCards.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="italic">No insights available yet.</p>
          <p className="text-sm mt-2">Questions and insights will appear as they become relevant.</p>
        </div>
      )}
    </div>
  );
};
