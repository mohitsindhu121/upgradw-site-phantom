import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

const categories = [
  { id: "all", name: "All Products", icon: "🎮", color: "bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6]" },
  { id: "panels", name: "Panels", icon: "🛡️", color: "bg-[#00FFFF]" },
  { id: "bots", name: "Bots", icon: "🤖", color: "bg-[#8B5CF6]" },
  { id: "websites", name: "Websites", icon: "🌐", color: "bg-[#10B981]" },
  { id: "youtube", name: "YouTube", icon: "📺", color: "bg-[#F59E0B]" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (categoryId: string) => {
    if (categoryId === "all") return allProducts.length;
    return allProducts.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
            DIGITAL ARSENAL
          </h1>
          <p className="text-gray-400 text-lg">
            Premium gaming solutions and digital products
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or Product ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A2E]/50 border-[#00FFFF]/30 focus:border-[#00FFFF] pl-12 glow-effect"
            />
            <i className="fas fa-search absolute left-4 top-4 text-[#00FFFF]"></i>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`
                px-6 py-3 font-semibold transition-all duration-300
                ${selectedCategory === category.id 
                  ? "cyber-button text-black" 
                  : "bg-[#1A1A2E] border-[#00FFFF]/30 text-white hover:bg-[#00FFFF] hover:text-black"
                }
              `}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-black/20">
                {getCategoryStats(category.id)}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card rounded-xl p-6 animate-pulse glow-effect">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-48 rounded-lg mb-4 animate-shimmer"></div>
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-4 rounded mb-2 animate-shimmer"></div>
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-3 rounded mb-4 animate-shimmer"></div>
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-8 rounded animate-shimmer"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationDuration: '600ms'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-orbitron text-2xl font-bold text-gray-400 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : `No products in ${categories.find(c => c.id === selectedCategory)?.name} category`
              }
            </p>
          </div>
        )}

        {/* Category Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="product-card rounded-xl p-6 text-center glow-effect">
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-orbitron font-bold text-[#00FFFF] mb-1">
                {category.name}
              </h3>
              <div className="text-2xl font-bold text-white">
                {getCategoryStats(category.id)}
              </div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
