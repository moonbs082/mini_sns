import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';

/**
 * LoginPage 컴포넌트 - 로그인 / 회원가입 화면
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/login" element={ <LoginPage /> } />
 */
function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const isSignUp = mode === 'signup';

  useEffect(() => {
    if (session) {
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [session, navigate, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (isSignUp) {
      const trimmedName = displayName.trim();
      if (trimmedName.length < 2 || trimmedName.length > 20) {
        setErrorMessage('표시 이름은 2~20자로 입력해 주세요.');
        return;
      }

      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: trimmedName },
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      });
      setIsSubmitting(false);

      if (error) {
        setErrorMessage(toKoreanErrorMessage(error));
        return;
      }
      if (!data.session) {
        setInfoMessage('가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요.');
        setMode('login');
      }
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, maxWidth: 400, mx: 'auto', mt: { xs: 2, md: 6 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
        <FitnessCenterIcon color="primary" sx={{ fontSize: 40 }} />
        <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700 }}>
          mini_sns
        </Box>
        <Box sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>오늘의 운동을 기록하고 공유해요</Box>
      </Box>

      <Tabs
        value={ mode }
        onChange={ (_event, value) => { setMode(value); setErrorMessage(''); } }
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="로그인" value="login" />
        <Tab label="회원가입" value="signup" />
      </Tabs>

      <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        { infoMessage && <Alert severity="success">{ infoMessage }</Alert> }
        { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

        <TextField
          label="이메일"
          type="email"
          required
          autoComplete="email"
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
        />
        <TextField
          label="비밀번호"
          type="password"
          required
          autoComplete={ isSignUp ? 'new-password' : 'current-password' }
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          helperText={ isSignUp ? '6자 이상' : '' }
        />
        { isSignUp && (
          <TextField
            label="표시 이름"
            required
            value={ displayName }
            onChange={ (event) => setDisplayName(event.target.value) }
            helperText="2~20자, 다른 사람과 중복되거나 부적절한 단어는 사용할 수 없어요"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        ) }

        <Button type="submit" variant="contained" size="large" disabled={ isSubmitting }>
          { isSignUp ? '가입하기' : '로그인' }
        </Button>
      </Box>
    </Paper>
  );
}

export default LoginPage;
