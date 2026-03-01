// src/pages/admin/AdminNotifications.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import notificationService from "../../services/notificationService";
import adminService from "../../services/adminService";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Send notification modal
  const [sendModal, setSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient: "all",
    userIds: [],
    title: "",
    message: "",
    type: "both",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications({ limit: 50 });
      setNotifications(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleSend = async () => {
    if (!sendForm.title || !sendForm.message) return;
    setSending(true);
    try {
      await adminService.sendNotification(sendForm);
      setSnackbar({
        open: true,
        message: "Notification sent",
        severity: "success",
      });
      setSendModal(false);
      setSendForm({
        recipient: "all",
        userIds: [],
        title: "",
        message: "",
        type: "both",
      });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Notifications
        </Typography>
        <Box>
          <Button variant="outlined" onClick={handleMarkAllRead} sx={{ mr: 2 }}>
            Mark All Read
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setSendModal(true)}
          >
            New Notification
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        {loading ? (
          <Box sx={{ p: 2 }}>Loading...</Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>No notifications</Box>
        ) : (
          <List>
            {notifications.map((n, index) => (
              <React.Fragment key={n._id}>
                <ListItem
                  sx={{ bgcolor: n.isRead ? "inherit" : "action.hover" }}
                  secondaryAction={
                    <>
                      {!n.isRead && (
                        <IconButton
                          edge="end"
                          onClick={() => handleMarkRead(n._id)}
                        >
                          <ReadIcon color="primary" />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(n._id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {!n.isRead && (
                          <Chip label="New" size="small" color="info" />
                        )}
                        <Typography variant="subtitle1">{n.title}</Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{n.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Send Notification Modal */}
      <Dialog
        open={sendModal}
        onClose={() => setSendModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Recipient"
            value={sendForm.recipient}
            onChange={(e) =>
              setSendForm({ ...sendForm, recipient: e.target.value })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="users">Users Only</MenuItem>
            <MenuItem value="owners">Owners Only</MenuItem>
            <MenuItem value="specific">
              Specific Users (not implemented)
            </MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Title"
            value={sendForm.title}
            onChange={(e) =>
              setSendForm({ ...sendForm, title: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={3}
            value={sendForm.message}
            onChange={(e) =>
              setSendForm({ ...sendForm, message: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Type"
            value={sendForm.type}
            onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="in-app">In-App Only</MenuItem>
            <MenuItem value="email">Email Only</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminNotifications;
