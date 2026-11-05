import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import PageTitle from '../components/common/page-title.jsx';
import PostFeed from '../components/post/post-feed.jsx';

/**
 * PostListPage - 커뮤니티 게시물 목록 (오운완 인증 · 운동 이야기)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/posts" element={ <PostListPage /> } />
 */
function PostListPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageTitle
        title="커뮤니티"
        subtitle="오늘의 운동을 인증하고 서로 응원해요"
        action={ (
          <Button variant="contained" color="secondary" startIcon={ <AddIcon /> } onClick={ () => navigate('/posts/new') }>
            글쓰기
          </Button>
        ) }
      />
      <PostFeed emptyMessage="첫 번째 운동 인증 게시물을 올려보세요!" />
    </Box>
  );
}

export default PostListPage;
