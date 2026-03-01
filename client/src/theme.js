import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',     // Royal Blue
      dark: '#1E40AF',      // Secondary (darker blue)
    },
    info: {
      main: '#38BDF8',      // Accent (light blue)
    },
    background: {
      default: '#0F172A',    // Dark Navy (main background)
      paper: '#F1F5F9',      // Light Background (cards, sections)
    },
    text: {
      primary: '#FFFFFF',    // White text on dark backgrounds
      secondary: '#1E293B',  // Dark text on light backgrounds
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  components: {
    // Global style overrides (optional)
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase
          borderRadius: '0.375rem',
        },
      },
    },
  },
});

export default theme;