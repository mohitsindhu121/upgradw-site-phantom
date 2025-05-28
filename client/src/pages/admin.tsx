import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/admin/product-form";
import YoutubeForm from "@/components/admin/youtube-form";
import { useAuth } from "@/hooks/useAuth";
import type { Product, YoutubeResource, ContactMessage } from "@shared/schema";

export default function Admin() {
  const { user } = useAuth();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showYoutubeForm, setShowYoutubeForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingYoutube, setEditingYoutube] = useState<YoutubeResource | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: youtubeResources = [] } = useQuery<YoutubeResource[]>({
    queryKey: ["/api/youtube-resources"],
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditYoutube = (resource: YoutubeResource) => {
    setEditingYoutube(resource);
    setShowYoutubeForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseYoutubeForm = () => {
    setShowYoutubeForm(false);
    setEditingYoutube(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
            ADMIN COMMAND CENTER
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your digital empire, {user?.username || 'Mohit'}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#1A1A2E]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
              Products
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
              YouTube
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="product-card glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#00FFFF] font-orbitron">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.length}</div>
                  <p className="text-sm text-gray-400">
                    {products.filter(p => p.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card className="product-card glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#8B5CF6] font-orbitron">
                    YouTube Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{youtubeResources.length}</div>
                  <p className="text-sm text-gray-400">
                    {youtubeResources.filter(r => r.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card className="product-card glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#10B981] font-orbitron">
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contactMessages.length}</div>
                  <p className="text-sm text-gray-400">
                    {contactMessages.filter(m => !m.isRead).length} unread
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="product-card glow-effect">
              <CardHeader>
                <CardTitle className="font-orbitron text-xl text-[#00FFFF]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowProductForm(true)}
                  className="cyber-button"
                >
                  Add New Product
                </Button>
                <Button
                  onClick={() => setShowYoutubeForm(true)}
                  className="cyber-button"
                >
                  Add YouTube Video
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                Product Management
              </h2>
              <Button
                onClick={() => setShowProductForm(true)}
                className="cyber-button"
              >
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="product-card glow-effect">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant="outline" className="text-[#00FFFF] border-[#00FFFF]">
                            {product.productId}
                          </Badge>
                          <Badge 
                            variant={product.isActive ? "default" : "secondary"}
                            className={product.isActive ? "bg-[#10B981]" : ""}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#10B981] font-semibold">${product.price}</span>
                          <span className="text-gray-400">Category: {product.category}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline"
                        size="sm"
                        className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-orbitron text-2xl font-bold text-[#8B5CF6]">
                YouTube Management
              </h2>
              <Button
                onClick={() => setShowYoutubeForm(true)}
                className="cyber-button"
              >
                Add Video
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {youtubeResources.map((resource) => (
                <Card key={resource.id} className="product-card glow-effect">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{resource.title}</h3>
                          <Badge 
                            variant={resource.isActive ? "default" : "secondary"}
                            className={resource.isActive ? "bg-[#10B981]" : ""}
                          >
                            {resource.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{resource.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#8B5CF6]">Category: {resource.category}</span>
                          {resource.duration && (
                            <span className="text-gray-400">Duration: {resource.duration}</span>
                          )}
                          {resource.views && (
                            <span className="text-gray-400">Views: {resource.views}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditYoutube(resource)}
                        variant="outline"
                        size="sm"
                        className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="font-orbitron text-2xl font-bold text-[#10B981]">
              Contact Messages
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {contactMessages.map((message) => (
                <Card key={message.id} className="product-card glow-effect">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{message.name}</h3>
                        <p className="text-gray-400 text-sm">{message.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={message.isRead ? "secondary" : "default"}
                          className={!message.isRead ? "bg-[#10B981]" : ""}
                        >
                          {message.isRead ? "Read" : "Unread"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Form Modal */}
        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleCloseProductForm}
          />
        )}

        {/* YouTube Form Modal */}
        {showYoutubeForm && (
          <YoutubeForm
            resource={editingYoutube}
            onClose={handleCloseYoutubeForm}
          />
        )}
      </div>
    </div>
  );
}
