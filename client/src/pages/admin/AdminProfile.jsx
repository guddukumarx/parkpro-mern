// src/pages/admin/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";

const AdminProfile = () => {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

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

  // Snackbar for general notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const updated = await userService.updateProfile(profile);
      setProfile({ name: updated.name, email: updated.email });
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError(err.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPassError("New passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }
    setPassError("");
    setPassSuccess("");
    try {
      await userService.changePassword(passwords.current, passwords.new);
      setPassSuccess("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setPassError(err.message || "Password change failed");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Admin Profile
      </Typography>

      {/* Profile Information */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        {profileError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {profileError}
          </Alert>
        )}
        {profileSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {profileSuccess}
          </Alert>
        )}
        <form onSubmit={handleProfileSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Change Password */}
      <Paper sx={{ p: 4 }}>
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
                        {showPass.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                        {showPass.confirm ? <VisibilityOff /> : <Visibility />}
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
      </Paper>

      {/* Snackbar (optional) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProfile;
