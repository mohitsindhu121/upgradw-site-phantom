import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, InsertProduct } from "@shared/schema";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    category: "",
    imageUrl: "",
    videoUrl: "",
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        currency: product.currency || "INR",
        category: product.category,
        imageUrl: product.imageUrl || "",
        videoUrl: product.videoUrl || "",
        isActive: product.isActive ?? true,
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: product ? "Product Updated" : "Product Created",
        description: `Product has been ${product ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product.`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      return await apiRequest("DELETE", `/api/products/${product.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      currency: formData.currency,
      category: formData.category,
      imageUrl: formData.imageUrl,
      videoUrl: formData.videoUrl,
      isActive: formData.isActive,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="product-card glow-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-orbitron text-2xl text-[#00FFFF]">
              {product ? "Edit Product" : "Add New Product"}
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panels">🛡️ Panels</SelectItem>
                    <SelectItem value="bots">🤖 Bots</SelectItem>
                    <SelectItem value="websites">🌐 Websites</SelectItem>
                    <SelectItem value="youtube">📺 YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Currency *</label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                    <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                    <SelectItem value="BDT">৳ BDT (Bangladeshi Taka)</SelectItem>
                    <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active Product</label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <Input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="cyber-button flex-1"
              >
                {mutation.isPending ? "Saving..." : (product ? "Update Product" : "Create Product")}
              </Button>
              
              {product && (
                <Button
                  type="button"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  variant="destructive"
                  className="px-6"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              )}
              
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
