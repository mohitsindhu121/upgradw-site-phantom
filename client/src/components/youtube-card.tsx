import { Badge } from "@/components/ui/badge";
import type { YoutubeResource } from "@shared/schema";

interface YoutubeCardProps {
  resource: YoutubeResource;
}

export default function YoutubeCard({ resource }: YoutubeCardProps) {
  const categoryColors = {
    tutorials: "bg-[#00FFFF]/20 text-[#00FFFF]",
    reviews: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
    gaming: "bg-[#10B981]/20 text-[#10B981]"
  };

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(resource.youtubeUrl);
  const thumbnailUrl = resource.thumbnailUrl || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

  const handleVideoClick = () => {
    window.open(resource.youtubeUrl, '_blank');
  };

  return (
    <div className="bg-[#1A1A2E]/50 rounded-xl overflow-hidden glow-effect group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
         onClick={handleVideoClick}>
      <div className="relative">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={resource.title}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-[#00FFFF]/20 to-[#8B5CF6]/20 flex items-center justify-center">
            <i className="fab fa-youtube text-6xl text-red-500"></i>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center">
            <i className="fas fa-play text-white text-xl ml-1"></i>
          </div>
        </div>

        {resource.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
            {resource.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-white group-hover:text-[#00FFFF] transition-colors line-clamp-2 flex-1">
            {resource.title}
          </h4>
          <Badge 
            variant="secondary" 
            className={`ml-2 shrink-0 ${categoryColors[resource.category as keyof typeof categoryColors]}`}
          >
            {resource.category}
          </Badge>
        </div>
        
        {resource.description && (
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {resource.description}
          </p>
        )}
        
        <div className="flex justify-between text-xs text-gray-500">
          {resource.views && <span>{resource.views}</span>}
          <span className="text-red-500">
            <i className="fab fa-youtube mr-1"></i>
            YouTube
          </span>
        </div>
      </div>
    </div>
  );
}
