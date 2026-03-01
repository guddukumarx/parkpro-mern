// src/pages/owner/OwnerSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const SettingSection = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const OwnerSettings = () => {
  const { user, updateUser } = useAuth(); // Assume updateUser exists in context

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Notification preferences (placeholder)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        avatar: data.avatar || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await userService.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
      });
      setProfile({
        name: updated.name || "",
        email: updated.email || "",
        phone: updated.phone || "",
        avatar: updated.avatar || "",
      });
      if (updateUser) {
        updateUser(updated);
      }
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPassError("Passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }
    setPassError("");
    try {
      await userService.changePassword(passwords.current, passwords.new);
      setPassSuccess("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setPassError(err.message || "Password change failed");
    }
  };

  const handleNotificationChange = (key) => (e) => {
    setNotifications({ ...notifications, [key]: e.target.checked });
  };

  const saveNotifications = () => {
    // Placeholder for future backend integration
    setSuccess("Notification preferences saved (placeholder)");
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Owner Settings
        </Typography>
        <IconButton onClick={fetchProfile} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Profile Section */}
      <SettingSection
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={profile.avatar}
              sx={{ width: 80, height: 80, mr: 2, bgcolor: "primary.main" }}
            >
              {profile.name.charAt(0)}
            </Avatar>
            <IconButton color="primary" component="label">
              <PhotoCameraIcon />
              <input type="file" hidden accept="image/*" />
            </IconButton>
          </Box>
          <form onSubmit={handleProfileSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Avatar URL"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </SettingSection>

      {/* Change Password Section */}
      <SettingSection
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          {passError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passError}
            </Alert>
          )}
          {passSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passSuccess}
            </Alert>
          )}
          <form onSubmit={handlePasswordSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPass.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPass({
                              ...showPass,
                              current: !showPass.current,
                            })
                          }
                        >
                          {showPass.current ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPass.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPass({ ...showPass, new: !showPass.new })
                          }
                        >
                          {showPass.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showPass.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPass({
                              ...showPass,
                              confirm: !showPass.confirm,
                            })
                          }
                        >
                          {showPass.confirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<LockIcon />}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </SettingSection>

      {/* Notification Preferences (placeholder) */}
      <SettingSection
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange("emailNotifications")}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.smsNotifications}
                    onChange={handleNotificationChange("smsNotifications")}
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.bookingAlerts}
                    onChange={handleNotificationChange("bookingAlerts")}
                  />
                }
                label="Booking Alerts"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={saveNotifications}>
                Save Preferences
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </SettingSection>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={4000}
        onClose={() => {
          setError("");
          setSuccess("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => {
            setError("");
            setSuccess("");
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerSettings;
