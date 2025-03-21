
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
  Clock,
  PieChart,
  LineChart,
  Lightbulb,
  MessageSquare,
  ListChecks
} from 'lucide-react';

export type CardType = 'portfolio' | 'news' | 'market' | 'client' | 'stock' | 'fund' | 'summary';

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
  fundSuggestions?: FundSuggestion[];
  conversationSummary?: ConversationSummary;
  is_esg_highlight?: boolean;
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
  historicalData?: HistoricalData[];
  relatedNews?: StockNewsItem[];
}

export interface HistoricalData {
  date: string;
  price: number;
  volume?: number;
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
  breakdown?: {
    name: string;
    symbol: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  topMovers?: {
    name: string;
    symbol: string;
    change: number;
    changePercent: number;
  }[];
  relatedNews?: {
    symbol: string;
    news: StockNewsItem[];
  }[];
}

export interface FundSuggestion {
  id: string;
  name: string;
  ticker: string;
  ter: number; // Total Expense Ratio
  yield: number;
  fiveYearPerformance: number;
  turnoverPercent: number;
  isDistributing: boolean;
  category: string;
  description: string;
  esg: boolean;
}

export interface ConversationSummary {
  discussionPoints: string[];
  actionItems: string[];
  investmentGoalChanges: string[];
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
    type: 'stock',
    title: 'NVIDIA Performance',
    content: 'NVIDIA stock is up 5.7% today following positive earnings report.',
    timestamp: '10 minutes ago',
    isPinned: true,
    icon: LineChart,
    stockData: {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      price: 845.27,
      change: 45.63,
      changePercent: 5.7,
      volume: 54362800,
      historicalData: [
        { date: '2023-07', price: 452.17 },
        { date: '2023-08', price: 493.55 },
        { date: '2023-09', price: 435.17 },
        { date: '2023-10', price: 412.63 },
        { date: '2023-11', price: 467.70 },
        { date: '2023-12', price: 495.22 },
        { date: '2024-01', price: 561.37 },
        { date: '2024-02', price: 689.22 },
        { date: '2024-03', price: 721.33 },
        { date: '2024-04', price: 762.55 },
        { date: '2024-05', price: 812.89 },
        { date: '2024-06', price: 845.27 }
      ],
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
    type: 'fund',
    title: 'Fund Recommendations',
    content: 'Based on your investment goals and risk profile, here are some fund suggestions.',
    timestamp: '20 minutes ago',
    isPinned: false,
    icon: Lightbulb,
    fundSuggestions: [
      {
        id: 'f1',
        name: 'Vanguard Total Stock Market ETF',
        ticker: 'VTI',
        ter: 0.03,
        yield: 1.42,
        fiveYearPerformance: 15.32,
        turnoverPercent: 2.5,
        isDistributing: true,
        category: 'US Equity',
        description: 'A low-cost, diversified approach to the entire U.S. equity market.',
        esg: false
      },
      {
        id: 'f2',
        name: 'iShares ESG Aware MSCI USA ETF',
        ticker: 'ESGU',
        ter: 0.15,
        yield: 1.22,
        fiveYearPerformance: 14.76,
        turnoverPercent: 18.7,
        isDistributing: true,
        category: 'ESG US Equity',
        description: 'Exposure to U.S. companies with favorable environmental, social, and governance practices.',
        esg: true
      },
      {
        id: 'f3',
        name: 'Invesco QQQ Trust',
        ticker: 'QQQ',
        ter: 0.20,
        yield: 0.55,
        fiveYearPerformance: 21.85,
        turnoverPercent: 9.8,
        isDistributing: true,
        category: 'Technology',
        description: 'Tracks the Nasdaq-100 Index, which includes 100 of the largest non-financial companies listed on the Nasdaq.',
        esg: false
      }
    ]
  },
  {
    id: '6',
    type: 'summary',
    title: 'Meeting Summary: June 15, 2024',
    content: 'Summary of our discussion regarding portfolio adjustments and next steps.',
    timestamp: '30 minutes ago',
    isPinned: false,
    icon: MessageSquare,
    conversationSummary: {
      discussionPoints: [
        'Reviewed current portfolio allocation and performance against benchmarks',
        'Discussed market volatility concerns, particularly in tech sector',
        'Explored potential for increased exposure to renewable energy companies',
        'Analyzed the impact of rising interest rates on fixed income holdings',
        'Considered tax-efficient withdrawal strategies for upcoming property purchase'
      ],
      actionItems: [
        'Schedule follow-up call with tax advisor before end of quarter',
        'Send research reports on selected renewable energy funds',
        'Initiate 5% portfolio rebalancing to reduce tech exposure',
        'Review estate planning documents and update beneficiaries'
      ],
      investmentGoalChanges: [
        'Increase risk tolerance from moderate to moderately aggressive',
        'Add new goal for funding children\'s education trust by 2025',
        'Accelerate retirement timeline from 2040 to 2037'
      ]
    }
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
