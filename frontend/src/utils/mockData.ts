
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Briefcase, 
  AlertTriangle,
  Globe,
  Users,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';

export type CardType = 'portfolio' | 'news' | 'market' | 'client';

export interface CardData {
  id: string;
  type: CardType;
  title: string;
  content: string;
  timestamp: string;
  isPinned?: boolean;
  isLoading?: boolean;
  icon?: any;
  chartData?: any;
  newsItems?: NewsItem[];
  portfolioData?: PortfolioData;
  stockData?: StockData;
  marketData?: MarketData;
  insights?: string;
  actionItems?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface StockNewsItem {
  headline: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  relatedNews?: StockNewsItem[];
}

export interface MarketData {
  indicators: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  topMovers?: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }[];
}

export interface PortfolioData {
  totalValue: number;
  change: number;
  changePercent: number;
  period: string;
  allocation: {
    label: string;
    value: number;
    color: string;
  }[];
  performance: {
    date: string;
    value: number;
  }[];
}

export interface ClientData {
  id: string;
  name: string;
  avatar: string;
  occupation: string;
  since: string;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  portfolioSize: number;
  preferredContact: string;
  lastContact: string;
  notes: string;
  tags: string[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'portfolio' | 'market' | 'strategy' | 'general';
  expiresIn: number; // seconds
}

// Mock client data
export const clientData: ClientData = {
  id: '1',
  name: 'Jonathan Rothwell',
  avatar: 'JR',
  occupation: 'Tech Executive (Former CTO, Alacrity)',
  since: 'March 2018',
  riskAppetite: 'Aggressive',
  portfolioSize: 12500000,
  preferredContact: 'Video call',
  lastContact: '3 weeks ago',
  notes: 'Interested in emerging tech and sustainable investments. Prefers detailed quarterly reviews.',
  tags: ['Tech', 'ESG Focus', 'High Growth', 'VIP']
};

// Mock cards data
export const initialCards: CardData[] = [
  {
    id: '1',
    type: 'portfolio',
    title: 'Portfolio Performance',
    content: 'Your portfolio has increased by 3.2% this quarter, outperforming the S&P 500 by 1.1%.',
    timestamp: '2 minutes ago',
    isPinned: false,
    icon: TrendingUp,
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
      ]
    }
  },
  {
    id: '2',
    type: 'news',
    title: 'Market Update: Tech Sector',
    content: 'Recent developments in the tech sector affecting your investments.',
    timestamp: '5 minutes ago',
    isPinned: false,
    icon: Globe,
    newsItems: [
      {
        id: 'n1',
        title: 'NVIDIA Announces New AI Chip, Stock Surges 8%',
        source: 'Financial Times',
        url: '#',
        publishedAt: '2 hours ago',
        summary: 'NVIDIA unveiled its next-generation AI processor, sparking investor excitement and further cementing its leadership in the AI hardware space.',
        sentiment: 'positive'
      },
      {
        id: 'n2',
        title: 'Tech Regulation Bill Advances in Senate',
        source: 'Wall Street Journal',
        url: '#',
        publishedAt: '6 hours ago',
        summary: 'A new bill targeting large tech companies moved forward today, raising concerns about potential impacts on sector growth and innovation.',
        sentiment: 'negative'
      },
      {
        id: 'n3',
        title: 'Microsoft Cloud Revenue Beats Expectations',
        source: 'Bloomberg',
        url: '#',
        publishedAt: '1 day ago',
        summary: 'Microsoft reported cloud segment growth of 27%, exceeding analyst projections and highlighting the continued strength of cloud computing demand.',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: '3',
    type: 'market',
    title: 'NVIDIA Performance',
    content: 'NVIDIA stock is up 5.7% today following positive earnings report.',
    timestamp: '10 minutes ago',
    isPinned: true,
    icon: BarChart,
    stockData: {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      price: 845.27,
      change: 45.63,
      changePercent: 5.7,
      volume: 54362800,
      relatedNews: [
        {
          headline: 'NVIDIA unveils next-gen AI chips at GTC conference',
          source: 'TechCrunch',
          timestamp: '4 hours ago',
          sentiment: 'positive'
        },
        {
          headline: 'Analysts raise NVIDIA price targets following earnings',
          source: 'CNBC',
          timestamp: '6 hours ago',
          sentiment: 'positive'
        }
      ]
    }
  },
  {
    id: '4',
    type: 'client',
    title: 'Retirement Planning',
    content: "Based on your current contribution rate and market projections, you're on track to reach your retirement goal of $20M by 2035.",
    timestamp: '15 minutes ago',
    isPinned: false,
    icon: Briefcase
  },
  {
    id: '5',
    type: 'market',
    title: 'Market Trends Analysis',
    content: 'Recent market volatility has created potential opportunities in the healthcare sector.',
    timestamp: '30 minutes ago',
    isPinned: false,
    icon: TrendingUp,
    insights: 'Healthcare innovation is accelerating with AI integration and gene therapy advancements.',
    actionItems: [
      'Consider increasing allocation to healthcare ETFs',
      'Evaluate individual biotech companies with strong pipelines',
      'Monitor upcoming FDA decisions for potential impact'
    ]
  }
];

// Mock suggested questions
export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: 'q1',
    text: 'How is my tech sector exposure performing?',
    category: 'portfolio',
    expiresIn: 20
  },
  {
    id: 'q2',
    text: "What's the impact of recent Fed decisions on my bonds?",
    category: 'market',
    expiresIn: 30
  },
  {
    id: 'q3',
    text: 'Should I rebalance given current market conditions?',
    category: 'strategy',
    expiresIn: 25
  },
  {
    id: 'q4',
    text: "What's your take on emerging market opportunities?",
    category: 'general',
    expiresIn: 15
  }
];
