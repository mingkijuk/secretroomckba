
import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (name: string) => void;
  onClose: () => void;
  allowedNames: string[];
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, allowedNames }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allowedNames.includes(name.trim())) {
      onLogin(name.trim());
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-md w-full border border-slate-800 bg-slate-950 p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 border border-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-500">
              <path d="M12 11V7a4 4 0 018 0v4m-8 0a4 4 0 00-8 0v4m8-4V7m0 4v10M4 11v10m16-10v10" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase">Agent Authentication</h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1 uppercase">Central Korea Bureau of Anomalies Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">요원 식별 성명</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성명을 입력하십시오"
              className={`w-full bg-black border ${error ? 'border-red-600 animate-shake' : 'border-slate-800'} px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-all font-medium text-center`}
              autoFocus
            />
            {error && (
              <p className="text-[10px] text-red-600 font-bold mt-2 text-center animate-pulse">
                [경고] 인가되지 않은 요원 성명입니다. 접근이 거부되었습니다.
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-red-700 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              Authorize
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-[0.2em]">
          <span>Security Protocol: v.4.0.1</span>
          <span>Encrypted: Site-to-Site</span>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
