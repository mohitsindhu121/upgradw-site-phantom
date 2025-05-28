export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {/* Main animated background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000814] via-[#001D3D] to-[#000814]" />
      
      {/* Animated particle rain effect */}
      <div className="absolute inset-0">
        {/* Top row of falling particles */}
        <div className="particle particle-cyan" style={{ left: '5%', animationDelay: '0s' }}></div>
        <div className="particle particle-purple" style={{ left: '15%', animationDelay: '2s' }}></div>
        <div className="particle particle-green" style={{ left: '25%', animationDelay: '4s' }}></div>
        <div className="particle particle-orange" style={{ left: '35%', animationDelay: '1s' }}></div>
        <div className="particle particle-cyan" style={{ left: '45%', animationDelay: '3s' }}></div>
        <div className="particle particle-purple" style={{ left: '55%', animationDelay: '5s' }}></div>
        <div className="particle particle-green" style={{ left: '65%', animationDelay: '2.5s' }}></div>
        <div className="particle particle-orange" style={{ left: '75%', animationDelay: '0.5s' }}></div>
        <div className="particle particle-cyan" style={{ left: '85%', animationDelay: '4.5s' }}></div>
        <div className="particle particle-purple" style={{ left: '95%', animationDelay: '1.5s' }}></div>
        
        {/* Second row with different timing */}
        <div className="particle particle-green" style={{ left: '10%', animationDelay: '6s' }}></div>
        <div className="particle particle-orange" style={{ left: '20%', animationDelay: '7s' }}></div>
        <div className="particle particle-cyan" style={{ left: '30%', animationDelay: '8s' }}></div>
        <div className="particle particle-purple" style={{ left: '40%', animationDelay: '6.5s' }}></div>
        <div className="particle particle-green" style={{ left: '50%', animationDelay: '7.5s' }}></div>
        <div className="particle particle-orange" style={{ left: '60%', animationDelay: '8.5s' }}></div>
        <div className="particle particle-cyan" style={{ left: '70%', animationDelay: '9s' }}></div>
        <div className="particle particle-purple" style={{ left: '80%', animationDelay: '9.5s' }}></div>
        <div className="particle particle-green" style={{ left: '90%', animationDelay: '10s' }}></div>
        
        {/* Third row for denser effect */}
        <div className="particle particle-orange" style={{ left: '7%', animationDelay: '11s' }}></div>
        <div className="particle particle-cyan" style={{ left: '17%', animationDelay: '12s' }}></div>
        <div className="particle particle-purple" style={{ left: '27%', animationDelay: '13s' }}></div>
        <div className="particle particle-green" style={{ left: '37%', animationDelay: '11.5s' }}></div>
        <div className="particle particle-orange" style={{ left: '47%', animationDelay: '12.5s' }}></div>
        <div className="particle particle-cyan" style={{ left: '57%', animationDelay: '13.5s' }}></div>
        <div className="particle particle-purple" style={{ left: '67%', animationDelay: '14s' }}></div>
        <div className="particle particle-green" style={{ left: '77%', animationDelay: '14.5s' }}></div>
        <div className="particle particle-orange" style={{ left: '87%', animationDelay: '15s' }}></div>
        <div className="particle particle-cyan" style={{ left: '97%', animationDelay: '15.5s' }}></div>
      </div>
      
      {/* Cyber grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>
      
      {/* Large floating orbs */}
      <div className="floating-orb floating-orb-cyan" style={{ top: '20%', left: '20%', animationDelay: '0s' }}></div>
      <div className="floating-orb floating-orb-purple" style={{ top: '60%', left: '70%', animationDelay: '3s' }}></div>
      <div className="floating-orb floating-orb-green" style={{ top: '40%', left: '10%', animationDelay: '6s' }}></div>
      <div className="floating-orb floating-orb-orange" style={{ top: '80%', left: '80%', animationDelay: '9s' }}></div>
    </div>
  );
}
