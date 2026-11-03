/**
 * 작성일을 "방금 전", "3시간 전", "2026. 11. 3." 형태로 변환
 * @param {string} isoString - ISO 날짜 문자열
 * @returns {string}
 */
export function formatRelativeDate(isoString) {
  const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);

  if (diffSeconds < 60) return '방금 전';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}분 전`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}시간 전`;
  if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}일 전`;

  return new Date(isoString).toLocaleDateString('ko-KR');
}

/**
 * 가입일 등을 "2026년 11월 3일" 형태로 변환
 * @param {string} isoString - ISO 날짜 문자열
 * @returns {string}
 */
export function formatFullDate(isoString) {
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
