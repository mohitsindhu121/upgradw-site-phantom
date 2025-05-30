import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    businessType: "Individual",
    gstNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
    specialization: "",
    experience: "",
    portfolio: "",
    socialMediaLinks: "",
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
      const googleUser = await signInWithGoogle();
      
      // Check if user already exists
      const response = await apiRequest("POST", "/api/auth/google-login", {
        googleId: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL
      });

      const data = await response.json();

      if (data.userExists) {
        toast({
          title: "Account Already Exists!",
          description: "You already have a seller account. Redirecting to admin panel...",
        });
        setTimeout(() => {
          setLocation("/admin");
        }, 2000);
      } else {
        toast({
          title: "Google Connected Successfully",
          description: "Now complete your seller profile below to create your account.",
        });
      }
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

    if (!formData.storeName || !formData.username || !formData.phoneNumber || !formData.city || !formData.specialization) {
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
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        bankAccountNumber: formData.bankAccountNumber,
        bankIfscCode: formData.bankIfscCode,
        bankName: formData.bankName,
        specialization: formData.specialization,
        experience: formData.experience,
        portfolio: formData.portfolio,
        socialMediaLinks: formData.socialMediaLinks,
        role: "seller",
        isVerified: true,
      };

      const response = await apiRequest("POST", "/api/auth/register-seller", sellerData);
      
      if (response.ok) {
        // Import queryClient for cache invalidation
        const { queryClient } = await import("@/lib/queryClient");
        
        // Invalidate auth cache to refresh authentication state
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
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
        <div className="max-w-4xl mx-auto">
          <Card className="glow-effect">
            <CardHeader>
              <CardTitle className="font-orbitron text-3xl text-center text-glow">
                🚀 Become a Professional Seller
              </CardTitle>
              <p className="text-center text-gray-400 text-lg">
                Join Phantoms Corporation and start selling your digital products with comprehensive seller profile
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!googleUser ? (
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-[#1A1A2E]/50 to-[#0A0A0A]/50 p-8 rounded-xl border border-[#00FFFF]/20">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-[#00FFFF]">
                        Step 1: Connect Your Google Account
                      </h3>
                      <p className="text-gray-300 mb-6 text-lg">
                        Secure your seller account with Google authentication
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-10 py-4 text-lg font-semibold"
                    >
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isLoading ? "Connecting..." : "Connect with Google"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-900/20 to-green-700/20 p-6 rounded-xl border border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={googleUser.photoURL}
                          alt="Profile"
                          className="w-16 h-16 rounded-full border-2 border-green-400"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-green-400">✓ Google Account Connected</h4>
                          <p className="text-gray-400">{googleUser.email}</p>
                          <p className="text-sm text-green-300">{googleUser.displayName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#1A1A2E]/50 to-[#0A0A0A]/50 p-6 rounded-xl border border-[#8B5CF6]/20">
                    <h3 className="text-xl font-semibold mb-4 text-[#8B5CF6] flex items-center">
                      <span className="w-8 h-8 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Complete Your Professional Seller Profile
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Fill in all details to create your comprehensive seller account
                    </p>

                    <Tabs defaultValue="basic" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4 bg-[#1A1A2E]">
                        <TabsTrigger value="basic" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
                          Contact Details
                        </TabsTrigger>
                        <TabsTrigger value="business" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
                          Business Info
                        </TabsTrigger>
                        <TabsTrigger value="professional" className="data-[state=active]:bg-[#00FFFF] data-[state=active]:text-black">
                          Professional
                        </TabsTrigger>
                      </TabsList>

                      <form onSubmit={handleSubmit}>
                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="username">Username *</Label>
                              <Input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                placeholder="Enter your username"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="storeName">Store Name *</Label>
                              <Input
                                id="storeName"
                                type="text"
                                value={formData.storeName}
                                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                                placeholder="Enter your store name"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="storeDescription">Store Description</Label>
                            <Textarea
                              id="storeDescription"
                              value={formData.storeDescription}
                              onChange={(e) => setFormData(prev => ({ ...prev, storeDescription: e.target.value }))}
                              placeholder="Describe your store and what you offer..."
                              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] min-h-[120px]"
                              rows={4}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phoneNumber">Phone Number *</Label>
                              <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                placeholder="+91 98765 43210"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="Enter your city"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address">Full Address</Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="Enter your complete address"
                              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="e.g., Maharashtra"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                                <SelectTrigger className="bg-[#0A0A0A] border-[#00FFFF]/30">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="USA">USA</SelectItem>
                                  <SelectItem value="UK">UK</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="pincode">Pincode</Label>
                              <Input
                                id="pincode"
                                type="text"
                                value={formData.pincode}
                                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                placeholder="400001"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="business" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="businessType">Business Type</Label>
                              <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                                <SelectTrigger className="bg-[#0A0A0A] border-[#00FFFF]/30">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Individual">Individual</SelectItem>
                                  <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                                  <SelectItem value="Partnership">Partnership</SelectItem>
                                  <SelectItem value="Private Limited">Private Limited</SelectItem>
                                  <SelectItem value="LLP">LLP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="gstNumber">GST Number</Label>
                              <Input
                                id="gstNumber"
                                type="text"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                                placeholder="22AAAAA0000A1Z5"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="panNumber">PAN Number</Label>
                            <Input
                              id="panNumber"
                              type="text"
                              value={formData.panNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value }))}
                              placeholder="ABCTY1234D"
                              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Input
                                id="bankName"
                                type="text"
                                value={formData.bankName}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                                placeholder="e.g., HDFC Bank"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bankAccountNumber">Account Number</Label>
                              <Input
                                id="bankAccountNumber"
                                type="text"
                                value={formData.bankAccountNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                                placeholder="Account number"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bankIfscCode">IFSC Code</Label>
                              <Input
                                id="bankIfscCode"
                                type="text"
                                value={formData.bankIfscCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankIfscCode: e.target.value }))}
                                placeholder="HDFC0000123"
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="professional" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="specialization">Specialization *</Label>
                              <Textarea
                                id="specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                placeholder="e.g., Web Development, Mobile Apps, Gaming Bots, Digital Marketing..."
                                className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="experience">Years of Experience</Label>
                              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                                <SelectTrigger className="bg-[#0A0A0A] border-[#00FFFF]/30">
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                                  <SelectItem value="5-10 years">5-10 years</SelectItem>
                                  <SelectItem value="10+ years">10+ years</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="portfolio">Portfolio/Previous Work</Label>
                            <Textarea
                              id="portfolio"
                              value={formData.portfolio}
                              onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                              placeholder="Share links to your previous work, GitHub, websites you've built, etc."
                              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="socialMediaLinks">Social Media Links</Label>
                            <Textarea
                              id="socialMediaLinks"
                              value={formData.socialMediaLinks}
                              onChange={(e) => setFormData(prev => ({ ...prev, socialMediaLinks: e.target.value }))}
                              placeholder="Instagram: @yourhandle, YouTube: youtube.com/c/yourchannel, LinkedIn: linkedin.com/in/yourprofile"
                              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF]"
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <div className="mt-6">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#00FFFF] text-black font-bold py-3"
                          >
                            {isLoading ? "Creating Account..." : "Create Professional Seller Account"}
                          </Button>
                        </div>
                      </form>
                    </Tabs>
                  </div>
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