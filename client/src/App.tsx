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
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/components/ui/loading-screen";
import ParticlesBackground from "@/components/ui/particles-background";
import WhatsAppPopup from "@/components/ui/whatsapp-popup";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-x-hidden">
      <ParticlesBackground />
      <WhatsAppPopup />
      
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/products" component={Products} />
            <Route path="/youtube" component={Youtube} />
            <Route path="/contact" component={Contact} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/youtube" component={Youtube} />
            <Route path="/contact" component={Contact} />
            <Route path="/admin" component={Admin} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  useEffect(() => {
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
  }, []);

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
