import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import type { User, Product } from "@shared/schema";

export default function SellerProfile() {
  const [location] = useLocation();
  const sellerId = location.split('/')[2]; // Extract seller ID from URL

  const { data: seller } = useQuery<User>({
    queryKey: ["/api/users", sellerId],
    enabled: !!sellerId,
  });

  const { data: sellerProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", "seller", sellerId],
    enabled: !!sellerId,
  });

  if (!seller) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#00FFFF] mb-4">Seller Not Found</h1>
            <p className="text-gray-400">The seller profile you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Seller Header */}
          <Card className="glow-effect">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  {(seller as any).profileImageUrl && (
                    <img
                      src={(seller as any).profileImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-[#00FFFF]/30"
                    />
                  )}
                  <div>
                    <CardTitle className="font-orbitron text-3xl text-[#00FFFF] mb-2">
                      {(seller as any).storeName || seller.username}
                    </CardTitle>
                    <p className="text-gray-400 text-lg mb-2">
                      @{seller.username}
                    </p>
                    <div className="flex items-center gap-3">
                      {(seller as any).isVerified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          ✓ Verified Seller
                        </Badge>
                      )}
                      {(seller as any).averageRating > 0 && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          ⭐ {(seller as any).averageRating}/5.0
                        </Badge>
                      )}
                      {(seller as any).totalSales > 0 && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {(seller as any).totalSales} Sales
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-auto">
                  <Button className="cyber-button">
                    Contact Seller
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {(seller as any).storeDescription && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#8B5CF6] mb-2">About Store</h3>
                  <p className="text-gray-300">{(seller as any).storeDescription}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(seller as any).specialization && (
                  <div>
                    <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Specialization</h4>
                    <p className="text-gray-300">{(seller as any).specialization}</p>
                  </div>
                )}
                
                {(seller as any).experience && (
                  <div>
                    <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Experience</h4>
                    <p className="text-gray-300">{(seller as any).experience}</p>
                  </div>
                )}
                
                {(seller as any).city && (
                  <div>
                    <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Location</h4>
                    <p className="text-gray-300">
                      {(seller as any).city}, {(seller as any).state || (seller as any).country}
                    </p>
                  </div>
                )}
                
                {(seller as any).businessType && (
                  <div>
                    <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Business Type</h4>
                    <p className="text-gray-300">{(seller as any).businessType}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Member Since</h4>
                  <p className="text-gray-300">
                    {new Date((seller as any).createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {(seller as any).lastLoginAt && (
                  <div>
                    <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Last Active</h4>
                    <p className="text-gray-300">
                      {new Date((seller as any).lastLoginAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              {(seller as any).portfolio && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Portfolio</h4>
                  <div className="bg-[#1A1A2E]/50 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{(seller as any).portfolio}</p>
                  </div>
                </div>
              )}
              
              {(seller as any).socialMediaLinks && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#00FFFF] mb-2">Social Media</h4>
                  <div className="bg-[#1A1A2E]/50 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{(seller as any).socialMediaLinks}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Separator className="bg-[#8B5CF6]/20" />
          
          {/* Seller Products */}
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-[#00FFFF] mb-6">
              Products by {(seller as any).storeName || seller.username}
            </h2>
            
            {sellerProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card className="product-card">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                    <p>This seller hasn't listed any products yet.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}