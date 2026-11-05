import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const QUICK_ITEMS = [
  { path: '/me', label: '마이페이지', icon: <PersonOutlineIcon />, color: 'primary.main' },
  { path: '/workout-log', label: '운동 기록표', icon: <TableChartOutlinedIcon />, color: 'secondary.main' },
  { path: '/exercises', label: '운동 자세', icon: <AccessibilityNewIcon />, color: 'brown.main' },
  { path: '/posts', label: '커뮤니티', icon: <ForumOutlinedIcon />, color: 'warning.main' },
];

/**
 * QuickMenu 컴포넌트 - 홈 화면의 주요 메뉴 바로가기 아이콘 4개
 *
 * Props: 없음
 *
 * Example usage:
 * <QuickMenu />
 */
function QuickMenu() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 1 }}>
      { QUICK_ITEMS.map((item) => (
        <ButtonBase
          key={ item.path }
          onClick={ () => navigate(item.path) }
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1.5, borderRadius: 3 }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: item.color,
              color: item.color === 'warning.main' ? 'primary.main' : 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { fontSize: 28 },
            }}
          >
            { item.icon }
          </Box>
          <Box sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{ item.label }</Box>
        </ButtonBase>
      )) }
    </Box>
  );
}

export default QuickMenu;
