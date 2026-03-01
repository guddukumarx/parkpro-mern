// src/components/AdminSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarBase from "./SidebarBase";
import { adminRoutes } from "../routes/routeConfig";

const AdminSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  return (
    <SidebarBase
      open={open}
      onClose={onClose}
      title="Admin Panel"
      menuItems={adminRoutes}
      user={user}
      onLogout={logout}
    />
  );
};

export default AdminSidebar;
