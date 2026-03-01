// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          // Optionally validate token with backend here
        }
      } catch (err) {
        console.error("Failed to load user", err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user in state and localStorage
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    // Update localStorage if authService has method, else direct
    if (authService.updateUser) {
      authService.updateUser(updatedUser);
    } else {
      // Fallback: directly update localStorage
      localStorage.setItem("parkpro_user", JSON.stringify(updatedUser));
    }
  };

  // Role-based helpers
  const hasRole = (role) => user?.role === role;
  const isUser = () => user?.role === "user";
  const isOwner = () => user?.role === "owner";
  const isAdmin = () => user?.role === "admin";
  const isStaff= () => user?.role === "staff";

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated: !!user,
    hasRole,
    isUser,
    isOwner,
    isAdmin,
    isStaff,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
