// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Skeleton,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Save as SaveIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import adminService from "../../services/adminService";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const SettingCard = styled(motion.div)(({ theme }) => ({
  height: "100%",
}));

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getSettings();
      setSettings(res.data || {});
    } catch (err) {
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await adminService.updateSettings(settings);
      setSuccess("Settings updated successfully");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Platform Settings
        </Typography>
        <IconButton onClick={fetchSettings} disabled={loading} color="primary">
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

      <StyledPaper>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* General Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={settings.siteName || ""}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={settings.contactPhone || ""}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={settings.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </Grid>
            </SettingCard>

            {/* System Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                System Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode === true}
                      onChange={(e) =>
                        handleChange("maintenanceMode", e.target.checked)
                      }
                    />
                  }
                  label="Maintenance Mode (disable user access)"
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Bookings Per User"
                  type="number"
                  value={settings.maxBookingsPerUser || ""}
                  onChange={(e) =>
                    handleChange(
                      "maxBookingsPerUser",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cancellation Window (hours before)"
                  type="number"
                  value={settings.cancellationWindowHours || ""}
                  onChange={(e) =>
                    handleChange(
                      "cancellationWindowHours",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />
              </Grid>
            </SettingCard>

            {/* Payment Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Payment Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Currency Symbol"
                  value={settings.currencySymbol || "$"}
                  onChange={(e) =>
                    handleChange("currencySymbol", e.target.value)
                  }
                />
              </Grid>
            </SettingCard>

            <SettingCard
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  value={settings.taxRate || ""}
                  onChange={(e) =>
                    handleChange("taxRate", parseFloat(e.target.value) || 0)
                  }
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
            </SettingCard>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

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

export default AdminSettings;
