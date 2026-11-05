import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppHeader from './components/common/app-header.jsx';
import RequireAuth from './components/common/require-auth.jsx';
import AuthPage from './pages/auth-page.jsx';
import ExerciseDetailPage from './pages/exercise-detail-page.jsx';
import ExerciseListPage from './pages/exercise-list-page.jsx';
import HomePage from './pages/home-page.jsx';
import MyPage from './pages/my-page.jsx';
import OnboardingPage from './pages/onboarding-page.jsx';
import PostCreatePage from './pages/post-create-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import PostListPage from './pages/post-list-page.jsx';
import WorkoutLogPage from './pages/workout-log-page.jsx';

/** 헤더 없이 전체 화면으로 보여줄 단계형 화면 */
const FULL_SCREEN_PATHS = ['/onboarding', '/auth'];

function App() {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_PATHS.includes(location.pathname);
  const isHome = location.pathname === '/';

  return (
    <>
      { !isFullScreen && <AppHeader isTitleHidden={ isHome } /> }
      <Box sx={{
        width: '100%',
        minHeight: isFullScreen ? '100vh' : 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: isFullScreen ? 'center' : 'flex-start',
        bgcolor: isFullScreen ? 'background.paper' : 'background.default',
        py: { xs: 2, md: 4 },
      }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 } }}>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/onboarding" element={ <OnboardingPage /> } />
            <Route path="/auth" element={ <AuthPage /> } />
            <Route path="/posts" element={ <PostListPage /> } />
            <Route path="/posts/new" element={ <RequireAuth><PostCreatePage /></RequireAuth> } />
            <Route path="/posts/:postId" element={ <PostDetailPage /> } />
            <Route path="/exercises" element={ <ExerciseListPage /> } />
            <Route path="/exercises/:exerciseId" element={ <ExerciseDetailPage /> } />
            <Route path="/workout-log" element={ <RequireAuth><WorkoutLogPage /></RequireAuth> } />
            <Route path="/me" element={ <RequireAuth><MyPage /></RequireAuth> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
