
import React, { useState, useEffect } from 'react';
import { generateAnomalyReports } from '../services/geminiService';
import { AnomalyReport } from '../types';

interface AnomalyArchiveProps {
  onSeeAll?: () => void;
}

const AnomalyArchive: React.FC<AnomalyArchiveProps> = ({ onSeeAll }) => {
  const [reports, setReports] = useState<AnomalyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const data = await generateAnomalyReports();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
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
    <section className="py-20 bg-slate-900/30 -mx-4 px-4 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">최근 괴이 보고서</h2>
            <p className="text-slate-400">현 시간부로 업데이트된 현장 보고 및 격리 상태입니다.</p>
          </div>
          <button 
            onClick={onSeeAll}
            className="text-sm text-red-500 font-medium hover:underline uppercase tracking-widest font-black"
          >
            아카이브 전체보기 →
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 animate-pulse font-mono text-sm">ACCESSING SECURE DATABASE...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div key={report.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-slate-600 transition-colors">
                <div className="p-1 bg-slate-800 flex justify-between items-center px-4">
                  <span className="text-[10px] font-mono text-slate-500">ID: {report.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getLevelColor(report.level)}`}>
                    {report.level}
                  </span>
                </div>
                <div className="p-6 flex-grow">
                  <h4 className="text-lg font-bold text-slate-100 mb-2">{report.location}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-4">
                    {report.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-900 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">{report.timestamp}</span>
                    <button className="text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-tighter">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AnomalyArchive;
