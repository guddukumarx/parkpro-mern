// src/components/NotificationsPopover.jsx
import React, { useState, useEffect } from 'react';
import {
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Badge,
  Divider,
  Button,
  Skeleton,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

const NotificationsPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (anchorEl) fetchNotifications();
  }, [anchorEl]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({ limit: 5 });
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    handleClose();
    navigate('/notifications');
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={() => notificationService.markAllAsRead().then(fetchNotifications)}>
                Mark all read
              </Button>
            )}
          </Box>
          <Divider />
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={40} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((n) => (
                <React.Fragment key={n._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ bgcolor: n.isRead ? 'inherit' : 'action.hover' }}
                    secondaryAction={
                      !n.isRead && (
                        <IconButton edge="end" size="small" onClick={() => handleMarkAsRead(n._id)}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={n.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {n.message}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(n.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button size="small" onClick={handleViewAll}>View All</Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsPopover;