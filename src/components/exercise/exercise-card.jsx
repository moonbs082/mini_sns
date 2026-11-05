import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { BODY_PART_OPTIONS, findLabel } from '../../utils/body-analysis.js';

/**
 * ExerciseCard 컴포넌트 - 운동 자세 목록의 카드 한 개
 *
 * Props:
 * @param {object} exercise - EXERCISES 항목 [Required]
 *
 * Example usage:
 * <ExerciseCard exercise={ exercise } />
 */
function ExerciseCard({ exercise }) {
  return (
    <Card elevation={ 0 } sx={{ borderRadius: 3, border: 1, borderColor: 'grey.200', height: '100%' }}>
      <CardActionArea
        component={ RouterLink }
        to={ `/exercises/${exercise.id}` }
        sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, height: '100%', justifyContent: 'flex-start' }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.5,
            bgcolor: 'primary.main',
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FitnessCenterIcon />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{ exercise.name }</Box>
            <Box
              sx={{
                fontSize: '0.7rem',
                fontWeight: 800,
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                bgcolor: exercise.level === '초급' ? 'warning.main' : 'secondary.main',
                color: exercise.level === '초급' ? 'text.primary' : 'common.white',
              }}
            >
              { exercise.level }
            </Box>
          </Box>
          <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>{ exercise.equipment }</Box>
          <Box sx={{ fontSize: '0.8rem', color: 'brown.main', fontWeight: 700, mt: 0.25 }}>
            { exercise.parts.map((part) => findLabel(BODY_PART_OPTIONS, part)).join(' · ') }
          </Box>
        </Box>
        <ChevronRightIcon sx={{ color: 'grey.400' }} />
      </CardActionArea>
    </Card>
  );
}

export default ExerciseCard;
