import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import PageTitle from '../components/common/page-title.jsx';
import SectionTitle from '../components/ui/section-title.jsx';
import WeeklyPlan from '../components/workout/weekly-plan.jsx';
import WorkoutLogForm from '../components/workout/workout-log-form.jsx';
import WorkoutLogList from '../components/workout/workout-log-list.jsx';
import { useBodyProfile } from '../hooks/use-body-profile.js';
import { useWorkoutLogs } from '../hooks/use-workout-logs.js';
import { buildWeeklySchedule } from '../utils/workout-schedule.js';

/**
 * WorkoutLogPage - 개인 운동 기록표 (이번 주 계획 달성 현황 + 기록 추가 + 날짜별 기록)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/workout-log" element={ <RequireAuth><WorkoutLogPage /></RequireAuth> } />
 */
function WorkoutLogPage() {
  const navigate = useNavigate();
  const { body } = useBodyProfile();
  const { logs, doneDateKeys, isLoading, errorMessage, addLog, deleteLog } = useWorkoutLogs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schedule = body ? buildWeeklySchedule(body.weeklyCount, body.targetParts) : null;
  const plannedCount = schedule?.filter((day) => day.isWorkout).length ?? 0;
  const doneThisWeek = schedule?.filter((day) => doneDateKeys.has(day.key)).length ?? 0;

  const handleAdd = async (log) => {
    setIsSubmitting(true);
    const isSaved = await addLog(log);
    setIsSubmitting(false);
    return isSaved;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageTitle title="개인 운동 기록표" subtitle="매일의 기록이 쌓여 몸이 바뀌어요" />

      <Paper elevation={ 0 } sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' }}>
        <SectionTitle
          action={ schedule && (
            <Box sx={{ fontWeight: 900, color: 'secondary.main' }}>{ doneThisWeek } / { plannedCount }회</Box>
          ) }
        >
          이번 주 달성 현황
        </SectionTitle>
        { schedule ? (
          <WeeklyPlan schedule={ schedule } doneDateKeys={ doneDateKeys } />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ color: 'text.secondary' }}>신체 정보를 입력하면 이번 주 운동 일정을 만들어 드려요.</Box>
            <Button variant="outlined" onClick={ () => navigate('/onboarding') }>신체 정보 입력하기</Button>
          </Box>
        ) }
      </Paper>

      <Paper elevation={ 0 } sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' }}>
        <SectionTitle>오늘의 운동 기록</SectionTitle>
        <WorkoutLogForm isSubmitting={ isSubmitting } onSubmit={ handleAdd } />
      </Paper>

      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

      <Box>
        <SectionTitle>기록 목록</SectionTitle>
        { isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <WorkoutLogList logs={ logs } onDelete={ deleteLog } />
        ) }
      </Box>
    </Box>
  );
}

export default WorkoutLogPage;
