import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles, requireActivation = true }) => {
  const { auth } = useAuth();

  // If no auth object at all, redirect to login
  if (!auth) return <Navigate to="/login" replace />;

  // Safely extract role, handling possible structural differences in localStorage
  const userRole = auth?.user?.role || auth?.role;

  // If we have an auth object but somehow no user role can be determined
  // it might be a corrupted session, send to login to re-authenticate
  if (!userRole) {
    console.warn("RequireAuth: Could not determine user role, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Check Role with case insensitivity just in case
  if (allowedRoles) {
    const hasAllowedRole = allowedRoles.some(role => role.toUpperCase() === userRole.toUpperCase());
    if (!hasAllowedRole) {
      console.warn(`RequireAuth: Unauthorized access. Expected one of ${allowedRoles}, got ${userRole}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
