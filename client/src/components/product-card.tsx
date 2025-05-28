import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const categoryIcons = {
    panels: "🛡️",
    bots: "🤖",
    websites: "🌐",
    youtube: "📺"
  };

  const categoryColors = {
    panels: "text-[#00FFFF]",
    bots: "text-[#8B5CF6]",
    websites: "text-[#10B981]",
    youtube: "text-[#F59E0B]"
  };

  return (
    <>
      <div className="product-card rounded-xl overflow-hidden glow-effect group hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer transform-gpu hover:shadow-2xl hover:shadow-[#00FFFF]/20">
        {product.imageUrl && (
          <div className="relative overflow-hidden">
            <img 
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        
        <div className="p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/5 to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-orbitron font-bold text-lg text-white group-hover:text-[#00FFFF] transition-colors duration-300">
                <span className="inline-block group-hover:animate-pulse">{categoryIcons[product.category as keyof typeof categoryIcons]}</span> {product.name}
              </h4>
              <Badge 
                variant="outline" 
                className={`text-xs border-current ${categoryColors[product.category as keyof typeof categoryColors]} group-hover:animate-pulse`}
              >
                {product.productId}
              </Badge>
            </div>
            
            {product.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                {product.description}
              </p>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#10B981] group-hover:text-[#00FFFF] transition-colors duration-300 font-mono">
                ${product.price}
              </span>
              <Badge variant="secondary" className="bg-[#8B5CF6]/20 text-[#8B5CF6] group-hover:bg-[#8B5CF6]/30 transition-colors duration-300">
                {product.category}
              </Badge>
            </div>
            
            <Button 
              onClick={() => setShowDetails(true)}
              className="w-full cyber-button group-hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">View Details</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 to-[#8B5CF6]/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl bg-[#0A0A0A]/95 border-[#8B5CF6]/30 text-white">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-2xl text-[#8B5CF6] flex items-center gap-2">
              <span className="text-2xl">{categoryIcons[product.category as keyof typeof categoryIcons]}</span>
              {product.name}
              <Badge variant="outline" className={`ml-auto ${categoryColors[product.category as keyof typeof categoryColors]}`}>
                {product.productId}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {product.imageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full max-h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
                    ${product.price}
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-[#00FFFF] mb-2">Category</h4>
                <Badge variant="secondary" className="bg-[#8B5CF6]/20 text-[#8B5CF6]">
                  {product.category}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold text-[#00FFFF] mb-2">Product ID</h4>
                <code className="bg-[#1A1A2E] px-2 py-1 rounded text-[#00FFFF] text-sm">
                  {product.productId}
                </code>
              </div>
            </div>
            
            {product.description && (
              <div>
                <h4 className="font-semibold text-[#00FFFF] mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            
            {product.videoUrl && (
              <div>
                <h4 className="font-semibold text-[#00FFFF] mb-2">Demo Video</h4>
                <Button 
                  onClick={() => product.videoUrl && window.open(product.videoUrl, '_blank')}
                  className="cyber-button"
                >
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </Button>
              </div>
            )}
            
            <div className="flex gap-4 pt-4 border-t border-[#8B5CF6]/20">
              <Button 
                className="flex-1 cyber-button"
                onClick={() => {
                  // Add to cart or purchase logic here
                  alert('Purchase functionality coming soon!');
                }}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Purchase Now - ${product.price}
              </Button>
              <Button 
                variant="outline" 
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
