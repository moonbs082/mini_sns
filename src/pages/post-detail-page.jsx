import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentSection from '../components/post/comment-section.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';
import { formatRelativeDate } from '../utils/format-date.js';
import { isPostLiked, setPostLiked } from '../utils/liked-posts.js';
import { fetchPost } from '../utils/post-api.js';

/**
 * PostDetailPage - 게시물 상세 (이미지 · 내용 · 좋아요 · 댓글 · 삭제)
 *
 * Props: 없음 (URL 의 :postId 사용)
 *
 * Example usage:
 * <Route path="/posts/:postId" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetchPost(Number(postId)).then(({ data, error }) => {
      if (error) setErrorMessage(toKoreanErrorMessage(error));
      setPost(data);
      setIsLiked(data ? isPostLiked(data.id) : false);
      setIsLoading(false);
    });
  }, [postId]);

  const handleLike = async () => {
    if (!profile) {
      navigate('/auth', { state: { from: `/posts/${postId}` } });
      return;
    }
    const nextLiked = !isLiked;
    const { data, error } = await supabase.rpc('like_post', { p_post_id: post.id, p_delta: nextLiked ? 1 : -1 });
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    setIsLiked(nextLiked);
    setPostLiked(post.id, nextLiked);
    setPost((prev) => ({ ...prev, likes_count: data }));
  };

  const handleDelete = async () => {
    if (!window.confirm('이 게시물을 삭제할까요?')) return;
    /** 댓글은 DB 에서 ON DELETE CASCADE 로 함께 삭제됨 */
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    navigate('/posts', { replace: true });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        { errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{ errorMessage }</Alert> }
        <Box sx={{ mb: 2 }}>게시물을 찾을 수 없어요.</Box>
        <Button variant="contained" onClick={ () => navigate('/posts') }>목록으로</Button>
      </Box>
    );
  }

  const isMine = profile?.id === post.user_id;

  return (
    <Box>
      <IconButton aria-label="뒤로 가기" onClick={ () => navigate(-1) } sx={{ mb: 1, ml: -1 }}>
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <Paper elevation={ 0 } sx={{ borderRadius: 4, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.5 }}>
          <Avatar src={ post.author?.avatar_url || undefined } sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            { post.author?.display_name?.[0] }
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ fontWeight: 800 }}>{ post.author?.display_name }</Box>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              @{ post.author?.username } · { formatRelativeDate(post.created_at) }
            </Box>
          </Box>
          { isMine && (
            <IconButton aria-label="게시물 삭제" onClick={ handleDelete }>
              <DeleteOutlineIcon />
            </IconButton>
          ) }
        </Box>

        { post.image_url && (
          <Box
            component="img"
            src={ post.image_url }
            alt=""
            sx={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', bgcolor: 'grey.200' }}
          />
        ) }

        <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconButton
              aria-label={ isLiked ? '좋아요 취소' : '좋아요' }
              onClick={ handleLike }
              sx={{ color: 'secondary.main', ml: -1 }}
            >
              { isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
            </IconButton>
            <Box sx={{ fontWeight: 800 }}>좋아요 { post.likes_count }개</Box>
            <Box sx={{ ml: 'auto', fontSize: '0.875rem', color: 'text.secondary' }}>댓글 { commentCount }개</Box>
          </Box>
          { errorMessage && <Alert severity="error" sx={{ mb: 1 }}>{ errorMessage }</Alert> }
          <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, wordBreak: 'break-word' }}>{ post.caption }</Box>
        </Box>

        <Box sx={{ px: 2, pb: 2, borderTop: 1, borderColor: 'grey.200', pt: 2 }}>
          <CommentSection postId={ post.id } onCountChange={ setCommentCount } />
        </Box>
      </Paper>
    </Box>
  );
}

export default PostDetailPage;
