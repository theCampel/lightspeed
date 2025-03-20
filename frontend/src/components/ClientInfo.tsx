import React, { useEffect, useState } from 'react';
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
  Tag,
  Shield,
  BadgeCheck
} from 'lucide-react';

interface ClientInfoProps {
  client?: ClientData;
}

interface Profile {
  profile: {
    name: string;
    initials: string;
    position: string;
    formerPosition: string;
    clientDetails: {
      clientSince: string;
      portfolioSize: string;
      riskAppetite: string;
      preferredContact: string;
      lastContact: string;
    };
    tags: string[];
    notes: string;
  }
}

export const ClientInfo = ({ client: initialClient }: ClientInfoProps) => {
  const [client, setClient] = useState<ClientData | null>(initialClient || null);
  const [loading, setLoading] = useState<boolean>(!initialClient);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/profiles/Jonathan%20Rothwell');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const profileData: Profile = await response.json();
        
        // Map risk appetite to the expected type
        let riskAppetite: "Conservative" | "Moderate" | "Aggressive" = "Moderate";
        if (profileData.profile.clientDetails.riskAppetite === "Aggressive") {
          riskAppetite = "Aggressive";
        } else if (profileData.profile.clientDetails.riskAppetite === "Conservative") {
          riskAppetite = "Conservative";
        }
        
        // Transform the profile data to match ClientData format
        const clientData: ClientData = {
          id: "profile-1", // Adding a default id
          name: profileData.profile.name,
          avatar: profileData.profile.initials,
          occupation: profileData.profile.position,
          since: profileData.profile.clientDetails.clientSince,
          portfolioSize: parseFloat(profileData.profile.clientDetails.portfolioSize.replace(/[^0-9.]/g, '')),
          riskAppetite: riskAppetite,
          preferredContact: profileData.profile.clientDetails.preferredContact,
          lastContact: profileData.profile.clientDetails.lastContact,
          tags: profileData.profile.tags,
          notes: profileData.profile.notes
        };
        
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load client profile');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if no initial client was provided
    
    fetchProfile();
    
  }, []);

  const formatCurrency = (value: number) => {
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
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative p-6">
        <div className="flex justify-center items-center h-full">
          <p>Loading client information...</p>
        </div>
      </Card>
    );
  }

  if (error || !client) {
    return (
      <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative p-6">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error || 'Client information not available'}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md overflow-hidden h-full animate-fade-in shadow-xl border border-white/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-slate-100 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-client to-client-dark rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
              {client.avatar}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-client-light opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-client items-center justify-center">
                <BadgeCheck className="h-3 w-3 text-white" />
              </span>
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{client.name}</h2>
            <p className="text-sm text-slate-500">{client.occupation}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5 relative z-10">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-client" /> 
            <span>Client Details</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Client Since</p>
                <p className="text-sm font-medium">{client.since}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Portfolio Size</p>
                <p className="text-sm font-medium">{formatCurrency(client.portfolioSize)}</p>
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
                  getRiskColor(client.riskAppetite)
                )}>
                  {client.riskAppetite}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Preferred Contact</p>
                <p className="text-sm font-medium">{client.preferredContact}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center text-client">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Contact</p>
                <p className="text-sm font-medium">{client.lastContact}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-client" /> 
            <span>Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {client.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-slate-100 to-blue-50 shadow-sm text-slate-700 border border-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-client" /> 
            <span>Notes</span>
          </h3>
          <p className="text-sm text-slate-700 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 rounded-lg border border-white/80 shadow-sm">
            {client.notes}
          </p>
        </div>
      </div>
    </Card>
  );
};
