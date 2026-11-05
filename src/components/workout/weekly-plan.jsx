import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';

/**
 * WeeklyPlan 컴포넌트 - 이번 주(월~일) 운동 일정 달력
 *
 * Props:
 * @param {Array<object>} schedule - buildWeeklySchedule() 결과 [Required]
 * @param {Set<string>} doneDateKeys - 운동 기록이 있는 날짜('YYYY-MM-DD') [Optional, 기본값: 빈 Set]
 *
 * Example usage:
 * <WeeklyPlan schedule={ schedule } doneDateKeys={ doneKeys } />
 */
function WeeklyPlan({ schedule, doneDateKeys = new Set() }) {
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: { xs: 0.5, md: 1 } }}>
        { schedule.map((day) => {
          const isDone = doneDateKeys.has(day.key);
          let bgcolor = 'grey.100';
          let color = 'text.secondary';
          if (day.isWorkout) {
            bgcolor = 'primary.main';
            color = 'common.white';
          }
          if (isDone) {
            bgcolor = 'secondary.main';
            color = 'common.white';
          }
          return (
            <Box
              key={ day.key }
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                py: 1.25,
                borderRadius: 2,
                bgcolor,
                color,
                opacity: day.isPast && !isDone ? 0.45 : 1,
                outline: day.isToday ? '3px solid' : 'none',
                outlineColor: 'warning.main',
                outlineOffset: 1,
              }}
            >
              <Box sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{ day.dayName }</Box>
              <Box sx={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.2 }}>{ day.dateNumber }</Box>
              <Box sx={{ height: 18, display: 'flex', alignItems: 'center' }}>
                { isDone && <CheckIcon sx={{ fontSize: 16 }} /> }
                { !isDone && day.isWorkout && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} /> }
              </Box>
            </Box>
          );
        }) }
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        { schedule.filter((day) => day.isWorkout).map((day) => (
          <Box
            component="li"
            key={ day.key }
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.9rem' }}
          >
            <Box sx={{ fontWeight: 800, minWidth: 64 }}>{ day.dayName }요일 { day.dateNumber }일</Box>
            <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>{ day.focus }</Box>
            { day.isToday && (
              <Box sx={{ fontSize: '0.75rem', fontWeight: 800, bgcolor: 'warning.main', px: 1, py: 0.25, borderRadius: 1 }}>
                오늘
              </Box>
            ) }
          </Box>
        )) }
      </Box>
    </Box>
  );
}

export default WeeklyPlan;
