import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#00FFFF]/30 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-orbitron text-2xl font-bold text-glow mb-4">
              MOHIT CORPORATION
            </div>
            <p className="text-gray-400">
              Leading provider of gaming solutions, digital products, and automation tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-4 text-[#00FFFF]">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/">
                <a className="block text-gray-400 hover:text-[#00FFFF] transition-colors">Home</a>
              </Link>
              <Link href="/products">
                <a className="block text-gray-400 hover:text-[#00FFFF] transition-colors">Products</a>
              </Link>
              <Link href="/youtube">
                <a className="block text-gray-400 hover:text-[#00FFFF] transition-colors">YouTube</a>
              </Link>
              <Link href="/contact">
                <a className="block text-gray-400 hover:text-[#00FFFF] transition-colors">Contact</a>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-orbitron font-bold mb-4 text-[#00FFFF]">System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-[#10B981]">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Users:</span>
                <span className="text-[#F59E0B]">2.5K+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Support:</span>
                <span className="text-[#00FFFF]">24/7</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#00FFFF]/30 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 Mohit Corporation. All rights reserved. | Powered by Advanced Gaming Technology
          </p>
        </div>
      </div>
    </footer>
  );
}
