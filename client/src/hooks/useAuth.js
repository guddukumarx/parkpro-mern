// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and methods.
 * Must be used within an AuthProvider.
 *
 * @returns {Object} Auth context value containing:
 * - user: current user object or null
 * - role: user role string ('user', 'owner', 'admin') or null
 * - isAuthenticated: boolean indicating if user is logged in
 * - loading: boolean indicating if auth state is being loaded
 * - login(email, password): async function to log in
 * - logout(): async function to log out
 * - register(userData): async function to register
 * - hasRole(role): function to check if user has specific role
 * - isUser(), isOwner(), isAdmin(): convenience role checks
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;