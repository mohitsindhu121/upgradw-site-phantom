import { useEffect, useState, useRef } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState(0);
  const [rings, setRings] = useState(0);
  const [hexGrid, setHexGrid] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Advanced sound synthesis
    const createAdvancedSound = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        // Sci-fi startup sound sequence
        const playTone = (freq: number, duration: number, delay: number, type: OscillatorType = 'sine') => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.type = type;
            filter.frequency.setValueAtTime(2000, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
          }, delay);
        };

        // Optimized sound sequence
        playTone(330, 0.4, 0, 'sawtooth');
        playTone(440, 0.3, 200, 'sine');
        playTone(550, 0.5, 400, 'triangle');
      } catch (error) {
        console.log("Audio not available");
      }
    };

    // Faster animation sequence
    const animationSequence = () => {
      createAdvancedSound();
      
      setTimeout(() => setPhase(1), 200);
      setTimeout(() => setRings(1), 400);
      setTimeout(() => setPhase(2), 600);
      setTimeout(() => setRings(2), 800);
      setTimeout(() => setHexGrid(true), 1000);
      setTimeout(() => setPhase(3), 1200);
      setTimeout(() => setRings(3), 1400);
      setTimeout(() => setPhase(4), 1600);
    };

    animationSequence();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] overflow-hidden">
      {/* Matrix rain effect */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 bg-gradient-to-b from-[#00FFFF] via-[#8B5CF6] to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${20 + Math.random() * 40}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-[#00FFFF]/40 to-transparent animate-pulse"
            style={{
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Central loading interface */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Hexagonal grid background */}
          {hexGrid && (
            <div className="absolute inset-0 -m-32">
              <svg className="w-64 h-64 animate-spin" style={{animationDuration: '20s'}}>
                {[...Array(12)].map((_, i) => (
                  <polygon
                    key={i}
                    points="30,5 50,15 50,35 30,45 10,35 10,15"
                    fill="none"
                    stroke="#00FFFF"
                    strokeWidth="0.5"
                    opacity="0.3"
                    transform={`translate(${i * 20}, ${(i % 3) * 20}) scale(${1 + Math.sin(i) * 0.2})`}
                    className="animate-pulse"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Rotating rings */}
          {[...Array(rings + 1)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-[#8B5CF6] via-[#00FFFF] to-[#8B5CF6] animate-spin"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                margin: `${-(i + 1) * 40}px`,
                animationDuration: `${3 + i}s`,
                animationDirection: i % 2 ? 'reverse' : 'normal',
                borderColor: i % 2 ? '#00FFFF' : '#8B5CF6',
                opacity: 0.7 - i * 0.2
              }}
            />
          ))}

          {/* Center logo with phase animations */}
          <div className="relative z-10 text-center">
            <div className={`transition-all duration-1000 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#00FFFF] to-[#8B5CF6] animate-pulse">
                M
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${phase >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <div className="text-2xl md:text-3xl font-light text-[#00FFFF] tracking-[0.5em] mt-4">
                OHIT
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-600 ${phase >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <div className="text-lg md:text-xl text-[#8B5CF6] tracking-[0.3em] mt-2">
                CORPORATION
              </div>
            </div>

            {/* Energy pulse effect */}
            {phase >= 4 && (
              <div className="absolute inset-0 -m-20">
                <div className="w-full h-full rounded-full bg-gradient-radial from-[#00FFFF]/20 via-[#8B5CF6]/10 to-transparent animate-ping" />
                <div className="absolute inset-4 rounded-full bg-gradient-radial from-[#8B5CF6]/20 via-[#00FFFF]/10 to-transparent animate-ping animation-delay-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scanning lines */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent animate-pulse"
            style={{
              top: `${20 + i * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Corner UI elements */}
      <div className="absolute top-6 left-6">
        <div className="w-16 h-16 border-l-2 border-t-2 border-[#00FFFF]/60" />
        <div className="w-4 h-4 bg-[#00FFFF] rounded-full mt-2 animate-pulse" />
      </div>
      <div className="absolute top-6 right-6">
        <div className="w-16 h-16 border-r-2 border-t-2 border-[#8B5CF6]/60" />
        <div className="w-4 h-4 bg-[#8B5CF6] rounded-full mt-2 ml-12 animate-pulse" />
      </div>
      <div className="absolute bottom-6 left-6">
        <div className="w-16 h-16 border-l-2 border-b-2 border-[#00FFFF]/60" />
        <div className="w-4 h-4 bg-[#00FFFF] rounded-full -mt-2 animate-pulse" />
      </div>
      <div className="absolute bottom-6 right-6">
        <div className="w-16 h-16 border-r-2 border-b-2 border-[#8B5CF6]/60" />
        <div className="w-4 h-4 bg-[#8B5CF6] rounded-full -mt-2 ml-12 animate-pulse" />
      </div>
    </div>
  );
}
