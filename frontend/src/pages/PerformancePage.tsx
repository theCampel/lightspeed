
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const PerformancePage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AppSidebar />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Performance Tracker</h1>
          <p>Performance tracking content will appear here.</p>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PerformancePage;
