import { useEffect, useRef } from "react";

declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function ParticlesBackground() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initParticles = () => {
      if (typeof window !== 'undefined' && window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: { 
              value: 150, 
              density: { enable: true, value_area: 800 } 
            },
            color: { 
              value: ['#00FFFF', '#8B5CF6', '#10B981', '#F59E0B'] 
            },
            shape: { 
              type: ['circle', 'triangle', 'edge'],
              stroke: { width: 1, color: '#00FFFF' }
            },
            opacity: { 
              value: 0.7, 
              random: true,
              anim: { enable: true, speed: 1.5, opacity_min: 0.1 }
            },
            size: { 
              value: 5, 
              random: true,
              anim: { enable: true, speed: 3, size_min: 0.5 }
            },
            line_linked: { 
              enable: true, 
              distance: 150, 
              color: '#00FFFF', 
              opacity: 0.4, 
              width: 2 
            },
            move: { 
              enable: true, 
              speed: 4, 
              direction: 'none', 
              random: true, 
              straight: false, 
              out_mode: 'out', 
              bounce: false,
              attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'grab' },
              onclick: { enable: true, mode: 'push' },
              resize: true
            },
            modes: {
              grab: { distance: 250, line_linked: { opacity: 1 } },
              push: { particles_nb: 6 },
              repulse: { distance: 120, duration: 0.4 }
            }
          },
          retina_detect: true
        });
      }
    };

    // Multiple attempts to initialize particles
    const timer1 = setTimeout(initParticles, 100);
    const timer2 = setTimeout(initParticles, 500);
    const timer3 = setTimeout(initParticles, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      {/* Main particles container */}
      <div 
        id="particles-js"
        ref={particlesRef}
        className="fixed inset-0 z-[-1] bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A]"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* CSS fallback animation */}
      <div className="particle-fallback cyber-grid"></div>
      
      {/* Additional animated background elements */}
      <div className="fixed inset-0 z-[-2] opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse-glow"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-[#8B5CF6] rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-[#F59E0B] rounded-full animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-[#00FFFF] rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-float"></div>
      </div>
    </>
  );
}
