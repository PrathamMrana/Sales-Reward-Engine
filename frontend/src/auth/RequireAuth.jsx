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
    const hasAllowedRole = allowedRoles.some(role => {
      const r = typeof role === 'string' ? role : String(role);
      const ur = typeof userRole === 'string' ? userRole : String(userRole);
      return r.toUpperCase() === ur.toUpperCase();
    });
    
    if (!hasAllowedRole) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h1>Unauthorized</h1>
          <p>Expected one of: {JSON.stringify(allowedRoles)}</p>
          <p>Your actual role is: {JSON.stringify(userRole)}</p>
          <p>Full Auth Object: {JSON.stringify(auth)}</p>
          <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>Clear Data & Login</button>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default RequireAuth;
