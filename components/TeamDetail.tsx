
import React, { useState } from 'react';
import { TeamInfo, AgentProfile } from '../types';

interface TeamDetailProps {
  team: TeamInfo;
  onBack: () => void;
  agents: AgentProfile[];
  onUpdateAgents: (updated: AgentProfile[]) => void;
}

const TeamIcon = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case 'ckrr':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
          <circle cx="12" cy="12" r="9" className="opacity-20" />
          <path d="M12 3v18M3 12h18" strokeLinecap="square" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    case 'research':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      );
    case 'office':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
          <rect x="3" y="4" width="18" height="16" rx="1" />
          <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" className="opacity-40" />
        </svg>
      );
    case 'cleanup':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="2" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

const TeamDetail: React.FC<TeamDetailProps> = ({ team, onBack, agents, onUpdateAgents }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AgentProfile>>({});

  const isCombatTeam = team.id === 'ckrr';

  const handleEdit = (agent: AgentProfile) => {
    setEditingId(agent.id);
    setEditForm({ ...agent });
  };

  const handleSave = () => {
    const updated = agents.map(a => a.id === editingId ? { ...a, ...editForm } as AgentProfile : a);
    onUpdateAgents(updated);
    setEditingId(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case '딜러': return 'text-red-500 border-red-900/50 bg-red-950/20';
      case '힐러': return 'text-green-500 border-green-900/50 bg-green-950/20';
      case '서포터': return 'text-yellow-500 border-yellow-900/50 bg-yellow-950/20';
      default: return 'text-slate-500 border-slate-800 bg-slate-900/20';
    }
  };

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-8 text-slate-500 hover:text-white flex items-center space-x-2 text-[10px] font-mono tracking-widest transition-colors uppercase font-bold"
      >
        <span>← [Return_to_Central_Archive]</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-none sticky top-24 backdrop-blur-sm">
            <div className="mb-10 flex justify-center lg:justify-start">
              <div className="p-6 border border-white/5 rounded-full bg-white/[0.02]">
                <TeamIcon id={team.id} className="w-16 h-16 text-white opacity-90" />
              </div>
            </div>
            <div className="text-slate-500 font-mono text-[10px] tracking-[0.4em] mb-2 uppercase font-bold">{team.codeName}</div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-widest">{team.name}</h2>
            <p className="text-slate-400 leading-relaxed mb-6 italic border-l border-slate-700 pl-4 text-sm font-medium">
              {team.description}
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 border border-slate-800">
                <span className="block text-[9px] text-slate-600 font-mono uppercase tracking-widest font-black">Operation Status</span>
                <span className="text-white font-bold text-xs tracking-widest flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-16">
          <section>
            <h3 className="text-sm font-black text-white mb-8 flex items-center tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 bg-white mr-3 rotate-45"></span>
              주요 임무 (Mission Objectives)
            </h3>
            <div className="space-y-4">
              {team.details?.missions.map((m, i) => (
                <div key={i} className="bg-slate-900/20 p-6 border border-slate-800/60 flex items-start space-x-8 group hover:border-white/10 transition-all">
                  <span className="text-slate-800 font-mono text-3xl font-black group-hover:text-white/20 transition-colors">0{i+1}</span>
                  <p className="text-slate-300 leading-relaxed text-sm pt-2 font-medium">{m}</p>
                </div>
              ))}
            </div>
          </section>

          {isCombatTeam && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-white flex items-center tracking-[0.3em] uppercase">
                  <span className="w-1.5 h-1.5 bg-red-600 mr-3 rotate-45 animate-pulse"></span>
                  소속 요원 인사 기록 (Personnel Dossier)
                </h3>
              </div>
              <div className="space-y-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-black/60 border border-slate-800 p-6 group hover:border-red-600/30 transition-all relative">
                    {editingId === agent.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in">
                        <div className="col-span-1 space-y-4 text-center">
                          <div className="aspect-square bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                            {editForm.photo ? (
                              <img src={editForm.photo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-700 text-[10px] uppercase font-mono tracking-widest">No Image</span>
                            )}
                          </div>
                          <label className="block">
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-[8px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-none file:border-0 file:text-[8px] file:font-black file:bg-red-900/50 file:text-white hover:file:bg-red-800 cursor-pointer" />
                          </label>
                        </div>
                        <div className="md:col-span-3 grid grid-cols-2 gap-4">
                          <div className="space-y-1 col-span-1">
                            <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">나이</label>
                            <input type="text" value={editForm.age || ''} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white p-2 text-xs focus:outline-none focus:border-red-600" />
                          </div>
                          <div className="space-y-1 col-span-1">
                            <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">무기</label>
                            <input type="text" value={editForm.weapon || ''} onChange={(e) => setEditForm({ ...editForm, weapon: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white p-2 text-xs focus:outline-none focus:border-red-600" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">경력</label>
                            <input type="text" value={editForm.experience || ''} onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white p-2 text-xs focus:outline-none focus:border-red-600" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">이능력</label>
                            <input type="text" value={editForm.ability || ''} onChange={(e) => setEditForm({ ...editForm, ability: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white p-2 text-xs focus:outline-none focus:border-red-600" />
                          </div>
                          <div className="col-span-2 flex justify-end space-x-2 pt-4">
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-slate-800 text-slate-500 text-[9px] font-black uppercase hover:bg-slate-900">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-red-700 text-white text-[9px] font-black uppercase hover:bg-red-600">Save</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-32 h-40 bg-slate-900 border border-slate-800 shrink-0 overflow-hidden relative group/img">
                          {agent.photo ? (
                            <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-950">
                               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-12 h-12 text-slate-800">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" />
                               </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="text-white font-black text-xl tracking-tight">{agent.name}</h4>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getClassColor(agent.class)}`}>
                                  {agent.class}
                                </span>
                                {agent.age && <span className="text-[10px] text-slate-500 font-mono">AGE: {agent.age}</span>}
                              </div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {agent.gender} 요원 <span className="mx-2 text-slate-800">|</span> <span className="text-slate-500">{agent.id}</span>
                              </div>
                            </div>
                            <button onClick={() => handleEdit(agent)} className="text-[9px] font-black text-slate-600 hover:text-red-500 border border-slate-800 hover:border-red-900 px-3 py-1 transition-all uppercase tracking-widest">
                              [Edit_Dossier]
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-6">
                            <div>
                               <span className="block text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-1">Experience</span>
                               <p className="text-slate-400 text-[11px] leading-relaxed italic">{agent.experience || '기록 없음'}</p>
                            </div>
                            <div>
                               <span className="block text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-1">Weapon</span>
                               <p className="text-slate-400 text-[11px] leading-relaxed italic">{agent.weapon || '기록 없음'}</p>
                            </div>
                            <div className="md:col-span-2">
                               <span className="block text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-1">Ability</span>
                               <p className="text-slate-300 text-xs leading-relaxed font-medium">{agent.ability || '이능력 미등록'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
