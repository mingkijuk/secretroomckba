
import { TeamInfo, AgentProfile } from './types';

export const TEAMS: TeamInfo[] = [
  {
    id: 'ckrr',
    name: '전투팀',
    codeName: 'CKRR',
    role: '현장 제압 및 무력 격리',
    description: '괴이 현상 발생 시 가장 먼저 현장에 투입되어 물리적 타격과 무력 격리를 수행하는 특수 부대입니다.',
    icon: 'ckrr',
    details: {
      missions: [
        '최우선 격리 구역 확보 및 민간인 접근 차단',
        '고위험 등급(CRITICAL) 괴이 대상 무력화 작전 수행',
        '현장 요원 구조 및 안전 퇴로 확보'
      ],
      structure: [
        '제1타격대 (시가전 특화)',
        '제2타격대 (비정형 실체 대응)',
        '공중 지원 및 저격 지원조'
      ],
      requirements: '특수부대 5년 이상 경력 및 정신 오염 저항 수치(PSI) 80 이상 필수'
    }
  },
  {
    id: 'research',
    name: '연구팀',
    codeName: 'RESEARCH',
    role: '기원 분석 및 약점 파악',
    description: '발생한 괴이의 기원, 작동 원리 및 물리적/영적 약점을 분석하여 대응 가이드를 제작합니다.',
    icon: 'research',
    details: {
      missions: [
        '괴이 개체의 생물학적/비물리적 구성 성분 분석',
        '차원 물리학 연구실',
        '봉인 및 부적 공학실'
      ],
      structure: [
        '생체 해부 분석과',
        '차원 물리학 연구실',
        '봉인 및 부적 공학실'
      ],
      requirements: '관련 분야 박사 학위 소지 및 비일상적 현상에 대한 개방적 사고 역량'
    }
  },
  {
    id: 'office',
    name: '사무팀',
    codeName: 'OFFICE',
    role: '정보 통제 및 자원 운용',
    description: '대국민 정보 통제, 미디어 필터링 및 각 부서간의 자원 분배와 행정 업무를 총괄합니다.',
    icon: 'office',
    details: {
      missions: [
        'SNS 및 미디어 실시간 필터링 (가스 누출, 집단 환각 등으로 위장)',
        '기억 소거 장치(V-Flash) 운영 승인 및 기록 관리',
        '부서별 작전 예산 편성 및 자원 조달'
      ],
      structure: [
        '대외협력 홍보실 (은폐 전담)',
        '자원관리 운영실',
        '법무 및 보안 감사실'
      ],
      requirements: '고도의 상황 판단력 및 비밀 엄수 서약(정부 1급 기밀)'
    }
  },
  {
    id: 'cleanup',
    name: '후처리팀',
    codeName: 'CLEANUP',
    role: '현장 정화 및 증거 인멸',
    description: '상황 종료 후 현장의 오염된 환경을 정화하고, 민간에 남은 잔류 흔적을 완벽히 제거합니다.',
    icon: 'cleanup',
    details: {
      missions: [
        '전투 현장 내 혈흔, 점액질, 차원 잔여물 물리적 제거',
        '잔류 정신 오염 농도 정화 및 정적 복구',
        '민간 파손 시설에 대한 국가 보상 대행 및 현장 복구'
      ],
      structure: [
        '물리 정화 기동조',
        '정신 잔류물 정화팀',
        '시설 복구 협력단'
      ],
      requirements: '강인한 체력 및 정서적 회복 탄력성, 특수 청소 자격증 보유자 우대'
    }
  }
];

