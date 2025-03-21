import React, { useEffect, useRef, useState } from 'react';
import { CardList } from '@/components/CardList';
import { ClientInfo } from '@/components/ClientInfo';
import { initialCards, clientData, CardData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  // Set up WebSocket connection
  useEffect(() => {
    // Only create the connection once
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:8000/ws');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Check for transcription status message
        if (data.status === 'start') {
          setIsTranscribing(true);
        } else if (data.status === 'stop') {
          setIsTranscribing(false);
        }
        
        // Handle card data if available
        if (data.type) {
          addCardToInterface(data);
        }
      };
      
      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsTranscribing(false);
      };
      
      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsTranscribing(false);
      };
    }
    
    // Clean up function to close the WebSocket when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  
  function addCardToInterface(cardData) {
    // Create and append a new card element based on the data
    console.log(cardData);
  }

  const handleCardPin = (id: string, isPinned: boolean) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isPinned } : card
      )
    );
  };

  const handleCardDelete = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const isEmpty = cards.length === 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AppSidebar isTranscribing={isTranscribing} />
        <div className="flex-1 p-4">
          {isEmpty ? (
            <div className="flex justify-center items-center min-h-[calc(100vh-2rem)] transition-all duration-500 ease-in-out">
              <div className="w-full max-w-md">
                <ClientInfo client={clientData} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 transition-all duration-500 ease-in-out">
              <div className="lg:col-span-5 space-y-3">
                <div 
                  className={cn(
                    "bg-white rounded-2xl p-3",
                    "border border-gray-100 shadow-md"
                  )}
                >
                  <CardList 
                    cards={cards} 
                    onCardPin={handleCardPin} 
                    onCardDelete={handleCardDelete}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <ClientInfo client={clientData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
