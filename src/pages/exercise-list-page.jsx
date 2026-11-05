import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import PageTitle from '../components/common/page-title.jsx';
import ExerciseCard from '../components/exercise/exercise-card.jsx';
import PainRecommendation from '../components/exercise/pain-recommendation.jsx';
import SectionTitle from '../components/ui/section-title.jsx';
import { BODY_PART_OPTIONS } from '../utils/body-analysis.js';
import { EXERCISES } from '../utils/exercise-data.js';

/**
 * ExerciseListPage - 운동 자세 · 기구 사용법 목록 + 아픈 부위별 추천 운동
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/exercises" element={ <ExerciseListPage /> } />
 */
function ExerciseListPage() {
  const [part, setPart] = useState('all');
  const filtered = part === 'all' ? EXERCISES : EXERCISES.filter((exercise) => exercise.parts.includes(part));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <PageTitle title="운동 자세" subtitle="기구 사용법과 바른 자세, 운동 효과를 알아봐요" />
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 1.5, mx: -0.5, px: 0.5 }}>
          { [{ value: 'all', label: '전체' }, ...BODY_PART_OPTIONS].map((option) => (
            <Chip
              key={ option.value }
              label={ option.label }
              onClick={ () => setPart(option.value) }
              color={ part === option.value ? 'primary' : 'default' }
              variant={ part === option.value ? 'filled' : 'outlined' }
              sx={{ fontWeight: 700, height: 36, flexShrink: 0 }}
            />
          )) }
        </Box>
        <Grid container spacing={ 1.5 }>
          { filtered.map((exercise) => (
            <Grid key={ exercise.id } size={{ xs: 12, sm: 6 }}>
              <ExerciseCard exercise={ exercise } />
            </Grid>
          )) }
        </Grid>
      </Box>

      <Box>
        <SectionTitle>아픈 곳이 있나요?</SectionTitle>
        <PainRecommendation />
      </Box>
    </Box>
  );
}

export default ExerciseListPage;
