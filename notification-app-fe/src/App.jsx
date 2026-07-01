import { CssBaseline, ThemeProvider, createTheme, GlobalStyles } from '@mui/material';
import { NotificationsPage } from './pages/NotificationsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.02)',
    },
    primary: {
      main: '#9333ea', // Neon Purple
    },
    secondary: {
      main: '#3b82f6', // Neon Blue
    },
    success: {
      main: '#10b981', // Neon Green
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontSize: '2rem'
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'transparent',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }
      }
    }
  }
});

const globalStyles = (
  <GlobalStyles
    styles={{
      body: {
        backgroundColor: '#050505 !important',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)
        ` + ' !important',
        backgroundAttachment: 'fixed !important',
        minHeight: '100vh',
        color: '#ffffff !important'
      }
    }}
  />
);

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {globalStyles}
      <NotificationsPage />
    </ThemeProvider>
  );
}