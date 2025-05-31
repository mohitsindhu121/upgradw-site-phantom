import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/currency";

interface SellerMessage {
  id: number;
  orderId?: string;
  messageType: string;
  subject: string;
  content: string;
  customerInfo?: any;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

interface Order {
  id: number;
  orderId: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  paymentMethod: string;
  paymentOption: string;
  amount: string;
  totalAmount: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const [selectedMessage, setSelectedMessage] = useState<SellerMessage | null>(null);
  const queryClient = useQueryClient();
  
  // For demo purposes, using a fixed seller ID. In real app, get from authentication
  const sellerId = "admin";

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/seller/messages', sellerId],
    queryFn: async () => {
      const response = await fetch(`/api/seller/messages/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    }
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/seller/orders', sellerId],
    queryFn: async () => {
      const response = await fetch(`/api/seller/orders/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  const { data: unreadCount = { count: 0 } } = useQuery({
    queryKey: ['/api/seller/unread-count', sellerId],
    queryFn: async () => {
      const response = await fetch(`/api/seller/unread-count/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/seller/messages/${messageId}/read`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seller/messages', sellerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/unread-count', sellerId] });
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seller/orders', sellerId] });
    }
  });

  const handleMarkAsRead = async (message: SellerMessage) => {
    if (!message.isRead) {
      await markAsReadMutation.mutateAsync(message.id);
    }
    setSelectedMessage(message);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-400/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-400/50';
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-400/50';
      case 'delivered': return 'bg-green-600/20 text-green-300 border-green-300/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-400/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-400/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-400/50';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-400/50';
      case 'low': return 'bg-gray-500/20 text-gray-400 border-gray-400/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-400/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] bg-clip-text text-transparent mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-400">Manage your orders and customer communications</p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="bg-[#1A1A2E]/50 border border-[#8B5CF6]/30">
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#8B5CF6]/20">
              संदेश ({unreadCount.count} नए)
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#8B5CF6]/20">
              ऑर्डर ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages List */}
              <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <i className="fas fa-envelope"></i>
                    आपके संदेश
                  </CardTitle>
                  <CardDescription>ग्राहकों के ऑर्डर और पूछताछ</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {messagesLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">कोई संदेश नहीं मिला</div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message: SellerMessage) => (
                          <div
                            key={message.id}
                            className={`p-4 rounded-lg cursor-pointer transition-all border ${
                              !message.isRead 
                                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/20' 
                                : 'bg-[#16213E]/50 border-[#8B5CF6]/20 hover:bg-[#16213E]/80'
                            }`}
                            onClick={() => handleMarkAsRead(message)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse"></div>
                                )}
                                <Badge className={getPriorityColor(message.priority)}>
                                  {message.priority}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(message.createdAt).toLocaleDateString('hi-IN')}
                              </span>
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-1">
                              {message.subject}
                            </h4>
                            <p className="text-gray-400 text-xs line-clamp-2">
                              {message.content.substring(0, 100)}...
                            </p>
                            {message.orderId && (
                              <Badge variant="outline" className="mt-2 text-xs text-[#00FFFF] border-[#00FFFF]/50">
                                {message.orderId}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Message Detail */}
              <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
                <CardHeader>
                  <CardTitle className="text-white">संदेश विवरण</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(selectedMessage.priority)}>
                          {selectedMessage.priority}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {new Date(selectedMessage.createdAt).toLocaleString('hi-IN')}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white">
                        {selectedMessage.subject}
                      </h3>
                      
                      <Separator className="bg-[#8B5CF6]/30" />
                      
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                          {selectedMessage.content}
                        </pre>
                      </div>

                      {selectedMessage.customerInfo && (
                        <Card className="bg-[#16213E]/50 border-[#00FFFF]/30">
                          <CardHeader>
                            <CardTitle className="text-[#00FFFF] text-lg">ग्राहक संपर्क जानकारी</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-user text-[#00FFFF]"></i>
                              <span className="text-white">{selectedMessage.customerInfo.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <i className="fas fa-phone text-[#00FFFF]"></i>
                              <span className="text-white">{selectedMessage.customerInfo.phone}</span>
                              <Button size="sm" variant="outline" className="ml-auto border-[#00FFFF]/50 text-[#00FFFF]">
                                <i className="fab fa-whatsapp mr-2"></i>
                                WhatsApp
                              </Button>
                            </div>
                            {selectedMessage.customerInfo.email && (
                              <div className="flex items-center gap-2">
                                <i className="fas fa-envelope text-[#00FFFF]"></i>
                                <span className="text-white">{selectedMessage.customerInfo.email}</span>
                              </div>
                            )}
                            {selectedMessage.customerInfo.address && (
                              <div className="flex items-start gap-2">
                                <i className="fas fa-map-marker-alt text-[#00FFFF] mt-1"></i>
                                <span className="text-white">{selectedMessage.customerInfo.address}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      एक संदेश चुनें उसका विवरण देखने के लिए
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <i className="fas fa-shopping-bag"></i>
                  आपके ऑर्डर
                </CardTitle>
                <CardDescription>सभी ऑर्डर की सूची और उनकी स्थिति</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">कोई ऑर्डर नहीं मिला</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <Card key={order.id} className="bg-[#16213E]/50 border-[#8B5CF6]/20">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-white">{order.orderId}</h4>
                              <p className="text-sm text-gray-400">Product: {order.productId}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('hi-IN')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Customer</p>
                              <p className="text-white">{order.customerName}</p>
                              <p className="text-[#00FFFF]">{order.customerPhone}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Payment</p>
                              <p className="text-white">{order.paymentMethod.toUpperCase()}</p>
                              <p className="text-gray-300">{order.paymentOption}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Amount</p>
                              <p className="text-green-400 font-semibold">
                                {formatPrice(order.amount, 'INR')}
                              </p>
                              <p className="text-xs text-gray-400">
                                Total: {formatPrice(order.totalAmount, 'INR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Actions</p>
                              <div className="flex gap-2 mt-1">
                                {order.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatusMutation.mutate({ 
                                      orderId: order.orderId, 
                                      status: 'confirmed' 
                                    })}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {order.status === 'confirmed' && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatusMutation.mutate({ 
                                      orderId: order.orderId, 
                                      status: 'processing' 
                                    })}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Process
                                  </Button>
                                )}
                                {order.status === 'processing' && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatusMutation.mutate({ 
                                      orderId: order.orderId, 
                                      status: 'shipped' 
                                    })}
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    Ship
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}