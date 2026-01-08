
import React, { useState, useEffect } from 'react';
import { generateAnomalyReports } from '../services/geminiService';
import { AnomalyReport } from '../types';

interface ArchiveModalProps {
  onClose: () => void;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ onClose }) => {
  const [reports, setReports] = useState<AnomalyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullArchive = async () => {
      setLoading(true);
      // 대량의 보고서를 가져오기 위해 여러 번 호출하거나 더 긴 컨텐츠를 요청할 수 있음
      // 여기서는 기본 생성 함수를 사용하되 전체 아카이브 느낌을 위해 로딩 상태를 보여줌
      const data = await generateAnomalyReports();
      setReports(data);
      setLoading(false);
    };
    fetchFullArchive();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-600 text-white';
      case 'MEDIUM': return 'bg-yellow-600 text-black';
      default: return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-6xl w-full border border-slate-800 bg-slate-950 shadow-2xl relative flex flex-col h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-black flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase">Central Anomaly Archive</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-2 uppercase">접속 등급: LEVEL 4 상급 아카이브 // 전체 보고서 열람 중</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white font-mono text-xs border border-slate-800 px-4 py-2 transition-colors uppercase"
          >
            Close Archive [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 border-t-2 border-red-600 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-red-500 font-mono text-lg font-black animate-pulse uppercase tracking-[0.3em]">Decrypting Encrypted Data...</p>
                <p className="text-slate-600 font-mono text-xs mt-2 uppercase">Please wait while the AI reconstructs the event logs.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div key={report.id} className="group bg-slate-900/40 border border-slate-800 p-6 hover:border-red-600/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono text-slate-500">REF_{report.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[9px] font-black px-2 py-0.5 tracking-tighter ${getLevelColor(report.level)}`}>
                      {report.level}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{report.timestamp}</span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-3 group-hover:text-red-500 transition-colors">{report.location}</h3>
                  <div className="h-px w-8 bg-slate-700 mb-4 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                    {report.description}
                  </p>
                  
                  <button className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                    + Full Case File
                  </button>
                </div>
              ))}
              
              {/* 추가 로딩 카드 (아카이브 느낌을 위해) */}
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-slate-900/50 p-6 flex flex-col justify-center items-center text-slate-800">
                  <span className="font-mono text-[10px] animate-pulse uppercase">Searching Next Entry...</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-900 bg-black text-[9px] font-mono text-slate-700 flex justify-between items-center uppercase tracking-widest">
          <span>Total Records: {reports.length} Detected</span>
          <span>CKBA Archive Server: Sector-07</span>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
