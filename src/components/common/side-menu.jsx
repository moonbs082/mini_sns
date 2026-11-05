import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useAuth } from '../../hooks/use-auth.js';

/** 위에서 아래 순서대로 배치되는 메뉴 */
const MENU_ITEMS = [
  { path: '/', label: '홈 화면', icon: <HomeOutlinedIcon /> },
  { path: '/me', label: '마이페이지', icon: <PersonOutlineIcon /> },
  { path: '/workout-log', label: '개인 운동 기록표', icon: <TableChartOutlinedIcon /> },
  { path: '/exercises', label: '운동 자세', icon: <AccessibilityNewIcon /> },
];

const SUB_MENU_ITEMS = [
  { path: '/posts', label: '커뮤니티 게시물', icon: <FitnessCenterIcon /> },
  { path: '/posts/new', label: '게시물 작성', icon: <EditNoteIcon /> },
  { path: '/onboarding', label: '신체 정보 다시 분석', icon: <AccessibilityNewIcon /> },
];

/**
 * SideMenu 컴포넌트 - 좌측 햄버거 아이콘을 누르면 열리는 메뉴 목록
 *
 * Props:
 * @param {boolean} isOpen - 메뉴 열림 여부 [Required]
 * @param {function} onClose - 메뉴 닫기 [Required]
 *
 * Example usage:
 * <SideMenu isOpen={ isMenuOpen } onClose={ () => setIsMenuOpen(false) } />
 */
function SideMenu({ isOpen, onClose }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMove = (path) => {
    onClose();
    navigate(path);
  };

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate('/');
  };

  const renderItem = (item) => (
    <ListItemButton
      key={ item.path }
      selected={ location.pathname === item.path }
      onClick={ item.onClick ?? (() => handleMove(item.path)) }
      sx={{
        minHeight: 56,
        borderRadius: 2,
        mx: 1,
        '&.Mui-selected': { bgcolor: 'secondary.main', color: 'common.white' },
        '&.Mui-selected:hover': { bgcolor: 'secondary.dark' },
        '&.Mui-selected .MuiListItemIcon-root': { color: 'common.white' },
      }}
    >
      <ListItemIcon sx={{ color: 'primary.main', minWidth: 44 }}>{ item.icon }</ListItemIcon>
      <ListItemText primary={ item.label } slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
    </ListItemButton>
  );

  return (
    <Drawer open={ isOpen } onClose={ onClose }>
      <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'common.white', px: 3, py: 3 }}>
          <Box sx={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.2 }}>
            Healthy Muscle
            <Box component="span" sx={{ color: 'secondary.main' }}> Making</Box>
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'grey.400', mt: 1 }}>
            { profile ? `${profile.display_name} 님, 오늘도 화이팅!` : '로그인하고 기록을 시작하세요' }
          </Box>
        </Box>

        <List sx={{ py: 1 }}>{ MENU_ITEMS.map(renderItem) }</List>
        <Divider sx={{ mx: 2 }} />
        <List sx={{ py: 1 }}>{ SUB_MENU_ITEMS.map(renderItem) }</List>

        <Box sx={{ mt: 'auto', pb: 2 }}>
          <Divider sx={{ mx: 2, mb: 1 }} />
          { profile
            ? renderItem({ path: '#logout', label: '로그아웃', icon: <LogoutIcon />, onClick: handleSignOut })
            : renderItem({ path: '/auth', label: '로그인 / 회원가입', icon: <LoginIcon /> }) }
        </Box>
      </Box>
    </Drawer>
  );
}

export default SideMenu;
