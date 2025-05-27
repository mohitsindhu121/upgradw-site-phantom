import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <div className="product-card rounded-xl overflow-hidden glow-effect group hover:-translate-y-1 transition-all duration-300">
      {product.imageUrl && (
        <img 
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-orbitron font-bold text-lg text-white group-hover:text-[#00FFFF] transition-colors">
            {categoryIcons[product.category as keyof typeof categoryIcons]} {product.name}
          </h4>
          <Badge 
            variant="outline" 
            className={`text-xs border-current ${categoryColors[product.category as keyof typeof categoryColors]}`}
          >
            {product.productId}
          </Badge>
        </div>
        
        {product.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-[#10B981]">
            ${product.price}
          </span>
          <Badge variant="secondary" className="bg-[#8B5CF6]/20 text-[#8B5CF6]">
            {product.category}
          </Badge>
        </div>
        
        <Button className="w-full cyber-button group-hover:scale-105 transition-transform">
          View Details
        </Button>
      </div>
    </div>
  );
}
