import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';

/** 빈 운동 항목 */
export const EMPTY_ITEM = { name: '', sets: '', reps: '', weight: '' };

/**
 * ScheduleEditor 컴포넌트 - 운동 기록표 입력 (날짜 + 운동 항목 여러 개)
 *
 * Props:
 * @param {object} schedule - { date: string, items: Array } [Required]
 * @param {function} onChange - 기록표가 바뀔 때 호출 (새 schedule 전달) [Required]
 *
 * Example usage:
 * <ScheduleEditor schedule={ schedule } onChange={ setSchedule } />
 */
function ScheduleEditor({ schedule, onChange }) {
  const updateItem = (index, field, value) => {
    const items = schedule.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...schedule, items });
  };

  const addItem = () => onChange({ ...schedule, items: [...schedule.items, { ...EMPTY_ITEM }] });

  const removeItem = (index) => onChange({
    ...schedule,
    items: schedule.items.filter((_, i) => i !== index),
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="운동 날짜"
        type="date"
        size="small"
        value={ schedule.date }
        onChange={ (event) => onChange({ ...schedule, date: event.target.value }) }
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ maxWidth: 200 }}
      />

      { schedule.items.map((item, index) => (
        <Grid container spacing={ 1 } key={ index } sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="운동 이름"
              size="small"
              fullWidth
              value={ item.name }
              onChange={ (event) => updateItem(index, 'name', event.target.value) }
              placeholder="스쿼트"
            />
          </Grid>
          <Grid size={{ xs: 3.5, sm: 2.3 }}>
            <TextField
              label="세트"
              type="number"
              size="small"
              fullWidth
              value={ item.sets }
              onChange={ (event) => updateItem(index, 'sets', event.target.value) }
            />
          </Grid>
          <Grid size={{ xs: 3.5, sm: 2.3 }}>
            <TextField
              label="횟수"
              type="number"
              size="small"
              fullWidth
              value={ item.reps }
              onChange={ (event) => updateItem(index, 'reps', event.target.value) }
            />
          </Grid>
          <Grid size={{ xs: 3.5, sm: 2.4 }}>
            <TextField
              label="kg"
              type="number"
              size="small"
              fullWidth
              value={ item.weight }
              onChange={ (event) => updateItem(index, 'weight', event.target.value) }
            />
          </Grid>
          <Grid size={{ xs: 1.5, sm: 1 }}>
            <IconButton aria-label="운동 삭제" onClick={ () => removeItem(index) } size="small">
              <DeleteOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
      )) }

      <Button startIcon={ <AddIcon /> } onClick={ addItem } sx={{ alignSelf: 'flex-start' }}>
        운동 추가
      </Button>
    </Box>
  );
}

export default ScheduleEditor;
