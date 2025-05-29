import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, onAuthStateChange } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function SellerRegister() {
  const [, setLocation] = useLocation();
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setGoogleUser(user);
      if (user) {
        setFormData(prev => ({
          ...prev,
          username: user.displayName || user.email?.split('@')[0] || ""
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Google Sign-in Successful",
        description: "Please complete your seller profile below.",
      });
    } catch (error) {
      toast({
        title: "Sign-in Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!googleUser) {
      toast({
        title: "Error",
        description: "Please sign in with Google first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.storeName || !formData.username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const sellerData = {
        googleId: googleUser.uid,
        email: googleUser.email,
        firstName: googleUser.displayName?.split(' ')[0] || "",
        lastName: googleUser.displayName?.split(' ').slice(1).join(' ') || "",
        profileImageUrl: googleUser.photoURL,
        username: formData.username,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        role: "seller",
        isVerified: true,
      };

      const response = await apiRequest("POST", "/api/auth/register-seller", sellerData);
      
      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your seller account has been created successfully!",
        });
        
        // Wait a moment then redirect
        setTimeout(() => {
          setLocation("/admin");
        }, 1500);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to create seller account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-3xl text-center text-glow">
                🚀 Become a Seller
              </CardTitle>
              <p className="text-center text-gray-400">
                Join Phantoms Corporation and start selling your digital products
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!googleUser ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-[#1A1A2E]/50 to-[#0A0A0A]/50 p-6 rounded-xl border border-[#00FFFF]/20">
                    <h3 className="text-xl font-semibold mb-3 text-[#00FFFF]">
                      Step 1: Google Authentication
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Sign in with your Google account to get started
                    </p>
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3"
                    >
                      <i className="fab fa-google mr-3"></i>
                      {isLoading ? "Signing in..." : "Sign in with Google"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/20 to-green-700/20 p-4 rounded-xl border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <img
                        src={googleUser.photoURL}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-green-400">Google Account Connected</h4>
                        <p className="text-sm text-gray-400">{googleUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Username *</label>
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter your username"
                        className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name *</label>
                      <Input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="Enter your store name"
                        className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Store Description</label>
                      <Textarea
                        value={formData.storeDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, storeDescription: e.target.value }))}
                        placeholder="Describe your store and products..."
                        className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] resize-none"
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#00FFFF] text-black font-bold py-3"
                    >
                      {isLoading ? "Creating Account..." : "Create Seller Account"}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}