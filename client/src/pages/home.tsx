import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Product, YoutubeResource, ContactMessage, User, Announcement } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: youtubeResources = [] } = useQuery<YoutubeResource[]>({
    queryKey: ["/api/youtube-resources"],
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const stats = {
    totalProducts: products.length,
    totalVideos: youtubeResources.length,
    unreadMessages: contactMessages.filter(msg => !msg.isRead).length,
    activeProducts: products.filter(p => p.isActive).length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#00FFFF]/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Header with animation */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#00FFFF] to-[#8B5CF6] mb-4 animate-pulse">
                Welcome back, {user?.username || user?.id || 'User'}!
              </h1>
              <p className="text-gray-400 text-lg">
                Command Center - {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00FFFF]/20 rounded-lg border border-[#00FFFF]/30">
                <div className="text-sm text-[#00FFFF]">System Status</div>
                <div className="text-lg font-bold text-green-400">● ONLINE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-orbitron text-2xl font-bold text-[#00FFFF] mb-6 flex items-center gap-3">
              <i className="fas fa-bullhorn text-[#8B5CF6] animate-pulse"></i>
              Latest Announcements
            </h2>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement, index) => {
                const typeConfig = {
                  info: { color: 'from-blue-500/20 to-blue-400/20', icon: 'fas fa-info-circle', textColor: 'text-blue-400', borderColor: 'border-blue-400/30' },
                  success: { color: 'from-green-500/20 to-green-400/20', icon: 'fas fa-check-circle', textColor: 'text-green-400', borderColor: 'border-green-400/30' },
                  warning: { color: 'from-yellow-500/20 to-yellow-400/20', icon: 'fas fa-exclamation-triangle', textColor: 'text-yellow-400', borderColor: 'border-yellow-400/30' },
                  error: { color: 'from-red-500/20 to-red-400/20', icon: 'fas fa-exclamation-circle', textColor: 'text-red-400', borderColor: 'border-red-400/30' }
                };
                const config = typeConfig[announcement.type as keyof typeof typeConfig] || typeConfig.info;
                
                return (
                  <Alert 
                    key={announcement.id}
                    className={`bg-gradient-to-r ${config.color} border ${config.borderColor} backdrop-blur-sm transform transition-all duration-700 hover:scale-105 hover:shadow-lg animate-in slide-in-from-left-5`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full bg-black/30 border ${config.borderColor}`}>
                        <i className={`${config.icon} ${config.textColor} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-bold text-lg ${config.textColor}`}>{announcement.title}</h3>
                          {(announcement.priority ?? 0) > 0 && (
                            <Badge variant="outline" className={`${config.textColor} ${config.borderColor} animate-pulse`}>
                              Priority: {announcement.priority}
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="text-gray-300 leading-relaxed text-base">
                          {announcement.content}
                        </AlertDescription>
                        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                          <i className="fas fa-clock"></i>
                          {new Date(announcement.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </Alert>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats with enhanced animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Total Products", value: stats.totalProducts, color: "#00FFFF", delay: "0ms" },
            { title: "YouTube Videos", value: stats.totalVideos, color: "#8B5CF6", delay: "100ms" },
            { title: "Unread Messages", value: stats.unreadMessages, color: "#10B981", delay: "200ms" },
            { title: "Active Products", value: stats.activeProducts, color: "#F59E0B", delay: "300ms" }
          ].map((stat, index) => (
            <Card 
              key={index}
              className={`product-card glow-effect transform transition-all duration-700 hover:scale-105 hover:rotate-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: stat.delay,
                background: `linear-gradient(135deg, rgba(${stat.color === '#00FFFF' ? '0,255,255' : stat.color === '#8B5CF6' ? '139,92,246' : stat.color === '#10B981' ? '16,185,129' : '245,158,11'}, 0.1) 0%, transparent 100%)`
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-orbitron text-lg" style={{ color: stat.color }}>
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 animate-pulse"
                    style={{ 
                      backgroundColor: stat.color,
                      width: `${Math.min(100, (stat.value / 10) * 100)}%`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="product-card glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-[#00FFFF]">
                🛡️ Manage Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Add, edit, or remove products from your catalog
              </p>
              <Link href="/admin">
                <Button className="cyber-button w-full">
                  Manage Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="product-card glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-[#8B5CF6]">
                📺 YouTube Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Manage your YouTube resources and videos
              </p>
              <Link href="/admin">
                <Button className="cyber-button w-full">
                  Manage Videos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="product-card glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-[#10B981]">
                📬 Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                View and respond to customer inquiries
              </p>
              <Link href="/admin">
                <Button className="cyber-button w-full">
                  View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="product-card glow-effect">
          <CardHeader>
            <CardTitle className="font-orbitron text-2xl text-glow">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981] mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FFFF] mb-2">2.5K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F59E0B] mb-2">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
