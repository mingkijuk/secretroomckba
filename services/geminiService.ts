
import { NewsAlert, AnomalyReport } from "../types";

// Always use a named parameter and direct process.env.API_KEY reference
// 캐시 키 및 설정
const CACHE_KEYS = {
  NEWS: 'ckba_news_cache_v3',
  REPORTS: 'ckba_reports_cache_v3'
};

const CACHE_TTL = 30 * 60 * 1000; // 30분 동안 캐시 유지

interface CacheData<T> {
  data: T;
  timestamp: number;
}

// 로컬 스토리지 헬퍼
const getCache = <T>(key: string): T | null => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as CacheData<T>;
    const now = Date.now();
    
    // 캐시가 유효 기간 내에 있는지 확인
    if (now - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
};

const getStaleCache = <T>(key: string): T | null => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as CacheData<T>;
    return parsed.data;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: any) => {
  try {
    const cacheObject: CacheData<any> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (e) {
    console.warn("Failed to save cache", e);
  }
};

export const generateBreakingNews = async (): Promise<NewsAlert[]> => {
  const validCache = getCache<NewsAlert[]>(CACHE_KEYS.NEWS);
  if (validCache) return validCache;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "대한민국 가상의 괴이 관리국(CKBA)의 실시간 긴박한 속보 5개를 반드시 '한국어'로 생성해줘. 각 속보는 '[긴급속보] HH:mm [장소] [상황 설명] ... [시민 대응 지침]' 형식을 가져야 해. 대한민국 지명을 사용하고 매우 기괴하고 긴박한 톤으로 작성해줘.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              content: { type: Type.STRING, description: "한국어로 작성된 긴급 속보 내용" },
              isBreaking: { type: Type.BOOLEAN }
            },
            required: ["id", "content", "isBreaking"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      setCache(CACHE_KEYS.NEWS, data);
      return data;
    }
    throw new Error("Empty response");
  } catch (error: any) {
    const staleCache = getStaleCache<NewsAlert[]>(CACHE_KEYS.NEWS);
    if (staleCache) return staleCache;

    return [
      { id: 'f1', content: '[긴급속보] 23:45 서울시 종로구 일대 비정형 안개 확산... 가시거리 1m 미만. 해당 구역 진입을 절대 금하며 고지대로 대피하십시오.', isBreaking: true },
      { id: 'f2', content: '[경보] 22:15 경기도 가평군 인근 산간 지역 중력 이상 감지... 보행 시 안전 장구를 착용하고 낙하물에 주의하십시오.', isBreaking: true },
      { id: 'f3', content: '[행정안전부] 괴이 출몰 빈도 급증에 따른 국가 비상 단계 2단계 격상. 야간 외출을 자제하고 실내 보안을 강화하십시오.', isBreaking: false },
      { id: 'f4', content: '[속보] 부산시 해운대구 해안가 미확인 거대 실체 식별... 해안 도로 전면 통제 및 인근 주민 지하 대피소 이동 명령.', isBreaking: true },
      { id: 'f5', content: '[공지] CKRR 제1타격대 인천 송도 구역 작전 성공. 해당 지역 오염도 정화 작업 중으로 06시까지 통행이 제한됩니다.', isBreaking: false }
    ];
  }
};

export const generateAnomalyReports = async (): Promise<AnomalyReport[]> => {
  const validCache = getCache<AnomalyReport[]>(CACHE_KEYS.REPORTS);
  if (validCache) return validCache;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "최근 대한민국에서 발생한 가상의 괴이 현상 보고서 6개를 반드시 '한국어'로 생성해줘. 상세한 설명(description)과 구체적인 국내 장소(location)를 포함해야 해. 등급은 LOW, MEDIUM, HIGH, CRITICAL 중 하나로 설정해줘.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              location: { type: Type.STRING, description: "한국어로 된 발생 장소 (예: 서울시 강남구 테헤란로)" },
              description: { type: Type.STRING, description: "한국어로 된 괴이 현상 상세 보고 내용" },
              timestamp: { type: Type.STRING },
              level: { type: Type.STRING }
            },
            required: ["id", "location", "description", "timestamp", "level"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      setCache(CACHE_KEYS.REPORTS, data);
      return data;
    }
    throw new Error("Empty response");
  } catch (error: any) {
    const staleCache = getStaleCache<AnomalyReport[]>(CACHE_KEYS.REPORTS);
    if (staleCache) return staleCache;

    return [
      {
        id: 'REF-9921',
        location: '서울 서초구 지하철 환승 통로',
        description: '벽면에서 자라나는 인간형 거울 실체들이 승객의 그림자를 포획하는 현상 발생. CKRR 투입 후 해당 거울면 파쇄 및 임시 봉인 완료.',
        timestamp: '2024-05-20 03:22',
        level: 'CRITICAL'
      },
      {
        id: 'REF-8810',
        location: '강원도 평창군 폐광촌',
        description: '폐광 내부에서 저주파 비명소리가 지속적으로 발생하여 인근 가축들이 집단 폐사함. 연구팀 분석 결과 차원 균열로 인한 음향 간섭으로 판명.',
        timestamp: '2024-05-19 14:10',
        level: 'HIGH'
      },
      {
        id: 'REF-7723',
        location: '대전 유성구 연구단지 인근',
        description: '시간이 5초 단위로 반복되는 국소적 타임 루프 구역 형성. 물리적 피해는 없으나 보행자들의 극심한 혼란 야기. 현재 사무팀에서 정보 통제 중.',
        timestamp: '2024-05-18 09:45',
        level: 'MEDIUM'
      }
    ];
  }
};
