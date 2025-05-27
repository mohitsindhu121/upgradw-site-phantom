import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product, YoutubeResource, ContactMessage } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: youtubeResources = [] } = useQuery<YoutubeResource[]>({
    queryKey: ["/api/youtube-resources"],
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
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
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
            Welcome back, {user?.firstName || 'Mohit'}!
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your gaming empire from the command center
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="product-card glow-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#00FFFF] font-orbitron text-lg">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.totalProducts}
              </div>
            </CardContent>
          </Card>

          <Card className="product-card glow-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#8B5CF6] font-orbitron text-lg">
                YouTube Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.totalVideos}
              </div>
            </CardContent>
          </Card>

          <Card className="product-card glow-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#10B981] font-orbitron text-lg">
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.unreadMessages}
              </div>
            </CardContent>
          </Card>

          <Card className="product-card glow-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#F59E0B] font-orbitron text-lg">
                Active Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.activeProducts}
              </div>
            </CardContent>
          </Card>
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
