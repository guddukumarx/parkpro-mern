// src/components/SidebarBase.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  marginBottom: theme.spacing(2),
}));

const SidebarBase = ({ open, onClose, title, menuItems, user, onLogout }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <DrawerHeader>
        <Typography variant="h6" fontWeight={700} color="primary">
          {title}
        </Typography>
      </DrawerHeader>

      <Divider />

      {/* User Info */}
      <UserInfo>
        <Avatar
          src={user?.avatar}
          sx={{
            width: 64,
            height: 64,
            mb: 1,
            bgcolor: theme.palette.primary.main,
            fontSize: "1.5rem",
          }}
        >
          {!user?.avatar && user?.name?.charAt(0)}
        </Avatar>

        <Typography variant="subtitle1" fontWeight={600}>
          {user?.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ wordBreak: "break-word", textAlign: "center" }}
        >
          {user?.email}
        </Typography>
      </UserInfo>

      {/* Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main + "20",
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  },
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                <item.icon />
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Logout */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItemButton onClick={onLogout} sx={{ borderRadius: 2 }}>
          <ListItemIcon
            sx={{ minWidth: 40, color: theme.palette.text.secondary }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: open ? drawerWidth : 0 },
        flexShrink: { md: 0 },
        transition: "width 0.3s ease",
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default SidebarBase;
