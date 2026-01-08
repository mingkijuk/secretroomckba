import React, { useState, useRef, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import TeamGrid from './components/TeamGrid';
import AnomalyArchive from './components/AnomalyArchive';
import TeamDetail from './components/TeamDetail';
import StatusModal from './components/StatusModal';
import ReportModal from './components/ReportModal';
import LoginModal from './components/LoginModal';
import ArchiveModal from './components/ArchiveModal';
import MissionModal from './components/MissionModal';
import Footer from './components/Footer';
import { TeamInfo, Mission, AgentStats, AgentProfile } from './types';
import { CKRR_AGENTS } from './constants';

interface Report {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

const ALLOWED_AGENTS = [
  '아리스가와 바토리',
  '하타케야마 켄쇼',
  '쿠로사키 유우',
  '클라우스 퐁 에이프릴',
  '심영운',
  '백형운',
  '서요한',
  '류해',
  '안여울',
  '정이혁',
  '도호연'
];

const App: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInAgent, setLoggedInAgent] = useState<string | null>(null);
  const [missionRefreshKey, setMissionRefreshKey] = useState(0);

  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const teamGridRef = useRef<HTMLDivElement>(null);
  const archiveSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAgents = localStorage.getItem('ckba_agents_data');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    } else {
      setAgents(CKRR_AGENTS);
    }
  }, []);

  const handleUpdateAgents = (updatedAgents: AgentProfile[]) => {
    setAgents(updatedAgents);
    localStorage.setItem('ckba_agents_data', JSON.stringify(updatedAgents));
  };

  const currentAgentProfile = useMemo(() => {
    return agents.find(a => a.name === loggedInAgent) || null;
  }, [loggedInAgent, agents]);

  const missions = useMemo<Mission[]>(() => {
    if (!loggedInAgent) return [];
    
    // missionRefreshKey가 바뀔 때마다 새로 생성됨
    const others = agents.filter(a => a.name !== loggedInAgent);
    
    const generateTeammates = (count: number): AgentStats[] => {
      const shuffled = [...others].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(agent => ({
        name: agent.name,
        hp: 60 + Math.floor(Math.random() * 40),
        maxHp: 100,
        power: 50 + Math.floor(Math.random() * 50),
        photo: agent.photo,
        weapon: agent.weapon,
        ability: agent.ability,
        class: agent.class
      }));
    };

    const missionTitles = [
      { t: '신촌 로터리 비정형 실체 격리 작전', d: '신촌 로터리 중앙에서 차원 균열 발생. 15m 급 비정형 실체가 건물을 잠식 중입니다.' },
      { t: '평택항 화물 구역 오염원 정화', d: '입항 화물선 내부에서 녹색 발광 점액질 발견. 작업자 집단 환각 증세 발생 중.' },
      { t: '의정부 주택가 그림자 개체 추적', d: '그림자가 실종되는 연쇄 사건 발생. 하급 괴이 ‘Shadow Stalker’ 집단 서식지 판명.' },
      { t: '강남구 테헤란로 시간 왜곡 현상 조사', d: '특정 구간에서 시간이 5초씩 반복되는 타임 루프 구역 발생. 물리적 격리 시급.' },
      { t: '제주도 한라산 심부 미확인 생명체', d: '심야 한라산 국립공원 내 대규모 마나 폭주 감지. 고대 괴이의 부활 징조 식별.' }
    ];

    const shuffledTitles = [...missionTitles].sort(() => 0.5 - Math.random());

    return shuffledTitles.slice(0, 3).map((m, idx) => ({
      id: `MSN-${700 + idx + missionRefreshKey}`,
      title: m.t,
      description: m.d,
      status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
      teammates: generateTeammates(2 + Math.floor(Math.random() * 3))
    }));
  }, [loggedInAgent, agents, missionRefreshKey]);

  const [reports, setReports] = useState<Report[]>([
    { id: '1', user: '4492', content: '강남역 2번 출구 부근에서 그림자가 벽을 타고 기어다니는 것을 목격했습니다.', timestamp: '2024-05-20 22:15' },
    { id: '2', user: '8812', content: '수원 화성 성곽 위에서 보랏빛 안개가 피어오르고 있습니다.', timestamp: '2024-05-20 22:42' },
  ]);

  const handleRefreshMissions = () => {
    setMissionRefreshKey(prev => prev + 1);
  };

  const goHome = () => {
    setSelectedTeam(null);
    setShowStatusModal(false);
    setShowReportModal(false);
    setShowLoginModal(false);
    setShowArchiveModal(false);
    setShowMissionModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTeam = (team: TeamInfo) => {
    setSelectedTeam(team);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReport = () => setShowReportModal(true);
  const handleAddReport = (content: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      user: Math.floor(1000 + Math.random() * 9000).toString(),
      content,
      timestamp: new Date().toLocaleString('ko-KR', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };
    setReports(prev => [...prev, newReport]);
  };

  const handleStatus = () => setShowStatusModal(true);
  const handleLoginClick = () => setShowLoginModal(true);
  const handleArchiveClick = () => setShowArchiveModal(true);
  const handleMissionClick = () => setShowMissionModal(true);

  const handleInfoClick = () => {
    setSelectedTeam(null); 
    setTimeout(() => {
      teamGridRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setLoggedInAgent(name);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInAgent(null);
    setShowMissionModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-600 selection:text-white relative">
      <Header 
        onGoHome={goHome} 
        onLoginClick={handleLoginClick} 
        onInfoClick={handleInfoClick}
        onArchiveClick={handleArchiveClick}
        onEmergencyClick={handleReport}
        onMissionClick={handleMissionClick}
        isLoggedIn={isLoggedIn}
        agentName={loggedInAgent}
        onLogout={handleLogout}
      />
      
      {showStatusModal && <StatusModal onClose={() => setShowStatusModal(false)} />}
      {showReportModal && <ReportModal reports={reports} onAddReport={handleAddReport} onClose={() => setShowReportModal(false)} />}
      {showLoginModal && <LoginModal allowedNames={ALLOWED_AGENTS} onLogin={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />}
      {showArchiveModal && <ArchiveModal onClose={() => setShowArchiveModal(false)} />}
      {showMissionModal && currentAgentProfile && (
        <MissionModal 
          onClose={() => setShowMissionModal(false)} 
          onRefresh={handleRefreshMissions}
          currentAgent={{
            name: currentAgentProfile.name,
            hp: 95,
            maxHp: 100,
            power: 88,
            photo: currentAgentProfile.photo,
            weapon: currentAgentProfile.weapon,
            ability: currentAgentProfile.ability,
            class: currentAgentProfile.class
          }}
          missions={missions}
        />
      )}

      <main className="flex-grow">
        <BreakingNewsTicker />
        
        {!selectedTeam ? (
          <>
            <Hero onReportClick={handleReport} onStatusClick={handleStatus} />
            <div className="max-w-7xl mx-auto px-4">
              <div ref={teamGridRef}>
                <TeamGrid onSelectTeam={handleSelectTeam} />
              </div>
              <div ref={archiveSectionRef} id="anomaly-archive">
                <AnomalyArchive onSeeAll={handleArchiveClick} />
              </div>
              
              <section className="py-20 text-center">
                <div className="bg-gradient-to-br from-red-900/10 to-slate-900/50 p-12 rounded-lg border border-red-900/20">
                  <h2 className="text-3xl font-black text-white mb-6 uppercase italic tracking-[0.3em]">시민 행동 강령</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-black/50 p-6 border-l-2 border-red-600">
                      <span className="text-red-500 font-mono text-2xl mb-2 block font-black">01</span>
                      <h4 className="font-bold text-white mb-2 tracking-tight">즉시 대피</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">비정상적인 소음이나 형태가 감지될 경우, 해당 지역에서 반경 2km 이상 즉시 이탈하십시오.</p>
                    </div>
                    <div className="bg-black/50 p-6 border-l-2 border-red-600">
                      <span className="text-red-500 font-mono text-2xl mb-2 block font-black">02</span>
                      <h4 className="font-bold text-white mb-2 tracking-tight">기록 금지</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">괴이의 형상을 육안으로 확인하거나 촬영하는 행위는 정신 오염 및 타겟팅의 원인이 됩니다.</p>
                    </div>
                    <div className="bg-black/50 p-6 border-l-2 border-red-600">
                      <span className="text-red-500 font-mono text-2xl mb-2 block font-black">03</span>
                      <h4 className="font-bold text-white mb-2 tracking-tight">신속 신고</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">안전한 장소 확보 후 상단의 긴급 제보 버튼을 통해 현장 상황을 송신하십시오.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <TeamDetail 
              team={selectedTeam} 
              onBack={goHome} 
              agents={agents} 
              onUpdateAgents={handleUpdateAgents}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
