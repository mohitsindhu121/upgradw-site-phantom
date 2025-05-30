import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Product, YoutubeResource, ContactMessage, User } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import ProductForm from "@/components/admin/product-form";
import YoutubeForm from "@/components/admin/youtube-form";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showYoutubeForm, setShowYoutubeForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingYoutube, setEditingYoutube] = useState<YoutubeResource | null>(null);
  
  // User form state
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: ''
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const { data: youtubeResources = [] } = useQuery<YoutubeResource[]>({
    queryKey: ["/api/admin/youtube-resources"],
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: (user as any)?.id === 'mohit', // Only fetch users if admin
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowUserForm(false);
      setNewUserData({ username: '', password: '' });
      toast({
        title: "User created successfully",
        description: "New user has been added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating user",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest('DELETE', `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "User deleted successfully",
        description: "User has been removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting user",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest('DELETE', `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product deleted successfully",
        description: "Product has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting product",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const deleteYoutubeMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      await apiRequest('DELETE', `/api/youtube-resources/${resourceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/youtube-resources"] });
      toast({
        title: "YouTube resource deleted successfully",
        description: "Resource has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting resource",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditYoutube = (resource: YoutubeResource) => {
    setEditingYoutube(resource);
    setShowYoutubeForm(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
              ADMIN COMMAND CENTER
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your digital empire, {(user as any)?.username || (user as any)?.id || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant="outline" className="border-[#00FFFF] text-[#00FFFF]">
              {(user as any)?.id === 'mohit' ? 'Super Admin' : 'Seller'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full ${(user as any)?.id === 'mohit' ? 'grid-cols-5' : 'grid-cols-4'} bg-[#1A1A2E]`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            {(user as any)?.id === 'mohit' && (
              <TabsTrigger value="users" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
                Users
              </TabsTrigger>
            )}
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

          {(user as any)?.id === 'mohit' && (
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                  User Management
                </h2>
                <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                  <DialogTrigger asChild>
                    <Button className="cyber-button">
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0A0A0A] border-[#8B5CF6]/30">
                    <DialogHeader>
                      <DialogTitle className="text-[#8B5CF6]">Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={newUserData.username}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
                          className="bg-[#0A0A0A] border-[#8B5CF6]/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUserData.password}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-[#0A0A0A] border-[#8B5CF6]/30"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => createUserMutation.mutate(newUserData)}
                          disabled={!newUserData.username || !newUserData.password || createUserMutation.isPending}
                          className="cyber-button"
                        >
                          {createUserMutation.isPending ? "Creating..." : "Create User"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowUserForm(false)}
                          className="border-[#8B5CF6]/30"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id} className="product-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          {(user as any).profileImageUrl && (
                            <img
                              src={(user as any).profileImageUrl}
                              alt="Profile"
                              className="w-12 h-12 rounded-full border-2 border-[#00FFFF]/30"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-[#00FFFF]">
                              {user.username || user.id}
                              {(user as any).storeName && (
                                <span className="text-sm text-gray-400 ml-2">({(user as any).storeName})</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-400">Email: {(user as any).email}</p>
                            <p className="text-sm text-gray-400">Role: {(user as any).role || 'user'}</p>
                            {(user as any).phoneNumber && (
                              <p className="text-sm text-gray-400">Phone: {(user as any).phoneNumber}</p>
                            )}
                            {(user as any).city && (
                              <p className="text-sm text-gray-400">Location: {(user as any).city}, {(user as any).state || (user as any).country}</p>
                            )}
                            {(user as any).specialization && (
                              <p className="text-sm text-[#8B5CF6]">Specialization: {(user as any).specialization}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {(user as any).isVerified && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Verified</span>
                              )}
                              {(user as any).averageRating > 0 && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                  ⭐ {(user as any).averageRating}
                                </span>
                              )}
                              {(user as any).totalSales > 0 && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                  {(user as any).totalSales} sales
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.id !== 'mohit' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#0A0A0A] border-[#8B5CF6]/30">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#8B5CF6]">Delete User</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    Are you sure you want to delete user "{user.username || user.id}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-[#8B5CF6]/30">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUserMutation.mutate(user.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="product-card glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#00FFFF] font-orbitron">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {products.length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Active products in database
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
                  <div className="text-3xl font-bold text-white">
                    {youtubeResources.length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Educational resources
                  </p>
                </CardContent>
              </Card>

              <Card className="product-card glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#FF6B6B] font-orbitron">
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {contactMessages.length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Contact inquiries
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                Product Management
              </h2>
              <Button 
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="cyber-button"
              >
                Add New Product
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="product-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#00FFFF]">{product.name}</h3>
                        <p className="text-sm text-gray-400">ID: {product.productId}</p>
                        <p className="text-sm text-gray-400">Price: ₹{product.price}</p>
                        <Badge variant="secondary" className="mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#0A0A0A] border-[#8B5CF6]/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#8B5CF6]">Delete Product</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-[#8B5CF6]/30">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProductMutation.mutate(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-orbitron text-2xl font-bold text-[#8B5CF6]">
                YouTube Resources
              </h2>
              <Button 
                onClick={() => {
                  setEditingYoutube(null);
                  setShowYoutubeForm(true);
                }}
                className="cyber-button"
              >
                Add New Resource
              </Button>
            </div>

            <div className="grid gap-4">
              {youtubeResources.map((resource) => (
                <Card key={resource.id} className="product-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#8B5CF6]">{resource.title}</h3>
                        <p className="text-sm text-gray-400">{resource.duration}</p>
                        <Badge variant="secondary" className="mt-1">
                          {resource.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditYoutube(resource)}
                          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#0A0A0A] border-[#8B5CF6]/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#8B5CF6]">Delete Resource</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-[#8B5CF6]/30">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteYoutubeMutation.mutate(resource.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="font-orbitron text-2xl font-bold text-[#FF6B6B]">
              Contact Messages
            </h2>

            <div className="grid gap-4">
              {contactMessages.map((message) => (
                <Card key={message.id} className="product-card">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#FF6B6B]">{message.name}</h3>
                          <p className="text-sm text-gray-400">{message.email}</p>
                        </div>
                        <Badge 
                          variant={message.isRead ? "secondary" : "destructive"}
                          className="ml-2"
                        >
                          {message.isRead ? "Read" : "Unread"}
                        </Badge>
                      </div>
                      <p className="text-gray-300">{message.message}</p>
                      <p className="text-xs text-gray-500">
                        {message.createdAt && new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Dialog */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* YouTube Form Dialog */}
      {showYoutubeForm && (
        <YoutubeForm
          resource={editingYoutube}
          onClose={() => {
            setShowYoutubeForm(false);
            setEditingYoutube(null);
          }}
        />
      )}
    </div>
  );
}