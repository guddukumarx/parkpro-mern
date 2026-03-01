// src/components/ErrorBoundary.jsx
import React from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';

const FallbackWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: 500,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  padding: theme.spacing(2),
  borderRadius: '50%',
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.handleReset();
    const { homePath = '/' } = this.props;
    if (this.props.navigate) {
      this.props.navigate(homePath);
    } else {
      window.location.href = homePath;
    }
  };

  handleGoDashboard = () => {
    this.handleReset();
    const { dashboardPath = '/dashboard' } = this.props;
    if (this.props.navigate) {
      this.props.navigate(dashboardPath);
    } else {
      window.location.href = dashboardPath;
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;
      const error = this.state.error;
      const errorInfo = this.state.errorInfo;

      if (fallback) {
        return fallback;
      }

      return <ErrorFallback 
        error={error} 
        errorInfo={errorInfo} 
        showDetails={showDetails}
        onReset={this.handleReset}
        onGoHome={this.handleGoHome}
        onGoDashboard={this.handleGoDashboard}
        {...this.props}
      />;
    }

    return this.props.children;
  }
}

// Separate component for fallback UI
const ErrorFallback = ({ 
  error, 
  errorInfo, 
  showDetails,
  onReset,
  onGoHome,
  onGoDashboard,
  homeLabel = 'Go to Home',
  dashboardLabel = 'Go to Dashboard',
  retryLabel = 'Try Again',
  message = 'Something went wrong',
  description = 'An unexpected error has occurred. Please try again or contact support if the problem persists.',
}) => {
  const theme = useTheme();

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
      <FallbackWrapper>
        <IconWrapper>
          <ErrorOutlineIcon fontSize="large" />
        </IconWrapper>
        <Typography variant="h4" component="h2" gutterBottom color="text.secondary">
          Oops!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>

        {showDetails && error && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
              borderRadius: 1,
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: 200,
            }}
          >
            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error.toString()}
            </Typography>
            {errorInfo && (
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mt: 1 }}>
                {errorInfo.componentStack}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
          <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={onReset}>
            {retryLabel}
          </Button>
          <Button variant="outlined" color="primary" startIcon={<HomeIcon />} onClick={onGoHome}>
            {homeLabel}
          </Button>
          <Button variant="outlined" color="info" onClick={onGoDashboard}>
            {dashboardLabel}
          </Button>
        </Box>
      </FallbackWrapper>
    </Box>
  );
};

export default ErrorBoundary;