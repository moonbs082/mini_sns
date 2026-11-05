import { createTheme } from '@mui/material/styles';

/**
 * Health Muscle Making 테마
 * - 메인: 검정 / 하양 (연령 상관없이 눈에 잘 띄는 대비)
 * - 보조: 빨강(강조·행동), 노랑(하이라이트), 갈색(보조 정보)
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#111111',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f9a825',
      contrastText: '#111111',
    },
    brown: {
      main: '#6d4c41',
      light: '#efebe9',
      dark: '#4e342e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#5f5f5f',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Roboto", sans-serif',
    h1: { fontWeight: 900, lineHeight: 1.2 },
    h2: { fontWeight: 800, lineHeight: 1.2 },
    h3: { fontWeight: 800, lineHeight: 1.3 },
    h4: { fontWeight: 800, lineHeight: 1.3 },
    h5: { fontWeight: 700, lineHeight: 1.4 },
    h6: { fontWeight: 700, lineHeight: 1.4 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        sizeLarge: {
          minHeight: 52,
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
