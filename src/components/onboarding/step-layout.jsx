import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

/**
 * StepLayout 컴포넌트 - 온보딩 각 선택 화면의 공통 틀
 * (상단 진행바 · 제목 · 내용 · 하단 "계속" 버튼)
 *
 * Props:
 * @param {number} stepIndex - 현재 단계 (0부터) [Required]
 * @param {number} totalSteps - 전체 단계 수 [Required]
 * @param {string} title - 질문 제목 [Required]
 * @param {string} description - 질문 설명 [Optional]
 * @param {boolean} isNextDisabled - 계속 버튼 비활성화 여부 [Optional, 기본값: false]
 * @param {string} nextLabel - 하단 버튼 문구 [Optional, 기본값: '계속']
 * @param {function} onNext - 계속 버튼 클릭 [Required]
 * @param {function} onBack - 뒤로 가기 클릭 (없으면 버튼 숨김) [Optional]
 * @param {node} children - 선택 영역 [Required]
 *
 * Example usage:
 * <StepLayout stepIndex={ 0 } totalSteps={ 8 } title="성별을 선택해 주세요" onNext={ next }>...</StepLayout>
 */
function StepLayout({
  stepIndex,
  totalSteps,
  title,
  description,
  isNextDisabled = false,
  nextLabel = '계속',
  onNext,
  onBack,
  children,
}) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 'calc(100vh - 32px)', md: 640 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton
          aria-label="이전 단계"
          onClick={ onBack }
          sx={{ width: 44, height: 44, visibility: onBack ? 'visible' : 'hidden' }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <LinearProgress
          variant="determinate"
          value={ progress }
          color="secondary"
          sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
        />
        <Box sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.secondary', minWidth: 40, textAlign: 'right' }}>
          { stepIndex + 1 }/{ totalSteps }
        </Box>
      </Box>

      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
        { title }
      </Typography>
      { description && (
        <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: { xs: '0.95rem', md: '1rem' } }}>
          { description }
        </Typography>
      ) }

      <Box sx={{ flexGrow: 1, py: 4 }}>{ children }</Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          pt: 2,
          pb: { xs: 2, md: 0 },
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 30%)',
        }}
      >
        <Button
          fullWidth
          size="large"
          variant="contained"
          color="primary"
          disabled={ isNextDisabled }
          onClick={ onNext }
        >
          { nextLabel }
        </Button>
      </Box>
    </Box>
  );
}

export default StepLayout;
