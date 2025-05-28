import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "YouTube", href: "/youtube" },
    { name: "Contact", href: "/contact" },
  ];

  const adminNavigation = [
    ...navigation,
    { name: "Admin", href: "/admin" },
  ];

  const currentNavigation = isAuthenticated ? adminNavigation : navigation;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#00FFFF]/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="font-orbitron text-xl md:text-2xl font-bold text-glow cursor-pointer">
              <span className="hidden sm:inline">MOHIT CORPORATION</span>
              <span className="sm:hidden">MOHIT CORP</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span 
                  className={`nav-link transition-colors cursor-pointer ${
                    location === item.href 
                      ? "text-[#00FFFF]" 
                      : "text-white hover:text-[#00FFFF]"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Welcome, {user?.firstName || 'Mohit'}
                </span>
                <Button
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  size="sm"
                  className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="cyber-button px-4 py-2">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-[#00FFFF]"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#00FFFF]/30 pt-4">
            {currentNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span 
                  className={`block py-2 transition-colors cursor-pointer ${
                    location === item.href 
                      ? "text-[#00FFFF]" 
                      : "text-white hover:text-[#00FFFF]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </span>
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-[#00FFFF]/30">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    Welcome, {user?.firstName || 'Mohit'}
                  </div>
                  <Button
                    onClick={() => window.location.href = '/api/logout'}
                    variant="outline"
                    size="sm"
                    className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="cyber-button w-full">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
