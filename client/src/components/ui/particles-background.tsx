export default function ParticlesBackground() {
  return (
    <>
      {/* Main animated background with gradient */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A]" />
      
      {/* Cyber grid overlay */}
      <div className="fixed inset-0 z-[-1] cyber-grid opacity-30" />
      
      {/* Large floating particles */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        {/* Cyan particles */}
        <div className="absolute top-[10%] left-[10%] w-3 h-3 bg-[#00FFFF] rounded-full opacity-60 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-[30%] left-[80%] w-2 h-2 bg-[#00FFFF] rounded-full opacity-40 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        <div className="absolute top-[70%] left-[20%] w-4 h-4 bg-[#00FFFF] rounded-full opacity-50 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute top-[50%] left-[60%] w-2 h-2 bg-[#00FFFF] rounded-full opacity-30 animate-float" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        
        {/* Purple particles */}
        <div className="absolute top-[20%] left-[70%] w-3 h-3 bg-[#8B5CF6] rounded-full opacity-50 animate-pulse-glow" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
        <div className="absolute top-[80%] left-[40%] w-2 h-2 bg-[#8B5CF6] rounded-full opacity-40 animate-pulse-glow" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
        <div className="absolute top-[40%] left-[90%] w-3 h-3 bg-[#8B5CF6] rounded-full opacity-60 animate-pulse-glow" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
        
        {/* Green particles */}
        <div className="absolute top-[60%] left-[10%] w-2 h-2 bg-[#10B981] rounded-full opacity-50 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        <div className="absolute top-[15%] left-[50%] w-3 h-3 bg-[#10B981] rounded-full opacity-40 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute top-[85%] left-[70%] w-2 h-2 bg-[#10B981] rounded-full opacity-60 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        
        {/* Orange particles */}
        <div className="absolute top-[35%] left-[30%] w-2 h-2 bg-[#F59E0B] rounded-full opacity-40 animate-pulse-glow" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
        <div className="absolute top-[75%] left-[85%] w-3 h-3 bg-[#F59E0B] rounded-full opacity-50 animate-pulse-glow" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
        
        {/* Small scattered particles */}
        <div className="absolute top-[25%] left-[25%] w-1 h-1 bg-[#00FFFF] rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[45%] left-[75%] w-1 h-1 bg-[#8B5CF6] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[65%] left-[55%] w-1 h-1 bg-[#10B981] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[85%] left-[15%] w-1 h-1 bg-[#F59E0B] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[5%] left-[95%] w-1 h-1 bg-[#00FFFF] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[55%] left-[5%] w-1 h-1 bg-[#8B5CF6] rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Moving line connections */}
        <div className="absolute top-[20%] left-[20%] w-32 h-[1px] bg-gradient-to-r from-[#00FFFF] to-transparent opacity-30 animate-pulse" style={{ transform: 'rotate(45deg)', animationDelay: '0s' }}></div>
        <div className="absolute top-[60%] left-[70%] w-24 h-[1px] bg-gradient-to-r from-[#8B5CF6] to-transparent opacity-20 animate-pulse" style={{ transform: 'rotate(-30deg)', animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-28 h-[1px] bg-gradient-to-r from-[#10B981] to-transparent opacity-25 animate-pulse" style={{ transform: 'rotate(60deg)', animationDelay: '1s' }}></div>
      </div>
      
      {/* Animated background pattern */}
      <div className="particle-fallback opacity-20"></div>
    </>
  );
}
