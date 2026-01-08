
import React, { useState, useEffect } from 'react';
import { generateBreakingNews } from '../services/geminiService';
import { NewsAlert } from '../types';

const BreakingNewsTicker: React.FC = () => {
  const [alerts, setAlerts] = useState<NewsAlert[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await generateBreakingNews();
      setAlerts(data);
    };
    
    // 초기 호출
    fetchAlerts();
    
    // 할당량 보존을 위해 갱신 주기를 5분(300000ms)으로 연장
    const interval = setInterval(fetchAlerts, 300000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (alerts.length === 0) return null;

  // 모든 알림을 하나의 긴 문자열로 결합 (중간에 구분자 추가)
  const combinedAlerts = alerts.map(a => a.content).join(' \u00A0\u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ');

  return (
    <div className="bg-black border-y-2 border-red-600/50 h-12 flex items-center relative overflow-hidden z-[60] shadow-2xl">
      {/* 고정 라벨 부분 */}
      <div className="flex h-full items-center z-20 bg-red-700 px-4 shrink-0 shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          <span className="text-white font-black text-xs italic tracking-tighter whitespace-nowrap">CKBA LIVE NEWS</span>
        </div>
      </div>

      {/* 스크롤 티커 부분 */}
      <div className="flex-grow overflow-hidden relative h-full flex items-center bg-zinc-900">
        <div className="animate-marquee whitespace-nowrap py-1">
          <span className="text-red-500 font-bold text-sm tracking-tight inline-block mr-4 font-mono-news">
             {combinedAlerts}
          </span>
          {/* 연속성을 위해 한 번 더 반복 */}
          <span className="text-red-500 font-bold text-sm tracking-tight inline-block ml-4 font-mono-news">
             {combinedAlerts}
          </span>
        </div>
      </div>

      {/* 디지털 시계 부분 */}
      <div className="h-full bg-zinc-800 px-6 flex items-center z-20 shrink-0 border-l border-white/10 shadow-[-10px_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-white font-mono-news text-xs font-bold">
            {time.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-slate-500 text-[8px] font-mono mt-0.5 tracking-tighter">
            {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()} / KST
          </span>
        </div>
      </div>
      
      {/* 뉴스 바의 하이라이트 효과 */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 z-30"></div>
    </div>
  );
};

export default BreakingNewsTicker;