export const CKRR_AGENTS: AgentProfile[] = [
  { 
    id: 'AGT-001', 
    name: '아리스가와 바토리', 
    gender: '여성', 
    role: '아탈란테', 
    class: '딜러', 
    specialization: 'CKRR 제1타격대장', 
    bio: 'CKBA 설립 초기부터 활동해온 전설적인 요원입니다.',
    experience: '10년 이상',
    age: '31',
    ability: '혈액 조작',
    weapon: '쌍검'
  },
  { 
    id: 'AGT-010', 
    name: '정이혁', 
    gender: '남성', 
    role: '청랑', 
    class: '딜러', 
    specialization: '현장 전술 지휘관', 
    bio: '냉철한 판단력과 압도적인 화력을 보유한 베테랑입니다.',
    experience: '10년',
    age: '32',
    ability: '물체 조작',
    weapon: '도끼, 권총 두자루'
  },
  { 
    id: 'AGT-008', 
    name: '류해', 
    gender: '여성', 
    role: '바다', 
    class: '딜러', 
    specialization: '광역 제압 전문가', 
    bio: '수분 제어 능력을 통해 현장을 순식간에 동결시킵니다.',
    experience: '8년',
    age: '30',
    ability: '하이드로케네시스',
    weapon: '고드름'
  },
  { 
    id: 'AGT-011', 
    name: '도호연', 
    gender: '여성', 
    role: '오즈', 
    class: '딜러', 
    specialization: '암살 및 침투', 
    bio: '독을 사용하여 소리 없이 괴이를 무력화합니다.',
    experience: '7년',
    age: '32',
    ability: '포이즌',
    weapon: '권총'
  },
  { 
    id: 'AGT-002', 
    name: '하타케야마 켄쇼', 
    gender: '남성', 
    role: '켄쇼', 
    class: '딜러', 
    specialization: '근접전 돌격수', 
    bio: '이능력이 없음에도 불구하고 순수 무력으로 정점의 자리에 올랐습니다.',
    experience: '6년',
    age: '28',
    ability: '이능력 없음',
    weapon: '총검'
  },
  { 
    id: 'AGT-007', 
    name: '서요한', 
    gender: '남성', 
    role: '요한', 
    class: '딜러', 
    specialization: '특수 궤적 타격', 
    bio: '예측 불가능한 사복검의 궤적으로 적을 유린합니다.',
    experience: '6년',
    age: '26',
    ability: '익스센스',
    weapon: '사복검'
  },
  { 
    id: 'AGT-003', 
    name: '쿠로사키 유우', 
    gender: '남성', 
    role: '밀크', 
    class: '힐러', 
    specialization: '전술 의료 지원', 
    bio: '최전방에서 요원들의 생존율을 보장하는 핵심 인력입니다.',
    experience: '5년',
    age: '27',
    ability: '레드크로스',
    weapon: '회복액 분사기'
  },
  { 
    id: 'AGT-006', 
    name: '백형운', 
    gender: '남성', 
    role: '초원', 
    class: '서포터', 
    specialization: '신경 차단 및 마취', 
    bio: '자체 제작한 특수 약물로 적의 감각을 마비시킵니다.',
    experience: '2.5년',
    age: '26',
    ability: '통각조작, 수면마취',
    weapon: '자체제작 무기'
  },
  { 
    id: 'AGT-005', 
    name: '심영운', 
    gender: '남성', 
    role: '구름이', 
    class: '힐러', 
    specialization: '정신 및 외상 치유', 
    bio: '부드러운 기운으로 동료들의 상처를 어루만집니다.',
    experience: '2년',
    age: '25',
    ability: '접촉 힐',
    weapon: '스태프'
  },
  { 
    id: 'AGT-004', 
    name: '클라우스 퐁 에이프릴', 
    gender: '여성', 
    role: '에이프릴', 
    class: '서포터', 
    specialization: '심해 구속 및 디버프', 
    bio: '심해의 공포를 불러일으켜 괴이의 움직임을 봉쇄합니다.',
    experience: '1.5년',
    age: '24',
    ability: '신속의 발톱, 심해의 속삭임, 크툴루스 체인',
    weapon: '촉수'
  },
  { 
    id: 'AGT-009', 
    name: '안여울', 
    gender: '여성', 
    role: '여울', 
    class: '서포터', 
    specialization: '정보 수집 및 탐지', 
    bio: '물건에 남은 기억을 읽어 괴이의 흔적을 추적합니다.',
    experience: '3개월',
    age: '19',
    ability: '사이코메트리',
    weapon: '호신용 가스총'
  }
];

export const REGIONS = ['서울시', '부산시', '대구시', '인천시', '광주시', '대전시', '울산시', '세종시', '경기도', '강원도', '충청도', '전라도', '경상도', '제주도'];
