import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import PostCard from '../components/post/post-card.jsx';
import ProfileEditDialog from '../components/profile/profile-edit-dialog.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { formatFullDate } from '../utils/format-date.js';
import { POST_SELECT } from '../utils/post-query.js';

/**
 * ProfilePage 컴포넌트 - 사용자 프로필 (사진, 이름, 소개글, 가입일, 작성한 게시물)
 *
 * Props: 없음 (URL의 :userId 사용)
 *
 * Example usage:
 * <Route path="/profile/:userId" element={ <ProfilePage /> } />
 */
function ProfilePage() {
  const { userId } = useParams();
  const { profile: myProfile, refreshProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    const [{ data: userData }, { data: postData }] = await Promise.all([
      supabase.from('users').select('id, username, display_name, bio, avatar_url, created_at').eq('id', userId).maybeSingle(),
      supabase.from('posts').select(POST_SELECT).eq('user_id', userId).order('created_at', { ascending: false }),
    ]);
    setUser(userData);
    setPosts(postData || []);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaved = async () => {
    await refreshProfile();
    loadProfile();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Alert severity="warning">존재하지 않는 사용자입니다.</Alert>;
  }

  const isMine = myProfile?.id === user.id;
  const totalLikes = posts.reduce((sum, post) => sum + post.likes_count, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, alignItems: 'center' }}>
          <Avatar src={ user.avatar_url || undefined } sx={{ width: { xs: 72, md: 96 }, height: { xs: 72, md: 96 }, fontSize: '2rem' }}>
            { user.display_name?.[0] }
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700 }}>
              { user.display_name }
            </Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              { user.username }
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, fontSize: '0.875rem' }}>
              <Box><Box component="strong">{ posts.length }</Box> 게시물</Box>
              <Box><Box component="strong">{ totalLikes }</Box> 받은 좋아요</Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          { user.bio || <Box component="span" sx={{ color: 'text.secondary' }}>아직 소개글이 없어요.</Box> }
        </Box>
        <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
          { formatFullDate(user.created_at) } 가입
        </Box>

        { isMine && (
          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={ () => setIsEditOpen(true) }>
            프로필 편집
          </Button>
        ) }
      </Paper>

      { posts.length === 0 && (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>아직 게시물이 없어요.</Box>
      ) }

      { posts.map((post) => (
        <PostCard
          key={ post.id }
          post={ post }
          onDeleted={ (postId) => setPosts((prev) => prev.filter((item) => item.id !== postId)) }
        />
      )) }

      { isMine && isEditOpen && (
        <ProfileEditDialog
          isOpen={ isEditOpen }
          profile={ myProfile }
          onClose={ () => setIsEditOpen(false) }
          onSaved={ handleSaved }
        />
      ) }
    </Box>
  );
}

export default ProfilePage;
