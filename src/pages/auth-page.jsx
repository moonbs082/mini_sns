import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailAuthForm from '../components/auth/email-auth-form.jsx';
import PhoneAuthForm from '../components/auth/phone-auth-form.jsx';
import SocialLoginButtons from '../components/auth/social-login-buttons.jsx';
import { useAuth } from '../hooks/use-auth.js';

/**
 * AuthPage - 로그인 / 회원가입 (이메일 · SNS · 휴대폰 번호)
 * 온보딩이 끝나면 회원가입 탭으로 바로 이어진다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/auth" element={ <AuthPage /> } />
 */
function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login');
  const [method, setMethod] = useState('email');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const redirectPath = location.state?.from || '/';

  /** 로그인되면(SNS 로그인 복귀 포함) 원래 가려던 화면으로 */
  useEffect(() => {
    if (session) {
      navigate(redirectPath, { replace: true });
    }
  }, [session, navigate, redirectPath]);

  const handleSuccess = () => navigate(redirectPath, { replace: true });

  const handleModeChange = (_event, nextMode) => {
    setMode(nextMode);
    setErrorMessage('');
    setInfoMessage('');
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' }, fontWeight: 900, lineHeight: 1.1 }}>
          Healthy Muscle
          <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>Making</Box>
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          { mode === 'signup' ? '분석 결과를 저장하고 운동 기록을 시작하세요' : '다시 오신 걸 환영해요' }
        </Typography>
      </Box>

      <Paper elevation={ 0 } sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: 1, borderColor: 'grey.200' }}>
        <Tabs
          value={ mode }
          onChange={ handleModeChange }
          variant="fullWidth"
          textColor="inherit"
          slotProps={{ indicator: { sx: { bgcolor: 'secondary.main', height: 3 } } }}
          sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 800, fontSize: '1rem', minHeight: 52 } }}
        >
          <Tab value="login" label="로그인" />
          <Tab value="signup" label="회원가입" />
        </Tabs>

        <SocialLoginButtons onError={ setErrorMessage } />

        <Divider sx={{ my: 3, fontSize: '0.85rem', color: 'text.secondary' }}>또는</Divider>

        <ToggleButtonGroup
          value={ method }
          exclusive
          fullWidth
          onChange={ (_event, nextMethod) => nextMethod && setMethod(nextMethod) }
          sx={{ mb: 2.5, '& .MuiToggleButton-root': { minHeight: 48, fontWeight: 700, gap: 1 } }}
        >
          <ToggleButton value="email"><EmailOutlinedIcon fontSize="small" />이메일</ToggleButton>
          <ToggleButton value="phone"><PhoneIphoneIcon fontSize="small" />휴대폰 번호</ToggleButton>
        </ToggleButtonGroup>

        { errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{ errorMessage }</Alert> }
        { infoMessage && <Alert severity="info" sx={{ mb: 2 }}>{ infoMessage }</Alert> }

        { method === 'email' ? (
          <EmailAuthForm
            key={ mode }
            isSignUp={ mode === 'signup' }
            onSuccess={ handleSuccess }
            onError={ setErrorMessage }
            onInfo={ setInfoMessage }
          />
        ) : (
          <PhoneAuthForm onSuccess={ handleSuccess } onError={ setErrorMessage } onInfo={ setInfoMessage } />
        ) }
      </Paper>
    </Box>
  );
}

export default AuthPage;
