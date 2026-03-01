// src/theme/palette.js

/**
 * Color palette definitions for ParkPro.
 * Provides consistent colors across light and dark modes with proper contrast.
 */

// Shared color values (base hues)
const baseColors = {
  primary: {
    main: '#2563EB', // Royal Blue
    light: '#60A5FA',
    dark: '#1E40AF',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#1E40AF', // Dark Blue
    light: '#3B82F6',
    dark: '#1E3A8A',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#38BDF8', // Light Blue
    light: '#7DD3FC',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981', // Green
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B', // Amber
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#000000',
  },
  error: {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
};

// Grey scale (matches MUI defaults for consistency)
const grey = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#EEEEEE',
  300: '#E0E0E0',
  400: '#BDBDBD',
  500: '#9E9E9E',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Light mode palette
const lightPalette = {
  mode: 'light',
  ...baseColors,
  grey,
  background: {
    default: '#F1F5F9', // Light gray
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',   // Dark navy
    secondary: '#334155',
    disabled: '#94A3B8',
  },
  divider: '#E2E8F0',
  action: {
    active: '#1E293B',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
};

// Dark mode palette
const darkPalette = {
  mode: 'dark',
  ...baseColors,
  grey,
  background: {
    default: '#0F172A',   // Dark navy
    paper: '#1E293B',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#F1F5F9',
    disabled: '#94A3B8',
  },
  divider: '#334155',
  action: {
    active: '#FFFFFF',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
};

/**
 * Returns the complete palette object based on theme mode.
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} MUI-compatible palette configuration
 */
export const getPalette = (mode) => {
  return mode === 'dark' ? darkPalette : lightPalette;
};

export default getPalette;