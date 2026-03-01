// src/components/UserSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarBase from "./SidebarBase";
import { userRoutes } from "../routes/routeConfig";

const UserSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  return (
    <SidebarBase
      open={open}
      onClose={onClose}
      title="My Account"
      menuItems={userRoutes}
      user={user}
      onLogout={logout}
    />
  );
};

export default UserSidebar;
