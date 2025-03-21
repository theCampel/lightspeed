import React, { useEffect, useRef, useState } from 'react';
import { CardList } from '@/components/CardList';
import { ClientInfo } from '@/components/ClientInfo';
import { initialCards, clientData, CardData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BarChart, Lightbulb, LineChart, MessageSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [lastCardType, setLastCardType] = useState<string | null>(null);
  let counter = 2;

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
        if (data && data.status) {
          if (data.status === 'start') {
            setIsTranscribing(true);
            
            addPortfolioCard();
          } else if (data.status === 'stop') {
            setIsTranscribing(false);
            
            // Fetch summary data when transcription stops
            fetchSummaryAndAddCard();
          }
        }

      
        // Handle card data if available
        if (data.card) {
          addCardToInterface(data);
        }
      };

      function addPortfolioCard() {
        // Add a portfolio card when transcription starts
        const portfolioCard: CardData = {
          id: '1',
          type: 'portfolio',
          title: 'Portfolio Performance',
          content: 'Your portfolio has increased by 3.2% this quarter, outperforming the S&P 500 by 1.1%.',
          timestamp: '2 minutes ago',
          isPinned: false,
          portfolioData: {
            totalValue: 12500000,
            change: 387500,
            changePercent: 3.2,
            period: 'This Quarter',
            allocation: [
              { label: 'Technology', value: 42, color: '#6366f1' },
              { label: 'Healthcare', value: 18, color: '#8b5cf6' },
              { label: 'Finance', value: 15, color: '#10b981' },
              { label: 'Consumer', value: 12, color: '#f59e0b' },
              { label: 'Energy', value: 8, color: '#ef4444' },
              { label: 'Other', value: 5, color: '#6b7280' },
            ],
            performance: [
              { date: 'Jan', value: 11800000 },
              { date: 'Feb', value: 12100000 },
              { date: 'Mar', value: 12000000 },
              { date: 'Apr', value: 12200000 },
              { date: 'May', value: 12350000 },
              { date: 'Jun', value: 12500000 },
            ],
            breakdown: [
              { name: 'Apple Inc.', symbol: 'AAPL', value: 2250000, change: 125000, changePercent: 5.9 },
              { name: 'Microsoft Corp.', symbol: 'MSFT', value: 1875000, change: 93750, changePercent: 5.3 },
              { name: 'Amazon.com Inc.', symbol: 'AMZN', value: 1500000, change: -45000, changePercent: -2.9 },
              { name: 'Nvidia Corp.', symbol: 'NVDA', value: 1125000, change: 213750, changePercent: 23.5 },
              { name: 'Alphabet Inc.', symbol: 'GOOGL', value: 937500, change: -28125, changePercent: -2.9 }
            ],
            topMovers: [
              { name: 'Nvidia Corp.', symbol: 'NVDA', change: 213750, changePercent: 23.5 },
              { name: 'Tesla Inc.', symbol: 'TSLA', change: -145000, changePercent: -16.2 }
            ],
            relatedNews: [
              {
                symbol: 'NVDA',
                news: [
                  {
                    headline: 'NVIDIA Announces New AI Chip for Data Centers',
                    source: 'Bloomberg',
                    timestamp: '3 hours ago',
                    sentiment: 'positive'
                  },
                  {
                    headline: 'NVIDIA Raises Outlook on Strong AI Demand',
                    source: 'Financial Times',
                    timestamp: '1 day ago',
                    sentiment: 'positive'
                  }
                ]
              },
              {
                symbol: 'TSLA',
                news: [
                  {
                    headline: 'Tesla Cuts Vehicle Prices in Major Markets',
                    source: 'Reuters',
                    timestamp: '6 hours ago',
                    sentiment: 'negative'
                  },
                  {
                    headline: 'Tesla Faces Production Challenges in Berlin Factory',
                    source: 'Wall Street Journal',
                    timestamp: '2 days ago',
                    sentiment: 'negative'
                  }
                ]
              }
            ]
          }
        };
        
        setCards(prevCards => [portfolioCard, ...prevCards]);
        setLastCardType('portfolio');
      }
      
      
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

    if (cardData.card === "stock_card"){
      const newCard: CardData = {
        id: counter.toString(),
        type: 'stock',
        title: cardData.data.symbol,
        content: 'Empty.',
        timestamp: 'Now',
        isPinned: true,
        icon: LineChart,
        stockData: cardData.data
      };
      counter++;
      setCards(prevCards => [newCard, ...prevCards]);
      setLastCardType('stock');
      console.log("stock card created with data:", newCard.stockData);
    }
    else if (cardData.card === "esg_card") {
      // Check if the last card added was also a fund card
      if (lastCardType === 'fund') {
        console.log("Preventing consecutive fund card addition");
        return; // Don't add another fund card if the last one was also a fund
      }
      
      const newCard: CardData = {
        id: counter.toString(),
        type: 'fund',
        title: 'ESG',
        content: 'Empty.',
        timestamp: 'Now',
        icon: Lightbulb,
        isPinned: true,
        fundSuggestions: cardData.data
      }
      counter++;
      setCards(prevCards => [newCard, ...prevCards]);
      setLastCardType('fund');
    } else if (cardData.card === "highlight_esg") {
      setCards(prevCards => 
        prevCards.map((card, index) => 
          index === 0 ? { ...card, is_esg_highlight: true } : card
        )
      );
      // This doesn't add a new card, so don't update lastCardType
    }
    console.log(cardData);
  }

  function fetchSummaryAndAddCard() {
    fetch('/api/summary')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(summaryData => {
        console.log("Summary data received:", summaryData);
        
        // Create a new summary card
        const summaryCard: CardData = {
          id: uuidv4(),
          type: 'summary',
          title: 'Meeting Summary',
          content: '',
          timestamp: 'Just now',
          isPinned: true,
          icon: MessageSquare,
          conversationSummary: {
            discussionPoints: summaryData.discussion_points || [],
            actionItems: summaryData.action_items || [],
            investmentGoalChanges: summaryData.investment_goal_changes || []
          }
        };
        
        // Add the summary card to the top of the feed
        setCards(prevCards => [summaryCard, ...prevCards]);
        setLastCardType('summary');
      })
      .catch(error => {
        console.error("Error fetching summary:", error);
      });
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