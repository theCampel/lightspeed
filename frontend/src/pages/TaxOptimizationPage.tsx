
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const TaxOptimizationPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AppSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Tax Optimization</h1>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
            <p className="text-lg text-gray-700">
              Welcome to the Tax Optimization page. Here you'll find strategies and tools to minimize tax liability and maximize investment returns.
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TaxOptimizationPage;
