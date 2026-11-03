/**
 * 좋아요 누른 게시물 기록 (브라우저 저장소)
 * - DB 설계상 좋아요는 likes_count 숫자만 저장하므로(별도 테이블 없음)
 *   "내가 눌렀는지"는 이 브라우저에만 기억한다.
 */
const STORAGE_KEY = 'mini_sns_liked_posts';

function readLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

/**
 * @param {number} postId - 게시물 id
 * @returns {boolean} 좋아요 눌렀는지 여부
 */
export function isPostLiked(postId) {
  return readLikedIds().has(postId);
}

/**
 * @param {number} postId - 게시물 id
 * @param {boolean} isLiked - 좋아요 상태
 */
export function setPostLiked(postId, isLiked) {
  const ids = readLikedIds();
  if (isLiked) {
    ids.add(postId);
  } else {
    ids.delete(postId);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /** 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 무시 */
  }
}
