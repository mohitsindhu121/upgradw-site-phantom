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
    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    };
    
    // Use setTimeout to ensure DOM is updated
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // Enhanced message formatting function
  const formatMessage = (text: string) => {
    // Split text into parts (code blocks, links, regular text)
    const parts = [];
    let currentIndex = 0;
    
    // First, handle code blocks (```code```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        parts.push({
          type: 'text',
          content: text.slice(currentIndex, match.index)
        });
      }
      
      // Add code block
      parts.push({
        type: 'codeblock',
        language: match[1] || 'text',
        content: match[2].trim()
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(currentIndex)
      });
    }
    
    // If no code blocks found, treat as regular text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: text
      });
    }
    
    return parts.map((part, index) => {
      if (part.type === 'codeblock') {
        return (
          <div key={index} className="my-3 relative">
            <div className="bg-[#0A0A0A] border border-[#8B5CF6]/30 rounded-lg overflow-hidden">
              <div className="bg-[#1A1A2E] px-3 py-2 text-xs text-[#00FFFF] flex items-center justify-between border-b border-[#8B5CF6]/20">
                <span className="font-mono">{part.language}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(part.content);
                    // Could add toast notification here
                  }}
                >
                  <i className="fas fa-copy mr-1"></i>
                  Copy
                </Button>
              </div>
              <pre className="p-3 text-sm text-gray-300 overflow-x-auto">
                <code className="font-mono">{part.content}</code>
              </pre>
            </div>
          </div>
        );
      } else {
        // Handle inline code and links in regular text
        const textContent = part.content;
        
        // Handle inline code (`code`)
        const inlineCodeRegex = /`([^`]+)`/g;
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        
        let formattedText = textContent;
        
        // Replace inline code
        formattedText = formattedText.replace(inlineCodeRegex, '<code class="bg-[#1A1A2E] text-[#00FFFF] px-1 py-0.5 rounded text-sm font-mono">$1</code>');
        
        // Replace links
        formattedText = formattedText.replace(linkRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#00FFFF] hover:text-[#8B5CF6] underline transition-colors">$1</a>');
        
        return (
          <div 
            key={index} 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userText = message.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      console.log("Sending message to AI:", userText);
      
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("AI response received:", data);

      if (data.response) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
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
                      Phantoms Corporation
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
                        className={`max-w-[85%] p-3 rounded-lg text-sm ${
                          msg.isUser
                            ? "bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] text-white"
                            : "bg-[#1A1A2E]/80 text-gray-300 border border-[#8B5CF6]/30"
                        }`}
                      >
                        <div className="leading-relaxed">
                          {msg.isUser ? (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          ) : (
                            <div className="space-y-2">
                              {formatMessage(msg.text)}
                            </div>
                          )}
                        </div>
                        <p className="text-xs opacity-70 mt-2 pt-2 border-t border-white/10">
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