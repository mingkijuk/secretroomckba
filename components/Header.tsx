
import React from 'react';

interface HeaderProps {
  onGoHome: () => void;
  onLoginClick: () => void;
  onInfoClick: () => void;
  onArchiveClick: () => void;
  onEmergencyClick: () => void;
  onMissionClick: () => void;
  isLoggedIn: boolean;
  agentName: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onGoHome, 
  onLoginClick, 
  onInfoClick, 
  onArchiveClick, 
  onEmergencyClick,
  onMissionClick,
  isLoggedIn, 
  agentName, 
  onLogout 
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button 
          onClick={onGoHome}
          className="flex items-center space-x-6 hover:opacity-80 transition-all group"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-none stroke-current stroke-[2] opacity-20">
              <circle cx="50" cy="50" r="48" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-none stroke-current stroke-[3]">
                <path d="M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 Z" className="group-hover:stroke-[4] transition-all duration-300" />
                <circle cx="50" cy="50" r="5" className="fill-white" />
                <path d="M50 15 V35 M50 65 V85 M20 50 H40 M60 50 H80" className="stroke-[1.5]" />
              </svg>
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black tracking-[0.2em] text-white leading-none">중앙괴이관리국</h1>
            <div className="flex items-center mt-1.5">
              <p className="text-[8px] text-slate-500 font-mono tracking-[0.3em] uppercase leading-none font-bold">Central Korea Bureau of Anomalies</p>
            </div>
          </div>
        </button>
        
        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold text-slate-400 font-mono tracking-widest">
          <button onClick={onInfoClick} className="hover:text-white transition-colors py-2 uppercase">Information</button>
          <button onClick={onArchiveClick} className="hover:text-white transition-colors py-2 uppercase">Archive</button>
          
          {isLoggedIn && (
            <button 
              onClick={onMissionClick}
              className="relative px-8 py-3 bg-red-800 text-white font-black rounded-none transition-all uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(220,38,38,0.7)] group/mission overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-600 animate-pulse opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/mission:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 flex items-center">
                <span className="w-2.5 h-2.5 bg-white rounded-full mr-3 animate-ping shadow-[0_0_10px_white]"></span>
                작전 구역 진입 (MISSION)
              </span>
            </button>
          )}
          
          <div className="h-4 w-px bg-slate-800 mx-2"></div>
          
          <button onClick={onEmergencyClick} className="px-4 py-2 border border-red-600/50 hover:bg-red-600 hover:text-white text-red-500 text-[10px] font-black transition-all uppercase tracking-widest">Emergency</button>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-black uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>AGENT: {agentName}</span>
              </div>
              <button onClick={onLogout} className="text-slate-500 hover:text-white transition-colors uppercase text-[9px] font-bold">[Logout]</button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="px-4 py-2 bg-red-950/30 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-900/50 transition-all">LOGIN</button>
          )}
        </nav>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
};

export default Header;
