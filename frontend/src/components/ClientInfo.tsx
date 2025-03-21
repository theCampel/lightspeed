import React, { useState, useEffect } from 'react';
import { ClientData } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Briefcase, 
  Flame, 
  Calendar, 
  Clock,
  Phone,
  Target,
  Shield,
  BadgeCheck,
  Loader2
} from 'lucide-react';

interface ClientInfoProps {
  client?: ClientData;
}

interface InvestmentGoal {
  title: string;
  value: string;
}

interface Profile {
  profile: {
    name: string;
    initials: string;
    position: string;
    formerPosition: string;
    avatar?: string;
    clientDetails: {
      clientSince: string;
      portfolioSize: string;
      riskAppetite: string;
      preferredContact: string;
      lastContact: string;
    };
    investmentGoals: InvestmentGoal[];
    notes: string;
  };
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const encodedName = encodeURIComponent("Leo Camacho");
        const response = await fetch(`/api/profiles/${encodedName}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching profile: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatCurrency = (value: string | number) => {
    if (typeof value === 'string') {
      return value; // Already formatted
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Conservative': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Moderate': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Aggressive': return 'bg-rose-50 text-rose-700 border border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full shadow-xl border border-white/50 relative flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 text-client animate-spin" />
        <p className="ml-2 text-slate-600">Loading client data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full shadow-xl border border-white/50 relative p-5">
        <div className="text-rose-500 text-center">
          <p>Error loading client data</p>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full shadow-xl border border-white/50 relative p-5">
        <div className="text-slate-500 text-center">No client data available</div>
      </Card>
    );
  }

  const { name, initials, position, notes, avatar } = profile.profile;
  const { clientSince, portfolioSize, riskAppetite, preferredContact, lastContact } = profile.profile.clientDetails;
  const investmentGoals = profile.profile.investmentGoals;

  return (
    <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-transparent pointer-events-none" />
      
      <div className="p-5 border-b border-slate-100 relative">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {avatar ? (
              <div className="flex-shrink-0 w-16 h-16 rounded-full shadow-lg overflow-hidden">
                <img 
                  src={avatar} 
                  alt={`${name}'s avatar`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-client to-client-dark rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-client-light opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-client items-center justify-center">
                <BadgeCheck className="h-3 w-3 text-white" />
              </span>
            </span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-800">{name}</h2>
            <p className="text-sm text-slate-500">{position}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 relative z-10">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-client" /> 
            <span>Client Details</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Client Since</p>
                <p className="text-sm font-medium">{clientSince}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Portfolio Size</p>
                <p className="text-sm font-medium">{portfolioSize}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Flame size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Risk Appetite</p>
                <p className={cn(
                  "text-sm font-medium px-2 py-0.5 rounded-full inline-block mt-1",
                  getRiskColor(riskAppetite)
                )}>
                  {riskAppetite}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Preferred Contact</p>
                <p className="text-sm font-medium">{preferredContact}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Contact</p>
                <p className="text-sm font-medium">{lastContact}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-client" /> 
            <span>Investment Goals</span>
          </h3>
          <div className="space-y-2">
            {investmentGoals.map((goal, index) => (
              <div key={index} className="p-2 rounded-lg bg-gradient-to-r from-slate-100 to-blue-50/40 shadow-sm text-slate-700 border border-white/80">
                <div className="font-medium text-sm">{goal.title}</div>
                <div className="text-xs text-slate-600 mt-1">{goal.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-client" /> 
            <span>Notes</span>
          </h3>
          <p className="text-sm text-slate-700 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 rounded-lg border border-white/80 shadow-sm">
            {notes}
          </p>
        </div>
      </div>
    </Card>
  );
};
