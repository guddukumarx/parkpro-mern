// src/components/Topbar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { useAuth } from "../context/AuthContext";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

const Topbar = ({
  toggleSidebar,
  showEarningsPreview = false,
  earningsAmount = 0,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifEl, setNotifEl] = useState(null);

  const openMenu = Boolean(anchorEl);
  const openNotif = Boolean(notifEl);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -------- Breadcrumb Logic --------
  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    return {
      name: value.charAt(0).toUpperCase() + value.slice(1),
      to,
    };
  });

  // -------- Dummy Notifications --------
  const notifications = [
    { id: 1, text: "New booking received" },
    { id: 2, text: "Slot approved successfully" },
    { id: 3, text: "Payment processed" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* Sidebar Toggle (3 Lines Only) */}
        <IconButton onClick={toggleSidebar} edge="start" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Breadcrumb / Page Title */}
        {isMobile ? (
          <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
            {breadcrumbs.length
              ? breadcrumbs[breadcrumbs.length - 1].name
              : "Dashboard"}
          </Typography>
        ) : (
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              color="inherit"
            >
              Home
            </Link>

            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                component={RouterLink}
                to={crumb.to}
                underline="hover"
                color={
                  index === breadcrumbs.length - 1 ? "text.primary" : "inherit"
                }
                sx={{
                  fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                }}
              >
                {crumb.name}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Earnings Preview (Owner Only - Optional) */}
        {showEarningsPreview && user?.role === "owner" && (
          <Box
            onClick={() => navigate("/owner/earnings")}
            sx={{
              mr: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: theme.palette.success.light,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <AttachMoneyIcon fontSize="small" />${earningsAmount.toFixed(2)}
          </Box>
        )}

        {/* Theme Toggle */}
        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleTheme}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton onClick={(e) => setNotifEl(e.currentTarget)}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={notifEl}
          open={openNotif}
          onClose={() => setNotifEl(null)}
        >
          {notifications.map((n) => (
            <MenuItem key={n.id}>{n.text}</MenuItem>
          ))}
        </Menu>

        {/* User Avatar */}
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate(`/${user?.role}/profile`);
            }}
          >
            <PersonIcon sx={{ mr: 1 }} fontSize="small" />
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate(`/${user?.role}/settings`);
            }}
          >
            <SettingsIcon sx={{ mr: 1 }} fontSize="small" />
            Settings
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
