import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import LoginBanner from './login-banner.jsx';
import SideMenu from './side-menu.jsx';

/**
 * AppHeader 컴포넌트 - 좌측 햄버거 메뉴(하양) / 가운데 타이틀 / 우측 원형 로그인 배너
 *
 * Props:
 * @param {boolean} isTitleHidden - 가운데 타이틀 숨김 여부 (홈 히어로에 큰 타이틀이 있을 때) [Optional, 기본값: false]
 *
 * Example usage:
 * <AppHeader isTitleHidden />
 */
function AppHeader({ isTitleHidden = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="sticky" elevation={ 0 } sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: { xs: 64 }, px: { xs: 1, md: 2 }, gap: 1 }}>
          <IconButton
            aria-label="메뉴 열기"
            onClick={ () => setIsMenuOpen(true) }
            sx={{ color: 'common.white', width: 48, height: 48 }}
          >
            <MenuIcon sx={{ fontSize: 30 }} />
          </IconButton>

          <Box
            component="button"
            type="button"
            onClick={ () => navigate('/') }
            sx={{
              flexGrow: 1,
              border: 0,
              bgcolor: 'transparent',
              color: 'common.white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 900,
              fontSize: { xs: '1rem', md: '1.15rem' },
              letterSpacing: '-0.01em',
              visibility: isTitleHidden ? 'hidden' : 'visible',
            }}
          >
            Healthy Muscle <Box component="span" sx={{ color: 'secondary.main' }}>Making</Box>
          </Box>

          <Box sx={{ pr: 0.5 }}>
            <LoginBanner />
          </Box>
        </Toolbar>
      </AppBar>
      <SideMenu isOpen={ isMenuOpen } onClose={ () => setIsMenuOpen(false) } />
    </>
  );
}

export default AppHeader;
