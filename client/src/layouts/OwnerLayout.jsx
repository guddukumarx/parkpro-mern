// src/layouts/OwnerLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OwnerSidebar from "../components/OwnerSidebar";
import Topbar from "../components/Topbar";

const OwnerLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Responsive sidebar behavior
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
      <OwnerSidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Right Side Container */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s ease",
        }}
      >
        {/* Topbar */}
        <Topbar
          toggleSidebar={toggleSidebar}
          showEarningsPreview
          earningsAmount={0}
        />

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

export default OwnerLayout;
