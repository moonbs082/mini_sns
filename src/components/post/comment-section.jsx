import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/use-auth.js';
import { formatRelativeDate } from '../../utils/format-date.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

/**
 * CommentSection 컴포넌트 - 게시물의 댓글 목록과 댓글 입력창
 *
 * Props:
 * @param {number} postId - 댓글을 불러올 게시물 id [Required]
 * @param {function} onCountChange - 댓글 수가 바뀔 때 호출 (새 개수 전달) [Optional]
 *
 * Example usage:
 * <CommentSection postId={ post.id } onCountChange={ setCommentCount } />
 */
function CommentSection({ postId, onCountChange }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, users(id, display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    setComments(data);
    onCountChange?.(data.length);
  }, [postId, onCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !profile) return;

    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('comments')
      .insert({ content: trimmed, post_id: postId, user_id: profile.id });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    setContent('');
    loadComments();
  };

  const handleDelete = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    loadComments();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

      { comments.length === 0 && (
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>첫 댓글을 남겨보세요.</Box>
      ) }

      { comments.map((comment) => (
        <Box key={ comment.id } sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Avatar
            component={ RouterLink }
            to={ `/profile/${comment.user_id}` }
            src={ comment.users?.avatar_url || undefined }
            sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
          >
            { comment.users?.display_name?.[0] }
          </Avatar>
          <Box sx={{ flexGrow: 1, fontSize: '0.875rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
            <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>{ comment.users?.display_name }</Box>
            { comment.content }
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              { formatRelativeDate(comment.created_at) }
            </Box>
          </Box>
          { profile?.id === comment.user_id && (
            <IconButton aria-label="댓글 삭제" size="small" onClick={ () => handleDelete(comment.id) }>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) }
        </Box>
      )) }

      { profile ? (
        <Box
          component="form"
          onSubmit={ handleSubmit }
          sx={{ display: 'flex', gap: 1, borderTop: 1, borderColor: 'divider', pt: 1 }}
        >
          <InputBase
            value={ content }
            onChange={ (event) => setContent(event.target.value) }
            placeholder="댓글 달기..."
            inputProps={{ maxLength: 500, 'aria-label': '댓글 입력' }}
            sx={{ flexGrow: 1, fontSize: '0.875rem' }}
          />
          <Button type="submit" size="small" disabled={ !content.trim() || isSubmitting }>
            게시
          </Button>
        </Box>
      ) : (
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          <RouterLink to="/login">로그인</RouterLink>하고 댓글을 남겨보세요.
        </Box>
      ) }
    </Box>
  );
}

export default CommentSection;
