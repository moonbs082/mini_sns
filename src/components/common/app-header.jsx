import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * AppHeader 컴포넌트 - 상단 바 (로고, 글쓰기, 프로필, 로그아웃)
 *
 * Props: 없음
 *
 * Example usage:
 * <AppHeader />
 */
function AppHeader() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={ 1 }>
      <Toolbar sx={{ gap: 1, px: { xs: 2, md: 3 } }}>
        <Box
          component={ RouterLink }
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            flexGrow: 1,
          }}
        >
          <FitnessCenterIcon />
          mini_sns
        </Box>

        { session ? (
          <>
            <Tooltip title="새 게시물">
              <IconButton component={ RouterLink } to="/new" color="primary" aria-label="새 게시물">
                <AddBoxOutlinedIcon />
              </IconButton>
            </Tooltip>
            { profile && (
              <Tooltip title="내 프로필">
                <IconButton component={ RouterLink } to={ `/profile/${profile.id}` } aria-label="내 프로필">
                  <Avatar src={ profile.avatar_url || undefined } sx={{ width: 32, height: 32 }}>
                    { profile.display_name?.[0] }
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) }
            <Tooltip title="로그아웃">
              <IconButton onClick={ handleSignOut } aria-label="로그아웃">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Button component={ RouterLink } to="/login" variant="contained">
            로그인
          </Button>
        ) }
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
