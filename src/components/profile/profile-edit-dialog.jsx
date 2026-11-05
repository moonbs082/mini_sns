import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { supabase } from '../../lib/supabase.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

/**
 * ProfileEditDialog 컴포넌트 - 표시 이름 · 소개글 · 프로필 사진 수정
 *
 * Props:
 * @param {boolean} isOpen - 열림 여부 [Required]
 * @param {object} profile - 내 users 행 [Required]
 * @param {function} onClose - 닫기 [Required]
 * @param {function} onSaved - 저장 완료 후 호출 [Required]
 *
 * Example usage:
 * <ProfileEditDialog isOpen={ isOpen } profile={ profile } onClose={ close } onSaved={ refreshProfile } />
 */
function ProfileEditDialog({ isOpen, profile, onClose, onSaved }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShuffleAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 10);
    setAvatarUrl(`https://picsum.photos/seed/${seed}/200/200`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('users')
      .update({ display_name: displayName.trim(), bio: bio.trim() || null, avatar_url: avatarUrl || null })
      .eq('id', profile.id);
    setIsSaving(false);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    await onSaved();
    onClose();
  };

  return (
    <Dialog open={ isOpen } onClose={ onClose } fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>프로필 수정</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={ avatarUrl || undefined } sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.75rem' }}>
            { displayName?.[0] }
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button size="small" variant="outlined" startIcon={ <ShuffleIcon /> } onClick={ handleShuffleAvatar }>
              랜덤 사진
            </Button>
            { avatarUrl && (
              <Button size="small" color="inherit" onClick={ () => setAvatarUrl('') }>사진 삭제</Button>
            ) }
          </Box>
        </Box>
        <TextField
          label="표시 이름"
          value={ displayName }
          onChange={ (event) => setDisplayName(event.target.value) }
          slotProps={{ htmlInput: { maxLength: 20 } }}
          helperText="2~20자"
        />
        <TextField
          label="소개글"
          value={ bio }
          onChange={ (event) => setBio(event.target.value) }
          multiline
          minRows={ 3 }
          slotProps={{ htmlInput: { maxLength: 300 } }}
          helperText={ `${bio.length} / 300` }
        />
        { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={ onClose } color="inherit">취소</Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={ handleSave }
          disabled={ displayName.trim().length < 2 || isSaving }
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileEditDialog;
