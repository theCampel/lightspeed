
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const FundsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AppSidebar />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Fund Search</h1>
          <p>Fund search content will appear here.</p>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FundsPage;
