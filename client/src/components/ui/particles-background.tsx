export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main animated background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000814] via-[#001D3D] to-[#000814]" />
      
      {/* Enhanced particle rain effect with blue particles */}
      <div className="absolute inset-0">
        {/* Blue particles - main focus */}
        <div className="particle particle-blue" style={{ left: '8%', animationDelay: '0s' }}></div>
        <div className="particle particle-blue" style={{ left: '18%', animationDelay: '1s' }}></div>
        <div className="particle particle-blue" style={{ left: '28%', animationDelay: '2s' }}></div>
        <div className="particle particle-blue" style={{ left: '38%', animationDelay: '0.5s' }}></div>
        <div className="particle particle-blue" style={{ left: '48%', animationDelay: '1.5s' }}></div>
        <div className="particle particle-blue" style={{ left: '58%', animationDelay: '2.5s' }}></div>
        <div className="particle particle-blue" style={{ left: '68%', animationDelay: '3s' }}></div>
        <div className="particle particle-blue" style={{ left: '78%', animationDelay: '3.5s' }}></div>
        <div className="particle particle-blue" style={{ left: '88%', animationDelay: '4s' }}></div>
        
        {/* Cyan particles */}
        <div className="particle particle-cyan" style={{ left: '5%', animationDelay: '0s' }}></div>
        <div className="particle particle-cyan" style={{ left: '25%', animationDelay: '4s' }}></div>
        <div className="particle particle-cyan" style={{ left: '45%', animationDelay: '3s' }}></div>
        <div className="particle particle-cyan" style={{ left: '65%', animationDelay: '2.5s' }}></div>
        <div className="particle particle-cyan" style={{ left: '85%', animationDelay: '4.5s' }}></div>
        
        {/* Purple particles */}
        <div className="particle particle-purple" style={{ left: '15%', animationDelay: '2s' }}></div>
        <div className="particle particle-purple" style={{ left: '35%', animationDelay: '1s' }}></div>
        <div className="particle particle-purple" style={{ left: '55%', animationDelay: '5s' }}></div>
        <div className="particle particle-purple" style={{ left: '75%', animationDelay: '0.5s' }}></div>
        <div className="particle particle-purple" style={{ left: '95%', animationDelay: '1.5s' }}></div>
        
        {/* Second layer of blue particles */}
        <div className="particle particle-blue" style={{ left: '12%', animationDelay: '6s' }}></div>
        <div className="particle particle-blue" style={{ left: '32%', animationDelay: '7s' }}></div>
        <div className="particle particle-blue" style={{ left: '52%', animationDelay: '8s' }}></div>
        <div className="particle particle-blue" style={{ left: '72%', animationDelay: '6.5s' }}></div>
        <div className="particle particle-blue" style={{ left: '92%', animationDelay: '7.5s' }}></div>
        
        {/* More cyan and other color particles */}
        <div className="particle particle-cyan" style={{ left: '10%', animationDelay: '6s' }}></div>
        <div className="particle particle-green" style={{ left: '20%', animationDelay: '7s' }}></div>
        <div className="particle particle-cyan" style={{ left: '30%', animationDelay: '8s' }}></div>
        <div className="particle particle-purple" style={{ left: '40%', animationDelay: '6.5s' }}></div>
        <div className="particle particle-green" style={{ left: '50%', animationDelay: '7.5s' }}></div>
        <div className="particle particle-orange" style={{ left: '60%', animationDelay: '8.5s' }}></div>
        <div className="particle particle-cyan" style={{ left: '70%', animationDelay: '9s' }}></div>
        <div className="particle particle-purple" style={{ left: '80%', animationDelay: '9.5s' }}></div>
        <div className="particle particle-green" style={{ left: '90%', animationDelay: '10s' }}></div>
      </div>
      
      {/* Enhanced cyber grid overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(0, 100, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 100, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'grid-move 15s linear infinite'
        }}></div>
      </div>
      
      {/* Enhanced floating orbs with blue */}
      <div className="floating-orb floating-orb-blue" style={{ top: '15%', left: '15%', animationDelay: '0s' }}></div>
      <div className="floating-orb floating-orb-cyan" style={{ top: '25%', left: '75%', animationDelay: '2s' }}></div>
      <div className="floating-orb floating-orb-blue" style={{ top: '45%', left: '85%', animationDelay: '4s' }}></div>
      <div className="floating-orb floating-orb-purple" style={{ top: '65%', left: '25%', animationDelay: '6s' }}></div>
      <div className="floating-orb floating-orb-blue" style={{ top: '75%', left: '65%', animationDelay: '8s' }}></div>
      <div className="floating-orb floating-orb-cyan" style={{ top: '35%', left: '45%', animationDelay: '10s' }}></div>
    </div>
  );
}
