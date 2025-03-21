import React from 'react';
import { LayoutDashboard, LineChart, Search, Zap, BarChart3, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { ConnectionStatus } from '@/components/ConnectionStatus';

interface AppSidebarProps {
  isTranscribing?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isTranscribing = false }) => {
  return (
    <Sidebar className="w-56"> {/* Making the sidebar narrower */}
      <SidebarHeader className="flex items-center justify-center py-6">
        <div className="inline-flex items-center gap-3">
          <Zap className="h-5 w-5 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
            LIGHTSPEED
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col pl-4"> {/* Left padding for menu items */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <Link to="/">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Performance Tracker">
              <Link to="/performance">
                <LineChart className="h-5 w-5" />
                <span>Performance Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Fund Search">
              <Link to="/funds">
                <Search className="h-5 w-5" />
                <span>Fund Search</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Market Insights">
              <Link to="/market-insights">
                <BarChart3 className="h-5 w-5" />
                <span>Market Insights</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Tax Optimization">
              <Link to="/tax-optimization">
                <Receipt className="h-5 w-5" />
                <span>Tax Optimization</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4">
        <ConnectionStatus isActive={isTranscribing} />
      </SidebarFooter>
    </Sidebar>
  );
};
