import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { EXERCISES } from '../../utils/exercise-data.js';
import { toDateKey } from '../../utils/workout-schedule.js';

const EXERCISE_NAMES = EXERCISES.map((exercise) => exercise.name);

/**
 * 숫자 입력값 → 숫자 또는 null
 * @param {string} value - 입력값
 * @returns {number|null}
 */
function toNumberOrNull(value) {
  return value === '' ? null : Number(value);
}

/**
 * WorkoutLogForm 컴포넌트 - 운동 기록 한 줄 추가 폼
 *
 * Props:
 * @param {boolean} isSubmitting - 저장 중 여부 [Optional, 기본값: false]
 * @param {function} onSubmit - 저장 버튼 클릭 시 기록 객체 전달 (성공 시 true 반환) [Required]
 *
 * Example usage:
 * <WorkoutLogForm onSubmit={ handleAdd } />
 */
function WorkoutLogForm({ isSubmitting = false, onSubmit }) {
  const [workoutDate, setWorkoutDate] = useState(toDateKey(new Date()));
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isSaved = await onSubmit({
      workout_date: workoutDate,
      exercise: exercise.trim(),
      sets: toNumberOrNull(sets),
      reps: toNumberOrNull(reps),
      weight_kg: toNumberOrNull(weightKg),
      memo: memo.trim() || null,
    });
    if (isSaved) {
      setSets('');
      setReps('');
      setWeightKg('');
      setMemo('');
    }
  };

  return (
    <Box component="form" onSubmit={ handleSubmit }>
      <Grid container spacing={ 1.5 }>
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField
            label="날짜"
            type="date"
            fullWidth
            value={ workoutDate }
            onChange={ (event) => setWorkoutDate(event.target.value) }
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 7 }}>
          <Autocomplete
            freeSolo
            options={ EXERCISE_NAMES }
            inputValue={ exercise }
            onInputChange={ (_event, value) => setExercise(value) }
            renderInput={ (params) => <TextField { ...params } label="운동 종목" required slotProps={{ htmlInput: { ...params.inputProps, maxLength: 50 } }} /> }
          />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <TextField label="세트" type="number" fullWidth value={ sets } onChange={ (event) => setSets(event.target.value) } slotProps={{ htmlInput: { min: 0, max: 100 } }} />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <TextField label="횟수" type="number" fullWidth value={ reps } onChange={ (event) => setReps(event.target.value) } slotProps={{ htmlInput: { min: 0, max: 1000 } }} />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <TextField label="무게(kg)" type="number" fullWidth value={ weightKg } onChange={ (event) => setWeightKg(event.target.value) } slotProps={{ htmlInput: { min: 0, max: 1000, step: 0.5 } }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="메모 (선택)" fullWidth value={ memo } onChange={ (event) => setMemo(event.target.value) } slotProps={{ htmlInput: { maxLength: 200 } }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="secondary"
            startIcon={ <AddIcon /> }
            disabled={ !exercise.trim() || isSubmitting }
          >
            기록 추가
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WorkoutLogForm;
