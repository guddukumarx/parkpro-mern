// src/components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  useTheme,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Custom styled components with animation
const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: 'slideUp 0.6s ease-out',
  '@keyframes slideUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '10rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  '& svg': {
    fontSize: 'inherit',
  },
}));

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Optional: role-based redirect logic (example)
  // const { user } = useAuth(); // hypothetical auth context
  // const role = user?.role; // 'user', 'owner', 'admin'

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    // Role-based redirect could be implemented here
    // if (role === 'admin') navigate('/admin/dashboard');
    // else if (role === 'owner') navigate('/owner/dashboard');
    // else navigate('/');
    navigate('/'); // default home
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <AnimatedBox
            sx={{
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 4,
              p: { xs: 4, sm: 6 },
              boxShadow: theme.shadows[5],
            }}
          >
            {/* Illustration */}
            <IconWrapper>
              <ErrorOutlineIcon />
            </IconWrapper>

            {/* Large 404 */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                fontWeight: 900,
                lineHeight: 1,
                color: theme.palette.primary.main,
                textShadow: `0 10px 20px ${theme.palette.primary.main}20`,
                mb: 2,
              }}
            >
              404
            </Typography>

            {/* Friendly message */}
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}
            >
              Oops! Page Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: 500, mx: 'auto' }}
            >
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  color: theme.palette.text.primary,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: theme.palette.primary.main + '10',
                  },
                }}
              >
                Go Back
              </Button>
            </Box>

            {/* Optional small note */}
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 4, color: theme.palette.text.disabled }}
            >
              If you believe this is an error, please contact support.
            </Typography>
          </AnimatedBox>
        </Fade>
      </Container>
    </Box>
  );
};

export default NotFound;