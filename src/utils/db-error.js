/**
 * Supabase/DB 오류를 사용자에게 보여줄 한국어 메시지로 변환
 * @param {object} error - Supabase 오류 객체
 * @returns {string}
 */
export function toKoreanErrorMessage(error) {
  if (!error) return '';
  const message = error.message || '';

  if (error.code === '23505' || message.includes('users_display_name_lower_idx')) {
    return '이미 사용 중인 표시 이름입니다.';
  }
  if (message.includes('사용할 수 없는 표시 이름')) {
    return '사용할 수 없는 단어가 포함된 표시 이름입니다.';
  }
  if (message.includes('Database error saving new user')) {
    return '표시 이름이 이미 사용 중이거나 사용할 수 없는 단어가 포함되어 있습니다.';
  }
  if (message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (message.includes('Email not confirmed')) {
    return '메일 인증이 아직 완료되지 않았습니다. 받은 편지함을 확인해 주세요.';
  }
  if (message.includes('User already registered')) {
    return '이미 가입된 이메일입니다.';
  }
  if (message.includes('Password should be at least')) {
    return '비밀번호는 6자 이상이어야 합니다.';
  }
  if (message.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (message.includes('check constraint')) {
    return '입력값이 허용 범위를 벗어났습니다. 글자 수를 확인해 주세요.';
  }
  return message || '알 수 없는 오류가 발생했습니다.';
}
