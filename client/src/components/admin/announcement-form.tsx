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
import type { Announcement, InsertAnnouncement } from "@shared/schema";

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onClose: () => void;
}

export default function AnnouncementForm({ announcement, onClose }: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    priority: 0,
    isActive: true,
    expiresAt: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type || "info",
        priority: announcement.priority || 0,
        isActive: announcement.isActive ?? true,
        expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [announcement]);

  const mutation = useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      const url = announcement ? `/api/announcements/${announcement.id}` : "/api/announcements";
      const method = announcement ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: announcement ? "Announcement Updated" : "Announcement Created",
        description: `Announcement has been ${announcement ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${announcement ? "update" : "create"} announcement.`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!announcement) return;
      return await apiRequest("DELETE", `/api/announcements/${announcement.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Announcement Deleted",
        description: "Announcement has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete announcement.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      title: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      isActive: formData.isActive,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      createdBy: "admin", // This will be overridden by the server
    } as InsertAnnouncement);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="product-card glow-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-orbitron text-2xl text-[#00FFFF]">
              {announcement ? "Edit Announcement" : "Create New Announcement"}
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
              <label className="block text-sm font-medium mb-2">
                <i className="fas fa-heading mr-2 text-[#00FFFF]"></i>
                Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter announcement title"
                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <i className="fas fa-align-left mr-2 text-[#00FFFF]"></i>
                Content *
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter announcement content"
                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <i className="fas fa-tag mr-2 text-[#8B5CF6]"></i>
                  Type
                </label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">ℹ️ Info</SelectItem>
                    <SelectItem value="success">✅ Success</SelectItem>
                    <SelectItem value="warning">⚠️ Warning</SelectItem>
                    <SelectItem value="error">❌ Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <i className="fas fa-sort-numeric-up mr-2 text-[#10B981]"></i>
                  Priority
                </label>
                <Input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-[#0A0A0A] border-[#10B981]/30 focus:border-[#10B981]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active</label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <i className="fas fa-calendar-times mr-2 text-[#F59E0B]"></i>
                Expires At (Optional)
              </label>
              <Input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="bg-[#0A0A0A] border-[#F59E0B]/30 focus:border-[#F59E0B]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty for permanent announcement
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="cyber-button flex-1"
              >
                {mutation.isPending ? "Saving..." : (announcement ? "Update Announcement" : "Create Announcement")}
              </Button>
              
              {announcement && (
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