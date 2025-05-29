import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { signInWithGoogle } from "@/lib/firebase";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      return response.json();
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#8B5CF6]/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#0A0A0A] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 bg-[#0A0A0A] border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10"
              onClick={async () => {
                try {
                  const googleUser = await signInWithGoogle();
                  
                  // Check if user exists in backend
                  const response = await apiRequest("POST", "/api/auth/google-login", {
                    googleId: googleUser.uid,
                    email: googleUser.email,
                    displayName: googleUser.displayName,
                    photoURL: googleUser.photoURL
                  });

                  const data = await response.json();

                  if (data.userExists) {
                    // Invalidate auth cache to refresh authentication state
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                    
                    toast({
                      title: "Welcome Back!",
                      description: "Successfully signed in. Redirecting to admin panel...",
                    });
                    // Use setTimeout to ensure auth state refreshes then redirect
                    setTimeout(() => {
                      setLocation("/admin");
                    }, 1500);
                  } else {
                    toast({
                      title: "New User Detected",
                      description: "Please complete your seller registration...",
                    });
                    setTimeout(() => {
                      setLocation("/seller-register");
                    }, 1500);
                  }
                } catch (error) {
                  toast({
                    title: "Sign-in Failed",
                    description: "Failed to sign in with Google. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Want to become a seller?{" "}
                <Link href="/seller-register" className="text-[#00FFFF] hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}