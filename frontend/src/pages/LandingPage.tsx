import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('waiting');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:8000/ws');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connection established on landing page');
        setStatus('connected');
      };
      
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Check for transcription status message
        if (data && data.status) {
          if (data.status === 'start') {
            setStatus('call-started');
            // Navigate to dashboard when a call starts
            navigate('/dashboard');
          }
        }
      };
      
      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      };
      
      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setStatus('disconnected');
      };
    }
    
    // Clean up function to close the WebSocket when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
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
            {status === 'connected' ? 'Waiting for a call to begin...' : 'Connecting to service...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
