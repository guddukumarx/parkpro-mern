// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Chip,
  Pagination,
  Skeleton,
  Alert,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
} from "@mui/icons-material";
import notificationService from "../services/notificationService";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({
        page,
        limit: 10,
      });
      setNotifications(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
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
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Notifications
        </Typography>
        <Button variant="outlined" onClick={handleMarkAllRead}>
          Mark All Read
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={60} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((n) => (
              <React.Fragment key={n._id}>
                <ListItem
                  alignItems="flex-start"
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
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, val) => setPage(val)}
          />
        </Box>
      )}
    </Container>
  );
};

export default NotificationsPage;
