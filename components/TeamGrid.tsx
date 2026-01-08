
import React from 'react';
import { TEAMS } from '../constants';
import { TeamInfo } from '../types';

interface TeamGridProps {
  onSelectTeam: (team: TeamInfo) => void;
}

const TeamIcon = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case 'ckrr':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="9" className="opacity-30" />
          <path d="M12 3v18M3 12h18" strokeLinecap="square" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'research':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      );
    case 'office':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="1" />
          <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" className="opacity-60" />
        </svg>
      );
    case 'cleanup':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="2" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

const TeamGrid: React.FC<TeamGridProps> = ({ onSelectTeam }) => {
  return (
    <section className="py-20">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl font-black text-white mb-2 tracking-[0.3em] uppercase">조직 및 기능</h2>
        <div className="h-[2px] w-16 bg-white/20"></div>
        <p className="mt-4 text-slate-400 text-center max-w-2xl text-xs font-medium tracking-wider leading-relaxed">
          중앙괴이관리국은 효율적인 격리와 현장 대응을 위해 4개의 핵심 부서를 유기적으로 운영하고 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAMS.map((team) => (
          <button 
            key={team.id} 
            onClick={() => onSelectTeam(team)}
            className="group relative bg-slate-900/20 border border-slate-800/50 p-8 hover:border-white/20 hover:bg-slate-800/40 transition-all duration-500 text-left outline-none"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
               <TeamIcon id={team.id} className="w-8 h-8 text-white" />
            </div>
            <div className="text-slate-600 font-mono text-[9px] mb-2 tracking-[0.3em] uppercase group-hover:text-white/40 transition-colors">{team.codeName}</div>
            <h3 className="text-lg font-black text-white mb-4 tracking-widest">{team.name}</h3>
            <div className="h-px w-6 bg-white/10 mb-4 group-hover:w-full transition-all duration-700"></div>
            <p className="text-slate-400 text-xs leading-relaxed mb-8 h-16 overflow-hidden line-clamp-3 font-medium">
              {team.description}
            </p>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-auto group-hover:text-white transition-colors flex items-center">
              ACCESS DEPT_DATA <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white/30 group-hover:w-full transition-all duration-500"></div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TeamGrid;
