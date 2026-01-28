import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;
  if (!allowedRoles.includes(auth.role))
    return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default RequireAuth;
