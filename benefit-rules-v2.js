window.BENEFIT_RULES_V2 = [
  {
    id: 'incheon-safety-insurance-2026',
    title: '인천시민안전보험',
    agency: '인천광역시',
    category: '안전·생활',
    region: '인천',
    district: '',
    automaticEnrollment: true,
    applicationStatus: 'automatic',
    officialUrl: 'https://www.incheon.go.kr/IC010205/view?repDt=2026-01-20&repSeq=DOM_0000000013980881',
    lastVerifiedAt: '2026-09-10',
    rules: {
      residenceRequired: true,
      ageMin: null,
      ageMax: null,
      employmentAllowed: ['employed','jobseeker','business','student','farmer','other']
    },
    summary: '인천시에 주민등록을 둔 시민 등은 별도 가입 절차 없이 자동으로 보장받는 시민안전보험입니다.'
  },
  {
    id: 'training-card-2026',
    title: '국민내일배움카드',
    agency: '고용노동부·고용24',
    category: '교육·직업훈련',
    region: '전국',
    district: '',
    automaticEnrollment: false,
    applicationStatus: 'open_or_ongoing',
    officialUrl: 'https://www.work24.go.kr/hr/h/a/1100/selectIssuGudn.do',
    lastVerifiedAt: '2026-09-10',
    rules: {
      ageMin: null,
      ageMax: 74,
      employmentAllowed: ['employed','jobseeker','business','student','farmer','other'],
      exclusionsNeedCheck: true
    },
    summary: '직업훈련과 역량개발을 지원하는 카드입니다. 일부 직군·소득·신분 조건은 추가 확인이 필요합니다.'
  },
  {
    id: 'incheon-middle-career-2026',
    title: '잡스인천 중장년 취업·경력설계 지원',
    agency: '인천광역시·인천테크노파크',
    category: '일자리·경력',
    region: '인천',
    district: '',
    automaticEnrollment: false,
    applicationStatus: 'check_current_program',
    officialUrl: 'https://www.incheon.go.kr/jobs/jobsincheon/pst/view.do?pst_id=o_notice&pst_sn=1632&search=',
    lastVerifiedAt: '2026-09-10',
    rules: {
      residenceRequired: true,
      ageMin: 40,
      ageMax: 69,
      employmentAllowed: ['employed','jobseeker','business','other']
    },
    summary: '인천 거주 40~60대 중장년을 대상으로 상담, 경력진단, 진로탐색, 취업·경력설계를 지원합니다.'
  },
  {
    id: 'incheon-ipass-2026',
    title: '인천 i-패스',
    agency: '인천광역시',
    category: '교통',
    region: '인천',
    district: '',
    automaticEnrollment: false,
    applicationStatus: 'ongoing',
    officialUrl: 'https://www.incheon.go.kr/traffic/TR080201',
    lastVerifiedAt: '2026-09-10',
    rules: {
      residenceRequired: true,
      ageMin: 19,
      ageMax: null,
      employmentAllowed: ['employed','jobseeker','business','student','farmer','other'],
      needsPublicTransitUse: true
    },
    summary: '인천 시민의 대중교통비 부담을 줄이는 제도입니다. 실제 이용 여부에 따라 실질 혜택이 달라집니다.'
  },
  {
    id: 'housing-benefit-2026',
    title: '주거급여',
    agency: '국토교통부·보건복지부',
    category: '주거',
    region: '전국',
    district: '',
    automaticEnrollment: false,
    applicationStatus: 'ongoing',
    officialUrl: 'https://www.bokjiro.go.kr/',
    lastVerifiedAt: '2026-09-10',
    rules: {
      ageMin: null,
      ageMax: null,
      employmentAllowed: ['employed','jobseeker','business','student','farmer','other'],
      requiresIncomeAssetsCheck: true
    },
    summary: '소득인정액 등 기준을 충족하는 가구의 주거비를 지원합니다. 단순 월급만으로 자격을 확정할 수 없습니다.'
  },
  {
    id: 'middle-career-support-unemployed-2026',
    title: '중장년 경력지원제',
    agency: '고용노동부',
    category: '일자리·경력',
    region: '전국',
    district: '',
    automaticEnrollment: false,
    applicationStatus: 'check_current_program',
    officialUrl: 'https://www.incheon.go.kr/jobs/main/support/business/view.do?plcy_sprt_sn=2646',
    lastVerifiedAt: '2026-09-10',
    rules: {
      birthYearMin: 1961,
      birthYearMax: 1976,
      employmentAllowed: ['jobseeker','other'],
      unemploymentRequired: true
    },
    summary: '주된 일자리에서 퇴직 후 전직·재취업을 준비하는 중장년 대상 경력지원 프로그램입니다.'
  },
  {
    id: 'namdong-youth-challenge-2026',
    title: '남동구 청년도전 지원사업',
    agency: '인천광역시 남동구',
    category: '청년·일자리',
    region: '인천',
    district: '남동구',
    automaticEnrollment: false,
    applicationStatus: 'check_current_program',
    officialUrl: '',
    lastVerifiedAt: '2026-09-10',
    rules: {
      residenceRequired: true,
      ageMin: 19,
      ageMax: 39,
      employmentAllowed: ['jobseeker','other']
    },
    summary: '구직단념청년 등 청년층의 노동시장 참여를 돕는 지원사업입니다.'
  }
];
