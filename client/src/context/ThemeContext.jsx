// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

// Define color palette (matches ParkPro design)
const palette = {
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

// Light theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
    background: {
      default: '#F1F5F9', // Light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark text
      secondary: '#334155',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
    background: {
      default: '#0F172A', // Dark navy
      paper: '#1E293B',   // Slightly lighter dark for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#F1F5F9',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: lightTheme.typography, // reuse typography
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
        },
      },
    },
  },
});

// Create context
const ThemeContext = createContext(null);

// Custom hook for consuming theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme mode from localStorage or default to light
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('parkpro-theme');
    return savedMode || 'light';
  });

  // Toggle theme function
  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('parkpro-theme', newMode);
      return newMode;
    });
  };

  // Memoize the current theme object
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};