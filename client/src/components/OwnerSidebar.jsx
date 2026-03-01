// src/components/OwnerSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarBase from "./SidebarBase";
import { ownerRoutes } from "../routes/routeConfig";

const OwnerSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  // Sirf visible routes filter karo (hidden wale nahi dikhenge)
  const visibleRoutes = ownerRoutes.filter((route) => !route.hidden);

  return (
    <SidebarBase
      open={open}
      onClose={onClose}
      title="Owner Dashboard"
      menuItems={visibleRoutes}
      user={user}
      onLogout={logout}
    />
  );
};

export default OwnerSidebar;
