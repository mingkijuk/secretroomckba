
import React, { useState, useEffect, useRef } from 'react';
import { Mission, AgentStats } from '../types';

interface MissionModalProps {
  onClose: () => void;
  onRefresh: () => void;
  currentAgent: AgentStats;
  missions: Mission[];
}

type SimStatus = 'IDLE' | 'RUNNING' | 'DECIDING' | 'FINISHED';

interface SimLog {
  id: string;
  text: string;
  type: 'INFO' | 'ACTION' | 'DANGER' | 'SUCCESS' | 'SYSTEM' | 'EVENT';
  actor?: string;
  value?: string;
  subText?: string;
}

const MissionModal: React.FC<MissionModalProps> = ({ onClose, onRefresh, currentAgent, missions }) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(missions[0] || null);
  const [simStatus, setSimStatus] = useState<SimStatus>('IDLE');
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [teamHp, setTeamHp] = useState<number[]>([]);
  const [enemyHp, setEnemyHp] = useState(100);
  const [tacticalPoints, setTacticalPoints] = useState(100);
  const [grade, setGrade] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHurt, setIsHurt] = useState(false);
  const [isEnraged, setIsEnraged] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);
  const simTimerRef = useRef<number | null>(null);

  const startSimulation = () => {
    if (!selectedMission) return;
    setSimStatus('RUNNING');
    setCurrentStep(0);
    setEnemyHp(100);
    setTacticalPoints(100);
    setIsEnraged(false);
    setLogs([{ id: 'start', text: `>>> [${selectedMission.title}] 작전 승인. 지휘부 전술 네트워크 링크가 활성화되었습니다.`, type: 'SYSTEM' }]);
    setTeamHp([currentAgent.hp, ...selectedMission.teammates.map(t => t.hp)]);
    setGrade(null);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [logs]);

  useEffect(() => {
    if (simStatus !== 'RUNNING' || !selectedMission) return;

    const allMembers: AgentStats[] = [currentAgent, ...selectedMission.teammates];
    
    simTimerRef.current = window.setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        
        if (next === 10 || next === 20 || next === 30) {
          if (simTimerRef.current) clearInterval(simTimerRef.current);
          setSimStatus('DECIDING');
          return next;
        }

        const isTeamDead = teamHp.every(hp => hp <= 0);
        if (enemyHp <= 0 || isTeamDead || next >= 40) {
          if (simTimerRef.current) clearInterval(simTimerRef.current);
          finishSimulation();
          return next;
        }

        processStep(next, allMembers);
        return next;
      });
    }, 3200);

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [simStatus, enemyHp, teamHp]);

  const processStep = (step: number, allMembers: AgentStats[]) => {
    const aliveIndices = teamHp.map((hp, i) => hp > 0 ? i : -1).filter(i => i !== -1);
    if (aliveIndices.length === 0) return;

    const actorIdx = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
    const actor = allMembers[actorIdx];
    const eventType = Math.random();

    if (enemyHp < 35 && !isEnraged) {
      setIsEnraged(true);
      setLogs(prev => [...prev, { id: `event-${step}`, text: "!!! [경보] 개체의 생체 신호 폭주. 차원 간섭 수준이 '멸절' 단계에 진입했습니다. 전원 충격에 대비하십시오.", type: 'EVENT' }]);
      return;
    }

    let newLog: SimLog = { id: `log-${step}`, text: '', type: 'INFO', actor: actor.name };

    // 이능력 보유 여부 확인 로직
    const hasAbility = actor.ability && actor.ability !== '이능력 없음';

    if (eventType > 0.45) {
      const isCrit = Math.random() > 0.85;
      const baseDmg = isEnraged ? 6 : 12;
      const finalDmg = (isCrit ? baseDmg * 2.5 : baseDmg) + Math.floor(Math.random() * 12);
      setEnemyHp(prev => Math.max(0, prev - finalDmg));

      let actions: string[];
      if (hasAbility) {
        // 이능력 사용자용 템플릿
        actions = [
          `${actor.name} 요원이 이능력 [${actor.ability}]을(를) 활성화했습니다. 초자연적 힘이 주무기 [${actor.weapon || '전술 장비'}]에 깃들며 괴이의 핵을 타격합니다.`,
          `${actor.name}이(가) [${actor.ability}]의 출력을 개방하여 전장의 물리 법칙을 왜곡시킵니다. 개체의 움직임을 봉쇄하고 치명적인 연계 공격을 시도합니다.`,
          `[이능 연계] ${actor.name} 요원이 [${actor.ability}]을 이용해 개체의 내부 마나 흐름을 역추적, [${actor.weapon || '장비'}]로 치명상을 입혔습니다.`
        ];
      } else {
        // 이능력 미보유자(하타케야마 켄쇼 등)용 무력/무기 특화 템플릿
        actions = [
          `${actor.name} 요원이 이능력 없이 순수 무력만으로 괴이의 사각지대를 파고듭니다. 주무기 [${actor.weapon || '전술 무기'}]의 날카로운 일격이 적의 외피를 가릅니다.`,
          `${actor.name}이(가) 초인적인 동체 시력으로 개체의 공격을 흘려보낸 뒤, [${actor.weapon || '장비'}]를 휘둘러 뼈를 깎는 충격을 전달합니다.`,
          `[무기 달인] ${actor.name} 요원이 이능의 도움 없이 오직 단련된 신체와 [${actor.weapon || '장비'}]의 기계적 성능만으로 괴이의 방어선을 분쇄합니다.`
        ];
      }

      newLog = { 
        id: `log-${step}`, 
        text: actions[Math.floor(Math.random() * actions.length)], 
        value: `-${finalDmg} HP`,
        subText: isCrit ? "PERFECT_EXECUTION" : "HIT_CONFIRMED",
        type: isCrit ? 'SUCCESS' : 'ACTION',
        actor: actor.name
      };
    } else if (eventType > 0.08) {
      const baseEnemyDmg = isEnraged ? 30 : 18;
      const finalEnemyDmg = baseEnemyDmg + Math.floor(Math.random() * 15);
      
      setIsHurt(true);
      setTimeout(() => setIsHurt(false), 700);
      
      setTeamHp(prev => {
        const next = [...prev];
        next[actorIdx] = Math.max(0, next[actorIdx] - finalEnemyDmg);
        return next;
      });
      
      const counterActions = [
        `개체에서 뿜어져 나온 고농도의 정신 오염 물질이 ${actor.name}의 보호구를 잠식합니다! 요원의 신경계에 직접적인 데미지가 누적됩니다.`,
        `[위기] 괴이의 기괴한 촉수가 ${actor.name} 요원의 사각지대를 타격했습니다. [${actor.weapon || '장비'}]의 내구도가 급격히 하락하며 VIT가 손실됩니다.`,
        `폭주한 개체의 차원 진동파가 발생했습니다. ${actor.name} 요원이 미처 회피하지 못하고 충격파에 정면 노출되었습니다.`
      ];

      newLog = { 
        id: `log-${step}`, 
        text: counterActions[Math.floor(Math.random() * counterActions.length)], 
        value: `-${finalEnemyDmg} VIT`,
        subText: "HIGH_RISK_ALERT",
        type: 'DANGER',
        actor: actor.name
      };

      if (finalEnemyDmg > 25 && aliveIndices.length > 1) {
        const helperIdx = aliveIndices.find(i => (allMembers[i].class === '힐러' || allMembers[i].class === '서포터') && i !== actorIdx);
        if (helperIdx !== undefined) {
          const helper = allMembers[helperIdx];
          const hasHelperAbility = helper.ability && helper.ability !== '이능력 없음';
          
          setTimeout(() => {
            setLogs(prev => [...prev, { 
              id: `save-${step}`, 
              text: `[구조] ${helper.name} 요원이 급파되었습니다! ${hasHelperAbility ? `[${helper.ability}] 능력을 전개해` : `[${helper.weapon || '장비'}]를 사용한 엄호 사격으로`} ${actor.name}의 치명적인 손상을 저지했습니다.`, 
              type: 'SUCCESS' 
            }]);
          }, 700);
        }
      }
    } else {
      const sp = 20;
      setTacticalPoints(prev => Math.min(100, prev + sp));
      newLog = { 
        id: `log-${step}`, 
        text: `전장의 불확실성이 해소됩니다. ${actor.name} 요원이 괴이의 마나 코어를 일시적으로 탈취하여 지휘 시스템의 SP를 확보했습니다.`, 
        value: `+${sp} SP`,
        type: 'INFO',
        actor: actor.name
      };
    }

    setLogs(prev => [...prev, newLog]);
  };

  const handleTacticalChoice = (type: 'OFFENSE' | 'DEFENSE' | 'SACRIFICE', cost: number) => {
    if (tacticalPoints < cost) return;
    
    setTacticalPoints(prev => prev - cost);
    let resultLog = '';
    
    if (type === 'OFFENSE') {
      const dmg = 60 + Math.floor(Math.random() * 20);
      setEnemyHp(prev => Math.max(0, prev - dmg));
      resultLog = `>>> [명령: 전술적 총사격] 지휘관의 권한으로 모든 요원의 출력을 개방합니다. 괴이에게 ${dmg}의 궤멸적인 타격을 입혔습니다.`;
    } else if (type === 'DEFENSE') {
      setTeamHp(prev => prev.map(hp => hp > 0 ? Math.min(100, hp + 60) : 0));
      resultLog = '>>> [명령: 광역 나노 복구] 지휘관이 전 요원의 생명 유지 장치에 직접 접속했습니다. 생존 요원 전원의 VIT가 즉각 수복됩니다.';
    } else {
      setTacticalPoints(100);
      setTeamHp(prev => prev.map(hp => Math.max(1, hp - 25)));
      resultLog = '>>> [명령: 생명 에너지 환원] 요원들의 체력을 담보로 지휘 에너지를 강제 재충전합니다. SP가 최대치로 복구되었습니다.';
    }

    setLogs(prev => [...prev, { id: `choice-${Date.now()}`, text: resultLog, type: 'SUCCESS' }]);
    setSimStatus('RUNNING');
  };

  const finishSimulation = () => {
    setSimStatus('FINISHED');
    const finalAvgHp = teamHp.reduce((a, b) => a + b, 0) / teamHp.length;
    const isSuccess = enemyHp <= 0;
    
    let resultGrade = 'F';
    if (isSuccess) {
      if (finalAvgHp > 85) resultGrade = 'S';
      else if (finalAvgHp > 60) resultGrade = 'A';
      else if (finalAvgHp > 25) resultGrade = 'B';
      else resultGrade = 'C';
    }
    
    setGrade(resultGrade);
    setLogs(prev => [...prev, { id: 'end', text: `>>> 작전 상황 종료. 최종 분석 등급: [${resultGrade}]. 모든 요원은 원대 복귀하십시오.`, type: 'SYSTEM' }]);
  };

  const StatBar: React.FC<{ label: string; current: number; max: number; color: string; large?: boolean }> = ({ label, current, max, color, large = false }) => (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-end">
        <span className={`${large ? 'text-xs' : 'text-[10px]'} font-black text-slate-500 uppercase tracking-widest`}>{label}</span>
        <span className={`${large ? 'text-3xl' : 'text-base'} font-mono font-black ${current < 30 ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>{Math.round(current)}%</span>
      </div>
      <div className={`${large ? 'h-3.5' : 'h-2.5'} w-full bg-slate-900 border border-white/10 overflow-hidden`}>
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${(current / max) * 100}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl transition-all duration-700 ${isHurt ? 'ring-[15px] ring-inset ring-red-900/40 shadow-[inset_0_0_150px_rgba(220,38,38,0.2)]' : ''}`}>
      <div className="max-w-[1300px] w-full border border-slate-800 bg-[#060608] shadow-2xl relative flex flex-col h-[94vh] overflow-hidden">
        
        {(simStatus === 'RUNNING' || simStatus === 'DECIDING') && (
          <div className="absolute top-0 left-0 w-full px-12 py-8 bg-gradient-to-b from-black via-black/90 to-transparent z-40 pointer-events-none">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-red-700 tracking-[0.6em] uppercase mb-1 animate-pulse">SUPPRESSION: {selectedMission?.title.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-600 font-mono font-black uppercase tracking-widest">{isEnraged ? 'WARNING: ANNIHILATION_PROTOCOL_ACTIVE' : 'STATUS: TARGET_LOCKED'}</span>
                </div>
                <div className="flex items-baseline space-x-6">
                  <span className={`text-6xl font-black font-mono leading-none tracking-tighter ${isEnraged ? 'text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'text-white'}`}>{Math.round(enemyHp)}%</span>
                </div>
              </div>
              <div className="h-4 w-full bg-red-950/20 border border-red-900/50 p-0.5">
                <div 
                  className={`h-full transition-all duration-1000 ${isEnraged ? 'bg-gradient-to-r from-red-800 via-red-400 to-red-800 bg-[length:200%_100%] animate-gradient-x shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-red-700'}`} 
                  style={{ width: `${enemyHp}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-slate-900 bg-black flex justify-between items-center shrink-0 z-50">
          <div className="flex items-center space-x-8">
            <div className="w-14 h-14 border-2 border-red-900/30 flex items-center justify-center rotate-45 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-800 -rotate-45" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase leading-tight">CKBA 통합 전술 시스템</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-[11px] text-slate-500 font-mono font-black uppercase tracking-[0.3em]">Operator: {currentAgent.name}</span>
                <span className="w-1.5 h-1.5 bg-red-800 rounded-full animate-ping"></span>
                <span className="text-[11px] text-red-900 font-mono font-black uppercase tracking-widest">Auth_Level: S-Grade</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white font-mono text-[11px] uppercase border border-slate-900 px-8 py-4 hover:bg-slate-900 transition-all font-black tracking-widest">[DISCONNECT]</button>
        </div>

        <div className="flex-grow flex overflow-hidden">
          <div className={`w-80 border-r border-slate-900 bg-black/50 flex flex-col ${simStatus !== 'IDLE' ? 'opacity-10 pointer-events-none' : ''}`}>
            <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/40">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">전술 작전 대기열</span>
              <button onClick={onRefresh} className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-500">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {missions.map(mission => (
                <button
                  key={mission.id}
                  onClick={() => setSelectedMission(mission)}
                  className={`w-full p-6 text-left border-b border-slate-900 transition-all ${selectedMission?.id === mission.id ? 'bg-red-950/10 border-l-[6px] border-l-red-800' : 'hover:bg-slate-900/60'}`}
                >
                  <div className="text-[10px] font-mono text-slate-600 mb-2 font-black">REF: {mission.id}</div>
                  <h3 className={`text-base font-black leading-tight tracking-tight ${selectedMission?.id === mission.id ? 'text-red-500' : 'text-slate-400'}`}>
                    {mission.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow flex flex-col bg-[#030305] overflow-hidden p-8 gap-8 relative">
            {selectedMission ? (
              <>
                {(simStatus === 'RUNNING' || simStatus === 'DECIDING') && (
                  <div className="fixed top-1/2 right-10 -translate-y-1/2 z-[100] w-[320px] p-8 bg-black/95 border-2 border-blue-900 shadow-[0_0_50px_rgba(30,58,138,0.5)] backdrop-blur-3xl animate-in slide-in-from-right-10">
                    <div className="relative">
                      <div className="absolute -top-12 left-0 text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] animate-pulse">COMMAND_ENERGY_CORE</div>
                      <StatBar label="전술 포인트 (SP)" current={tacticalPoints} max={100} color="bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.7)]" large={true} />
                      <div className="mt-5 flex justify-between text-[10px] font-mono font-black text-slate-600 border-t border-slate-900 pt-3">
                        <span>L-ULTRA_LINK</span>
                        <span className={tacticalPoints < 25 ? 'text-red-700 animate-pulse' : 'text-blue-600'}>{tacticalPoints < 25 ? 'POWER_LOW' : 'STABLE'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 shrink-0 z-10">
                  <div className={`p-4 border-2 transition-all shadow-lg ${teamHp[0] < 40 ? 'border-red-700 bg-red-950/30' : 'border-slate-800 bg-black/80'} ${teamHp[0] === 0 ? 'opacity-20 grayscale' : ''}`}>
                    <div className="flex items-center space-x-4 mb-3">
                       <div className="w-12 h-14 bg-slate-900 shrink-0 border border-slate-700 overflow-hidden relative">
                         {currentAgent.photo && <img src={currentAgent.photo} className="w-full h-full object-cover grayscale brightness-125" />}
                       </div>
                       <div className="min-w-0">
                         <h4 className="text-base font-black text-white truncate mb-0.5 leading-none">{currentAgent.name}</h4>
                         <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">지휘 본진</span>
                       </div>
                    </div>
                    <StatBar label="VIT" current={teamHp[0] ?? 100} max={100} color={teamHp[0] < 40 ? 'bg-red-700 animate-pulse' : 'bg-blue-700 shadow-sm'} />
                  </div>
                  {selectedMission.teammates.map((teammate, idx) => (
                    <div key={idx} className={`p-4 border-2 transition-all shadow-lg ${teamHp[idx+1] < 40 ? 'border-red-700 bg-red-950/30' : 'border-slate-800 bg-black/80'} ${teamHp[idx+1] === 0 ? 'opacity-20 grayscale' : ''}`}>
                      <div className="flex items-center space-x-4 mb-3">
                         <div className="w-12 h-14 bg-slate-900 shrink-0 border border-slate-700 overflow-hidden relative">
                           {teammate.photo && <img src={teammate.photo} className="w-full h-full object-cover grayscale" />}
                         </div>
                         <div className="min-w-0">
                           <h4 className="text-base font-black text-white truncate mb-0.5 leading-none">{teammate.name}</h4>
                           <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{teammate.class} 요원</span>
                         </div>
                      </div>
                      <StatBar label="VIT" current={teamHp[idx+1] ?? 100} max={100} color={teamHp[idx+1] < 40 ? 'bg-red-700 animate-pulse' : 'bg-green-800'} />
                    </div>
                  ))}
                </div>

                <div className="flex-grow border border-slate-900 bg-black relative flex flex-col min-h-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
                  {simStatus === 'IDLE' ? (
                    <div className="h-full flex flex-col items-center justify-center p-12">
                      <div className="mb-10 p-16 border-2 border-slate-800 max-w-4xl bg-[#08080a]/95 backdrop-blur-3xl relative shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-800 shadow-md"></div>
                        <span className="text-[10px] font-black text-red-800 uppercase tracking-[1em] mb-6 block">Strategic Mission Dossier</span>
                        <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-widest leading-snug">{selectedMission.title}</h3>
                        <div className="max-h-40 overflow-y-auto custom-scrollbar mb-10 pr-6 text-slate-300 text-2xl leading-relaxed italic font-medium">
                           "{selectedMission.description}"
                        </div>
                        <div className="grid grid-cols-3 gap-16 text-lg font-mono text-slate-700 uppercase font-black border-t border-slate-900 pt-10">
                           <div className="flex flex-col"><span className="text-red-900 mb-3 text-[10px] font-black tracking-widest">THREAT_LV</span> X-CLASS</div>
                           <div className="flex flex-col"><span className="text-blue-900 mb-3 text-[10px] font-black tracking-widest">SURVIVAL_RT</span> 14.2%</div>
                           <div className="flex flex-col"><span className="text-green-900 mb-3 text-[10px] font-black tracking-widest">OBJECTIVE</span> CRITICAL</div>
                        </div>
                      </div>
                      <button 
                        onClick={startSimulation}
                        className="group relative px-32 py-10 bg-red-950 text-white font-black text-3xl tracking-[1.2em] transition-all hover:bg-red-800 hover:scale-110 active:scale-95 shadow-xl border-4 border-red-700 overflow-hidden"
                      >
                        <span className="relative z-10">작전 개시</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col p-8 overflow-hidden relative">
                      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-900/60">
                         <span className="text-xl font-black text-red-800 uppercase flex items-center tracking-[0.4em]">
                            <span className="w-4 h-4 bg-red-600 rounded-full mr-5 animate-pulse shadow-[0_0_15px_rgba(220,38,38,1)]"></span>
                            전술 지휘 시퀀스 (Live Feed)
                         </span>
                         <div className="flex items-center space-x-12">
                            <span className="text-sm font-mono text-slate-700 font-black tracking-[0.2em] uppercase">STEP: {currentStep} / 40</span>
                            <span className={`text-sm font-mono font-black tracking-[0.2em] ${isEnraged ? 'text-red-700 animate-pulse' : 'text-slate-900'}`}>{isEnraged ? 'LINK: OVERLOAD' : 'LINK: SECURE'}</span>
                         </div>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto space-y-12 font-mono custom-scrollbar pr-[360px] pb-64">
                        {logs.map((log) => (
                          <div key={log.id} className="flex space-x-8 items-start animate-in slide-in-from-left-6 duration-1000">
                            <span className="text-slate-900 shrink-0 font-black text-sm mt-1.5">[{new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <div className="flex-grow leading-relaxed flex items-start justify-between">
                              <div className="max-w-4xl space-y-2">
                                <div className="flex items-center space-x-4">
                                  {log.actor && <span className="text-white font-black bg-white/10 px-4 py-1 border border-white/20 uppercase text-[11px] tracking-[0.2em] shadow-md">[{log.actor}]</span>}
                                  {log.subText && <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{log.subText}</span>}
                                </div>
                                <p className={`text-base font-medium leading-[1.6]
                                  ${log.type === 'ACTION' ? 'text-blue-50' : ''}
                                  ${log.type === 'DANGER' ? 'text-red-600 font-black text-xl bg-red-950/15 px-6 py-3 border-l-4 border-red-800 shadow-lg' : ''}
                                  ${log.type === 'SUCCESS' ? 'text-green-500 font-black' : ''}
                                  ${log.type === 'SYSTEM' ? 'text-yellow-700 font-black italic tracking-widest bg-yellow-950/10 px-6 py-2' : ''}
                                  ${log.type === 'EVENT' ? 'text-purple-700 font-black animate-pulse bg-purple-950/20 px-8 py-3' : ''}
                                  ${log.type === 'INFO' ? 'text-slate-500 italic' : ''}
                                `}>
                                  {log.text}
                                </p>
                              </div>
                              {log.value && <span className={`text-3xl font-black font-mono ml-10 shrink-0 drop-shadow-xl ${log.type === 'DANGER' ? 'text-red-900' : 'text-blue-700'}`}>{log.value}</span>}
                            </div>
                          </div>
                        ))}
                        <div ref={logEndRef} className="h-40" />
                      </div>

                      {simStatus === 'DECIDING' && (
                        <div className="absolute inset-0 z-[200] flex items-center justify-center p-20 bg-black/98 animate-in fade-in backdrop-blur-[50px]">
                          <div className="max-w-[1200px] w-full text-center space-y-20">
                            <div className="space-y-8">
                              <h4 className="text-6xl font-black text-white uppercase tracking-[0.6em] animate-pulse">현장 지휘 명령 하달</h4>
                              <p className="text-slate-500 text-3xl italic font-medium">개체의 이능적 반발이 임계점에 도달했습니다. 지휘관의 즉각적인 결단이 필요합니다.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                              <button 
                                disabled={tacticalPoints < 40}
                                onClick={() => handleTacticalChoice('OFFENSE', 40)}
                                className="group p-12 border-4 border-red-900 bg-red-950/20 hover:bg-red-800 disabled:opacity-10 transition-all transform hover:-translate-y-6 shadow-2xl"
                              >
                                <div className="text-red-500 group-hover:text-white font-black text-4xl mb-6 uppercase tracking-widest">섬멸 개시</div>
                                <div className="text-2xl text-slate-600 group-hover:text-white font-black mb-8">40 SP REQ.</div>
                                <div className="text-sm text-slate-700 group-hover:text-white/80 font-mono leading-relaxed px-4">요원들의 개별 화력을 일제히 해방하여 개체의 핵에 파괴적인 연계 일격을 가합니다.</div>
                              </button>
                              <button 
                                disabled={tacticalPoints < 30}
                                onClick={() => handleTacticalChoice('DEFENSE', 30)}
                                className="group p-12 border-4 border-blue-900 bg-blue-950/20 hover:bg-blue-800 disabled:opacity-10 transition-all transform hover:-translate-y-6 shadow-2xl"
                              >
                                <div className="text-blue-500 group-hover:text-white font-black text-4xl mb-6 uppercase tracking-widest">긴급 정화</div>
                                <div className="text-2xl text-slate-600 group-hover:text-white font-black mb-8">30 SP REQ.</div>
                                <div className="text-sm text-slate-700 group-hover:text-white/80 font-mono leading-relaxed px-4">나노 의료 로봇을 전장에 살포하여 생존 요원의 VIT를 대폭 회복시키고 오염을 제거합니다.</div>
                              </button>
                              <button 
                                disabled={tacticalPoints < 25}
                                onClick={() => handleTacticalChoice('SACRIFICE', 25)}
                                className="group p-12 border-4 border-yellow-900 bg-yellow-950/20 hover:bg-yellow-800 disabled:opacity-10 transition-all transform hover:-translate-y-6 shadow-2xl"
                              >
                                <div className="text-yellow-600 group-hover:text-white font-black text-4xl mb-6 uppercase tracking-widest">에너지 전환</div>
                                <div className="text-2xl text-slate-600 group-hover:text-white font-black mb-8">25 SP REQ.</div>
                                <div className="text-sm text-slate-700 group-hover:text-white/80 font-mono leading-relaxed px-4">요원들의 생명력을 일부 제물로 삼아 지휘 시스템의 SP를 즉각 최대치로 재충전합니다.</div>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {simStatus === 'FINISHED' && grade && (
                        <div className="absolute inset-0 z-[210] bg-black flex flex-col items-center justify-center p-12 animate-in fade-in zoom-in-95 duration-1000">
                          <div className="text-center relative">
                            <span className="text-slate-900 font-mono tracking-[2.5em] text-base mb-20 block uppercase font-black">Post-Operation Strategic Archive Record</span>
                            <div className="relative inline-block mb-24">
                              <span className="text-[24rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_120px_rgba(255,255,255,0.3)]">
                                {grade}
                              </span>
                              <div className="absolute -top-16 -right-16 bg-red-800 text-white px-12 py-5 text-6xl font-black rotate-12 shadow-2xl border-4 border-white/50">
                                RANK
                              </div>
                            </div>
                            <h3 className="text-6xl font-black text-white mb-20 uppercase tracking-[0.6em]">
                              {grade === 'S' ? '완벽한 전술적 우위' : 
                               grade === 'F' ? '작전 전면 중단' : '임무 완료'}
                            </h3>
                            <button 
                              onClick={() => setSimStatus('IDLE')}
                              className="px-36 py-10 border-4 border-slate-900 text-slate-700 font-black hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-[1.5em] text-3xl shadow-xl"
                            >
                              중앙 관제 복귀
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center opacity-5">
                <span className="text-[12rem] font-black tracking-[1.5em] uppercase animate-pulse">NO_LINK</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.95); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #151517; border-radius: 0; border: 3px solid #333; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 1s linear infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default MissionModal;
