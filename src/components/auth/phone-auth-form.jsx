import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { supabase } from '../../lib/supabase.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

/**
 * 010-1234-5678 → +821012345678 (국제 형식)
 * @param {string} phone - 입력한 휴대폰 번호
 * @returns {string}
 */
function toInternationalPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('82')) return `+${digits}`;
  if (digits.startsWith('0')) return `+82${digits.slice(1)}`;
  return `+${digits}`;
}

/**
 * PhoneAuthForm 컴포넌트 - 휴대폰 번호 + 문자 인증번호 로그인 (처음이면 자동 가입)
 *
 * Props:
 * @param {function} onSuccess - 로그인 완료 시 호출 [Required]
 * @param {function} onError - 오류 메시지 전달 [Required]
 * @param {function} onInfo - 안내 메시지 전달 [Required]
 *
 * Example usage:
 * <PhoneAuthForm onSuccess={ goHome } onError={ setError } onInfo={ setInfo } />
 */
function PhoneAuthForm({ onSuccess, onError, onInfo }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = phone.replace(/\D/g, '').length >= 10;

  const handleSendCode = async () => {
    setIsSubmitting(true);
    onError('');
    onInfo('');
    const { error } = await supabase.auth.signInWithOtp({ phone: toInternationalPhone(phone) });
    setIsSubmitting(false);
    if (error) {
      onError(toKoreanErrorMessage(error));
      return;
    }
    setIsCodeSent(true);
    onInfo('인증번호를 문자로 보냈어요.');
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    onError('');
    const { error } = await supabase.auth.verifyOtp({
      phone: toInternationalPhone(phone),
      token: code,
      type: 'sms',
    });
    setIsSubmitting(false);
    if (error) {
      onError(toKoreanErrorMessage(error));
      return;
    }
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={ handleVerify } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          label="휴대폰 번호"
          type="tel"
          placeholder="010-1234-5678"
          value={ phone }
          onChange={ (event) => setPhone(event.target.value) }
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          onClick={ handleSendCode }
          disabled={ !isPhoneValid || isSubmitting }
          sx={{ minHeight: 56, flexShrink: 0 }}
        >
          { isCodeSent ? '재전송' : '인증요청' }
        </Button>
      </Box>
      { isCodeSent && (
        <TextField
          label="인증번호 6자리"
          inputMode="numeric"
          value={ code }
          onChange={ (event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6)) }
        />
      ) }
      <Button
        type="submit"
        size="large"
        variant="contained"
        color="secondary"
        disabled={ !isCodeSent || code.length !== 6 || isSubmitting }
      >
        휴대폰 번호로 계속하기
      </Button>
    </Box>
  );
}

export default PhoneAuthForm;
