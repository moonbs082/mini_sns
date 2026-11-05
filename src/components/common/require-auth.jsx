import { Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * RequireAuth 컴포넌트 - 로그인하지 않은 사용자를 로그인 화면으로 보냄
 *
 * Props:
 * @param {node} children - 로그인 후 보여줄 화면 [Required]
 *
 * Example usage:
 * <RequireAuth><NewPostPage /></RequireAuth>
 */
function RequireAuth({ children }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RequireAuth;
