import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

/**
 * StatCard 컴포넌트 - 숫자 요약 카드
 *
 * Props:
 * @param {string} label - 항목 이름 [Required]
 * @param {string} value - 표시할 값 [Required]
 * @param {string} unit - 단위 [Optional, 기본값: '']
 * @param {string} color - 값 색상 (테마 색상 경로) [Optional, 기본값: 'text.primary']
 *
 * Example usage:
 * <StatCard label="기초대사량" value="1,620" unit="kcal" />
 */
function StatCard({ label, value, unit = '', color = 'text.primary' }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 3 }}>
      <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 700 }}>{ label }</Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
        <Box sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 900, color, lineHeight: 1.2 }}>{ value }</Box>
        <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{ unit }</Box>
      </Box>
    </Paper>
  );
}

export default StatCard;
