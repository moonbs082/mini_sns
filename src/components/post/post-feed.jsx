import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import PostCard from './post-card.jsx';
import { fetchPosts } from '../../utils/post-api.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

/**
 * PostFeed 컴포넌트 - 게시물 카드 목록 (불러오기 · 로딩 · 빈 화면 처리)
 *
 * Props:
 * @param {number} userId - 특정 사용자 게시물만 보기 [Optional]
 * @param {number} limit - 최대 개수 [Optional, 기본값: 30]
 * @param {string} emptyMessage - 게시물이 없을 때 문구 [Optional, 기본값: '아직 게시물이 없어요.']
 *
 * Example usage:
 * <PostFeed limit={ 5 } />
 */
function PostFeed({ userId, limit = 30, emptyMessage = '아직 게시물이 없어요.' }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    fetchPosts({ userId, limit }).then(({ data, error }) => {
      if (isCancelled) return;
      if (error) setErrorMessage(toKoreanErrorMessage(error));
      setPosts(data);
      setIsLoading(false);
    });
    return () => {
      isCancelled = true;
    };
  }, [userId, limit]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        { [0, 1].map((item) => (
          <Skeleton key={ item } variant="rounded" height={ 320 } sx={{ borderRadius: 4 }} />
        )) }
      </Box>
    );
  }

  if (errorMessage) {
    return <Alert severity="error">{ errorMessage }</Alert>;
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary', bgcolor: 'background.paper', borderRadius: 4 }}>
        { emptyMessage }
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      { posts.map((post) => <PostCard key={ post.id } post={ post } />) }
    </Box>
  );
}

export default PostFeed;
