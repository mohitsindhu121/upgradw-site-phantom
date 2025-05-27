import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContactMessage } from "@shared/schema";

const socialLinks = [
  {
    name: "YouTube",
    icon: "fab fa-youtube",
    color: "bg-red-600/20 border-red-600/30 hover:bg-red-600/30 text-red-500",
    url: "#"
  },
  {
    name: "Discord",
    icon: "fab fa-discord",
    color: "bg-purple-600/20 border-purple-600/30 hover:bg-purple-600/30 text-purple-400",
    url: "#"
  },
  {
    name: "Instagram",
    icon: "fab fa-instagram",
    color: "bg-pink-600/20 border-pink-600/30 hover:bg-pink-600/30 text-pink-400",
    url: "#"
  },
  {
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    color: "bg-green-600/20 border-green-600/30 hover:bg-green-600/30 text-green-400",
    url: "#"
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMessage = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact-messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", message: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    submitMessage.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold text-glow mb-4">
            CONTACT COMMAND CENTER
          </h1>
          <p className="text-gray-400 text-lg">
            Connect with us through multiple channels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="product-card glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                Send Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] glow-effect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] glow-effect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] glow-effect resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitMessage.isPending}
                  className="w-full cyber-button py-3 text-lg"
                >
                  {submitMessage.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social Links & Info */}
          <div className="space-y-8">
            <Card className="product-card glow-effect">
              <CardHeader>
                <CardTitle className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      className={`flex items-center space-x-3 p-4 border rounded-lg transition-all glow-effect ${link.color}`}
                    >
                      <i className={`${link.icon} text-2xl`}></i>
                      <span className="font-semibold">{link.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="product-card glow-effect">
              <CardHeader>
                <CardTitle className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                  System Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-[#00FFFF] font-semibold">Mohit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-[#10B981] font-semibold">24 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">System Status:</span>
                    <span className="text-[#10B981] font-semibold">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Support Hours:</span>
                    <span className="text-white font-semibold">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="product-card glow-effect">
              <CardHeader>
                <CardTitle className="font-orbitron text-2xl font-bold text-[#00FFFF]">
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-[#00FFFF]"></i>
                    <span className="text-gray-300">contact@mohitcorp.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-clock text-[#8B5CF6]"></i>
                    <span className="text-gray-300">Response within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-shield-alt text-[#10B981]"></i>
                    <span className="text-gray-300">Secure & confidential</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
