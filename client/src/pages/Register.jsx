// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Storefront as StoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import authService from "../services/authService";

const RegisterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  maxWidth: 600,
  width: "100%",
  margin: theme.spacing(2),
  boxShadow: theme.shadows[10],
}));

const RoleToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(3),
  "& .MuiToggleButton-root": {
    flex: 1,
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Role state
  const [role, setRole] = useState("user");

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessAddress: "",
    licenseNumber: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  // Handle role change
  const handleRoleChange = (event, newRole) => {
    if (newRole) {
      setRole(newRole);
      setErrors({});
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.phone && !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // Owner-specific fields (only frontend validation)
    if (role === "owner") {
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!formData.businessAddress.trim())
        newErrors.businessAddress = "Business address is required";
      if (!formData.licenseNumber.trim())
        newErrors.licenseNumber = "License number is required";
    }
    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for backend (only fields API expects)
      const userData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone || undefined,
      };

      await authService.register(userData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        py: 2,
      }}
    >
      <Fade in timeout={800}>
        <RegisterCard>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight={700}
              gutterBottom
            >
              Create an Account
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Join ParkPro – it's free!
            </Typography>

            {error && (
              <Grow in>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Grow>
            )}
            {success && (
              <Grow in>
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              </Grow>
            )}

            <RoleToggle
              value={role}
              exclusive
              onChange={handleRoleChange}
              aria-label="user role"
            >
              <ToggleButton value="user" aria-label="user">
                <PersonIcon sx={{ mr: 1 }} />
                Driver
              </ToggleButton>
              <ToggleButton value="owner" aria-label="owner">
                <StoreIcon sx={{ mr: 1 }} />
                Parking Owner
              </ToggleButton>
            </RoleToggle>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Common fields */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone (optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Owner-specific fields */}
                {role === "owner" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }}>Business Details</Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        error={!!errors.businessName}
                        helperText={errors.businessName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Business Address"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        error={!!errors.businessAddress}
                        helperText={errors.businessAddress}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="License Number"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        error={!!errors.licenseNumber}
                        helperText={errors.licenseNumber}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block", textAlign: "center" }}
                    >
                      * Your business details will be verified by admin.
                    </Typography>
                  </>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Register"}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                >
                  Log in
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </RegisterCard>
      </Fade>
    </Container>
  );
};

export default Register;
