
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    // Clean up the timers if component unmounts
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="animate-fade-in flex flex-col items-center">
        <img 
          src="/lovable-uploads/02a9902c-5825-45e4-951e-d35b37df70c7.png" 
          alt="Lightspeed Logo" 
          className="w-64 animate-float" 
        />
        <div className="mt-8 text-center space-y-3">
          <p className="text-lg font-medium text-slate-800">
            Join a call to see real-time client insights
          </p>
          <p className="text-sm text-slate-500">
            Connect with a client to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
