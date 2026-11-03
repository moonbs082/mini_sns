import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

/** 업로드 가능 최대 크기 (Storage 버킷 설정과 동일: 100MB) */
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/**
 * VideoPicker 컴포넌트 - 운동 영상 파일 선택 및 미리보기
 *
 * Props:
 * @param {File} file - 선택된 영상 파일 [Optional, 기본값: null]
 * @param {function} onChange - 파일 선택/해제 시 호출 (File 또는 null 전달) [Required]
 * @param {function} onError - 파일이 너무 클 때 호출 (메시지 전달) [Optional]
 *
 * Example usage:
 * <VideoPicker file={ videoFile } onChange={ setVideoFile } onError={ setError } />
 */
function VideoPicker({ file = null, onChange, onError }) {
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (selected.size > MAX_VIDEO_BYTES) {
      onError?.('영상은 100MB 이하만 올릴 수 있습니다.');
      return;
    }
    onChange(selected);
  };

  if (file) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box component="video" src={ previewUrl } controls sx={{ width: '100%', borderRadius: 2, bgcolor: 'black' }} />
        <IconButton
          aria-label="영상 제거"
          onClick={ () => onChange(null) }
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Button component="label" variant="outlined" startIcon={ <VideocamOutlinedIcon /> } sx={{ alignSelf: 'flex-start' }}>
      운동 영상 선택 (mp4 · mov · webm, 100MB 이하)
      <input hidden type="file" accept="video/mp4,video/quicktime,video/webm" onChange={ handleFileChange } />
    </Button>
  );
}

export default VideoPicker;
