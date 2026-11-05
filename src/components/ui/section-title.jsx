import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * SectionTitle 컴포넌트 - 페이지 안의 섹션 제목
 *
 * Props:
 * @param {node} children - 제목 내용 [Required]
 * @param {node} action - 우측 버튼/링크 [Optional]
 *
 * Example usage:
 * <SectionTitle action={ <Button>더보기</Button> }>최근 게시물</SectionTitle>
 */
function SectionTitle({ children, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
      <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
        { children }
      </Typography>
      { action }
    </Box>
  );
}

export default SectionTitle;
