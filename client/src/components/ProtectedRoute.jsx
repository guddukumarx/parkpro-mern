// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // assuming you have an AuthContext
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute component
 * @param {Object} props
 * @param {JSX.Element} props.children - The component(s) to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Optional array of roles allowed to access this route
 * @param {string} [props.redirectTo='/login'] - Where to redirect if not authenticated
 * @param {string} [props.unauthorizedRedirect='/unauthorized'] - Where to redirect if role mismatch
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/login',
  unauthorizedRedirect = '/unauthorized',
}) => {
  const { user, loading } = useAuth(); // Get auth state from context
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated -> redirect to login, preserving intended destination
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Role-based check: if allowedRoles provided, verify user role matches
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role; // Assuming user object has a role property
    if (!allowedRoles.includes(userRole)) {
      // Role not allowed -> redirect to unauthorized page
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  // Authorized -> render children
  return children;
};

export default ProtectedRoute;



// // Inside AuthProvider
// useEffect(() => {
//   const loadUser = async () => {
//     try {
//       const storedUser = authService.getCurrentUser();
//       console.log('AuthContext - loadUser: storedUser =', storedUser);
//       if (storedUser) {
//         setUser(storedUser);
//       }
//     } catch (err) {
//       console.error('AuthContext - loadUser error', err);
//       authService.logout();
//     } finally {
//       setLoading(false);
//       console.log('AuthContext - loadUser finished, loading false');
//     }
//   };
//   loadUser();
// }, []);

// const login = async (email, password) => {
//   setLoading(true);
//   setError(null);
//   try {
//     const userData = await authService.login(email, password);
//     console.log('AuthContext - login success, user =', userData);
//     setUser(userData);
//     return userData;
//   } catch (err) {
//     console.error('AuthContext - login error', err);
//     setError(err.message || 'Login failed');
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// };