import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#f5f7f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

export default theme;
