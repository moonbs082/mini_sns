/**
 * 신체 정보 기반 맞춤 분석 유틸
 * - 기초대사량: Mifflin-St Jeor 공식
 * - 하루 소모 칼로리(TDEE): 기초대사량 × 주간 운동 횟수별 활동 계수
 * - 근력 향상 추정: 초급자 저항운동 연구의 일반적인 향상 폭을 운동 빈도·나이로 보정한 추정치
 */

export const GENDER_OPTIONS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
];

export const GOAL_OPTIONS = [
  { value: 'muscle', label: '근육량 증가', description: '탄탄하고 큰 근육 만들기' },
  { value: 'diet', label: '체지방 감량', description: '체중을 줄이고 라인 만들기' },
  { value: 'strength', label: '근력 향상', description: '더 무거운 무게 들기' },
  { value: 'health', label: '건강·체력 관리', description: '지치지 않는 몸 만들기' },
  { value: 'rehab', label: '자세 교정·통증 완화', description: '거북목·허리 통증 개선' },
];

export const BODY_PART_OPTIONS = [
  { value: 'chest', label: '가슴' },
  { value: 'back', label: '등' },
  { value: 'shoulder', label: '어깨' },
  { value: 'arm', label: '팔' },
  { value: 'core', label: '복근' },
  { value: 'leg', label: '하체' },
  { value: 'glute', label: '엉덩이' },
];

export const WEEKLY_COUNT_OPTIONS = [
  { value: 1, label: '주 1회', description: '가볍게 시작해요' },
  { value: 2, label: '주 2회', description: '운동 습관 만들기' },
  { value: 3, label: '주 3회', description: '가장 추천하는 빈도' },
  { value: 4, label: '주 4회', description: '분할 운동 시작' },
  { value: 5, label: '주 5회', description: '본격적인 몸 만들기' },
  { value: 6, label: '주 6회 이상', description: '상급자 루틴' },
];

/**
 * value 로 옵션 label 찾기
 * @param {Array<{ value: any, label: string }>} options - 옵션 목록
 * @param {any} value - 찾을 값
 * @returns {string}
 */
export function findLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? '-';
}

/**
 * 주간 운동 횟수별 활동 계수
 * @param {number} weeklyCount - 주간 운동 횟수
 * @returns {number}
 */
function getActivityFactor(weeklyCount) {
  if (weeklyCount <= 2) return 1.375;
  if (weeklyCount <= 4) return 1.55;
  if (weeklyCount <= 5) return 1.725;
  return 1.9;
}

/**
 * BMI 구간 이름
 * @param {number} bmi - 체질량지수
 * @returns {{ label: string, color: string }}
 */
function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: '저체중', color: 'warning.main' };
  if (bmi < 23) return { label: '정상', color: 'success.main' };
  if (bmi < 25) return { label: '과체중', color: 'warning.main' };
  return { label: '비만', color: 'secondary.main' };
}

/**
 * 목표별 하루 권장 섭취 칼로리 조정값
 * @param {string} goal - 운동 목표
 * @returns {number}
 */
function getCalorieAdjustment(goal) {
  if (goal === 'diet') return -500;
  if (goal === 'muscle') return 300;
  if (goal === 'strength') return 200;
  return 0;
}

/**
 * 맞춤 분석 결과 계산
 * @param {{ gender: string, heightCm: number, weightKg: number, age: number, goal: string, targetParts: string[], weeklyCount: number }} body - 신체 정보
 * @returns {object} 분석 결과
 */
export function analyzeBody(body) {
  const { gender, heightCm, weightKg, age, goal, weeklyCount } = body;

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
  const tdee = bmr * getActivityFactor(weeklyCount);
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  const frequencyFactor = [0, 0.6, 0.8, 1, 1.1, 1.15, 1.2][Math.min(weeklyCount, 6)];
  let ageFactor = 1;
  if (age >= 60) ageFactor = 0.7;
  else if (age >= 45) ageFactor = 0.8;
  else if (age >= 30) ageFactor = 0.9;

  /** 초급자 기준 주차별 근력 향상률(%) - 4주 신경 적응, 8~12주 근비대 */
  const strengthTimeline = [
    { week: 4, label: '4주', base: 12, stage: '신경 적응기 — 동작이 익숙해지고 힘 쓰는 요령이 생겨요' },
    { week: 8, label: '8주', base: 22, stage: '근비대 시작 — 거울에서 변화가 보이기 시작해요' },
    { week: 12, label: '12주', base: 30, stage: '체형 변화기 — 주변에서 변화를 알아봐요' },
    { week: 24, label: '24주', base: 45, stage: '정체기 돌파 — 프로그램 변화가 필요해요' },
  ].map((item) => ({
    ...item,
    percent: Math.round(item.base * frequencyFactor * ageFactor),
  }));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(tdee + getCalorieAdjustment(goal)),
    proteinGram: Math.round(weightKg * (goal === 'muscle' || goal === 'strength' ? 1.8 : 1.4)),
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: getBmiCategory(bmi),
    strengthTimeline,
    firstChangeWeek: weeklyCount >= 3 ? 4 : 6,
  };
}
