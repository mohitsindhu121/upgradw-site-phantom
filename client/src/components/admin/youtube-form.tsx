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
import type { YoutubeResource, InsertYoutubeResource } from "@shared/schema";

interface YoutubeFormProps {
  resource?: YoutubeResource | null;
  onClose: () => void;
}

export default function YoutubeForm({ resource, onClose }: YoutubeFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    thumbnailUrl: "",
    category: "",
    duration: "",
    views: "",
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description || "",
        youtubeUrl: resource.youtubeUrl,
        thumbnailUrl: resource.thumbnailUrl || "",
        category: resource.category,
        duration: resource.duration || "",
        views: resource.views || "",
        isActive: resource.isActive ?? true,
      });
    }
  }, [resource]);

  const mutation = useMutation({
    mutationFn: async (data: InsertYoutubeResource) => {
      const url = resource ? `/api/youtube-resources/${resource.id}` : "/api/youtube-resources";
      const method = resource ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: resource ? "Video Updated" : "Video Created",
        description: `YouTube resource has been ${resource ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/youtube-resources"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${resource ? "update" : "create"} YouTube resource.`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!resource) return;
      return await apiRequest("DELETE", `/api/youtube-resources/${resource.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Video Deleted",
        description: "YouTube resource has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/youtube-resources"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete YouTube resource.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.youtubeUrl || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Auto-generate thumbnail URL if not provided
    const getVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const videoId = getVideoId(formData.youtubeUrl);
    const thumbnailUrl = formData.thumbnailUrl || 
      (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "");

    mutation.mutate({
      title: formData.title,
      description: formData.description,
      youtubeUrl: formData.youtubeUrl,
      thumbnailUrl,
      category: formData.category,
      duration: formData.duration,
      views: formData.views,
      isActive: formData.isActive,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const extractVideoInfo = () => {
    if (!formData.youtubeUrl) return;

    const getVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const videoId = getVideoId(formData.youtubeUrl);
    if (videoId) {
      setFormData(prev => ({
        ...prev,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }));
      
      toast({
        title: "Video Info Extracted",
        description: "Thumbnail URL has been automatically generated.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="product-card glow-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-orbitron text-2xl text-[#8B5CF6]">
              {resource ? "Edit YouTube Video" : "Add New Video"}
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
            <div>
              <label className="block text-sm font-medium mb-2">Video Title *</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description"
                className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6] resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL *</label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6] flex-1"
                  required
                />
                <Button
                  type="button"
                  onClick={extractVideoInfo}
                  variant="outline"
                  className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                >
                  <i className="fas fa-magic mr-2"></i>
                  Extract
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click "Extract" to auto-generate thumbnail from YouTube URL
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutorials">📚 Tutorials</SelectItem>
                    <SelectItem value="reviews">⭐ Reviews</SelectItem>
                    <SelectItem value="gaming">🎮 Gaming</SelectItem>
                    <SelectItem value="files">📁 Files</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active Video</label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 12:45"
                  className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
                <p className="text-xs text-gray-500 mt-1">Format: MM:SS or HH:MM:SS</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Views</label>
                <Input
                  type="text"
                  name="views"
                  value={formData.views}
                  onChange={handleInputChange}
                  placeholder="e.g., 125K views"
                  className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Thumbnail URL</label>
              <Input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/thumbnail.jpg (auto-generated if empty)"
                className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate from YouTube URL
              </p>
            </div>

            {/* Preview */}
            {formData.thumbnailUrl && (
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail Preview</label>
                <div className="relative w-full max-w-sm">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full aspect-video object-cover rounded-lg border border-[#8B5CF6]/30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                    <i className="fab fa-youtube text-4xl text-red-500"></i>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="cyber-button flex-1"
              >
                {mutation.isPending ? "Saving..." : (resource ? "Update Video" : "Create Video")}
              </Button>
              
              {resource && (
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
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white px-6"
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
