// src/hooks/useRole.js
import { useMemo } from 'react';
import useAuth from './useAuth';

/**
 * Custom hook to access user role information and permission helpers.
 *
 * @returns {Object} Role object containing:
 * - role: current user role (string) or null if not authenticated
 * - isUser: boolean indicating if user role is 'user'
 * - isOwner: boolean indicating if user role is 'owner'
 * - isAdmin: boolean indicating if user role is 'admin'
 * - hasRole(role): function to check if user has a specific role
 * - isAuthenticated: boolean indicating if user is logged in
 */
const useRole = () => {
  const { user, isAuthenticated } = useAuth();

  const role = user?.role || null;

  const roleHelpers = useMemo(
    () => ({
      isUser: role === 'user',
      isOwner: role === 'owner',
      isAdmin: role === 'admin',
      hasRole: (checkRole) => role === checkRole,
    }),
    [role]
  );

  return {
    role,
    isAuthenticated,
    ...roleHelpers,
  };
};

export default useRole;