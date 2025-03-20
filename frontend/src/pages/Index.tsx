import React, { useState, useEffect, useRef } from 'react';
import { CardList } from '@/components/CardList';
import { ClientInfo } from '@/components/ClientInfo';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { initialCards, clientData, suggestedQuestions, CardData, SuggestedQuestion, CardType } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Rocket, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [activeQuestions, setActiveQuestions] = useState<SuggestedQuestion[]>([]);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { toast } = useToast();
  
  // Create WebSocket reference to maintain across renders
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
        const cardData = JSON.parse(event.data);
        addCardToInterface(cardData);
      };
      
      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
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

  // Check API health on load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await api.checkHealth();
        setApiStatus('online');
        toast({
          title: "Connected to backend",
          description: health.message || "API is running",
          variant: "default",
        });
      } catch (error) {
        console.error("API Health check failed:", error);
        setApiStatus('offline');
        toast({
          title: "API Unavailable",
          description: "Using mock data instead",
          variant: "destructive",
        });
      }
    };
    
    checkApiHealth();
  }, [toast]);

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

  const handleQuestionClick = (question: SuggestedQuestion) => {
    setActiveQuestions(prevQuestions => 
      prevQuestions.filter(q => q.id !== question.id)
    );

    const newCard: CardData = {
      id: `card-${Date.now()}`,
      type: question.category === 'general' || question.category === 'strategy' ? 'market' : question.category as CardType,
      title: question.text,
      content: 'Fetching information...',
      timestamp: 'Just now',
      isPinned: false,
      isLoading: true
    };

    setCards(prevCards => [newCard, ...prevCards]);

    // In a real app, we'd fetch data from an API here
    // For now, we'll simulate an API call with setTimeout
    setTimeout(() => {
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === newCard.id 
            ? { 
                ...card, 
                isLoading: false,
                content: 'Based on the latest market analysis, your portfolio is well-positioned for the current economic climate. Recent volatility has been offset by your diverse asset allocation.'
              } 
            : card
        )
      );
    }, 2000 + Math.random() * 1000);
  };

  useEffect(() => {
    const initialActiveQuestions = suggestedQuestions
      .slice(0, 3)
      .map(q => ({
        ...q,
        expiresIn: 20 + Math.floor(Math.random() * 10)
      }));
    
    setActiveQuestions(initialActiveQuestions);
    
    const questionTimer = setInterval(() => {
      setActiveQuestions(prevQuestions => {
        if (prevQuestions.length >= 3) return prevQuestions;
        
        const availableQuestions = suggestedQuestions.filter(
          q => !prevQuestions.some(pq => pq.id === q.id)
        );
        
        if (availableQuestions.length === 0) return prevQuestions;
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const newQuestion = {
          ...availableQuestions[randomIndex],
          expiresIn: 20 + Math.floor(Math.random() * 10)
        };
        
        return [...prevQuestions, newQuestion].slice(0, 3);
      });
    }, 8000);
    
    return () => clearInterval(questionTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 animate-gradient-x">
      <div className="container mx-auto py-8">
        <header className="mb-8 text-center relative">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-white/50 mb-2 animate-fade-in">
            <Rocket className="h-6 w-6 text-indigo-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              LightSpeed
            </h1>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-slate-600 font-medium animate-fade-in">
            Real-time insights for high-value clients
          </p>
          {apiStatus === 'checking' && (
            <div className="mt-2 text-sm text-blue-500">Connecting to API...</div>
          )}
          {apiStatus === 'online' && (
            <div className="mt-2 text-sm text-green-500">Connected to backend API</div>
          )}
          {apiStatus === 'offline' && (
            <div className="mt-2 text-sm text-amber-500">Using mock data (API offline)</div>
          )}
          
          <div className="absolute -top-8 left-0 w-full h-40 bg-gradient-to-r from-violet-200/30 via-blue-200/30 to-indigo-200/30 blur-3xl -z-10 rounded-full"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <SuggestedQuestions 
              questions={activeQuestions}
              onQuestionClick={handleQuestionClick}
            />
            
            <div 
              className={cn(
                "bg-white/40 backdrop-blur-sm rounded-xl p-4",
                "border border-white/50 shadow-lg"
              )}
            >
              <CardList 
                cards={cards} 
                onCardPin={handleCardPin} 
                onCardDelete={handleCardDelete}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ClientInfo client={clientData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
