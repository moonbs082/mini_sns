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
import { supabase } from '../../lib/supabase.js';
import { toKoreanErrorMessage } from '../../utils/db-error.js';

/**
 * ProfileEditDialog 컴포넌트 - 표시 이름, 소개글, 프로필 사진 경로 수정
 *
 * Props:
 * @param {boolean} isOpen - 다이얼로그 열림 여부 [Required]
 * @param {object} profile - 현재 users 행 [Required]
 * @param {function} onClose - 닫을 때 호출 [Required]
 * @param {function} onSaved - 저장 성공 후 호출 [Optional]
 *
 * Example usage:
 * <ProfileEditDialog isOpen={ open } profile={ profile } onClose={ close } onSaved={ reload } />
 */
function ProfileEditDialog({ isOpen, profile, onClose, onSaved }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    const trimmedName = displayName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setErrorMessage('표시 이름은 2~20자로 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('users')
      .update({
        display_name: trimmedName,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq('id', profile.id);
    setIsSaving(false);

    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    onSaved?.();
    onClose();
  };

  return (
    <Dialog open={ isOpen } onClose={ onClose } fullWidth maxWidth="xs">
      <DialogTitle>프로필 편집</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Avatar src={ avatarUrl || undefined } sx={{ width: 72, height: 72, alignSelf: 'center' }}>
            { displayName?.[0] }
          </Avatar>
          { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
          <TextField
            label="표시 이름"
            value={ displayName }
            onChange={ (event) => setDisplayName(event.target.value) }
            helperText="2~20자, 다른 사람과 중복 불가"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
          <TextField
            label="소개글"
            value={ bio }
            onChange={ (event) => setBio(event.target.value) }
            multiline
            minRows={ 3 }
            helperText={ `${bio.length}/300` }
            slotProps={{ htmlInput: { maxLength: 300 } }}
          />
          <TextField
            label="프로필 사진 URL"
            value={ avatarUrl }
            onChange={ (event) => setAvatarUrl(event.target.value) }
            placeholder="https://..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={ onClose }>취소</Button>
        <Button variant="contained" onClick={ handleSave } disabled={ isSaving }>저장</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileEditDialog;
