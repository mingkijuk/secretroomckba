
import React from 'react';

interface StatusModalProps {
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ onClose }) => {
  // 가상의 현황 데이터
  const stats = [
    { label: '활성 괴이 개체수', value: '42', unit: 'ENTITY', trend: '+3' },
    { label: '누적 민간 사상자', value: '1,284', unit: 'PERSON', trend: 'STABLE' },
    { label: '정신 오염 평균 농도', value: '18.5', unit: 'PSI', trend: '+1.2%' },
    { label: '격리 성공률', value: '94.2', unit: '%', trend: '-0.5%' },
  ];

  const regionalData = [
    { region: '서울-수도권', coords: '37.56, 126.97', count: 12, risk: 'CRITICAL' },
    { region: '부산-경상권', coords: '35.17, 129.07', count: 8, risk: 'HIGH' },
    { region: '강원-영동권', coords: '37.75, 128.87', count: 15, risk: 'MEDIUM' },
    { region: '전라-충청권', coords: '35.82, 127.14', count: 5, risk: 'LOW' },
    { region: '제주-도서권', coords: '33.48, 126.49', count: 2, risk: 'LOW' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-4xl w-full border border-slate-700 bg-slate-950 p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-widest flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-3 animate-pulse"></span>
                전국 괴이 발생 실시간 통계
              </h2>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1 uppercase">National Anomaly Status Dashboard // v2.4.0</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white font-mono text-xs border border-slate-800 px-3 py-1 transition-colors">CLOSE[X]</button>
          </div>

          {/* Core Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-5">
                <span className="block text-[9px] text-slate-500 font-bold uppercase mb-2 tracking-tighter">{stat.label}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-white font-mono">{stat.value}</span>
                  <span className="text-[10px] text-slate-600 font-bold">{stat.unit}</span>
                </div>
                <span className={`text-[8px] font-mono mt-1 block ${stat.trend.startsWith('+') ? 'text-red-500' : 'text-slate-600'}`}>
                  TREND: {stat.trend}
                </span>
              </div>
            ))}
          </div>

          {/* Regional Table */}
          <div className="border border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-[10px] text-slate-400 font-mono uppercase tracking-widest border-b border-slate-800">
                  <th className="p-4">Region</th>
                  <th className="p-4">Coordinates</th>
                  <th className="p-4 text-center">Entities</th>
                  <th className="p-4 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-slate-300">
                {regionalData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-900/50 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white">{row.region}</td>
                    <td className="p-4 font-mono text-slate-500">{row.coords}</td>
                    <td className="p-4 text-center font-mono">{row.count}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        row.risk === 'CRITICAL' ? 'bg-red-950 text-red-500 border border-red-500/50' : 
                        row.risk === 'HIGH' ? 'bg-orange-950 text-orange-500' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-between text-[9px] font-mono text-slate-600">
            <p>LAST_SYNC: {new Date().toISOString()}</p>
            <p>ENCRYPTION: AES-256-GCM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
