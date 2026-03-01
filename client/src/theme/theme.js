// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Common palette (shared across modes)
const basePalette = {
  primary: {
    main: '#2563EB', // Royal Blue
  },
  secondary: {
    main: '#1E40AF', // Dark Blue
  },
  info: {
    main: '#38BDF8', // Accent Light Blue
  },
  success: {
    main: '#10B981', // Green
  },
  warning: {
    main: '#F59E0B', // Amber
  },
  error: {
    main: '#EF4444', // Red
  },
};

// Light mode specific colors
const lightPalette = {
  mode: 'light',
  ...basePalette,
  background: {
    default: '#F1F5F9', // Light background
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B', // Dark text
    secondary: '#334155',
  },
};

// Dark mode specific colors
const darkPalette = {
  mode: 'dark',
  ...basePalette,
  background: {
    default: '#0F172A', // Dark navy
    paper: '#1E293B',   // Slightly lighter dark
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#F1F5F9',
  },
};

// Common typography settings
const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: { fontWeight: 800 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 500 },
};

// Common shape and spacing
const shape = {
  borderRadius: 8,
};

// Common shadows (optional customizations)
const shadows = (mode) => mode === 'light' 
  ? ['none', '0px 2px 4px rgba(0,0,0,0.05)', '0px 4px 6px rgba(0,0,0,0.1)'] 
  : ['none', '0px 2px 4px rgba(0,0,0,0.3)', '0px 4px 6px rgba(0,0,0,0.4)'];

// Component overrides
const components = (mode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '6px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        },
      },
      containedPrimary: {
        backgroundColor: basePalette.primary.main,
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: basePalette.primary.main,
          filter: 'brightness(0.9)',
        },
      },
      containedSecondary: {
        backgroundColor: basePalette.secondary.main,
        color: '#FFFFFF',
      },
      containedInfo: {
        backgroundColor: basePalette.info.main,
        color: '#FFFFFF',
      },
      outlined: {
        borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
        color: mode === 'light' ? '#1E293B' : '#F1F5F9',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(37,99,235,0.04)' : 'rgba(56,189,248,0.08)',
          borderColor: basePalette.primary.main,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: mode === 'light' 
          ? '0px 4px 12px rgba(0,0,0,0.05)' 
          : '0px 4px 12px rgba(0,0,0,0.3)',
        border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
        color: mode === 'light' ? '#1E293B' : '#F1F5F9',
        boxShadow: mode === 'light' 
          ? '0px 2px 4px rgba(0,0,0,0.05)' 
          : '0px 2px 4px rgba(0,0,0,0.2)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
        borderRight: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #334155',
      },
      head: {
        fontWeight: 600,
        backgroundColor: mode === 'light' ? '#F8FAFC' : '#0F172A',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: basePalette.primary.main,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
});

// Theme factory function
export const createAppTheme = (mode = 'light') => {
  return createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape,
    shadows: shadows(mode),
    spacing: 8, // Default MUI spacing (8px)
    components: components(mode),
  });
};

export default createAppTheme;