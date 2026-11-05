import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PageTitle from '../components/common/page-title.jsx';
import PostureVideoChecker from '../components/exercise/posture-video-checker.jsx';
import SectionTitle from '../components/ui/section-title.jsx';
import { findExercise } from '../utils/exercise-data.js';

/**
 * ExerciseDetailPage - 운동 하나의 기구 사용법 · 체크포인트 · 효과 · 주의사항 · 자세 영상 비교
 *
 * Props: 없음 (URL 의 :exerciseId 사용)
 *
 * Example usage:
 * <Route path="/exercises/:exerciseId" element={ <ExerciseDetailPage /> } />
 */
function ExerciseDetailPage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = findExercise(exerciseId);

  if (!exercise) {
    return <Navigate to="/exercises" replace />;
  }

  const paperSx = { p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <IconButton aria-label="뒤로 가기" onClick={ () => navigate(-1) } sx={{ mb: 1, ml: -1 }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <PageTitle title={ exercise.name } subtitle={ `${exercise.equipment} · ${exercise.level}` } />
      </Box>

      <Paper elevation={ 0 } sx={ paperSx }>
        <SectionTitle>기구 사용법 · 동작 순서</SectionTitle>
        <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          { exercise.steps.map((step, index) => (
            <Box component="li" key={ step } sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  color: 'common.white',
                  fontWeight: 900,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                { index + 1 }
              </Box>
              <Box sx={{ lineHeight: 1.6, pt: 0.25 }}>{ step }</Box>
            </Box>
          )) }
        </Box>
      </Paper>

      <Paper elevation={ 0 } sx={{ ...paperSx, bgcolor: 'primary.main', color: 'common.white', borderColor: 'primary.main' }}>
        <SectionTitle>이 운동을 하면 좋아지는 점</SectionTitle>
        <Box component="ul" sx={{ m: 0, pl: 2.5, lineHeight: 1.8 }}>
          { exercise.benefits.map((benefit) => <li key={ benefit }>{ benefit }</li>) }
        </Box>
      </Paper>

      <Paper elevation={ 0 } sx={{ ...paperSx, bgcolor: 'brown.light', borderColor: 'brown.light' }}>
        <SectionTitle>주의사항</SectionTitle>
        <Box component="ul" sx={{ m: 0, pl: 2.5, lineHeight: 1.8 }}>
          { exercise.cautions.map((caution) => <li key={ caution }>{ caution }</li>) }
        </Box>
      </Paper>

      <Paper elevation={ 0 } sx={ paperSx }>
        <SectionTitle>내 자세 vs 트레이너 자세</SectionTitle>
        <Box sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 2 }}>
          운동 영상을 올리고 트레이너 기준 체크포인트와 비교해 보세요.
        </Box>
        <PostureVideoChecker key={ exercise.id } checkpoints={ exercise.checkpoints } />
      </Paper>
    </Box>
  );
}

export default ExerciseDetailPage;
