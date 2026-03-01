// src/components/StaffSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarBase from "./SidebarBase";
import { staffRoutes } from "../routes/routeConfig";

const StaffSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  return (
    <SidebarBase
      open={open}
      onClose={onClose}
      title="Staff Panel"
      menuItems={staffRoutes}
      user={user}
      onLogout={logout}
    />
  );
};

export default StaffSidebar;
