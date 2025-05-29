import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Products from "@/pages/products";
import Youtube from "@/pages/youtube";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/components/ui/loading-screen";
import ParticlesBackground from "@/components/ui/particles-background";
import AIChatPopup from "@/components/ui/ai-chat-popup";
import { useEffect, useState } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: 'transparent' }}>
      <ParticlesBackground />
      <div className="relative z-10">
        <AIChatPopup />
        
        <Switch>
          <Route path="/" component={isAuthenticated ? Home : Landing} />
          <Route path="/products" component={Products} />
          <Route path="/youtube" component={Youtube} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={isAuthenticated ? Admin : Login} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Show loading screen for 5 seconds on first load
    const timer = setTimeout(() => {
      setShowLoading(false);
      setAppReady(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!appReady) return;

    // Add click burst effect
    const handleClick = (e: MouseEvent) => {
      const burst = document.createElement('div');
      burst.className = 'fixed pointer-events-none rounded-full animate-ping z-[9999]';
      burst.style.left = (e.clientX - 25) + 'px';
      burst.style.top = (e.clientY - 25) + 'px';
      burst.style.width = '50px';
      burst.style.height = '50px';
      burst.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%)';
      document.body.appendChild(burst);

      setTimeout(() => {
        burst.remove();
      }, 600);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [appReady]);

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
