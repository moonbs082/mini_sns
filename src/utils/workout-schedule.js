import { BODY_PART_OPTIONS, findLabel } from './body-analysis.js';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

/** 주간 운동 횟수별 요일 배치 (0=월 ~ 6=일) - 휴식일이 고르게 들어가도록 */
const DAY_PATTERNS = {
  1: [2],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

/**
 * Date → 'YYYY-MM-DD' (로컬 시간 기준)
 * @param {Date} date - 날짜
 * @returns {string}
 */
export function toDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * 이번 주 월요일 구하기
 * @param {Date} baseDate - 기준 날짜
 * @returns {Date}
 */
function getMonday(baseDate) {
  const monday = new Date(baseDate);
  const diff = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * 이번 주(월~일) 운동 일정 만들기
 * - 주간 운동 횟수에 맞춰 요일을 고르게 배치하고, 키우고 싶은 부위를 순서대로 돌려가며 배정
 * @param {number} weeklyCount - 주간 운동 횟수
 * @param {string[]} targetParts - 키우고 싶은 부위 값 목록
 * @param {Date} baseDate - 기준 날짜 [기본값: 오늘]
 * @returns {Array<{ key: string, dayName: string, dateNumber: number, isWorkout: boolean, isToday: boolean, isPast: boolean, focus: string }>}
 */
export function buildWeeklySchedule(weeklyCount, targetParts, baseDate = new Date()) {
  const monday = getMonday(baseDate);
  const todayKey = toDateKey(baseDate);
  const workoutDays = DAY_PATTERNS[Math.min(Math.max(weeklyCount, 1), 7)];
  const parts = targetParts.length > 0 ? targetParts : ['chest', 'back', 'leg'];

  let workoutIndex = 0;
  return DAY_NAMES.map((dayName, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = toDateKey(date);
    const isWorkout = workoutDays.includes(index);
    let focus = '휴식';
    if (isWorkout) {
      focus = `${findLabel(BODY_PART_OPTIONS, parts[workoutIndex % parts.length])} 집중`;
      workoutIndex += 1;
    }
    return {
      key,
      dayName,
      dateNumber: date.getDate(),
      isWorkout,
      isToday: key === todayKey,
      isPast: key < todayKey,
      focus,
    };
  });
}
