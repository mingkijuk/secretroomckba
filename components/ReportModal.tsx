
import React, { useState } from 'react';

interface Report {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface ReportModalProps {
  reports: Report[];
  onAddReport: (content: string) => void;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ reports, onAddReport, onClose }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddReport(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-2xl w-full border border-red-900/50 bg-slate-950 shadow-2xl relative flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-red-950/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white tracking-widest uppercase">괴이 현상 시민 제보 센터</h2>
            <p className="text-[10px] text-red-500/70 font-mono tracking-widest mt-1">PUBLIC REPORTING PORTAL // SECURE LINE</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white font-mono text-xs border border-slate-800 px-3 py-1 transition-colors">DISCONNECT</button>
        </div>

        {/* Report List (Feed) */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {reports.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                <path d="M12 20h.01M7 20h.01M17 20h.01M4 20h.01M20 20h.01M12 4v12M12 16l-4-4M12 16l4-4" />
              </svg>
              <p className="text-xs font-mono">WAITING FOR INCOMING DATA...</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="bg-slate-900/50 border border-slate-800 p-4 animate-in slide-in-from-left-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-tighter">
                    CITIZEN_{report.user}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    {report.timestamp}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {report.content}
                </p>
              </div>
            )).reverse()
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/20">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">목격 상황 상세 기술</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="장소, 괴이의 형태, 특이 사항을 입력하십시오..."
                className="flex-grow bg-black border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors font-medium"
              />
              <button 
                type="submit"
                className="bg-red-700 hover:bg-red-600 text-white px-6 font-black text-xs uppercase tracking-widest transition-all"
              >
                SUBMIT
              </button>
            </div>
            <p className="text-[9px] text-slate-600 italic">※ 허위 제보 시 국가안보법 제12조에 의거하여 처벌받을 수 있습니다.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
