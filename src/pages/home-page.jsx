import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeroBanner from '../components/home/hero-banner.jsx';
import QuickMenu from '../components/home/quick-menu.jsx';
import PostFeed from '../components/post/post-feed.jsx';
import SectionTitle from '../components/ui/section-title.jsx';
import WeeklyPlan from '../components/workout/weekly-plan.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { useBodyProfile } from '../hooks/use-body-profile.js';
import { readOnboarding } from '../utils/onboarding-storage.js';
import { buildWeeklySchedule } from '../utils/workout-schedule.js';

/**
 * HomePage - 메인(홈) 화면
 * 최상단 타이틀 + 거북이 배경, 바로가기 메뉴, 이번 주 운동 일정, 최근 커뮤니티 게시물
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/" element={ <HomePage /> } />
 */
function HomePage() {
  const navigate = useNavigate();
  const { session, profile, isLoading: isAuthLoading } = useAuth();
  const { body } = useBodyProfile();

  /** 처음 방문(로그인 X, 신체 정보 X)이면 첫 페이지(온보딩)로 */
  if (!isAuthLoading && !session && !readOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }

  const schedule = body ? buildWeeklySchedule(body.weeklyCount, body.targetParts) : null;
  const today = schedule?.find((day) => day.isToday);
  let greeting = '오늘의 운동이 내일의 몸을 만듭니다';
  if (profile && today) {
    greeting = today.isWorkout ? `${profile.display_name} 님, 오늘은 ${today.focus} 데이!` : `${profile.display_name} 님, 오늘은 회복하는 날이에요`;
  }

  const paperSx = { p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ mx: { xs: -2, sm: 0 }, mt: { xs: -2, sm: 0 } }}>
        <HeroBanner greeting={ greeting } />
      </Box>

      <Paper elevation={ 0 } sx={{ ...paperSx, py: { xs: 1, md: 2 } }}>
        <QuickMenu />
      </Paper>

      { schedule ? (
        <Paper elevation={ 0 } sx={ paperSx }>
          <SectionTitle
            action={ (
              <Button size="small" color="secondary" endIcon={ <ArrowForwardIcon /> } onClick={ () => navigate('/workout-log') }>
                기록하기
              </Button>
            ) }
          >
            이번 주 운동 일정
          </SectionTitle>
          <WeeklyPlan schedule={ schedule } />
        </Paper>
      ) : (
        <Paper elevation={ 0 } sx={{ ...paperSx, bgcolor: 'primary.main', color: 'common.white', borderColor: 'primary.main' }}>
          <Box sx={{ fontWeight: 900, fontSize: '1.15rem', mb: 0.5 }}>맞춤 분석을 받아보세요</Box>
          <Box sx={{ color: 'grey.400', fontSize: '0.9rem', mb: 2 }}>
            신체 정보를 입력하면 하루 칼로리 소모량과 근력 향상 시기, 이번 주 운동 일정을 알려드려요.
          </Box>
          <Button variant="contained" color="secondary" onClick={ () => navigate('/onboarding') }>
            신체 정보 입력하기
          </Button>
        </Paper>
      ) }

      <Box>
        <SectionTitle
          action={ (
            <Button size="small" color="secondary" endIcon={ <ArrowForwardIcon /> } onClick={ () => navigate('/posts') }>
              더보기
            </Button>
          ) }
        >
          커뮤니티 최신 글
        </SectionTitle>
        <PostFeed limit={ 3 } emptyMessage="아직 게시물이 없어요. 첫 운동 인증을 올려보세요!" />
      </Box>
    </Box>
  );
}

export default HomePage;
