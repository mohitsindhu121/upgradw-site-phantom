import { useEffect, useRef } from "react";

declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function ParticlesBackground() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { 
            value: 80, 
            density: { enable: true, value_area: 800 } 
          },
          color: { 
            value: ['#00FFFF', '#8B5CF6', '#10B981'] 
          },
          shape: { 
            type: 'circle' 
          },
          opacity: { 
            value: 0.5, 
            random: true 
          },
          size: { 
            value: 3, 
            random: true 
          },
          line_linked: { 
            enable: true, 
            distance: 150, 
            color: '#00FFFF', 
            opacity: 0.2, 
            width: 1 
          },
          move: { 
            enable: true, 
            speed: 2, 
            direction: 'none', 
            random: false, 
            straight: false, 
            out_mode: 'out', 
            bounce: false 
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }, []);

  return (
    <div 
      id="particles-js"
      ref={particlesRef}
      className="fixed inset-0 z-[-1]"
      style={{ pointerEvents: 'none' }}
    />
  );
}
