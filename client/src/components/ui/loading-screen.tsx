import { useEffect, useState, useRef } from "react";

export default function LoadingScreen() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const bootSequence = [
    { text: "SYSTEM INITIALIZATION", duration: 800 },
    { text: "NEURAL NETWORK ACTIVATION", duration: 600 },
    { text: "QUANTUM PROCESSORS ONLINE", duration: 700 },
    { text: "HOLOGRAPHIC INTERFACE READY", duration: 500 },
    { text: "MOHIT CORPORATION ACTIVATED", duration: 1000 }
  ];

  useEffect(() => {
    // Create and play loading sound
    const createLoadingSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    let progressInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const runBootSequence = () => {
      // Play sound
      try {
        createLoadingSound();
      } catch (error) {
        console.log("Audio context not available");
      }

      // Progress bar animation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsComplete(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      // Phase progression
      const runPhase = (index: number) => {
        if (index < bootSequence.length) {
          setCurrentPhase(index);
          phaseTimeout = setTimeout(() => {
            runPhase(index + 1);
          }, bootSequence[index].duration);
        }
      };

      runPhase(0);
    };

    runBootSequence();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00FFFF] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main loading interface */}
      <div className="relative text-center max-w-md mx-4">
        {/* Logo with advanced glow effect */}
        <div className="relative mb-12">
          <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#00FFFF] to-[#8B5CF6] animate-pulse">
            MOHIT
          </div>
          <div className="text-lg md:text-xl font-light text-[#00FFFF] mt-2 tracking-[0.3em]">
            CORPORATION
          </div>
          
          {/* Holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent animate-ping" />
        </div>

        {/* Boot sequence */}
        <div className="mb-8 space-y-3">
          {bootSequence.map((phase, index) => (
            <div
              key={index}
              className={`text-sm md:text-base transition-all duration-500 ${
                index <= currentPhase 
                  ? 'opacity-100 text-[#00FFFF] scale-100' 
                  : 'opacity-30 text-gray-500 scale-95'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {index === currentPhase && (
                  <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse" />
                )}
                <span className="font-mono tracking-wider">{phase.text}</span>
                {index < currentPhase && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Advanced progress bar */}
        <div className="relative">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-[#00FFFF]/30">
            <div 
              className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#00FFFF] to-[#8B5CF6] rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="mt-3 text-[#00FFFF] font-mono text-sm">
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Completion animation */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl text-green-500 font-bold animate-bounce">
              ✓ READY
            </div>
          </div>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#00FFFF]/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#00FFFF]/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#00FFFF]/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#00FFFF]/50" />
    </div>
  );
}
