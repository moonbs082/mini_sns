import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppHeader from './components/common/app-header.jsx';
import RequireAuth from './components/common/require-auth.jsx';
import FeedPage from './pages/feed-page.jsx';
import LoginPage from './pages/login-page.jsx';
import NewPostPage from './pages/new-post-page.jsx';
import ProfilePage from './pages/profile-page.jsx';

function App() {
  return (
    <>
      <AppHeader />
      <Box sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: { xs: 2, md: 4 },
      }}>
        <Container maxWidth="sm" sx={{ py: 2, px: { xs: 2, md: 3 }, alignSelf: 'flex-start' }}>
          <Routes>
            <Route path="/" element={ <FeedPage /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/new" element={ <RequireAuth><NewPostPage /></RequireAuth> } />
            <Route path="/profile/:userId" element={ <ProfilePage /> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
