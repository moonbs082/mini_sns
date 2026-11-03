import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from '../components/post/post-card.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';
import { POST_SELECT } from '../utils/post-query.js';

const PAGE_SIZE = 10;

/**
 * FeedPage 컴포넌트 - 전체 게시물 피드 (최신순, 10개씩 더 보기)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/" element={ <FeedPage /> } />
 */
function FeedPage() {
  const { session } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPosts = useCallback(async (offset) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);
    setIsLoading(false);

    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    setPosts((prev) => (offset === 0 ? data : [...prev, ...data]));
    setHasMore(data.length === PAGE_SIZE);
  }, []);

  useEffect(() => {
    loadPosts(0);
  }, [loadPosts]);

  const handleDeleted = (postId) => setPosts((prev) => prev.filter((post) => post.id !== postId));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

      { !isLoading && posts.length === 0 && !errorMessage && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          아직 게시물이 없어요. 첫 운동 기록을 올려보세요!
          <Button component={ RouterLink } to={ session ? '/new' : '/login' } variant="contained">
            { session ? '첫 게시물 쓰기' : '로그인하고 시작하기' }
          </Button>
        </Box>
      ) }

      { posts.map((post) => (
        <PostCard key={ post.id } post={ post } onDeleted={ handleDeleted } />
      )) }

      { isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) }

      { !isLoading && hasMore && (
        <Button onClick={ () => loadPosts(posts.length) } sx={{ alignSelf: 'center' }}>
          더 보기
        </Button>
      ) }
    </Box>
  );
}

export default FeedPage;
