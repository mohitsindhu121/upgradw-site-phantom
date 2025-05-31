import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
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
      <div className="product-card rounded-2xl overflow-hidden glow-effect group hover:-translate-y-3 hover:scale-105 transition-all duration-700 cursor-pointer transform-gpu hover:shadow-2xl hover:shadow-[#00FFFF]/30 relative border border-[#8B5CF6]/20 hover:border-[#00FFFF]/50">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/20 via-[#8B5CF6]/20 to-[#00FFFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
        
        {/* Card content */}
        <div className="relative bg-gradient-to-br from-[#1A1A2E]/95 to-[#0A0A0A]/95 rounded-2xl backdrop-blur-sm">
          {product.imageUrl && (
            <div className="relative overflow-hidden rounded-t-2xl">
              <img 
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Floating category badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${categoryColors[product.category as keyof typeof categoryColors]} bg-black/80 border-current animate-pulse`}>
                  <span className="mr-1">{categoryIcons[product.category as keyof typeof categoryIcons]}</span>
                  {product.category}
                </Badge>
              </div>
              
              {/* Product ID badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-black/80 text-[#00FFFF] border-[#00FFFF]/50 font-mono text-xs">
                  {product.productId}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/3 to-[#8B5CF6]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
            
            <div className="relative z-10">
              <div className="mb-3">
                <h4 className="font-orbitron font-bold text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#00FFFF] group-hover:to-[#8B5CF6] group-hover:bg-clip-text transition-all duration-500">
                  {product.name}
                </h4>
              </div>
              
              {product.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {product.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Price</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#10B981] to-[#00FFFF] bg-clip-text text-transparent group-hover:animate-pulse font-mono">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-400 border-green-400/30 animate-pulse">
                    <i className="fas fa-check-circle mr-1"></i>
                    Available
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowDetails(true)}
                className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#00FFFF] text-black font-bold py-3 rounded-xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden border-0 text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <i className="fas fa-eye"></i>
                  View Details
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0A0A0A]/98 via-[#1A1A2E]/95 to-[#0A0A0A]/98 border-2 border-[#8B5CF6]/40 text-white backdrop-blur-xl shadow-2xl shadow-[#8B5CF6]/20 animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-3xl text-transparent bg-gradient-to-r from-[#00FFFF] via-[#8B5CF6] to-[#00FFFF] bg-clip-text flex items-center gap-3 animate-pulse">
              <span className="text-3xl animate-bounce">{categoryIcons[product.category as keyof typeof categoryIcons]}</span>
              {product.name}
              <Badge variant="outline" className={`ml-auto text-sm ${categoryColors[product.category as keyof typeof categoryColors]} border-current animate-glow`}>
                {product.productId}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base">
              Premium digital product from Mohit Corporation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {product.imageUrl && (
              <div className="relative rounded-xl overflow-hidden group">
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full max-h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 right-6">
                  <Badge className="bg-gradient-to-r from-[#10B981]/90 to-[#00FFFF]/90 text-white border-0 text-lg px-4 py-2 font-bold animate-pulse shadow-lg">
                    {formatPrice(product.price, product.currency)}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <i className="fas fa-shield-alt text-[#00FFFF]"></i>
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#00FFFF]/10 p-4 rounded-xl border border-[#8B5CF6]/20">
                <h4 className="font-semibold text-[#00FFFF] mb-3 flex items-center gap-2">
                  <i className="fas fa-tag"></i>
                  Category
                </h4>
                <Badge variant="secondary" className="bg-[#8B5CF6]/30 text-[#8B5CF6] text-sm px-3 py-1">
                  <span className="mr-1">{categoryIcons[product.category as keyof typeof categoryIcons]}</span>
                  {product.category}
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-[#00FFFF]/10 to-[#8B5CF6]/10 p-4 rounded-xl border border-[#00FFFF]/20">
                <h4 className="font-semibold text-[#00FFFF] mb-3 flex items-center gap-2">
                  <i className="fas fa-barcode"></i>
                  Product ID
                </h4>
                <code className="bg-[#1A1A2E]/50 px-3 py-2 rounded-lg text-[#00FFFF] text-sm font-mono border border-[#00FFFF]/20">
                  {product.productId}
                </code>
              </div>
            </div>
            
            {product.description && (
              <div className="bg-gradient-to-r from-[#1A1A2E]/30 to-[#0A0A0A]/30 p-6 rounded-xl border border-[#8B5CF6]/20">
                <h4 className="font-semibold text-[#00FFFF] mb-4 flex items-center gap-2 text-lg">
                  <i className="fas fa-info-circle"></i>
                  Description
                </h4>
                <p className="text-gray-300 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>
            )}
            
            {product.videoUrl && (
              <div className="bg-gradient-to-r from-red-900/20 to-red-700/20 p-6 rounded-xl border border-red-500/30">
                <h4 className="font-semibold text-red-400 mb-4 flex items-center gap-2 text-lg">
                  <i className="fab fa-youtube"></i>
                  Demo Video
                </h4>
                <Button 
                  onClick={() => product.videoUrl && window.open(product.videoUrl, '_blank')}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 px-6 py-3 text-base font-semibold"
                >
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo Video
                </Button>
              </div>
            )}
            
            <div className="flex gap-4 pt-6 border-t-2 border-gradient-to-r from-[#8B5CF6]/30 via-[#00FFFF]/30 to-[#8B5CF6]/30">
              <Button 
                className="flex-1 bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#00FFFF] text-black font-bold text-lg py-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00FFFF]/30"
                onClick={() => {
                  if (product.purchaseLink) {
                    // Redirect to seller's custom purchase link
                    window.open(product.purchaseLink, '_blank');
                  } else {
                    // Show message if no purchase link is set
                    toast({
                      title: "Purchase link not available",
                      description: "Seller has not set up a purchase link yet. Please contact them directly.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <i className="fas fa-shopping-cart mr-3 text-lg"></i>
                Purchase Now - {formatPrice(product.price, product.currency)}
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white px-8 py-4 text-base font-semibold transition-all duration-300"
                onClick={() => setShowDetails(false)}
              >
                <i className="fas fa-times mr-2"></i>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </>
  );
}
