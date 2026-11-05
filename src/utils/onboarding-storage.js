/**
 * 온보딩(신체 정보 입력) 결과 브라우저 저장
 * - 회원가입 전에 입력한 정보를 보관했다가, 로그인되면 body_profiles 테이블에 저장한다.
 */
const STORAGE_KEY = 'hmm_onboarding';

/**
 * 저장된 온보딩 정보 읽기
 * @returns {{ body: object, isSynced: boolean } | null}
 */
export function readOnboarding() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * 온보딩 정보 저장
 * @param {object} body - 신체 정보
 * @param {boolean} isSynced - DB 저장 완료 여부
 */
export function saveOnboarding(body, isSynced = false) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ body, isSynced }));
  } catch {
    /** 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 무시 */
  }
}

/**
 * 화면용 신체 정보(camelCase) → body_profiles 행(snake_case)
 * @param {object} body - 신체 정보
 * @param {number} userId - users.id
 * @returns {object}
 */
export function toBodyProfileRow(body, userId) {
  return {
    user_id: userId,
    gender: body.gender,
    height_cm: body.heightCm,
    weight_kg: body.weightKg,
    age: body.age,
    goal: body.goal,
    target_parts: body.targetParts,
    weekly_count: body.weeklyCount,
    updated_at: new Date().toISOString(),
  };
}

/**
 * body_profiles 행(snake_case) → 화면용 신체 정보(camelCase)
 * @param {object} row - body_profiles 행
 * @returns {object}
 */
export function fromBodyProfileRow(row) {
  return {
    gender: row.gender,
    heightCm: Number(row.height_cm),
    weightKg: Number(row.weight_kg),
    age: row.age,
    goal: row.goal,
    targetParts: row.target_parts ?? [],
    weeklyCount: row.weekly_count,
  };
}
