import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TurtleHeroArt from './turtle-hero-art.jsx';

/**
 * HeroBanner 컴포넌트 - 홈 최상단 "Healthy Muscle Making" 타이틀 + 거북이 배경
 *
 * Props:
 * @param {string} greeting - 타이틀 아래 인사 문구 [Optional, 기본값: '오늘의 운동이 내일의 몸을 만듭니다']
 *
 * Example usage:
 * <HeroBanner greeting="민수 님, 오늘은 하체 데이!" />
 */
function HeroBanner({ greeting = '오늘의 운동이 내일의 몸을 만듭니다' }) {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'primary.main',
        color: 'common.white',
        overflow: 'hidden',
        height: { xs: 340, md: 420 },
        borderRadius: { xs: 0, sm: 4 },
      }}
    >
      <TurtleHeroArt
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: { xs: 8, md: 0 },
          mx: 'auto',
          width: '100%',
          maxWidth: 520,
          height: { xs: 240, md: 300 },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(17,17,17,0) 45%, rgba(17,17,17,0.95) 80%)',
        }}
      />
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: { xs: 2.5, md: 4 }, pb: { xs: 3, md: 4 } }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.1rem', md: '3rem' },
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Healthy Muscle
          <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>Making</Box>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', flexShrink: 0 }} />
          <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, color: 'grey.300' }}>
            { greeting }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroBanner;
