import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/1234567890?text=${encodedMessage}`, '_blank');
      setMessage("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-[1000] animate-float">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full glow-effect transition-all hover:scale-110 p-0"
        >
          <i className="fab fa-whatsapp text-2xl text-white"></i>
        </Button>
      </div>

      {/* WhatsApp Popup */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 glow-effect z-[1000] product-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fab fa-whatsapp text-white"></i>
                </div>
                <div>
                  <div className="font-semibold text-white">Mohit Corporation</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-[#0A0A0A] rounded-lg p-3">
              <p className="text-sm text-gray-300">
                Hi! How can we help you with our gaming products today?
              </p>
            </div>
            
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-[#0A0A0A] border-[#00FFFF]/30 focus:border-[#00FFFF] resize-none"
              rows={3}
            />
            
            <Button
              onClick={handleSendMessage}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              disabled={!message.trim()}
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Send Message
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
