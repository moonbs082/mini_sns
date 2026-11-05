import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SectionTitle from '../ui/section-title.jsx';
import StatCard from '../ui/stat-card.jsx';
import WeeklyPlan from '../workout/weekly-plan.jsx';
import { analyzeBody, findLabel, GOAL_OPTIONS } from '../../utils/body-analysis.js';
import { recommendExercises } from '../../utils/exercise-data.js';
import { buildWeeklySchedule } from '../../utils/workout-schedule.js';

/**
 * AnalysisReport 컴포넌트 - 신체 정보 분석 결과
 * (현재 몸 상태 · 하루 칼로리 소모량 · 근력 향상 시기와 정도 · 이번 주 운동 일정 · 추천 운동)
 *
 * Props:
 * @param {object} body - 신체 정보 { gender, heightCm, weightKg, age, goal, targetParts, weeklyCount } [Required]
 * @param {boolean} isCompact - 추천 운동 영역 숨김 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <AnalysisReport body={ body } />
 */
function AnalysisReport({ body, isCompact = false }) {
  const result = analyzeBody(body);
  const schedule = buildWeeklySchedule(body.weeklyCount, body.targetParts);
  const recommended = recommendExercises(body.targetParts).slice(0, 4);
  const maxPercent = Math.max(...result.strengthTimeline.map((item) => item.percent), 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <SectionTitle>현재 몸 상태</SectionTitle>
        <Grid container spacing={ 1.5 }>
          <Grid size={{ xs: 6 }}>
            <StatCard label="하루 칼로리 소모량" value={ result.tdee.toLocaleString() } unit="kcal" color="secondary.main" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <StatCard label="기초대사량" value={ result.bmr.toLocaleString() } unit="kcal" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <StatCard label={ `BMI · ${result.bmiCategory.label}` } value={ String(result.bmi) } unit="" color={ result.bmiCategory.color } />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <StatCard label="하루 권장 단백질" value={ String(result.proteinGram) } unit="g" color="brown.main" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 1.5, p: 2, borderRadius: 3, bgcolor: 'brown.light', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <strong>{ findLabel(GOAL_OPTIONS, body.goal) }</strong> 목표라면 하루{ ' ' }
          <Box component="strong" sx={{ color: 'secondary.main' }}>{ result.targetCalories.toLocaleString() } kcal</Box>
          { ' ' }정도 섭취를 권장해요.
        </Box>
      </Box>

      <Box>
        <SectionTitle>근력 향상 예상 시기와 정도</SectionTitle>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          주 { body.weeklyCount }회 꾸준히 운동하면 약 { result.firstChangeWeek }주 후부터 변화를 느낄 수 있어요.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          { result.strengthTimeline.map((item) => (
            <Box key={ item.week }>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, fontWeight: 800, fontSize: '0.9rem' }}>{ item.label }</Box>
                <Box sx={{ flexGrow: 1, height: 14, bgcolor: 'grey.200', borderRadius: 7, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${(item.percent / maxPercent) * 100}%`,
                      height: '100%',
                      bgcolor: item.week >= 12 ? 'secondary.main' : 'primary.main',
                      borderRadius: 7,
                    }}
                  />
                </Box>
                <Box sx={{ width: 52, textAlign: 'right', fontWeight: 900, color: 'secondary.main' }}>+{ item.percent }%</Box>
              </Box>
              <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', pl: 6.5, mt: 0.25 }}>{ item.stage }</Box>
            </Box>
          )) }
        </Box>
      </Box>

      <Box>
        <SectionTitle>이번 주 운동 일정</SectionTitle>
        <WeeklyPlan schedule={ schedule } />
      </Box>

      { !isCompact && (
        <Box>
          <SectionTitle>추천 운동</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            { recommended.map((exercise) => (
              <Box
                key={ exercise.id }
                sx={{ px: 1.75, py: 0.75, borderRadius: 5, border: 2, borderColor: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}
              >
                { exercise.name }
              </Box>
            )) }
          </Box>
        </Box>
      ) }

      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
        * 입력한 신체 정보로 계산한 추정치이며 개인차가 있습니다. 통증이나 질환이 있다면 전문가와 상담하세요.
      </Box>
    </Box>
  );
}

export default AnalysisReport;
