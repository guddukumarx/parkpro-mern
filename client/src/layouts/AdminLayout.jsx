// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AdminSidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Auto adjust sidebar on screen resize
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
      <AdminSidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Right Layout */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Content */}
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

export default AdminLayout;
