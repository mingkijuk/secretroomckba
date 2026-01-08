
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-5 mb-8">
              {/* Symbolic Footer Logo */}
              <div className="w-12 h-12 flex items-center justify-center border border-white/5 rounded-full">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-none stroke-current stroke-[4]">
                  <path d="M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 Z" />
                  <circle cx="50" cy="50" r="6" className="fill-white" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-slate-100 tracking-tight block">중앙괴이관리국 (CKBA)</span>
                <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase">Security Level: Grade 5 Site</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              본 웹사이트의 모든 정보는 국가 기밀로 분류되어 있으며, 무단 복제 및 배포 시 국가보안법에 따라 처벌받을 수 있습니다. 귀하의 접속 정보는 실시간으로 기록되고 있습니다.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 border border-slate-800 flex items-center justify-center text-slate-600 hover:text-white hover:border-white transition-colors cursor-pointer text-xs font-mono">KR</div>
              <div className="w-8 h-8 border border-slate-800 flex items-center justify-center text-slate-600 hover:text-white hover:border-white transition-colors cursor-pointer text-xs font-mono">EN</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center">
              <span className="w-1 h-3 bg-white mr-2 opacity-50"></span>
              관련 부처
            </h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors flex items-center">행정안전부</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">국가정보원</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">국방부 특수대응팀</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">경찰청 초자연수사부</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center">
              <span className="w-1 h-3 bg-white mr-2 opacity-50"></span>
              기술 지원
            </h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors flex items-center">보안 정책</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">데이터 아카이브</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">시스템 모니터링</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center">신고 센터</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-slate-600 uppercase font-mono tracking-[0.3em]">
          <p>© 2024 CENTRAL KOREA BUREAU OF ANOMALIES. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><span className="w-1 h-1 bg-white rounded-full mr-2"></span> SECURE</span>
            <span>IP: 127.0.0.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
