import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { findExercise, PAIN_RECOMMENDATIONS } from '../../utils/exercise-data.js';

/**
 * PainRecommendation 컴포넌트 - 아픈 부위를 고르면 추천 운동 · 스트레칭을 알려줌
 *
 * Props: 없음
 *
 * Example usage:
 * <PainRecommendation />
 */
function PainRecommendation() {
  const [selectedId, setSelectedId] = useState(PAIN_RECOMMENDATIONS[0].id);
  const selected = PAIN_RECOMMENDATIONS.find((item) => item.id === selectedId);

  return (
    <Paper elevation={ 0 } sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, bgcolor: 'brown.light' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        { PAIN_RECOMMENDATIONS.map((item) => (
          <Chip
            key={ item.id }
            label={ item.label }
            onClick={ () => setSelectedId(item.id) }
            color={ item.id === selectedId ? 'secondary' : 'default' }
            sx={{ fontWeight: 700, height: 36, bgcolor: item.id === selectedId ? undefined : 'common.white' }}
          />
        )) }
      </Box>
      <Box sx={{ lineHeight: 1.6, mb: 2 }}>{ selected.advice }</Box>

      <Box sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 1 }}>추천 운동</Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        { selected.exerciseIds.map((exerciseId) => (
          <Chip
            key={ exerciseId }
            component={ RouterLink }
            to={ `/exercises/${exerciseId}` }
            clickable
            label={ findExercise(exerciseId)?.name }
            sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'grey.800' } }}
          />
        )) }
      </Box>

      <Box sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 1 }}>스트레칭</Box>
      <Box component="ul" sx={{ m: 0, pl: 2.5, lineHeight: 1.8, fontSize: '0.9rem' }}>
        { selected.stretches.map((stretch) => <li key={ stretch }>{ stretch }</li>) }
      </Box>
    </Paper>
  );
}

export default PainRecommendation;
