// src/layouts/UserLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UserSidebar from "../components/UserSidebar";
import Topbar from "../components/Topbar";

const drawerWidth = 280; // same as SidebarBase

const UserLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <UserSidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Right Side Layout */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s ease",
        }}
      >
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
