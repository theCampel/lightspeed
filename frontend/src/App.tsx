
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PerformancePage from "./pages/PerformancePage";
import FundsPage from "./pages/FundsPage";
import MarketInsightsPage from "./pages/MarketInsightsPage";
import TaxOptimizationPage from "./pages/TaxOptimizationPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Index />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/funds" element={<FundsPage />} />
          <Route path="/market-insights" element={<MarketInsightsPage />} />
          <Route path="/tax-optimization" element={<TaxOptimizationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
