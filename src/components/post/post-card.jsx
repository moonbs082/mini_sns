import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { formatRelativeDate } from '../../utils/format-date.js';

/**
 * PostCard 컴포넌트 - 게시물 목록의 카드 한 개 (누르면 상세 페이지로)
 *
 * Props:
 * @param {object} post - fetchPosts() 로 조회한 게시물 [Required]
 *
 * Example usage:
 * <PostCard post={ post } />
 */
function PostCard({ post }) {
  return (
    <Card elevation={ 0 } sx={{ borderRadius: 4, border: 1, borderColor: 'grey.200' }}>
      <CardActionArea component={ RouterLink } to={ `/posts/${post.id}` }>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.5 }}>
          <Avatar src={ post.author?.avatar_url || undefined } sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            { post.author?.display_name?.[0] }
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Box sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{ post.author?.display_name }</Box>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              @{ post.author?.username } · { formatRelativeDate(post.created_at) }
            </Box>
          </Box>
        </Box>
        { post.image_url && (
          <Box
            component="img"
            src={ post.image_url }
            alt=""
            loading="lazy"
            sx={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', bgcolor: 'grey.200' }}
          />
        ) }
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.875rem', mb: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteBorderIcon fontSize="small" sx={{ color: 'secondary.main' }} />
              { post.likes_count }
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChatBubbleOutlineIcon fontSize="small" />
              { post.commentCount }
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: '0.95rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              whiteSpace: 'pre-line',
            }}
          >
            { post.caption }
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
