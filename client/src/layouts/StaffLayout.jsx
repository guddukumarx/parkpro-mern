// src/layouts/StaffLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StaffSidebar from "../components/StaffSidebar";
import Topbar from "../components/Topbar";

const StaffLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <StaffSidebar open={sidebarOpen} onClose={toggleSidebar} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
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

export default StaffLayout;
