// src/pages/admin/EmailTemplates.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import adminService from "../../services/adminService";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState({});
  const [selected, setSelected] = useState("welcome");
  const [content, setContent] = useState({ subject: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templates[selected]) {
      setContent({
        subject: templates[selected].subject || "",
        body: templates[selected].body || "",
      });
    }
  }, [selected, templates]);

  const fetchTemplates = async () => {
    try {
      setFetchLoading(true);
      const res = await adminService.getEmailTemplates();
      // Expected response format: { success: true, data: { welcome: { subject, body }, ... } }
      setTemplates(res.data || {});
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load templates");
      setTemplates({});
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await adminService.updateEmailTemplate(selected, {
        subject: content.subject,
        body: content.body,
      });
      setSuccess("Template updated successfully");
      // Refresh to get updated data (optional, but good)
      await fetchTemplates();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Email Templates
      </Typography>

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

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Select Template"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <MenuItem value="welcome">Welcome Email</MenuItem>
              <MenuItem value="bookingConfirmed">Booking Confirmed</MenuItem>
              <MenuItem value="bookingCancelled">Booking Cancelled</MenuItem>
              <MenuItem value="forgotPassword">Forgot Password</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              value={content.subject}
              onChange={(e) =>
                setContent({ ...content, subject: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Body (HTML allowed)"
              multiline
              rows={8}
              value={content.body}
              onChange={(e) => setContent({ ...content, body: e.target.value })}
              helperText="You can use variables like {{name}}, {{parking}}, etc."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Template"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

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

export default EmailTemplates;
