import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import ImagePicker from '../components/post/image-picker.jsx';
import ScheduleEditor, { EMPTY_ITEM } from '../components/post/schedule-editor.jsx';
import VideoPicker from '../components/post/video-picker.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';
import { trackUnsplashDownload } from '../utils/unsplash.js';

const STEPS = ['내용 작성', '이미지 선택', '확인 후 게시'];

/** 오늘 날짜 (YYYY-MM-DD, 로컬 기준) */
function todayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

/** 입력된 운동 항목 중 이름이 있는 것만 정리 (없으면 null) */
function cleanSchedule(schedule) {
  const items = schedule.items
    .filter((item) => item.name.trim())
    .map((item) => ({
      name: item.name.trim(),
      sets: Number(item.sets) || null,
      reps: Number(item.reps) || null,
      weight: Number(item.weight) || null,
    }));
  return items.length ? { date: schedule.date, items } : null;
}

/**
 * NewPostPage 컴포넌트 - 게시물 작성
 * 1단계: 캡션 + 운동 기록 + 영상 입력
 * 2단계: 랜덤 이미지 중 선택 (새로고침 가능)
 * 3단계: 확인 후 게시 (선택한 이미지 URL을 posts.image_url에 저장)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/new" element={ <NewPostPage /> } />
 */
function NewPostPage() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [caption, setCaption] = useState('');
  const [schedule, setSchedule] = useState({ date: todayString(), items: [{ ...EMPTY_ITEM }] });
  const [videoFile, setVideoFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    setErrorMessage('');
    if (activeStep === 0 && !caption.trim()) {
      setErrorMessage('내용(캡션)을 입력해 주세요.');
      return;
    }
    if (activeStep === 1 && !selectedImage) {
      setErrorMessage('마음에 드는 이미지를 하나 선택해 주세요.');
      return;
    }
    setActiveStep((step) => step + 1);
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;
    const extension = videoFile.name.split('.').pop()?.toLowerCase() || 'mp4';
    /** Storage 정책: 본인 auth id 폴더에만 업로드 가능 */
    const path = `${session.user.id}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from('workout-videos')
      .upload(path, videoFile, { contentType: videoFile.type });
    if (error) throw error;
    return supabase.storage.from('workout-videos').getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!profile) {
      setErrorMessage('프로필 정보를 불러오지 못했습니다. 다시 로그인해 주세요.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const videoUrl = await uploadVideo();
      const { error } = await supabase.from('posts').insert({
        user_id: profile.id,
        caption: caption.trim(),
        image_url: selectedImage.url,
        schedule: cleanSchedule(schedule),
        video_url: videoUrl,
      });
      if (error) throw error;

      trackUnsplashDownload(selectedImage.downloadLocation);
      navigate('/');
    } catch (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  const finalSchedule = cleanSchedule(schedule);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700 }}>
        새 게시물
      </Box>

      <Stepper activeStep={ activeStep } alternativeLabel>
        { STEPS.map((label) => (
          <Step key={ label }><StepLabel>{ label }</StepLabel></Step>
        )) }
      </Stepper>

      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

      { activeStep === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="내용"
            placeholder="오늘 운동은 어땠나요?"
            multiline
            minRows={ 4 }
            value={ caption }
            onChange={ (event) => setCaption(event.target.value) }
            helperText={ `${caption.length}/2200` }
            slotProps={{ htmlInput: { maxLength: 2200 } }}
          />
          <Box>
            <Box sx={{ fontWeight: 600, mb: 1.5 }}>운동 기록표 (선택)</Box>
            <ScheduleEditor schedule={ schedule } onChange={ setSchedule } />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ fontWeight: 600, mb: 1.5 }}>운동 영상 (선택)</Box>
            <VideoPicker file={ videoFile } onChange={ setVideoFile } onError={ setErrorMessage } />
          </Box>
        </Box>
      ) }

      { activeStep === 1 && (
        <ImagePicker selectedImage={ selectedImage } onSelect={ setSelectedImage } />
      ) }

      { activeStep === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            component="img"
            src={ selectedImage.url }
            alt="선택한 이미지"
            sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 2 }}
          />
          <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ caption }</Box>
          { finalSchedule && (
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              운동 기록 { finalSchedule.items.length }개 · { finalSchedule.date }
            </Box>
          ) }
          { videoFile && (
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              영상: { videoFile.name } ({ (videoFile.size / 1024 / 1024).toFixed(1) }MB)
            </Box>
          ) }
          { isSubmitting && <LinearProgress /> }
        </Box>
      ) }

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={ activeStep === 0 || isSubmitting }
          onClick={ () => { setErrorMessage(''); setActiveStep((step) => step - 1); } }
        >
          이전
        </Button>
        { activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={ handleNext }>다음</Button>
        ) : (
          <Button variant="contained" onClick={ handleSubmit } disabled={ isSubmitting }>
            { isSubmitting ? '게시 중...' : '게시하기' }
          </Button>
        ) }
      </Box>
    </Paper>
  );
}

export default NewPostPage;
