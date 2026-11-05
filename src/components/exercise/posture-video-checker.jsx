import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

/**
 * PostureVideoChecker 컴포넌트 - 내 운동 영상을 올려 트레이너 기준 체크포인트와 비교
 * (영상은 서버에 올라가지 않고 내 기기에서만 재생됩니다)
 *
 * Props:
 * @param {string[]} checkpoints - 트레이너 기준 자세 체크 항목 [Required]
 *
 * Example usage:
 * <PostureVideoChecker checkpoints={ exercise.checkpoints } />
 */
function PostureVideoChecker({ checkpoints }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [checked, setChecked] = useState([]);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoUrl(URL.createObjectURL(file));
    setChecked([]);
  };

  const toggle = (index) => {
    setChecked((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
  };

  const score = Math.round((checked.length / checkpoints.length) * 100);
  let feedback = '체크포인트를 하나씩 확인해 보세요.';
  if (score === 100) feedback = '트레이너 기준 자세와 일치해요! 무게를 조금씩 올려보세요.';
  else if (score >= 60) feedback = '좋아요! 체크되지 않은 항목만 보완하면 완벽해요.';
  else if (checked.length > 0) feedback = '가벼운 무게로 자세부터 다시 잡아보세요.';

  return (
    <Box>
      <Button
        component="label"
        variant={ videoUrl ? 'outlined' : 'contained' }
        startIcon={ <VideocamOutlinedIcon /> }
        fullWidth
        size="large"
      >
        { videoUrl ? '다른 영상 선택' : '내 운동 영상 올리기' }
        <input hidden type="file" accept="video/*" onChange={ handleFileChange } />
      </Button>
      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.75 }}>
        영상은 서버에 저장되지 않고 이 기기에서만 재생돼요.
      </Box>

      { videoUrl && (
        <Box sx={{ mt: 2 }}>
          <Box
            component="video"
            src={ videoUrl }
            controls
            playsInline
            sx={{ width: '100%', maxHeight: 420, borderRadius: 3, bgcolor: 'common.black' }}
          />
          <Box sx={{ fontWeight: 800, mt: 2, mb: 0.5 }}>영상을 보며 체크해 보세요</Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            { checkpoints.map((checkpoint, index) => (
              <FormControlLabel
                key={ checkpoint }
                control={ <Checkbox color="secondary" checked={ checked.includes(index) } onChange={ () => toggle(index) } /> }
                label={ checkpoint }
                sx={{ minHeight: 44, '& .MuiFormControlLabel-label': { fontSize: '0.95rem' } }}
              />
            )) }
          </Box>
          <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: 'primary.main', color: 'common.white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, mb: 1 }}>
              <span>자세 일치도</span>
              <Box component="span" sx={{ color: 'warning.main' }}>{ score }%</Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={ score }
              color="secondary"
              sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.800' }}
            />
            <Box sx={{ fontSize: '0.9rem', mt: 1.25, color: 'grey.300' }}>{ feedback }</Box>
          </Box>
        </Box>
      ) }
    </Box>
  );
}

export default PostureVideoChecker;
