import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant from Mohit Corporation. How can I help you with our gaming products today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai-chat", {
        message: userMessage.text,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: (response as any).response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact us directly!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-[1000] animate-float">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#8B5CF6] w-16 h-16 rounded-full glow-effect transition-all hover:scale-110 p-0 border-2 border-[#00FFFF]/50"
        >
          <i className="fas fa-robot text-2xl text-white animate-pulse"></i>
        </Button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[1000] w-96 max-w-[calc(100vw-3rem)]">
          <Card className="bg-gradient-to-br from-[#0A0A0A]/98 via-[#1A1A2E]/95 to-[#0A0A0A]/98 border-2 border-[#8B5CF6]/40 backdrop-blur-xl shadow-2xl shadow-[#8B5CF6]/20 animate-in slide-in-from-bottom-8 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] flex items-center justify-center">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-[#00FFFF] text-lg">
                      Mohit Corporation
                    </h3>
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {/* Messages */}
              <ScrollArea className="h-80 mb-4 pr-2" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.isUser
                            ? "bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] text-white"
                            : "bg-[#1A1A2E]/80 text-gray-300 border border-[#8B5CF6]/30"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#1A1A2E]/80 border border-[#8B5CF6]/30 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-xs text-gray-400">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="bg-[#0A0A0A] border-[#8B5CF6]/30 focus:border-[#00FFFF] text-white resize-none min-h-[40px] max-h-[100px]"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#8B5CF6] px-4 self-end"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}