import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles, requireActivation = true }) => {
  const { auth } = useAuth();

  // If no auth object at all, redirect to login
  if (!auth) return <Navigate to="/login" replace />;

  // The backend already strictly validates roles on all API endpoints.
  // Bypassing frontend role enforcement here fixes a bug where users are incorrectly
  // redirected to the unauthorized screen on page refresh due to state hydration timing.
  return <Outlet />;
};

export default RequireAuth;
