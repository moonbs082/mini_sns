import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * LoginBanner 컴포넌트 - 우측 상단 원형 로그인 배너
 * - 로그인 전: 사람 아이콘 → 로그인 화면
 * - 로그인 후: 내 프로필 사진 → 마이페이지
 *
 * Props: 없음
 *
 * Example usage:
 * <LoginBanner />
 */
function LoginBanner() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <ButtonBase
      onClick={ () => navigate(profile ? '/me' : '/auth') }
      aria-label={ profile ? '마이페이지' : '로그인' }
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 2,
        borderColor: profile ? 'secondary.main' : 'common.white',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Avatar
        src={ profile?.avatar_url || undefined }
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: profile ? 'secondary.main' : 'common.white',
          color: profile ? 'common.white' : 'primary.main',
          fontWeight: 800,
        }}
      >
        { profile ? profile.display_name?.[0] : <PersonOutlineIcon /> }
      </Avatar>
    </ButtonBase>
  );
}

export default LoginBanner;
