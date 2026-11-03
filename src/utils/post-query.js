/** 피드/프로필에서 공통으로 쓰는 게시물 조회 컬럼 (작성자 정보 + 댓글 수 포함) */
export const POST_SELECT = '*, users(id, display_name, avatar_url), comments(count)';
