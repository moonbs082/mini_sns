import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import PageTitle from '../components/common/page-title.jsx';
import ImagePicker from '../components/post/image-picker.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';
import { trackUnsplashDownload } from '../utils/unsplash.js';

const STEPS = ['내용 입력', '이미지 선택', '확인 후 게시'];
const MAX_CAPTION = 2200;

/**
 * PostCreatePage - 게시물 작성
 * 1단계 내용 입력 → 2단계 랜덤 이미지 중 선택(새로고침 가능) → 3단계 확인 후 posts 테이블에 저장
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/posts/new" element={ <RequireAuth><PostCreatePage /></RequireAuth> } />
 */
function PostCreatePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isStepValid = [caption.trim().length > 0, Boolean(selectedImage), true][activeStep];

  const handleSubmit = async () => {
    if (!profile) return;
    setIsSubmitting(true);
    setErrorMessage('');
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: profile.id, caption: caption.trim(), image_url: selectedImage.url })
      .select('id')
      .single();
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    trackUnsplashDownload(selectedImage.downloadLocation);
    navigate(`/posts/${data.id}`, { replace: true });
  };

  return (
    <Box>
      <PageTitle title="게시물 작성" subtitle="오늘의 운동을 기록하고 공유해요" />

      <Stepper
        activeStep={ activeStep }
        alternativeLabel
        sx={{
          mb: 3,
          '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': { color: 'secondary.main' },
        }}
      >
        { STEPS.map((label) => (
          <Step key={ label }>
            <StepLabel>{ label }</StepLabel>
          </Step>
        )) }
      </Stepper>

      <Paper elevation={ 0 } sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' }}>
        { activeStep === 0 && (
          <TextField
            label="내용"
            placeholder="오늘 어떤 운동을 했나요? 느낀 점을 자유롭게 적어주세요."
            multiline
            minRows={ 6 }
            fullWidth
            value={ caption }
            onChange={ (event) => setCaption(event.target.value) }
            helperText={ `${caption.length} / ${MAX_CAPTION}` }
            slotProps={{ htmlInput: { maxLength: MAX_CAPTION } }}
          />
        ) }

        { activeStep === 1 && (
          <ImagePicker selectedImage={ selectedImage } onSelect={ setSelectedImage } />
        ) }

        { activeStep === 2 && (
          <Box>
            <Box
              component="img"
              src={ selectedImage?.url }
              alt=""
              sx={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 3, mb: 2 }}
            />
            <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, wordBreak: 'break-word' }}>{ caption }</Box>
          </Box>
        ) }

        { errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{ errorMessage }</Alert> }

        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button
            size="large"
            variant="outlined"
            onClick={ () => (activeStep === 0 ? navigate(-1) : setActiveStep((prev) => prev - 1)) }
            sx={{ flex: 1 }}
          >
            { activeStep === 0 ? '취소' : '이전' }
          </Button>
          <Button
            size="large"
            variant="contained"
            color={ activeStep === 2 ? 'secondary' : 'primary' }
            disabled={ !isStepValid || isSubmitting }
            onClick={ activeStep === 2 ? handleSubmit : () => setActiveStep((prev) => prev + 1) }
            sx={{ flex: 2 }}
          >
            { activeStep === 2 ? (isSubmitting ? '게시 중...' : '게시하기') : '계속' }
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PostCreatePage;
