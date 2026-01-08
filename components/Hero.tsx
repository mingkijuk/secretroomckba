
import React from 'react';

interface HeroProps {
  onReportClick: () => void;
  onStatusClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onReportClick, onStatusClick }) => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/122/1600/900" 
          alt="Security Base" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]"></div>
        <div className="scanline"></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl px-4">
        <div className="inline-block px-3 py-1 bg-red-950/50 border border-red-500/30 text-red-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 animate-pulse">
          Confidential - Level 4 Access Required
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
          보이지 않는 위협으로부터<br/>
          <span className="text-red-700">대한민국</span>을 수호합니다.
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          중앙괴이관리국(CKBA)은 초자연적 현상과 미확인 생명체로부터 
          국가 안보를 지키는 행정안전부 산하의 최첨단 특수 관리 기관입니다.
        </p>
        
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-3xl mx-auto">
          {/* 제보 버튼 - 시민용 */}
          <button 
            onClick={onReportClick}
            className="group relative flex-1 px-8 py-6 bg-white text-black font-black rounded-sm hover:bg-red-600 hover:text-white transition-all overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-red-600 group-hover:text-white/80 font-mono tracking-widest mb-1">CITIZEN SERVICE</span>
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping group-hover:bg-white"></span>
                <span className="text-xl">괴이 긴급 제보</span>
              </div>
            </div>
          </button>

          {/* 현황 버튼 - 정보용 */}
          <button 
            onClick={onStatusClick}
            className="group flex-1 px-8 py-6 border border-slate-700 text-slate-300 font-black rounded-sm hover:bg-slate-800 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">REAL-TIME DATA</span>
              <span className="text-xl">전국 괴이 현황</span>
            </div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 flex flex-col space-y-2 opacity-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">MAINFRAME: ONLINE</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">ALERT LEVEL: ELEVATED</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
