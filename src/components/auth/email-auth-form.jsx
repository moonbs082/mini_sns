import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { supabase } from '../../lib/supabase.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/;

/**
 * EmailAuthForm 컴포넌트 - 이메일 로그인 / 회원가입 폼
 *
 * Props:
 * @param {boolean} isSignUp - 회원가입 모드 여부 [Required]
 * @param {function} onSuccess - 로그인 완료 시 호출 [Required]
 * @param {function} onError - 오류 메시지 전달 [Required]
 * @param {function} onInfo - 안내 메시지 전달 (메일 인증 필요 등) [Required]
 *
 * Example usage:
 * <EmailAuthForm isSignUp onSuccess={ goHome } onError={ setError } onInfo={ setInfo } />
 */
function EmailAuthForm({ isSignUp, onSuccess, onError, onInfo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUsernameInvalid = isSignUp && username.length > 0 && !USERNAME_PATTERN.test(username);
  const isFormValid = email && password.length >= 6
    && (!isSignUp || (displayName.trim().length >= 2 && USERNAME_PATTERN.test(username)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    onError('');
    onInfo('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim(), username },
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      });
      setIsSubmitting(false);
      if (error) {
        onError(toKoreanErrorMessage(error));
        return;
      }
      if (!data.session) {
        onInfo('가입 확인 메일을 보냈어요. 메일의 링크를 누르면 로그인됩니다.');
        return;
      }
      onSuccess();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      onError(toKoreanErrorMessage(error));
      return;
    }
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      { isSignUp && (
        <>
          <TextField
            label="표시 이름"
            value={ displayName }
            onChange={ (event) => setDisplayName(event.target.value) }
            helperText="프로필에 보이는 이름 (2~20자)"
            slotProps={{ htmlInput: { maxLength: 20 } }}
            required
          />
          <TextField
            label="사용자 아이디"
            value={ username }
            onChange={ (event) => setUsername(event.target.value.toLowerCase()) }
            error={ isUsernameInvalid }
            helperText="영문 소문자, 숫자, _, . 사용 (3~20자)"
            slotProps={{
              htmlInput: { maxLength: 20 },
              input: { startAdornment: <InputAdornment position="start">@</InputAdornment> },
            }}
            required
          />
        </>
      ) }
      <TextField
        label="이메일"
        type="email"
        autoComplete="email"
        value={ email }
        onChange={ (event) => setEmail(event.target.value.trim()) }
        required
      />
      <TextField
        label="비밀번호"
        type="password"
        autoComplete={ isSignUp ? 'new-password' : 'current-password' }
        value={ password }
        onChange={ (event) => setPassword(event.target.value) }
        helperText={ isSignUp ? '6자 이상' : ' ' }
        required
      />
      <Button type="submit" size="large" variant="contained" color="secondary" disabled={ !isFormValid || isSubmitting }>
        { isSubmitting ? '처리 중...' : (isSignUp ? '이메일로 회원가입' : '이메일로 로그인') }
      </Button>
    </Box>
  );
}

export default EmailAuthForm;
