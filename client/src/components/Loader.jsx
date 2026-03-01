// src/components/Loader.jsx
import React from 'react';
import { CircularProgress, Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const FullScreenOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndex.modal + 1,
  animation: 'fadeIn 0.2s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const InlineWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Loader Component
 * @param {Object} props
 * @param {'fullscreen' | 'section' | 'inline'} [props.type='section'] - Loader display type
 * @param {number} [props.size=40] - Size of the spinner (px)
 * @param {string} [props.color] - Custom color for spinner (defaults to primary)
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.overlay] - For fullscreen, enables backdrop (default true)
 * @param {boolean} [props.fullScreen] - Alias for type='fullscreen'
 * @param {boolean} [props.inline] - Alias for type='inline'
 */
const Loader = ({
  type = 'section',
  size = 40,
  color,
  text,
  overlay = true,
  fullScreen,
  inline,
}) => {
  const theme = useTheme();

  // Determine actual type from shorthand props
  let actualType = type;
  if (fullScreen) actualType = 'fullscreen';
  if (inline) actualType = 'inline';

  const spinnerColor = color || theme.palette.primary.main;

  const spinner = (
    <CircularProgress
      size={size}
      sx={{
        color: spinnerColor,
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
  );

  const textElement = text && (
    <Typography
      variant="body2"
      sx={{
        mt: actualType === 'fullscreen' ? 2 : actualType === 'section' ? 2 : 0,
        color: actualType === 'fullscreen' && theme.palette.mode === 'dark' ? '#fff' : 'text.secondary',
      }}
    >
      {text}
    </Typography>
  );

  if (actualType === 'fullscreen' && overlay) {
    return (
      <FullScreenOverlay>
        {spinner}
        {textElement}
      </FullScreenOverlay>
    );
  }

  if (actualType === 'fullscreen') {
    // Fullscreen without overlay (just centered)
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: theme.zIndex.modal,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {spinner}
        {textElement}
      </Box>
    );
  }

  if (actualType === 'inline') {
    return (
      <InlineWrapper>
        {spinner}
        {textElement}
      </InlineWrapper>
    );
  }

  // Default: section (centered inside a container)
  return (
    <SectionWrapper>
      {spinner}
      {textElement}
    </SectionWrapper>
  );
};

export default Loader;