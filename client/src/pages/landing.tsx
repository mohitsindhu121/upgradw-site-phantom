import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import type { Product } from "@shared/schema";

export default function Landing() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 6);

  useEffect(() => {
    // Hero animations
    const tl = window.gsap.timeline();
    tl.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power2.out" })
      .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.3");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Futuristic gaming setup" 
              className="mx-auto rounded-xl glow-effect max-w-md w-full h-64 object-cover"
            />
          </div>
          
          <h1 className="hero-title font-orbitron text-5xl md:text-7xl font-black text-glow mb-6">
            WELCOME TO<br />
            <span className="bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] bg-clip-text text-transparent">
              MOHIT CORPORATION
            </span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8">
            Powering Panels, Bots & Gaming Tools
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="cyber-button px-8 py-3 text-lg">
                Explore Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="font-orbitron text-4xl font-bold text-center text-glow mb-4">
            FEATURED PRODUCTS
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Discover our premium gaming solutions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button className="cyber-button px-8 py-3 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
