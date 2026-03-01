// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import context hook
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Box,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// Custom styled components
const LoginCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  width: "100%",
  maxWidth: 450,
  margin: theme.spacing(2),
  animation: "fadeIn 0.5s ease-in-out",
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from context

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoginError("");
    setLoading(true);

    try {
      // ✅ Use context login (which updates state and localStorage)
      const user = await login(email, password);

      setSuccessMessage(`Login successful! Redirecting to dashboard...`);

      // Determine dashboard path based on user role
      let dashboardPath = "/user/dashboard"; // default
      if (user.role === "owner") dashboardPath = "/owner/dashboard";
      else if (user.role === "admin") dashboardPath = "/admin/dashboard";

      // Redirect after a short delay to show success message
      setTimeout(() => {
        setSuccessMessage("");
        navigate(dashboardPath);
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.message || "Login failed. Please check your credentials.",
      );
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        py: 2,
      }}
    >
      <Fade in={true} timeout={500}>
        <LoginCard>
          <LogoWrapper>
            <DirectionsCarIcon />
          </LogoWrapper>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            color="text.secondary"
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign in to your ParkPro account
          </Typography>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Remember me"
              />
              <MuiLink
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
                sx={{ color: theme.palette.primary.main }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ color: theme.palette.text.primary, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </LoginCard>
      </Fade>
    </Container>
  );
};

export default Login;
