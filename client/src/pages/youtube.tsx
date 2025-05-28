import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import YoutubeCard from "@/components/youtube-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { YoutubeResource } from "@shared/schema";

const categories = [
  { id: "all", name: "All Videos", icon: "🎬" },
  { id: "tutorials", name: "Tutorials", icon: "📚" },
  { id: "reviews", name: "Reviews", icon: "⭐" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "files", name: "Files", icon: "📁" },
];

export default function Youtube() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: allResources = [], isLoading } = useQuery<YoutubeResource[]>({
    queryKey: ["/api/youtube-resources"],
  });

  const filteredResources = allResources.filter(resource => 
    selectedCategory === "all" || resource.category === selectedCategory
  );

  const getCategoryStats = (categoryId: string) => {
    if (categoryId === "all") return allResources.length;
    return allResources.filter(r => r.category === categoryId).length;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
            YOUTUBE RESOURCES
          </h1>
          <p className="text-gray-400 text-lg">
            Gaming tutorials, reviews, and educational content
          </p>
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

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1A1A2E]/50 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-4">
                  <div className="bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <YoutubeCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="font-orbitron text-2xl font-bold text-gray-400 mb-2">
              No Videos Found
            </h3>
            <p className="text-gray-500">
              No videos in {categories.find(c => c.id === selectedCategory)?.name} category
            </p>
          </div>
        )}

        {/* Category Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="product-card rounded-xl p-8 text-center glow-effect">
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="font-orbitron font-bold text-[#00FFFF] text-xl mb-2">
                {category.name}
              </h3>
              <div className="text-3xl font-bold text-white mb-1">
                {getCategoryStats(category.id)}
              </div>
              <div className="text-gray-400">Videos Available</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
