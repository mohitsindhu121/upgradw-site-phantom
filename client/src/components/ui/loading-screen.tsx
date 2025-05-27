import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  
  const bootLines = [
    "INITIALIZING SYSTEM...",
    "LOADING MODULES...",
    "CONNECTING TO DATABASE...",
    "AUTHENTICATING USER...",
    "SYSTEM READY"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < bootLines.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#1A1A2E]">
      <div className="text-center">
        <div className="text-4xl font-orbitron text-glow mb-8 animate-pulse-glow">
          MOHIT CORPORATION
        </div>
        
        <div className="system-boot text-sm mb-4 space-y-2">
          {bootLines.map((line, index) => (
            <div
              key={index}
              className={`transition-opacity duration-300 ${
                index <= currentLine ? 'opacity-100 text-[#00FFFF]' : 'opacity-30'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
        
        <div className="loading-bar h-2 w-64 mx-auto rounded-full"></div>
      </div>
    </div>
  );
}
