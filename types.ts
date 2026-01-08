
export enum TeamType {
  CKRR = 'CKRR',
  OFFICE = 'OFFICE',
  RESEARCH = 'RESEARCH',
  CLEANUP = 'CLEANUP'
}

export interface AnomalyReport {
  id: string;
  location: string;
  description: string;
  timestamp: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TeamInfo {
  id: string;
  name: string;
  codeName: string;
  role: string;
  description: string;
  icon: string;
  details?: {
    missions: string[];
    structure: string[];
    requirements: string;
  };
}

export interface NewsAlert {
  id: string;
  content: string;
  isBreaking: boolean;
}

// Added optional properties to AgentStats to prevent property access errors in MissionModal during simulations
export interface AgentStats {
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  ability?: string;
  weapon?: string;
  photo?: string;
  class?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  gender: '여성' | '남성';
  role: string;
  class: '딜러' | '힐러' | '서포터';
  specialization: string;
  bio: string;
  // 추가된 편집 가능 속성
  age?: string;
  experience?: string;
  ability?: string;
  weapon?: string;
  photo?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  teammates: AgentStats[];
}