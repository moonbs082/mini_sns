import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/use-auth.js';
import { formatRelativeDate } from '../../utils/format-date.js';
import { isPostLiked, setPostLiked } from '../../utils/liked-posts.js';
import CommentSection from './comment-section.jsx';
import ScheduleTable from './schedule-table.jsx';

/**
 * PostCard 컴포넌트 - 피드의 게시물 하나 (작성자, 이미지, 영상, 운동 기록, 좋아요, 댓글)
 *
 * Props:
 * @param {object} post - posts 행 + users(작성자) + comments(count) [Required]
 * @param {function} onDeleted - 게시물 삭제 후 호출 (게시물 id 전달) [Optional]
 *
 * Example usage:
 * <PostCard post={ post } onDeleted={ handleDeleted } />
 */
function PostCard({ post, onDeleted }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiked, setIsLiked] = useState(() => isPostLiked(post.id));
  const [isLiking, setIsLiking] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.[0]?.count ?? 0);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const author = post.users;
  const isMine = profile?.id === post.user_id;

  const handleLike = async () => {
    if (!profile) {
      navigate('/login');
      return;
    }
    if (isLiking) return;

    const nextLiked = !isLiked;
    setIsLiking(true);
    /** 화면을 먼저 바꾸고(낙관적 업데이트) 실패하면 되돌림 */
    setIsLiked(nextLiked);
    setLikesCount((count) => Math.max(count + (nextLiked ? 1 : -1), 0));

    const { data, error } = await supabase.rpc('like_post', {
      p_post_id: post.id,
      p_delta: nextLiked ? 1 : -1,
    });
    setIsLiking(false);

    if (error) {
      setIsLiked(!nextLiked);
      setLikesCount(post.likes_count);
      return;
    }
    setLikesCount(data);
    setPostLiked(post.id, nextLiked);
  };

  const handleDelete = async () => {
    setMenuAnchor(null);
    if (!window.confirm('이 게시물을 삭제할까요?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (!error) onDeleted?.(post.id);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={ (
          <Avatar
            component={ RouterLink }
            to={ `/profile/${post.user_id}` }
            src={ author?.avatar_url || undefined }
            aria-label={ `${author?.display_name} 프로필` }
          >
            { author?.display_name?.[0] }
          </Avatar>
        ) }
        title={ (
          <Box
            component={ RouterLink }
            to={ `/profile/${post.user_id}` }
            sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none' }}
          >
            { author?.display_name }
          </Box>
        ) }
        subheader={ formatRelativeDate(post.created_at) }
        action={ isMine && (
          <IconButton aria-label="게시물 메뉴" onClick={ (event) => setMenuAnchor(event.currentTarget) }>
            <MoreVertIcon />
          </IconButton>
        ) }
      />
      <Menu anchorEl={ menuAnchor } open={ Boolean(menuAnchor) } onClose={ () => setMenuAnchor(null) }>
        <MenuItem onClick={ handleDelete } sx={{ color: 'error.main' }}>삭제</MenuItem>
      </Menu>

      { post.image_url && (
        <Box
          component="img"
          src={ post.image_url }
          alt={ post.caption || '게시물 이미지' }
          loading="lazy"
          sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', bgcolor: 'action.hover' }}
        />
      ) }

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: -1 }}>
          <IconButton
            aria-label={ isLiked ? '좋아요 취소' : '좋아요' }
            onClick={ handleLike }
            color={ isLiked ? 'secondary' : 'default' }
          >
            { isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
          <IconButton aria-label="댓글 보기" onClick={ () => setIsCommentsOpen((open) => !open) }>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Box>

        <Box sx={{ fontWeight: 600, fontSize: '0.875rem', mt: -1 }}>좋아요 { likesCount }개</Box>

        { post.caption && (
          <Box sx={{ fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>{ author?.display_name }</Box>
            { post.caption }
          </Box>
        ) }

        { post.video_url && (
          <Box component="video" src={ post.video_url } controls preload="metadata" sx={{ width: '100%', borderRadius: 2, bgcolor: 'black' }} />
        ) }

        <ScheduleTable schedule={ post.schedule } />

        <Box
          component="button"
          type="button"
          onClick={ () => setIsCommentsOpen((open) => !open) }
          sx={{
            alignSelf: 'flex-start',
            border: 0,
            p: 0,
            bgcolor: 'transparent',
            color: 'text.secondary',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          { isCommentsOpen ? '댓글 숨기기' : `댓글 ${commentCount}개 보기` }
        </Box>

        <Collapse in={ isCommentsOpen } unmountOnExit>
          <CommentSection postId={ post.id } onCountChange={ setCommentCount } />
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default PostCard;
