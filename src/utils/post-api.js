import { supabase } from '../lib/supabase.js';

/** 게시물 + 작성자 + 댓글 수 조회 컬럼 */
const POST_COLUMNS = `
  id, caption, image_url, likes_count, created_at, user_id,
  author:users!posts_user_id_fkey ( id, username, display_name, avatar_url ),
  comments ( count )
`;

/**
 * 댓글 수 집계 결과를 숫자로 펼치기
 * @param {object} post - 조회한 게시물
 * @returns {object}
 */
function normalizePost(post) {
  return { ...post, commentCount: post.comments?.[0]?.count ?? 0 };
}

/**
 * 게시물 목록 조회 (최신순)
 * @param {{ userId: number, limit: number }} options - 특정 사용자 게시물만 / 개수 제한
 * @returns {Promise<{ data: object[], error: object|null }>}
 */
export async function fetchPosts({ userId, limit = 30 } = {}) {
  let query = supabase
    .from('posts')
    .select(POST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query;
  return { data: (data ?? []).map(normalizePost), error };
}

/**
 * 게시물 한 개 조회
 * @param {number} postId - 게시물 id
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function fetchPost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLUMNS)
    .eq('id', postId)
    .maybeSingle();
  return { data: data ? normalizePost(data) : null, error };
}
