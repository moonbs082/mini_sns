import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * PageTitle 컴포넌트 - 각 페이지 상단 제목 영역
 *
 * Props:
 * @param {string} title - 페이지 제목 [Required]
 * @param {string} subtitle - 제목 아래 설명 [Optional]
 * @param {node} action - 우측에 놓을 버튼 등 [Optional]
 *
 * Example usage:
 * <PageTitle title="운동 자세" subtitle="기구 사용법을 알아봐요" />
 */
function PageTitle({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 3 }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ width: 32, height: 4, bgcolor: 'secondary.main', borderRadius: 2, mb: 1.5 }} />
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
          { title }
        </Typography>
        { subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            { subtitle }
          </Typography>
        ) }
      </Box>
      { action }
    </Box>
  );
}

export default PageTitle;
