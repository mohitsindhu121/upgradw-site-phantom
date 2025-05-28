import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login Successful",
        description: "Welcome to admin panel!",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E]">
      <Card className="w-full max-w-md mx-4 bg-[#0A0A0A]/90 border-[#8B5CF6]/30">
        <CardHeader className="text-center">
          <CardTitle className="font-orbitron text-2xl text-[#8B5CF6] text-glow">
            ADMIN LOGIN
          </CardTitle>
          <p className="text-gray-400">Access the control panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6] text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#8B5CF6] text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full cyber-button"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "LOGIN"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Username: admin</p>
            <p>Password: 1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}