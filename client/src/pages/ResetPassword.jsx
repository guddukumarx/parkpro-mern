// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Send } from "@mui/icons-material";
import authService from "../services/authService";

const ForgotCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  width: "100%",
  maxWidth: 450,
  margin: theme.spacing(2),
}));

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <ForgotCard>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="text.primary"
        >
          Forgot Password?
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            If an account exists with that email, you will receive a password
            reset link shortly.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || success}
            sx={{ mt: 3, mb: 2 }}
            endIcon={<Send />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <RouterLink
              to="/login"
              style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
              }}
            >
              Back to Login
            </RouterLink>
          </Box>
        </Box>
      </ForgotCard>
    </Container>
  );
};

export default ForgotPassword;
